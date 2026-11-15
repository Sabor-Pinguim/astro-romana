// Builds the fixed Mars terrain sites (tools/terrain/sites.mjs) from real data:
// a HiRISE stereo DTM gives the heights, its orthoimage gives the texture (with the shading
// the DTM explains divided out, so the game light does not double it), and sites with
// `horizonKm` get a horizon ring from the same DTM plus a global DEM.
// Only the bytes of the site are downloaded (HTTP range requests).
//
//   npm run terrain:build                      # every site
//   npm run terrain:build -- jezero            # some sites
//   npm run terrain:build -- jezero --preview  # also write tools/terrain/preview/*.png
//
// Output: assets/terrain/<id>.glb and assets/terrain/manifest.json
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CTX_COLLECTION, DEFAULTS, HORIZON, HORIZON_DEM, SITES, STAC_API } from './sites.mjs';
import { deshade, directLight } from './lib/deshade.mjs';
import { writeGlb } from './lib/glb.mjs';
import { openGlobalDem, readGlobalDemBox } from './lib/global-dem.mjs';
import { buildHorizonMesh, horizonRadii, horizonTexture } from './lib/horizon.mjs';
import { encodeJpegGray } from './lib/jpeg.mjs';
import { encodePng } from './lib/png.mjs';
import { withRetry } from './lib/net.mjs';
import { createSiteFrame, projectionFromProjjson } from './lib/mars.mjs';
import { renderCrop, renderOverview } from './lib/preview.mjs';
import { borderPoints, fillHoles, openCog, pickLevel, readRegion, sampleGrid } from './lib/raster.mjs';
import { buildTerrainMesh, correlation, hillshade, imageAtVertices } from './lib/terrain-mesh.mjs';

const HIRISE_PDS = 'https://hirise-pds.lpl.arizona.edu/PDS/RDR';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT_DIR = path.join(ROOT, 'assets/terrain');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');
const PREVIEW_DIR = path.join(ROOT, 'tools/terrain/preview');

const DEG = Math.PI / 180;
const round = (value, digits) => Number(value.toFixed(digits));
const mean = (values) => values.reduce((sum, v) => sum + v, 0) / values.length;

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
  return { bytes, lo, hi };
}

/**
 * Horizon ring around the site, from three sources blended by distance (the finest on top):
 *   near    the site's HiRISE DTM and orthoimage (coarse overviews), up to ~1.8 km;
 *   middle  CTX stereo DTMs and their orthoimages (`cfg.ctx`), up to ~45 km where the strips reach;
 *   far     the global HRSC–MOLA DEM, out to `horizonKm`, textured with the site's mean ground
 *           brightness shaded like the photo (same sun and ambient/direct ratio, cast shadows included).
 * Near the site the coarser sources are matched to HiRISE: heights by the median difference, CTX
 * brightness by mean and spread. The texture is in the photo's units, so the game lights the ring as
 * level ground.
 */
