// Validates every site listed in godot/assets/terrain/manifest.json:
//   1. Khronos glTF Validator (spec errors fail the run)
//   2. Project rules: size limit, collision node name, grid, bounds match the manifest,
//      embedded texture, sun and source recorded.
//
//   npm run terrain:validate
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import validator from 'gltf-validator';
import { readGlbJson } from './lib/glb.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TERRAIN_DIR = path.join(ROOT, 'godot/assets/terrain');
const MAX_BYTES = 5 * 1024 * 1024; // AGENTS.md §9: larger binaries need team agreement
const MAX_VERTICES = 65535; // 16-bit indices (65535 itself is the reserved restart value)
const TOLERANCE_M = 0.01;

async function validateSite(site) {
  const problems = [];
  const bytes = await readFile(path.join(TERRAIN_DIR, site.file));

  const report = await validator.validateBytes(new Uint8Array(bytes), { uri: site.file, maxIssues: 50 });
  for (const message of report.issues.messages) {
    if (message.severity === 0) problems.push(`glTF error ${message.code}: ${message.message} (${message.pointer ?? ''})`);
  }

  const gltf = readGlbJson(bytes);
  if (bytes.length > MAX_BYTES) problems.push(`${(bytes.length / 1048576).toFixed(2)} MB > 5 MB`);
  if (gltf.nodes?.[0]?.name !== 'Terrain-col') problems.push('root node must be "Terrain-col" (Godot collision suffix)');

  const position = gltf.accessors[gltf.meshes[0].primitives[0].attributes.POSITION];
  const expectedVertices = site.gridVertices ** 2;
  if (position.count !== expectedVertices) problems.push(`${position.count} vertices, manifest says ${expectedVertices}`);
  if (position.count > MAX_VERTICES) problems.push(`${position.count} vertices > ${MAX_VERTICES}`);

  const half = site.sizeM / 2;
  const [minX, minY, minZ] = position.min;
  const [maxX, maxY, maxZ] = position.max;
  const near = (a, b) => Math.abs(a - b) <= TOLERANCE_M;
  if (!near(minX, -half) || !near(maxX, half) || !near(minZ, -half) || !near(maxZ, half)) {
    problems.push(`footprint x ${minX}..${maxX}, z ${minZ}..${maxZ}; expected ±${half} m`);
  }
  const { centerM, minM, maxM } = site.elevation;
  if (!near(minY, minM - centerM) || !near(maxY, maxM - centerM)) {
    problems.push(`height range ${minY.toFixed(2)}..${maxY.toFixed(2)} m does not match the manifest elevation`);
  }

  const image = gltf.images?.[0];
  if (!image || image.mimeType !== 'image/png') problems.push('missing embedded PNG texture');
  if (!(site.sun?.elevationDeg > 0 && site.sun.elevationDeg < 90)) problems.push('sun elevation missing or out of range');
  if (!site.source?.dtm?.url || !site.source?.ortho?.url || !site.source?.license) problems.push('source not recorded');
  if (site.shadingCheck && !(site.shadingCheck.photoSun > site.shadingCheck.oppositeSun)) {
    problems.push('texture and relief do not line up (shading check)');
  }

  return {
    problems,
    summary: `${(bytes.length / 1048576).toFixed(2)} MB, ${position.count} vertices, ` +
      `relief ${site.elevation.reliefM} m, sun az ${site.sun.azimuthDeg}° el ${site.sun.elevationDeg}°, ` +
      `${report.issues.numWarnings} warnings, ${report.issues.numInfos} infos`,
  };
}

async function main() {
  const manifest = JSON.parse(await readFile(path.join(TERRAIN_DIR, 'manifest.json'), 'utf8'));
  let failed = 0;
  for (const site of manifest.sites) {
    const { problems, summary } = await validateSite(site);
    if (problems.length) {
      failed++;
      console.log(`✘ ${site.id}: ${summary}`);
      for (const p of problems) console.log(`    - ${p}`);
    } else {
      console.log(`✔ ${site.id}: ${summary}`);
    }
  }
  if (failed) {
    console.error(`\n${failed} site(s) failed validation`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
