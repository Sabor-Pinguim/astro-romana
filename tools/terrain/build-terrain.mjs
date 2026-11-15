// Builds the fixed Mars terrain sites (tools/terrain/sites.mjs) from real data:
// a HiRISE stereo DTM gives the heights, its orthoimage gives the texture.
// Only the bytes of the site are downloaded (Cloud Optimized GeoTIFF range requests).
//
//   npm run terrain:build                      # every site
//   npm run terrain:build -- jezero            # some sites
//   npm run terrain:build -- jezero --preview  # also write tools/terrain/preview/*.png
//
// Output: godot/assets/terrain/<id>.glb and godot/assets/terrain/manifest.json
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULTS, SITES, STAC_API } from './sites.mjs';
import { writeGlb } from './lib/glb.mjs';
import { createSiteFrame, projectionFromProjjson } from './lib/mars.mjs';
import { encodePng } from './lib/png.mjs';
import { renderCrop, renderOverview } from './lib/preview.mjs';
import { borderPoints, fillHoles, openCog, pickLevel, readRegion, sampleGrid } from './lib/raster.mjs';
import { buildTerrainMesh, correlation, hillshade, imageAtVertices } from './lib/terrain-mesh.mjs';

const HIRISE_PDS = 'https://hirise-pds.lpl.arizona.edu/PDS/RDR';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT_DIR = path.join(ROOT, 'godot/assets/terrain');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');
const PREVIEW_DIR = path.join(ROOT, 'tools/terrain/preview');

const round = (value, digits) => Number(value.toFixed(digits));

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

/** ETag / Last-Modified, so the manifest records exactly which file version was used. */
async function fileVersion(url) {
  const response = await fetch(url, { method: 'HEAD' });
  return {
    etag: response.headers.get('etag')?.replaceAll('"', '') ?? null,
    lastModified: response.headers.get('last-modified'),
  };
}

/**
 * Sun position when the photo was taken, from the original HiRISE PDS label.
 * (The STAC catalog's view:sun_* fields are not usable: its "sun_elevation" holds the
 * local time, and its "sun_azimuth" is measured from the image's 3 o'clock direction.)
 */
async function photoSun(orthoName) {
  const [, phase, orbit, target] = orthoName.match(/^([A-Z]{3})_(\d{6})_(\d{4})_/) ?? [];
  if (!phase) throw new Error(`cannot read the HiRISE observation id from ${orthoName}`);
  const observation = `${phase}_${orbit}_${target}`;
  const orbitDir = `ORB_${orbit.slice(0, 4)}00_${orbit.slice(0, 4)}99`;
  const url = `${HIRISE_PDS}/${phase}/${orbitDir}/${observation}/${observation}_RED.LBL`;
  const label = await withRetry(async () => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
    return response.text();
  });
  const value = (key) => {
    const match = label.match(new RegExp(`^\\s*${key}\\s*=\\s*"?([^"<\\r\\n]+)`, 'm'));
    if (!match) throw new Error(`${key} missing in ${url}`);
    return match[1].trim();
  };
  const incidence = Number(value('INCIDENCE_ANGLE'));
  const subSolarAzimuth = Number(value('SUB_SOLAR_AZIMUTH'));
  const northAzimuth = Number(value('NORTH_AZIMUTH'));
  return {
    // Both label azimuths are clockwise from the image's 3 o'clock direction.
    azimuthDeg: round((((subSolarAzimuth - northAzimuth) % 360) + 360) % 360, 2),
    elevationDeg: round(90 - incidence, 2),
    localTimeH: round(Number(value('LOCAL_TIME')), 2),
    solarLongitudeDeg: round(Number(value('SOLAR_LONGITUDE')), 2),
    startTime: value('START_TIME'),
    observation,
    label: url,
  };
}

