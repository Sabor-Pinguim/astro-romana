// Horizon ring around a site: the land beyond the walkable terrain, out to tens of km, so the
// real crater rims and mountains stand on the horizon. A polar grid (rings × segments) with the
// curvature of Mars, plus a polar texture (u = azimuth, v = log distance) that carries the ground
// gray and the shading of the relief at the DEM's full resolution: far finer than the mesh.
//
// Same axes as the terrain: +X east, +Y up, -Z north, y = 0 at the site center elevation.

const SINK_M = 3; // vertices under the walkable terrain are pushed down so they never show through it

/** Ring radii in meters, spaced geometrically (the far land needs less detail). */
export function horizonRadii(innerM, outerM, rings) {
  const radii = new Float64Array(rings);
  for (let i = 0; i < rings; i++) radii[i] = innerM * (outerM / innerM) ** (i / (rings - 1));
  return radii;
}

/**
 * Mesh: `segments + 1` vertices per ring (the last repeats azimuth 0° with u = 1, so the texture does
 * not wrap backwards across the seam). uv = (azimuth / 360°, ring / (rings − 1)), which matches the
 * texture of horizonTexture because both use the same geometric spacing of distances.
 * @param {(r: number, azimuth: number, footprintM: number) => number} o.heightAt  m, relative to the site center (azimuth in radians, clockwise from north)
 */
export function buildHorizonMesh({ radii, segments, planetRadius, half, heightAt }) {
  const rings = radii.length;
  const columns = segments + 1;
  const vertexCount = rings * columns;
  if (vertexCount > 65535) throw new Error(`horizon has ${vertexCount} vertices; 16-bit indices hold 65535`);
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Uint16Array(vertexCount * 2); // normalized
  for (let i = 0; i < rings; i++) {
    const r = radii[i];
    const footprintM = (Math.PI * r) / segments; // half the spacing around the ring
    const angle = r / planetRadius;
    const horizontal = planetRadius * Math.sin(angle);
    const drop = planetRadius * (1 - Math.cos(angle));
    const ring = new Float64Array(segments);
    for (let j = 0; j < segments; j++) {
      const azimuth = (2 * Math.PI * j) / segments; // clockwise from north
      ring[j] = heightAt(r, azimuth, footprintM);
      if (!Number.isFinite(ring[j])) throw new Error(`no height for the horizon at ${r.toFixed(0)} m, azimuth ${((360 * j) / segments).toFixed(1)}°`);
    }
    for (let j = 0; j < columns; j++) {
      const azimuth = (2 * Math.PI * j) / segments;
      const east = r * Math.sin(azimuth);
      const north = r * Math.cos(azimuth);
      const under = Math.max(Math.abs(east), Math.abs(north)) < half - 1;
      const k = i * columns + j;
      positions[k * 3] = horizontal * Math.sin(azimuth);
      positions[k * 3 + 1] = ring[j % segments] - drop - (under ? SINK_M : 0);
      positions[k * 3 + 2] = -horizontal * Math.cos(azimuth);
      uvs[k * 2] = Math.round((65535 * j) / segments);
      uvs[k * 2 + 1] = Math.round((65535 * i) / (rings - 1));
    }
  }

  const indices = new Uint16Array((rings - 1) * segments * 6);
  let n = 0;
  for (let i = 0; i < rings - 1; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * columns + j; // inner ring
      const b = a + 1; // inner, next azimuth (clockwise)
      const c = a + columns; // outer ring
      const d = c + 1;
      indices.set([a, d, c, a, b, d], n); // counter-clockwise seen from above (+Y)
      n += 6;
    }
  }
  return { positions, uvs, indices };
}

/**
 * Polar texture values, `width` texels around (azimuth, from north clockwise) × `height` texels
 * outward (distance from innerM to outerM, geometric). Row 0 is the inner edge (glTF v = 0 at the top).
 * Returns the raw values of `valueAt` (Float32Array) and the distance of each row.
 * @param {(r: number, azimuth: number, footprintM: number) => number} o.valueAt
 */
export function horizonTexture({ width, height, innerM, outerM, valueAt }) {
  const values = new Float32Array(width * height);
  const rowDistance = new Float64Array(height);
  const logRatio = Math.log(outerM / innerM);
  for (let y = 0; y < height; y++) {
    const r = innerM * Math.exp((logRatio * (y + 0.5)) / height);
    rowDistance[y] = r;
    const footprintM = Math.max((r * logRatio) / height, (2 * Math.PI * r) / width) / 2;
    for (let x = 0; x < width; x++) values[y * width + x] = valueAt(r, (2 * Math.PI * (x + 0.5)) / width, footprintM);
  }
  return { values, rowDistance };
}
