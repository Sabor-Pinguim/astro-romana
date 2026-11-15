import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const DEG = THREE.MathUtils.DEG2RAD;

// ---------------------------------------------------------------------------
// Low-poly primitives. Keep segment counts small: the style is faceted on purpose.
// ---------------------------------------------------------------------------
export const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
export const cyl = (radiusTop, radiusBottom, height, segments = 8) =>
  new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments, 1);
export const cylOpen = (radiusTop, radiusBottom, height, segments = 8) =>
  new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments, 1, true);
export const cylArc = (
  radiusTop,
  radiusBottom,
  height,
  segments = 8,
  thetaStart = 0,
  thetaLength = Math.PI * 2,
) => new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments, 1, true, thetaStart, thetaLength);
export const ball = (radius, widthSegments = 8, heightSegments = 6) =>
  new THREE.SphereGeometry(radius, widthSegments, heightSegments);
/** Ring lying flat in the XZ plane (around the Y axis). */
export const ring = (radius, tube, tubularSegments = 10, radialSegments = 3) =>
  new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments).rotateX(Math.PI / 2);
/** Partial torus arc in the XY plane. */
export const torusArc = (radius, tube, tubularSegments = 10, radialSegments = 4, arc = Math.PI) =>
  new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
/** Solid annular washer / flange ring in the XZ plane centered at y = 0. */
export const flatRing = (outerR, innerR, height, segments = 12) => {
  const h = height / 2;
  const profile = [
    [innerR, -h],
    [outerR, -h],
    [outerR, h],
    [innerR, h],
    [innerR, -h],
  ];
  return new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), segments);
};
export const lathe = (profile, segments = 8) => {
  const pts =
    profile.length >= 2 && profile[0][1] > profile[profile.length - 1][1]
      ? [...profile].reverse()
      : profile;
  return new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), segments);
};
/** Partial sphere; phi is measured around +Y starting at -X (three.js convention). */
export const shell = (radius, w, h, phiStart, phiLength, thetaStart, thetaLength) =>
  new THREE.SphereGeometry(radius, w, h, phiStart, phiLength, thetaStart, thetaLength);

/** Non-indexed geometry with per-face normals = flat shading that survives glTF export. */
function flatten(geometry) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  for (const name of Object.keys(g.attributes)) {
    if (name !== 'position') g.deleteAttribute(name);
  }
  g.computeVertexNormals();
  return g;
}

function transformMatrix({ p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1] } = {}) {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(...p),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(r[0] * DEG, r[1] * DEG, r[2] * DEG)),
    new THREE.Vector3(...s),
  );
}

/**
 * Collects parts attached to one pivot and merges them into one mesh per material,
 * which keeps draw calls low (one per material per pivot).
 */
export class PartSet {
  constructor(materials) {
    this.materials = materials;
    this.byMaterial = new Map();
  }

  /**
   * @param {string} materialKey key in the palette (e.g. 'Suit', 'Accent')
   * @param {THREE.BufferGeometry} geometry
   * @param {{p?: number[], r?: number[], s?: number[]}} transform position (m), rotation (deg), scale
   */
  add(materialKey, geometry, transform) {
    if (!this.materials[materialKey]) throw new Error(`Unknown material "${materialKey}"`);
    if (transform?.s?.some((v) => v < 0)) throw new Error('Negative scale flips faces; mirror by position instead');
    const g = flatten(geometry).applyMatrix4(transformMatrix(transform));
    if (!this.byMaterial.has(materialKey)) this.byMaterial.set(materialKey, []);
    this.byMaterial.get(materialKey).push(g);
    return this;
  }

  /** Adds one mesh per material as children of `node`, named `<prefix>_<Material>`. */
  attachTo(node, prefix) {
    for (const [key, geometries] of this.byMaterial) {
      const merged = mergeGeometries(geometries, false);
      const mesh = new THREE.Mesh(merged, this.materials[key]);
      mesh.name = `${prefix}_${key}`;
      node.add(mesh);
    }
  }
}
