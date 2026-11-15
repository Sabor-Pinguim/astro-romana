// Turns a square height grid into mesh arrays and computes shading helpers.
//
// Grid layout: count x count samples, row-major, row 0 = north edge, column 0 = west
// edge, `step` meters apart. Godot/glTF axes: +X = east, +Y = up, -Z = north.

const DEG = Math.PI / 180;

/** Surface normals in glTF axes (x = east, y = up, z = south) from central differences. */
export function gridNormals(heights, count, step) {
  const normals = new Float32Array(count * count * 3);
  const h = (i, j) => heights[Math.min(count - 1, Math.max(0, j)) * count + Math.min(count - 1, Math.max(0, i))];
  for (let j = 0; j < count; j++) {
    for (let i = 0; i < count; i++) {
      const dx = (i === 0 || i === count - 1 ? 1 : 2) * step;
      const dz = (j === 0 || j === count - 1 ? 1 : 2) * step;
      const dhdx = (h(i + 1, j) - h(i - 1, j)) / dx; // slope toward east
      const dhdz = (h(i, j + 1) - h(i, j - 1)) / dz; // slope toward south (+Z)
      const length = Math.hypot(dhdx, 1, dhdz);
      const k = (j * count + i) * 3;
      normals[k] = -dhdx / length;
      normals[k + 1] = 1 / length;
      normals[k + 2] = -dhdz / length;
    }
  }
  return normals;
}

/** Unit vector pointing to the sun, glTF axes. Azimuth is clockwise from north. */
export function sunVector(azimuthDeg, elevationDeg) {
  const az = azimuthDeg * DEG;
  const el = elevationDeg * DEG;
  return [Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)];
}

/** Lambert shading (0..1) of the grid for a given sun. */
export function hillshade(heights, count, step, azimuthDeg, elevationDeg) {
  const normals = gridNormals(heights, count, step);
  const [sx, sy, sz] = sunVector(azimuthDeg, elevationDeg);
  const shade = new Float32Array(count * count);
  for (let k = 0; k < shade.length; k++) {
    shade[k] = Math.max(0, normals[k * 3] * sx + normals[k * 3 + 1] * sy + normals[k * 3 + 2] * sz);
  }
  return shade;
}

/** Pearson correlation of two equally sized arrays. */
export function correlation(a, b) {
  const n = a.length;
  let ma = 0;
  let mb = 0;
  for (let k = 0; k < n; k++) {
    ma += a[k];
    mb += b[k];
  }
  ma /= n;
  mb /= n;
  let cov = 0;
  let va = 0;
  let vb = 0;
  for (let k = 0; k < n; k++) {
    const da = a[k] - ma;
    const db = b[k] - mb;
    cov += da * db;
    va += da * da;
    vb += db * db;
  }
  return cov / Math.sqrt(va * vb);
}

/**
 * Averages a square image (pixels covering the whole site) over the footprint of each
 * vertex of a count x count grid (vertices on the site edges).
 */
export function imageAtVertices(image, size, count) {
  const footprint = size / (count - 1);
  const range = (k) => {
    const centerPx = (k * size) / (count - 1);
    return [Math.max(0, Math.floor(centerPx - footprint / 2)), Math.min(size - 1, Math.ceil(centerPx + footprint / 2) - 1)];
  };
  const out = new Float32Array(count * count);
  for (let j = 0; j < count; j++) {
    const [y0, y1] = range(j);
    for (let i = 0; i < count; i++) {
      const [x0, x1] = range(i);
      let sum = 0;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) sum += image[y * size + x];
      out[j * count + i] = sum / ((y1 - y0 + 1) * (x1 - x0 + 1));
    }
  }
  return out;
}

/**
 * Builds the mesh arrays. Heights are shifted by `reference` so y = 0 is the ground at
 * the site center. Each grid quad is split along its flatter diagonal, which keeps
 * ridges and gullies instead of zig-zagging across them.
 */
export function buildTerrainMesh(heights, count, sizeM, reference) {
  const step = sizeM / (count - 1);
  const half = sizeM / 2;
  const vertexCount = count * count;
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  for (let j = 0; j < count; j++) {
    for (let i = 0; i < count; i++) {
      const k = j * count + i;
      positions[k * 3] = -half + i * step;
      positions[k * 3 + 1] = heights[k] - reference;
      positions[k * 3 + 2] = -half + j * step;
      uvs[k * 2] = i / (count - 1);
      uvs[k * 2 + 1] = j / (count - 1);
    }
  }

  // 65535 is the primitive-restart value, so 16-bit indices can address 65535 vertices.
  const IndexArray = vertexCount <= 65535 ? Uint16Array : Uint32Array;
  const indices = new IndexArray((count - 1) * (count - 1) * 6);
  let n = 0;
  for (let j = 0; j < count - 1; j++) {
    for (let i = 0; i < count - 1; i++) {
      const a = j * count + i; // north-west
      const b = a + 1; // north-east
      const c = a + count; // south-west
      const d = c + 1; // south-east
      // Counter-clockwise seen from above (+Y), as glTF expects for front faces.
      if (Math.abs(heights[a] - heights[d]) <= Math.abs(heights[b] - heights[c])) {
        indices.set([a, c, d, a, d, b], n);
      } else {
        indices.set([a, c, b, b, c, d], n);
      }
      n += 6;
    }
  }

  return { positions, normals: gridNormals(heights, count, step), uvs, indices, step };
}