/** Retries flaky network work (S3 range requests fail now and then). */
async function withRetry(work, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await work();
    } catch (error) {
      if (/CERT|SELF_SIGNED/.test(error.cause?.code ?? '')) {
        throw new Error(
          `${error.cause.code}: this network intercepts HTTPS. ` +
          'Run with NODE_OPTIONS=--use-system-ca (Node ≥ 22.15) or NODE_EXTRA_CA_CERTS=<proxy CA .pem>.',
        );
      }
      if (attempt >= attempts) throw error;
      console.warn(`  … retrying after: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

/** Opens a COG and reads the site window; a failed read reopens the file from scratch. */
function readSiteRegion(url, maxPixelSize, border) {
  return withRetry(async () => {
    const cog = await openCog(url);
    return { cog, region: await readRegion(cog, pickLevel(cog, maxPixelSize), border) };
  });
}

function findOrthoAsset(item, orthoName) {
  const entry = Object.values(item.assets).find((a) => a.title === `Orthoimage: ${orthoName}`);
  if (!entry) {
    const names = Object.values(item.assets).filter((a) => a.title?.startsWith('Orthoimage: ')).map((a) => a.title.slice(13));
    throw new Error(`orthoimage ${orthoName} not in ${item.id}; available: ${names.join(', ')}`);
  }
  return entry;
}

/** Stretches the 1st–99th percentile of the photo to 0–255. */
function stretchToBytes(values) {
  const sorted = Float32Array.from(values).sort();
  const lo = sorted[Math.floor(sorted.length * 0.01)];
  const hi = sorted[Math.ceil(sorted.length * 0.99) - 1];
  const bytes = new Uint8Array(values.length);
  for (let k = 0; k < values.length; k++) {
    bytes[k] = Math.round(255 * Math.min(1, Math.max(0, (values[k] - lo) / (hi - lo || 1))));
  }
  return bytes;
}

async function buildSite(site, { preview }) {
  const cfg = { ...DEFAULTS, ...site };
  const log = (message) => console.log(`  ${site.id}: ${message}`);

  const item = await withRetry(() => getJson(`${STAC_API}/collections/${cfg.collection}/items/${cfg.item}`));
  const projection = projectionFromProjjson(item.properties['proj:projjson']);
  const frame = createSiteFrame(cfg.center, projection);
  const orthoAsset = findOrthoAsset(item, cfg.ortho);
  const border = borderPoints(frame, cfg.sizeM);

  // Heights: DTM sampled on the mesh grid, from the overview closest to half the spacing.
  const gridStep = cfg.sizeM / (cfg.gridVertices - 1);
  const { cog: dtm, region: dtmRegion } = await readSiteRegion(item.assets.dtm.href, gridStep / 2, border);
  const heightGrid = sampleGrid(dtmRegion, frame, cfg.gridVertices, cfg.sizeM, false);
  const reference = dtmRegion.sample(...frame.toProjected(0, 0));
  const holeFraction = heightGrid.invalid / heightGrid.values.length;
  if (Number.isNaN(reference) || holeFraction > cfg.maxHoleFraction) {
    throw new Error(
      `${(holeFraction * 100).toFixed(1)}% of the site has no DTM data` +
      ' (it crosses the edge of the DTM strip?). Move the center or shrink sizeM; check with --preview.',
    );
  }
  fillHoles(heightGrid.values, cfg.gridVertices);
  log(`heights from ${dtmRegion.pixelSize.toFixed(1)} m DTM pixels, ${heightGrid.invalid} holes filled`);

  // Texture: orthoimage sampled at pixel centers, stretched to 8-bit grayscale.
  const texelM = cfg.sizeM / cfg.textureSize;
  const { region: orthoRegion } = await readSiteRegion(orthoAsset.href, texelM / 2, border);
  const textureGrid = sampleGrid(orthoRegion, frame, cfg.textureSize, cfg.sizeM, true);
  if (textureGrid.invalid / textureGrid.values.length > cfg.maxHoleFraction) {
    throw new Error(`orthoimage ${cfg.ortho} does not cover the site`);
  }
  fillHoles(textureGrid.values, cfg.textureSize);
  const texture = stretchToBytes(textureGrid.values);
  log(`texture from ${orthoRegion.pixelSize.toFixed(1)} m orthoimage pixels`);

  // Sun of the photo: shadows are baked into the texture, so the game light should match.
  const sun = await photoSun(cfg.ortho);

  // Sanity check: if heights and photo are aligned and north-up, the relief shaded with
  // the photo's sun looks like the photo. The opposite sun must give a worse match.
  const photo = imageAtVertices(texture, cfg.textureSize, cfg.gridVertices);
  const shade = (azimuth) => hillshade(heightGrid.values, cfg.gridVertices, gridStep, azimuth, sun.elevationDeg);
  const shading = {
    photoSun: round(correlation(photo, shade(sun.azimuthDeg)), 3),
    oppositeSun: round(correlation(photo, shade(sun.azimuthDeg + 180)), 3),
  };
  log(`photo vs. shaded DTM correlation: ${shading.photoSun} (opposite sun: ${shading.oppositeSun})`);
  if (!(shading.photoSun > shading.oppositeSun)) {
    console.warn(`  ⚠ ${site.id}: texture and relief do not line up; check the projection`);
  }

  const mesh = buildTerrainMesh(heightGrid.values, cfg.gridVertices, cfg.sizeM, reference);
  let minH = Infinity;
  let maxH = -Infinity;
  for (const h of heightGrid.values) {
    minH = Math.min(minH, h);
    maxH = Math.max(maxH, h);
  }

  const glb = writeGlb({
    // "-col": Godot's importer adds a StaticBody3D with a trimesh collision shape.
    nodeName: 'Terrain-col',
    meshName: `Terrain_${site.id}`,
    positions: mesh.positions,
    normals: mesh.normals,
    uvs: mesh.uvs,
    indices: mesh.indices,
    material: {
      name: `Ground_${site.id}`,
      baseColorFactor: cfg.tint,
      // Godot extracts it on import as <id>_albedo.png next to the GLB.
      image: { name: 'albedo', mimeType: 'image/png', bytes: encodePng(cfg.textureSize, cfg.textureSize, 1, texture) },
    },
    extras: { site: site.id, centerLat: cfg.center.lat, centerLon: cfg.center.lon, referenceElevationM: round(reference, 2) },
  });
  const file = `${site.id}.glb`;
  await writeFile(path.join(OUT_DIR, file), glb);
  log(`${file}: ${(glb.length / 1024 / 1024).toFixed(2)} MB, ${mesh.indices.length / 3} triangles`);

  if (preview) {
    await mkdir(PREVIEW_DIR, { recursive: true });
    await writeFile(path.join(PREVIEW_DIR, `${site.id}_overview.png`), await renderOverview(dtm, frame, cfg.sizeM));
    await writeFile(
      path.join(PREVIEW_DIR, `${site.id}_crop.png`),
      renderCrop({ texture, textureSize: cfg.textureSize, heights: heightGrid.values, gridCount: cfg.gridVertices, step: gridStep, sun }),
    );
    log(`previews in ${path.relative(ROOT, PREVIEW_DIR)}/`);
  }

  const corners = [[-1, 1], [1, 1], [1, -1], [-1, -1]].map(([e, n]) => {
    const [lon, lat] = frame.toLonLat((e * cfg.sizeM) / 2, (n * cfg.sizeM) / 2);
    return { lat: round(lat, 6), lon: round(lon, 6) };
  });

  return {
    id: site.id,
    name: cfg.name,
    file,
    center: cfg.center,
    corners, // NW, NE, SE, SW
    sizeM: cfg.sizeM,
    gridVertices: cfg.gridVertices,
    gridSpacingM: round(gridStep, 4),
    textureSize: cfg.textureSize,
    texelM: round(texelM, 4),
    triangles: mesh.indices.length / 3,
    // Real values measured on the DTM (meters, as stored in the source product).
    elevation: { centerM: round(reference, 2), minM: round(minH, 2), maxM: round(maxH, 2), reliefM: round(maxH - minH, 2) },
    sun,
    shadingCheck: shading,
    holesFilled: heightGrid.invalid,
    tint: cfg.tint,
    source: {
      license: item.properties.license,
      catalog: `${STAC_API}/collections/${cfg.collection}/items/${cfg.item}`,
      description: item.properties.description,
      dtm: { url: item.assets.dtm.href, gsdM: round(item.properties.gsd, 4), ...(await withRetry(() => fileVersion(item.assets.dtm.href))) },
      ortho: { name: cfg.ortho, url: orthoAsset.href, ...(await withRetry(() => fileVersion(orthoAsset.href))) },
    },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const preview = args.includes('--preview');
  const ids = args.filter((a) => !a.startsWith('--'));
  const unknown = ids.filter((id) => !SITES.some((s) => s.id === id));
  if (unknown.length) throw new Error(`unknown site(s): ${unknown.join(', ')}`);
  const selected = ids.length ? SITES.filter((s) => ids.includes(s.id)) : SITES;

  await mkdir(OUT_DIR, { recursive: true });
  let previous = [];
  try {
    previous = JSON.parse(await readFile(MANIFEST, 'utf8')).sites ?? [];
  } catch {
    // first build
  }

  const built = new Map();
  for (const site of selected) {
    console.log(`▶ ${site.id}`);
    built.set(site.id, await buildSite(site, { preview }));
  }

  // Keep entries of sites not rebuilt this time, in the order of sites.mjs.
  const sites = SITES.map((s) => built.get(s.id) ?? previous.find((p) => p.id === s.id)).filter(Boolean);
  const manifest = {
    generator: 'tools/terrain/build-terrain.mjs',
    conventions: {
      units: 'meters',
      axes: '+X east, +Y up, -Z north (true north at the site center)',
      origin: 'site center; y = 0 is the DTM elevation at the center (elevation.centerM)',
      sunAzimuth: 'degrees clockwise from north, as seen from the ground',
      collision: 'node "Terrain-col" makes Godot add a StaticBody3D with a trimesh shape',
    },
    sites,
  };
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`✔ ${built.size} site(s) built → ${path.relative(ROOT, OUT_DIR)}/`);
}

main().catch((error) => {
  console.error(`✘ ${error.message}`);
  process.exit(1);
});
