// Shared pieces for low-poly planets: icosphere topology, per-face data sampling,
// flat-shaded meshes per material and surface anchors (Site_*).
import * as THREE from 'three';
import { latLonToVector, vectorToLatLon } from './geogrid.mjs';
import { cross, faceSamples, icosphere, normalize, sub } from './icosphere.mjs';

/**
 * Icosphere plus the adjacency the generators need.
 * `refine`: [{lat, lon, detail, radiusKm}] regions split finer than `detail` (see icosphere.mjs).
 */
export function createSphere(detail, refine = [], radiusKm = 1) {
  const regions = refine.map((r) => ({ dir: latLonToVector(r.lat, r.lon), detail: r.detail, radius: r.radiusKm / radiusKm }));
  const { vertices, faces } = icosphere(detail, regions);
  const vertexFaces = vertices.map(() => []);
  faces.forEach((face, i) => face.forEach((v) => vertexFaces[v].push(i)));

  const edgeOwner = new Map();
  const neighbours = faces.map(() => []);
  faces.forEach((face, i) => {
    for (let k = 0; k < 3; k++) {
      const a = face[k];
      const b = face[(k + 1) % 3];
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      const other = edgeOwner.get(key);
      if (other === undefined) edgeOwner.set(key, i);
      else {
        neighbours[i].push(other);
        neighbours[other].push(i);
      }
    }
  });
  return { vertices, faces, vertexFaces, neighbours };
}

/** Calls `sample(lat, lon)` at k² points inside every face; returns one array per face. */
export function sampleFaces(sphere, k, sample) {
  return sphere.faces.map((face) => {
    const [a, b, c] = face.map((v) => sphere.vertices[v]);
    return faceSamples(a, b, c, k).map((p) => sample(...vectorToLatLon(p)));
  });
}

/** Groups of faces connected across edges, for faces where `include(face)` is true. */
export function connectedGroups(sphere, include) {
  const group = new Int32Array(sphere.faces.length).fill(-1);
  const groups = [];
  for (let start = 0; start < sphere.faces.length; start++) {
    if (group[start] !== -1 || !include(start)) continue;
    const members = [start];
    group[start] = groups.length;
    for (let i = 0; i < members.length; i++) {
      for (const n of sphere.neighbours[members[i]]) {
        if (group[n] === -1 && include(n)) {
          group[n] = groups.length;
          members.push(n);
        }
      }
    }
    groups.push(members);
  }
  return { group, groups };
}

function displaced(sphere, radii, faceIndex) {
  return sphere.faces[faceIndex].map((v) => sphere.vertices[v].map((x) => x * radii[v]));
}

/**
 * Adds one flat-shaded, non-indexed mesh per material under `root`, named `<prefix>_<Material>`.
 * `radii[v]` scales unit vertex v; `faceMaterial[f]` is a key of `materials`.
 */
export function addSurfaceMeshes(root, prefix, materials, sphere, radii, faceMaterial) {
  const byMaterial = new Map();
  faceMaterial.forEach((key, f) => {
    if (!materials[key]) throw new Error(`face ${f}: unknown material "${key}"`);
    if (!byMaterial.has(key)) byMaterial.set(key, []);
    byMaterial.get(key).push(f);
  });
  for (const key of Object.keys(materials)) {
    const list = byMaterial.get(key);
    if (!list) continue;
    const positions = new Float32Array(list.length * 9);
    const normals = new Float32Array(list.length * 9);
    list.forEach((f, n) => {
      const points = displaced(sphere, radii, f);
      const normal = normalize(cross(sub(points[1], points[0]), sub(points[2], points[0])));
      for (let k = 0; k < 3; k++) {
        positions.set(points[k], n * 9 + k * 3);
        normals.set(normal, n * 9 + k * 3);
      }
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    const mesh = new THREE.Mesh(geometry, materials[key]);
    mesh.name = `${prefix}_${key}`;
    root.add(mesh);
  }
}

/**
 * Adds an empty node on the displaced surface at a latitude/longitude.
 * Local axes: +Y = up (away from the center), +X = east, −Z = north (Godot's forward).
 * @returns {number} distance of the node from the center (body radii)
 */
export function addSite(root, sphere, radii, { node, lat, lon }) {
  const d = latLonToVector(lat, lon);
  const inside = (f) => {
    const [a, b, c] = sphere.faces[f].map((v) => sphere.vertices[v]);
    const side = (p, q) => {
      const n = cross(p, q);
      return n[0] * d[0] + n[1] * d[1] + n[2] * d[2] >= -1e-12;
    };
    return side(a, b) && side(b, c) && side(c, a);
  };
  const face = sphere.faces.findIndex((_, f) => inside(f));
  if (face < 0) throw new Error(`${node}: no face contains ${lat}, ${lon}`);
  const [p0, p1, p2] = displaced(sphere, radii, face);
  const n = cross(sub(p1, p0), sub(p2, p0));
  const t = (n[0] * p0[0] + n[1] * p0[1] + n[2] * p0[2]) / (n[0] * d[0] + n[1] * d[1] + n[2] * d[2]);

  const up = new THREE.Vector3(...d);
  const east = new THREE.Vector3(0, 1, 0).cross(up).normalize();
  const south = east.clone().cross(up);
  const anchor = new THREE.Object3D();
  anchor.name = node;
  anchor.position.copy(up).multiplyScalar(t);
  anchor.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(east, up, south));
  anchor.userData = { lat, lon };
  root.add(anchor);
  return t;
}
