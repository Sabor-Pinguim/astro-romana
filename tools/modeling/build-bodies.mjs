// Builds the low-poly celestial bodies (planets, moons) as GLB files from the real global
// data in references/datasets/, and updates the `bodies` section of
// godot/assets/models/manifest.json.
//
//   npm run models:build:bodies            # all bodies
//   npm run models:build:bodies -- earth   # only selected bodies
//
// Output: godot/assets/models/bodies/<id>.glb
// The build reads only committed files (no network) and is deterministic.
import './lib/node-polyfills.mjs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import allBodies from './bodies/index.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MODELS_DIR = path.join(ROOT, 'godot/assets/models');
const MANIFEST = path.join(MODELS_DIR, 'manifest.json');

const BODY_CONVENTIONS = {
  units: 'body radii: the mean radius is 1.0; scale by radiusMeters (or any map scale) in the scene',
  up: '+Y = north pole (rotation axis)',
  forward: '+Z = latitude 0°, longitude 0°; +X = longitude 90° E',
  origin: 'center of the body',
  relief: 'vertices sit at 1 + reliefExaggeration × height / radiusMeters; water is flat at its level',
  siteAnchors: 'Site_* empties on the surface: +Y up, +X east, −Z north',
};

function countStats(root) {
  let triangles = 0;
  let meshes = 0;
  root.traverse((o) => {
    if (o.isMesh) {
      meshes++;
      triangles += o.geometry.attributes.position.count / 3;
    }
  });
  return { triangles, meshes };
}

async function buildBody(def, exporter) {
  const { root, sites, info } = await def.build({ root: ROOT });
  root.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(root);

  const stats = countStats(root);
  if (stats.triangles > def.budget.triangles) {
    throw new Error(`${def.id}: ${stats.triangles} triangles exceeds budget ${def.budget.triangles}`);
  }
  if (stats.meshes > def.budget.meshes) {
    throw new Error(`${def.id}: ${stats.meshes} meshes exceeds budget ${def.budget.meshes}`);
  }

  const glb = await exporter.parseAsync(root, { binary: true, trs: true, onlyVisible: true });
  const file = `bodies/${def.id}.glb`;
  const outPath = path.join(MODELS_DIR, file);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, Buffer.from(glb));

  const round = (x) => Number(x.toFixed(4));
  return {
    id: def.id,
    name: def.name,
    nodeName: def.nodeName,
    file,
    radiusMeters: def.radiusMeters,
    radiusSource: def.radiusSource,
    detail: def.detail,
    refine: def.refine ?? [],
    reliefExaggeration: def.reliefExaggeration,
    sites: sites.map(({ id, node, name, lat, lon, source, radius }) => ({
      id, node, name, lat, lon, radius: round(radius), source,
    })),
    materials: def.materialSources,
    faceCounts: info.faceCounts,
    maxHeightMeters: Math.round(info.maxHeightM),
    data: def.data,
    bounds: { min: bounds.min.toArray().map(round), max: bounds.max.toArray().map(round) },
    budget: def.budget,
    stats: { ...stats, bytes: glb.byteLength },
    references: def.references,
  };
}

async function main() {
  const only = process.argv.slice(2);
  const selected = only.length ? allBodies.filter((b) => only.includes(b.id)) : allBodies;
  if (only.length && selected.length !== only.length) {
    throw new Error(`Unknown body id. Known: ${allBodies.map((b) => b.id).join(', ')}`);
  }

  let manifest = {};
  try {
    manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
  } catch {
    // first build
  }
  const previous = manifest.bodies ?? [];

  const exporter = new GLTFExporter();
  const built = [];
  for (const def of selected) {
    const entry = await buildBody(def, exporter);
    built.push(entry);
    console.log(
      `✔ ${entry.id.padEnd(8)} ${String(entry.stats.triangles).padStart(6)} tris  ` +
        `${String(entry.stats.meshes).padStart(2)} meshes  ${(entry.stats.bytes / 1024).toFixed(0).padStart(5)} KB  → ${entry.file}`,
    );
    console.log(`  faces: ${Object.entries(entry.faceCounts).map(([k, n]) => `${k} ${n}`).join(', ')}`);
  }

  const bodies = allBodies
    .map((b) => built.find((e) => e.id === b.id) ?? previous.find((e) => e.id === b.id))
    .filter(Boolean);

  manifest = { ...manifest, generatedAt: new Date().toISOString(), bodyConventions: BODY_CONVENTIONS, bodies };
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`✔ manifest → ${path.relative(ROOT, MANIFEST)} (${bodies.length} bodies)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
