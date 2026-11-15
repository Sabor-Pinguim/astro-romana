// Icosphere for low-poly planets: an icosahedron split `detail` times, with every new
// vertex pushed onto the unit sphere. Faces are counter-clockwise seen from outside.
// One vertex sits on each pole (±Y), so the poles look the same.
//
// detail → faces: 3 → 1 280, 4 → 5 120, 5 → 20 480 (20 · 4^detail).
//
// Optional `regions` split further around a point (e.g. a launch site). A face next to a
// finer one is cut into 2 or 3 triangles through the shared midpoints, so the mesh stays
// watertight (no T-junction cracks). Neighbouring regions must differ by one level at most.

/**
 * @param {number} detail base subdivision level
 * @param {{dir: number[], detail: number, radius: number}[]} regions unit center, level, angular radius (rad)
 * @returns {{vertices: number[][], faces: number[][]}} unit vertices and vertex-index triples
 */
export function icosphere(detail, regions = []) {
  const t = (1 + Math.sqrt(5)) / 2;
  const base = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const baseFaces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  // Rotate about Z so vertex 0 lands on +Y (and vertex 3 on −Y).
  const angle = Math.atan2(1, t);
  const cos = Math.cos(-angle);
  const sin = Math.sin(-angle);
  const vertices = base.map(([x, y, z]) => normalize([x * cos - y * sin, x * sin + y * cos, z]));

  const midpoints = new Map();
  const key = (a, b) => (a < b ? `${a}_${b}` : `${b}_${a}`);
  const midpoint = (a, b) => {
    let index = midpoints.get(key(a, b));
    if (index === undefined) {
      const [p, q] = [vertices[a], vertices[b]];
      index = vertices.push(normalize([p[0] + q[0], p[1] + q[1], p[2] + q[2]])) - 1;
      midpoints.set(key(a, b), index);
    }
    return index;
  };

  const wanted = (face, level) => {
    if (level < detail) return true;
    if (!regions.length) return false;
    const corners = face.map((i) => vertices[i]);
    const center = normalize(corners.reduce((s, p) => [s[0] + p[0], s[1] + p[1], s[2] + p[2]], [0, 0, 0]));
    const reach = Math.max(...corners.map((p) => angleBetween(center, p)));
    return regions.some((r) => level < r.detail && angleBetween(center, r.dir) - reach < r.radius);
  };

  const leaves = [];
  const refine = (face, level) => {
    if (!wanted(face, level)) {
      leaves.push(face);
      return;
    }
    const [a, b, c] = face;
    const ab = midpoint(a, b);
    const bc = midpoint(b, c);
    const ca = midpoint(c, a);
    for (const child of [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]]) refine(child, level + 1);
  };
  for (const face of baseFaces) refine(face, 0);

  // Close T-junctions: a leaf whose edge was split by its neighbour uses that midpoint too.
  const faces = [];
  for (const v of leaves) {
    const m = [0, 1, 2].map((i) => midpoints.get(key(v[i], v[(i + 1) % 3])));
    m.forEach((mid, i) => {
      if (mid !== undefined && (midpoints.has(key(v[i], mid)) || midpoints.has(key(mid, v[(i + 1) % 3])))) {
        throw new Error('icosphere regions: neighbouring faces differ by more than one level');
      }
    });
    const hanging = m.filter((mid) => mid !== undefined).length;
    if (hanging === 0) faces.push(v);
    else if (hanging === 3) faces.push([v[0], m[0], m[2]], [v[1], m[1], m[0]], [v[2], m[2], m[1]], [m[0], m[1], m[2]]);
    else if (hanging === 1) {
      const i = m.findIndex((mid) => mid !== undefined);
      faces.push([v[i], m[i], v[(i + 2) % 3]], [m[i], v[(i + 1) % 3], v[(i + 2) % 3]]);
    } else {
      const j = m.findIndex((mid) => mid === undefined); // the only edge left whole
      const i = (j + 1) % 3;
      const k = (j + 2) % 3;
      const [p, q, r] = [v[i], v[(i + 1) % 3], v[(i + 2) % 3]];
      faces.push([m[i], q, m[k]], [p, m[i], m[k]], [p, m[k], r]);
    }
  }

  // Make every face counter-clockwise from outside (outward normal).
  for (const face of faces) {
    const [a, b, c] = face.map((i) => vertices[i]);
    const n = cross(sub(b, a), sub(c, a));
    if (n[0] * (a[0] + b[0] + c[0]) + n[1] * (a[1] + b[1] + c[1]) + n[2] * (a[2] + b[2] + c[2]) < 0) {
      [face[1], face[2]] = [face[2], face[1]];
    }
  }
  return { vertices, faces };
}

function angleBetween(p, q) {
  return Math.acos(Math.min(1, Math.max(-1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2])));
}

/**
 * Evenly spread sample points inside a spherical triangle (k² points, centers of a
 * k×k sub-triangulation), projected onto the unit sphere.
 */
export function faceSamples(a, b, c, k = 4) {
  const points = [];
  const at = (u, v) => {
    const w = 1 - u - v;
    return normalize([
      a[0] * w + b[0] * u + c[0] * v,
      a[1] * w + b[1] * u + c[1] * v,
      a[2] * w + b[2] * u + c[2] * v,
    ]);
  };
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k - i; j++) {
      points.push(at((i + 1 / 3) / k, (j + 1 / 3) / k));
      if (i + j < k - 1) points.push(at((i + 2 / 3) / k, (j + 2 / 3) / k));
    }
  }
  return points;
}

export function normalize([x, y, z]) {
  const r = Math.hypot(x, y, z);
  return [x / r, y / r, z / r];
}

export function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