async function buildHorizon({ cfg, frame, projection, dtmUrl, orthoUrl, reference, sun, photo, log }) {
  const outerM = cfg.horizonKm * 1000;
  const innerM = cfg.sizeM * HORIZON.innerFraction;
  const logRatio = Math.log(outerM / innerM);
  const smooth = (t) => {
    const c = Math.min(1, Math.max(0, t));
    return c * c * (3 - 2 * c);
  };
  const fade = ([start, end], r) => smooth((end - r) / (end - start));
  const median = (values) => {
    const v = values.filter(Number.isFinite).sort((x, y) => x - y);
    return v.length ? v[Math.floor(v.length / 2)] : NaN;
  };
  // 3 × 3 sample points over ±footprint, as lon/lat: computed once, read by every source.
  const grid = (east, north, footprintM) => {
    const points = [];
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) points.push(frame.toLonLat(east + a * footprintM, north + b * footprintM));
    return points;
  };
  const rasterMean = (region, proj) => (points) => {
    let sum = 0;
    let n = 0;
    for (const [lon, lat] of points) {
      const v = region.sample(...proj.forward(lon, lat));
      if (Number.isFinite(v)) {
        sum += v;
        n++;
      }
    }
    return n ? sum / n : NaN;
  };
  // Points near the site (0.3–1.8 km) where the coarser sources are matched to HiRISE.
  const overlap = [];
  for (let r = 300; r <= HORIZON.nearFadeM[1]; r += 150) {
    for (let a = 0; a < 360; a += 10) overlap.push(grid(r * Math.sin(a * DEG), r * Math.cos(a * DEG), 40));
  }

  // Near: HiRISE.
  const nearBorder = borderPoints(frame, 2 * HORIZON.nearFadeM[1]);
  const nearHeight = rasterMean((await readSiteRegion(dtmUrl, HORIZON.nearPixelM, nearBorder)).region, projection);
  const nearPhoto = rasterMean((await readSiteRegion(orthoUrl, HORIZON.nearPhotoPixelM, nearBorder)).region, projection);

  // Far: global DEM.
  const dem = await withRetry(() => openGlobalDem(HORIZON_DEM.url));
  const box = { lonMin: Infinity, lonMax: -Infinity, latMin: Infinity, latMax: -Infinity };
  for (let a = 0; a < 360; a += 5) {
    const [lon, lat] = frame.toLonLat(1.02 * outerM * Math.sin(a * DEG), 1.02 * outerM * Math.cos(a * DEG));
    box.lonMin = Math.min(box.lonMin, lon);
    box.lonMax = Math.max(box.lonMax, lon);
    box.latMin = Math.min(box.latMin, lat);
    box.latMax = Math.max(box.latMax, lat);
  }
  const far = await readGlobalDemBox(dem, box);
  const farLight = far.directLight(sun);
  log(`horizon: ${far.rows} × ${far.columns} pixels of the global DEM (${far.pixelM.toFixed(0)} m), shaded with the photo's sun`);
  const degPerM = 180 / (Math.PI * dem.radius);
  const farAt = (sampler, points, footprintM) => {
    const [lon, lat] = points[4];
    return sampler(lon, lat, (footprintM * degPerM) / Math.cos(lat * DEG), footprintM * degPerM);
  };
  const demShift = median(overlap.map((points) => nearHeight(points) - farAt(far.mean, points, 40)));

  // Middle: CTX strips, with a polar coverage grid each (soft edges, fading out with distance).
  const COVERAGE = [720, 160]; // azimuths × distances
  const middle = [];
  for (const id of cfg.ctx ?? []) {
    const item = await withRetry(() => getJson(`${STAC_API}/collections/${CTX_COLLECTION}/items/${id}`));
    const proj = projectionFromProjjson(item.properties['proj:projjson']);
    const border = borderPoints(createSiteFrame(cfg.center, proj), 2 * HORIZON.ctxFadeM[1]);
    const dtmAsset = item.assets.geoid_adjusted_dem ?? item.assets.dtm ?? item.assets.dem;
    const dtmRegion = (await readSiteRegion(dtmAsset.href, HORIZON.ctxPixelM, border)).region;
    const height = rasterMean(dtmRegion, proj);
    const brightness = rasterMean((await readSiteRegion(item.assets.orthoimage.href, HORIZON.ctxPhotoPixelM, border)).region, proj);
    const shift = median(overlap.map((points) => nearHeight(points) - height(points)));
    const pairs = overlap.map((points) => [brightness(points), nearPhoto(points)]).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
    if (pairs.length < 30 || !Number.isFinite(shift)) throw new Error(`CTX ${id} does not overlap the HiRISE data near the site`);
    const stats = (k) => {
      const m = pairs.reduce((sum, p) => sum + p[k], 0) / pairs.length;
      return [m, Math.sqrt(pairs.reduce((sum, p) => sum + (p[k] - m) ** 2, 0) / pairs.length)];
    };
    const [mx, sx] = stats(0);
    const [my, sy] = stats(1);
    const corr = pairs.reduce((sum, [x, y]) => sum + (x - mx) * (y - my), 0) / (pairs.length * sx * sy);
    const gain = sy / sx; // CTX photo → HiRISE photo units, matching mean and spread
    const coverage = new Float32Array(COVERAGE[0] * COVERAGE[1]);
    for (let y = 0; y < COVERAGE[1]; y++) {
      const r = innerM * Math.exp((logRatio * (y + 0.5)) / COVERAGE[1]);
      const distanceWeight = fade(HORIZON.ctxFadeM, r);
      if (!distanceWeight) continue;
      for (let x = 0; x < COVERAGE[0]; x++) {
        const az = (2 * Math.PI * (x + 0.5)) / COVERAGE[0];
        const points = grid(r * Math.sin(az), r * Math.cos(az), HORIZON.ctxFeatherM);
        let valid = 0;
        for (const [lon, lat] of points) if (Number.isFinite(dtmRegion.sample(...proj.forward(lon, lat)))) valid++;
        coverage[y * COVERAGE[0] + x] = (valid / points.length) * distanceWeight;
      }
    }
    middle.push({
      coverage,
      height: (points) => height(points) + shift,
      photo: (points) => my + gain * (brightness(points) - mx),
      info: {
        item: id,
        catalog: `${STAC_API}/collections/${CTX_COLLECTION}/items/${id}`,
        dtm: { url: dtmAsset.href, ...(await withRetry(() => fileVersion(dtmAsset.href))) },
        ortho: { url: item.assets.orthoimage.href, ...(await withRetry(() => fileVersion(item.assets.orthoimage.href))) },
        license: item.properties.license,
        heightShiftM: round(shift, 1),
        brightness: { ctxMean: round(mx, 2), ctxSpread: round(sx, 2), gain: round(gain, 4), correlation: round(corr, 3) },
      },
    });
    log(`horizon: CTX ${id}: heights shifted ${shift.toFixed(1)} m, brightness × ${gain.toFixed(3)} (photo correlation ${corr.toFixed(2)} over ${pairs.length} points)`);
  }
  const coverageAt = (grid2, r, az) => {
    const fy = (Math.log(r / innerM) / logRatio) * COVERAGE[1] - 0.5;
    const fx = (az / (2 * Math.PI)) * COVERAGE[0] - 0.5;
    const y0 = Math.min(COVERAGE[1] - 1, Math.max(0, Math.floor(fy)));
    const y1 = Math.min(COVERAGE[1] - 1, y0 + 1);
    const ty = Math.min(1, Math.max(0, fy - y0));
    const x0 = Math.floor(fx);
    const tx = fx - x0;
    const at = (x, y) => grid2[y * COVERAGE[0] + (((x % COVERAGE[0]) + COVERAGE[0]) % COVERAGE[0])];
    return (at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx) * (1 - ty) + (at(x0, y1) * (1 - tx) + at(x0 + 1, y1) * tx) * ty;
  };
  // Blend: far value, then CTX strips (the first in cfg.ctx on top), then HiRISE.
  const blend = (r, az, points, farValue, pickMiddle, nearValue) => {
    let value = farValue;
    for (let i = middle.length - 1; i >= 0; i--) {
      const w = coverageAt(middle[i].coverage, r, az);
      if (w > 0) {
        const v = pickMiddle(middle[i], points);
        if (Number.isFinite(v)) value = w * v + (1 - w) * value;
      }
    }
    const w = fade(HORIZON.nearFadeM, r);
    if (w > 0) {
      const v = nearValue(points);
      if (Number.isFinite(v)) value = w * v + (1 - w) * value;
    }
    return value;
  };

  const heightAt = (r, az, footprintM) => {
    const points = grid(r * Math.sin(az), r * Math.cos(az), footprintM);
    return blend(r, az, points, farAt(far.mean, points, footprintM) + demShift, (m, p) => m.height(p), nearHeight) - reference;
  };
  const radii = horizonRadii(innerM, outerM, HORIZON.rings);
  const mesh = buildHorizonMesh({ radii, segments: HORIZON.segments, planetRadius: dem.radius, half: cfg.sizeM / 2, heightAt });

  // Texture, in the photo's raw units. Near the site it gets the terrain texture's stretch (no seam);
  // from 1.2 to 4 km it moves to the region's own 1–99% range, because the region holds much brighter and
  // darker ground than the 512 m site (bright mountain flanks, dark dune fields) that would otherwise
  // clip. Past the range, values roll off softly instead of clipping (game choices).
  const [texW, texH] = HORIZON.texture;
  const STRETCH_BLEND_M = [1200, 4000];
  const level = Math.sin(sun.elevationDeg * DEG);
  const shadedFar = (points, footprintM) => (photo.meanRaw * (photo.ambientRatio + farAt(farLight, points, footprintM))) / (photo.ambientRatio + level);
  // The far texture is matched (mean and spread) to the CTX photos where they fully cover the ground,
  // so the brightness does not step where the strips end.
  let farMatch = { offset: 0, gain: 1 };
  if (middle.length) {
    const pairs = [];
    for (let r = 5000; r <= HORIZON.ctxFadeM[0]; r *= 1.15) {
      for (let a = 0; a < 360; a += 2) {
        const az = a * DEG;
        if (coverageAt(middle[0].coverage, r, az) < 0.99) continue;
        const points = grid(r * Math.sin(az), r * Math.cos(az), 200);
        const ctx = middle[0].photo(points);
        if (Number.isFinite(ctx)) pairs.push([shadedFar(points, 200), ctx]);
      }
    }
    if (pairs.length >= 100) {
      const meanOf = (k) => pairs.reduce((sum, p) => sum + p[k], 0) / pairs.length;
      const [mx, my] = [meanOf(0), meanOf(1)];
      const spread = (k, m) => Math.sqrt(pairs.reduce((sum, p) => sum + (p[k] - m) ** 2, 0) / pairs.length);
      const gain = spread(1, my) / spread(0, mx);
      farMatch = { offset: my - gain * mx, gain };
    }
  }
  const rawAt = (r, az, footprintM) => {
    const points = grid(r * Math.sin(az), r * Math.cos(az), footprintM);
    const farRaw = farMatch.offset + farMatch.gain * shadedFar(points, footprintM);
    return blend(r, az, points, farRaw, (m, p) => m.photo(p), nearPhoto);
  };
  const { values: raw, rowDistance } = horizonTexture({ width: texW, height: texH, innerM, outerM, valueAt: rawAt });
  const regional = [];
  for (let y = 0; y < texH; y++) if (rowDistance[y] > STRETCH_BLEND_M[1]) for (let x = 0; x < texW; x += 4) regional.push(raw[y * texW + x]);
  regional.sort((p, q) => p - q);
  const regionLo = regional[Math.floor(regional.length * 0.01)];
  const regionHi = regional[Math.ceil(regional.length * 0.99) - 1];
  const KNEE = 0.15;
  const softRange = (x) => {
    if (x > 1 - KNEE) return 1 - KNEE + KNEE * (1 - Math.exp(-(x - (1 - KNEE)) / KNEE));
    if (x < KNEE) return KNEE * Math.exp((x - KNEE) / KNEE);
    return x;
  };
  const texture = new Uint8Array(texW * texH);
  for (let y = 0; y < texH; y++) {
    const t = smooth((rowDistance[y] - STRETCH_BLEND_M[0]) / (STRETCH_BLEND_M[1] - STRETCH_BLEND_M[0]));
    const lo = photo.lo + (regionLo - photo.lo) * t;
    const hi = photo.hi + (regionHi - photo.hi) * t;
    for (let x = 0; x < texW; x++) texture[y * texW + x] = Math.round(255 * softRange((raw[y * texW + x] - lo) / (hi - lo)));
  }

  let maxRise = -Infinity;
  let azimuthOfMax = 0;
  for (let k = 0; k < mesh.positions.length / 3; k++) {
    const [x, y, z] = [mesh.positions[k * 3], mesh.positions[k * 3 + 1], mesh.positions[k * 3 + 2]];
    const rise = Math.atan2(y, Math.hypot(x, z)) / DEG;
    if (Math.hypot(x, z) > 2000 && rise > maxRise) {
      maxRise = rise;
      azimuthOfMax = ((Math.atan2(x, -z) / DEG) + 360) % 360;
    }
  }
  log(`horizon: highest point ${maxRise.toFixed(2)}° above level, azimuth ${azimuthOfMax.toFixed(0)}°; global DEM shifted ${demShift.toFixed(1)} m`);
  return {
    mesh,
    texture: { width: texW, height: texH, bytes: texture },
    info: {
      innerM: round(innerM, 1),
      radiusM: outerM,
      rings: HORIZON.rings,
      segments: HORIZON.segments,
      vertices: mesh.positions.length / 3,
      triangles: mesh.indices.length / 3,
      textureSize: HORIZON.texture,
      fadeM: { near: HORIZON.nearFadeM, middle: HORIZON.ctxFadeM },
      globalDemShiftM: round(demShift, 1),
      farTextureMatch: { offset: round(farMatch.offset, 2), gain: round(farMatch.gain, 4) },
      textureStretch: { site: [round(photo.lo, 2), round(photo.hi, 2)], region: [round(regionLo, 2), round(regionHi, 2)], blendM: STRETCH_BLEND_M },
      shading: { ambientRatio: round(photo.ambientRatio, 3), castShadows: true, lighting: 'the game lights the ring as level ground; the texture carries the relief shading' },
      highestDeg: round(maxRise, 2),
      highestAzimuthDeg: round(azimuthOfMax, 0),
      source: {
        near: 'HiRISE DTM and orthoimage of this site (coarse overviews)',
        middle: middle.map((m) => m.info),
        far: { ...HORIZON_DEM, pixelM: round(far.pixelM, 1), ...(await withRetry(() => fileVersion(HORIZON_DEM.url))) },
        planetRadiusM: dem.radius,
      },
    },
  };
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
  log(`texture from ${orthoRegion.pixelSize.toFixed(1)} m orthoimage pixels`);

  // Sun of the photo: its shadows are in the texture, so the game light should match it.
  const sun = await photoSun(cfg.ortho);

  // Sanity check: if heights and photo are aligned and north-up, the relief shaded with
  // the photo's sun looks like the photo. The opposite sun must give a worse match.
  const photo = imageAtVertices(stretchToBytes(textureGrid.values).bytes, cfg.textureSize, cfg.gridVertices);
  const shade = (azimuth) => hillshade(heightGrid.values, cfg.gridVertices, gridStep, azimuth, sun.elevationDeg);
  const photoSunShade = shade(sun.azimuthDeg);
  const shading = {
    photoSun: round(correlation(photo, photoSunShade), 3),
    oppositeSun: round(correlation(photo, shade(sun.azimuthDeg + 180)), 3),
  };
  log(`photo vs. shaded DTM correlation: ${shading.photoSun} (opposite sun: ${shading.oppositeSun})`);
  if (!(shading.photoSun > shading.oppositeSun)) {
    console.warn(`  ⚠ ${site.id}: texture and relief do not line up; check the projection`);
  }

  // De-shading: divide out the light the DTM explains; the game light shades the mesh instead.
  const { direct, shadowFraction } = directLight({
    heights: heightGrid.values, count: cfg.gridVertices, sizeM: cfg.sizeM, size: cfg.textureSize, sun,
  });
  const flat = deshade(textureGrid.values, direct);
  const stretched = stretchToBytes(flat.values);
  const texture = stretched.bytes;
  const deshading = {
    ambientRatio: flat.ambientRatio === null ? null : round(flat.ambientRatio, 3),
    castShadowFraction: round(shadowFraction, 4),
    photoVsRelief: shading.photoSun,
    textureVsRelief: round(correlation(imageAtVertices(texture, cfg.textureSize, cfg.gridVertices), photoSunShade), 3),
  };
  log(`de-shaded texture: ambient/direct ${deshading.ambientRatio}, correlation with the shaded DTM ${deshading.photoVsRelief} → ${deshading.textureVsRelief}`);

  const mesh = buildTerrainMesh(heightGrid.values, cfg.gridVertices, cfg.sizeM, reference);
  let minH = Infinity;
  let maxH = -Infinity;
  for (const h of heightGrid.values) {
    minH = Math.min(minH, h);
    maxH = Math.max(maxH, h);
  }

  const horizon = cfg.horizonKm
    ? await buildHorizon({
      cfg, frame, projection, dtmUrl: item.assets.dtm.href, orthoUrl: orthoAsset.href, reference, sun, log,
      photo: { lo: stretched.lo, hi: stretched.hi, meanRaw: mean(flat.values), ambientRatio: flat.ambientRatio ?? 0.5 },
    })
    : null;

  const nodes = [{
    nodeName: 'Terrain',
    meshName: `Terrain_${site.id}`,
    positions: mesh.positions,
    normals: mesh.normals,
    uvs: Uint16Array.from(mesh.uvs, (v) => Math.round(v * 65535)), // normalized: half the bytes of float
    indices: mesh.indices,
    material: {
      name: `Ground_${site.id}`,
      baseColorFactor: cfg.tint,
      image: { name: 'albedo', mimeType: 'image/jpeg', bytes: encodeJpegGray(cfg.textureSize, cfg.textureSize, texture, cfg.textureJpegQuality) },
    },
    extras: { site: site.id, centerLat: cfg.center.lat, centerLon: cfg.center.lon, referenceElevationM: round(reference, 2) },
  }];
  if (horizon) {
    nodes.push({
      nodeName: 'Horizon',
      meshName: `Horizon_${site.id}`,
      positions: horizon.mesh.positions,
      uvs: horizon.mesh.uvs,
      indices: horizon.mesh.indices,
      material: {
        name: `HorizonGround_${site.id}`,
        baseColorFactor: cfg.tint,
        image: { name: 'horizon', mimeType: 'image/jpeg', repeatU: true, bytes: encodeJpegGray(horizon.texture.width, horizon.texture.height, horizon.texture.bytes, HORIZON.jpegQuality) },
      },
    });
  }
  const glb = writeGlb(nodes);
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
    if (horizon) {
      const { width, height, bytes } = horizon.texture;
      await writeFile(path.join(PREVIEW_DIR, `${site.id}_horizon.png`), encodePng(width, height, 1, bytes));
    }
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
    deshading,
    ...(horizon ? { horizon: horizon.info } : {}),
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
      ground: 'the game reads heights from the mesh grid (row 0 = north edge, column 0 = west edge)',
      horizon: 'optional 2nd node "Horizon": polar ring (rings x (segments + 1), ring-major, last column repeats azimuth 0), Mars curvature applied, no normals; polar texture u = azimuth, v = log distance, relief shading baked in (light it as level ground)',
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
