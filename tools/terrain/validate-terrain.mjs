// Validates every site listed in assets/terrain/manifest.json:
//   1. Khronos glTF Validator (spec errors fail the run)
//   2. Project rules: size limit, root node name, grid, bounds match the manifest,
//      embedded texture, sun and source recorded, de-shading worked, horizon ring (if any).
//
//   npm run terrain:validate
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import validator from 'gltf-validator';
import { readGlbJson } from './lib/glb.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TERRAIN_DIR = path.join(ROOT, 'assets/terrain');
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
  if (gltf.nodes?.[0]?.name !== 'Terrain') problems.push('root node must be "Terrain"');

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
  if (!image || !['image/png', 'image/jpeg'].includes(image.mimeType)) problems.push('missing embedded texture');
  if (!(site.sun?.elevationDeg > 0 && site.sun.elevationDeg < 90)) problems.push('sun elevation missing or out of range');
  if (!site.source?.dtm?.url || !site.source?.ortho?.url || !site.source?.license) problems.push('source not recorded');
  if (site.shadingCheck && !(site.shadingCheck.photoSun > site.shadingCheck.oppositeSun)) {
    problems.push('texture and relief do not line up (shading check)');
  }
  const d = site.deshading;
  if (!d) problems.push('de-shading not recorded');
  else if (d.ambientRatio !== null && !(Math.abs(d.textureVsRelief) < Math.abs(d.photoVsRelief))) {
    problems.push(`de-shading did not reduce the relief shading in the texture (${d.photoVsRelief} → ${d.textureVsRelief})`);
  }

  let horizonSummary = '';
  const horizonNode = gltf.nodes.findIndex((n) => n.name === 'Horizon');
  if (site.horizon || horizonNode >= 0) {
    if (!site.horizon) problems.push('GLB has a "Horizon" node but the manifest has no horizon entry');
    else if (horizonNode < 0) problems.push('manifest lists a horizon but the GLB has no "Horizon" node');
    else {
      const primitive = gltf.meshes[gltf.nodes[horizonNode].mesh].primitives[0];
      const ring = gltf.accessors[primitive.attributes.POSITION];
      const expected = site.horizon.rings * (site.horizon.segments + 1);
      if (ring.count !== expected) problems.push(`horizon has ${ring.count} vertices, manifest says ${expected}`);
      if (ring.count > MAX_VERTICES) problems.push(`horizon has ${ring.count} vertices > ${MAX_VERTICES}`);
      const material = gltf.materials[primitive.material];
      if (primitive.attributes.TEXCOORD_0 === undefined || material?.pbrMetallicRoughness?.baseColorTexture === undefined) {
        problems.push('horizon has no texture (TEXCOORD_0 + baseColorTexture)');
      }
      const reach = Math.max(-ring.min[0], ring.max[0], -ring.min[2], ring.max[2]);
      if (!(reach > site.horizon.radiusM * 0.99 && reach <= site.horizon.radiusM)) {
        problems.push(`horizon reaches ${reach.toFixed(0)} m, manifest says ${site.horizon.radiusM} m`);
      }
      const far = site.horizon.source?.far;
      if (!far?.url || !far?.citation || !far?.license) problems.push('horizon source not recorded');
      horizonSummary = `, horizon ${site.horizon.radiusM / 1000} km (${site.horizon.triangles} triangles)`;
    }
  }

  return {
    problems,
    summary: `${(bytes.length / 1048576).toFixed(2)} MB, ${position.count} vertices, ` +
      `relief ${site.elevation.reliefM} m, sun az ${site.sun.azimuthDeg}° el ${site.sun.elevationDeg}°, ` +
      `${report.issues.numWarnings} warnings, ${report.issues.numInfos} infos${horizonSummary}`,
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
