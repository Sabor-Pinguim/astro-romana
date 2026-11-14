// Validates every model listed in godot/assets/models/manifest.json:
//   1. Khronos glTF Validator (spec errors fail the run)
//   2. Project rules: rig pivots, required clips, FX anchors, triangle budget,
//      no textures, size and ground placement.
//
//   npm run models:validate
import './lib/node-polyfills.mjs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import validator from 'gltf-validator';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MODELS_DIR = path.join(ROOT, 'godot/assets/models');

const HELMET_TOP_RANGE = [1.75, 1.95]; // meters: body height = top of the helmet in the rest pose
const MAX_TOTAL_HEIGHT = 2.4; // meters, including accessories such as antennas
const GROUND_TOLERANCE = 0.01; // the lowest point must sit on y = 0
const MAX_MESHES = 50; // ≈ draw calls per avatar (see AGENTS.md §5.3)
const MAX_BYTES = 400 * 1024;

function parseGlb(file, buffer) {
  return new Promise((resolve, reject) => {
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    new GLTFLoader().parse(arrayBuffer, '', resolve, (e) => reject(new Error(`${file}: ${e.message ?? e}`)));
  });
}

async function validateModel(entry, conventions) {
  const problems = [];
  const file = path.join(MODELS_DIR, entry.file);
  const bytes = await readFile(file);

  // 1. Khronos validator.
  const report = await validator.validateBytes(new Uint8Array(bytes), { uri: entry.file, maxIssues: 50 });
  for (const message of report.issues.messages) {
    if (message.severity === 0) problems.push(`glTF error ${message.code}: ${message.message} (${message.pointer ?? ''})`);
  }

  // 2. Project rules.
  const gltf = await parseGlb(entry.file, bytes);
  const scene = gltf.scene;
  const names = new Set();
  scene.traverse((o) => names.add(o.name));

  for (const pivot of conventions.pivots) {
    if (!names.has(pivot)) problems.push(`missing rig pivot "${pivot}"`);
  }
  const clipNames = gltf.animations.map((a) => a.name);
  for (const clip of conventions.requiredClips) {
    if (!clipNames.includes(clip)) problems.push(`missing animation "${clip}"`);
  }
  for (const fx of entry.fx ?? []) {
    if (!names.has(fx.anchor)) problems.push(`FX anchor "${fx.anchor}" listed in manifest but not in the model`);
    for (const clip of fx.clips ?? []) {
      if (!clipNames.includes(clip)) problems.push(`FX "${fx.anchor}" references unknown clip "${clip}"`);
    }
  }

  let triangles = 0;
  let meshes = 0;
  let textures = 0;
  scene.traverse((o) => {
    if (!o.isMesh) return;
    meshes++;
    const g = o.geometry;
    triangles += (g.index ? g.index.count : g.attributes.position.count) / 3;
    for (const value of Object.values(o.material)) if (value?.isTexture) textures++;
  });
  if (triangles > entry.budget.triangles) problems.push(`${triangles} triangles > budget ${entry.budget.triangles}`);
  if (meshes > MAX_MESHES) problems.push(`${meshes} meshes > ${MAX_MESHES}`);
  if (bytes.byteLength > MAX_BYTES) problems.push(`${(bytes.byteLength / 1024).toFixed(0)} KB > ${MAX_BYTES / 1024} KB`);
  if (textures > 0) problems.push(`${textures} textures found; avatars use flat palette colors only`);

  scene.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(scene);
  const height = bounds.max.y - bounds.min.y;
  if (height > MAX_TOTAL_HEIGHT) problems.push(`total height ${height.toFixed(2)} m > ${MAX_TOTAL_HEIGHT} m`);
  if (Math.abs(bounds.min.y) > GROUND_TOLERANCE) problems.push(`feet at y = ${bounds.min.y.toFixed(3)}, expected 0`);

  const helmet = scene.getObjectByName('Head_Helmet');
  const helmetTop = helmet ? new THREE.Box3().setFromObject(helmet).max.y : NaN;
  if (!(helmetTop >= HELMET_TOP_RANGE[0] && helmetTop <= HELMET_TOP_RANGE[1])) {
    problems.push(`helmet top at ${helmetTop.toFixed(2)} m, expected ${HELMET_TOP_RANGE.join('–')} m`);
  }

  return {
    problems,
    summary: `${triangles} tris, ${meshes} meshes, ${clipNames.length} clips, ` +
      `helmet top ${helmetTop.toFixed(2)} m, total ${height.toFixed(2)} m, ` +
      `${report.issues.numWarnings} warnings, ${report.issues.numInfos} infos`,
  };
}

async function main() {
  const manifest = JSON.parse(await readFile(path.join(MODELS_DIR, 'manifest.json'), 'utf8'));
  let failed = 0;
  for (const entry of manifest.models) {
    const { problems, summary } = await validateModel(entry, manifest.conventions);
    if (problems.length) {
      failed++;
      console.log(`✘ ${entry.id}: ${summary}`);
      for (const p of problems) console.log(`    - ${p}`);
    } else {
      console.log(`✔ ${entry.id}: ${summary}`);
    }
  }
  if (failed) {
    console.error(`\n${failed} model(s) failed validation`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
