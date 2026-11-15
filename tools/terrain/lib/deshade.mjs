// Removes from the orthoimage the shading that the DTM explains ("de-shading"), so the game
// light can shade the mesh without doubling the shadows already in the photo.
//
// Model, per texel: photo = albedo × (k + direct), where
//   direct = max(0, N·L), or 0 when the DTM casts a shadow on the texel (sun of the photo);
//   k      = ambient / direct light ratio, fitted on the photo itself (photo ≈ a + b·direct,
//            k = a / b), so no radiometric calibration is needed.
// Detail finer than the DTM (rocks, small ripples, cracks) cannot be explained and stays in
// the texture, as it should: the mesh cannot shade it.

const DEG = Math.PI / 180;
const SHADOW_EPSILON_M = 0.05; // ray clearance when testing cast shadows (avoids self-hits)
const MIN_AMBIENT_RATIO = 0.25; // never divide by less: keeps noise in deep shadows bounded

/** Bilinear height at fractional grid coordinates (gx east, gy south), clamped to the grid. */
function heightSampler(heights, count) {
  const max = count - 1.000001;
  return (gx, gy) => {
    const x = Math.min(max, Math.max(0, gx));
    const y = Math.min(max, Math.max(0, gy));
    const i = Math.floor(x);
    const j = Math.floor(y);
    const u = x - i;
    const v = y - j;
    const k = j * count + i;
    return (heights[k] * (1 - u) + heights[k + 1] * u) * (1 - v) + (heights[k + count] * (1 - u) + heights[k + count + 1] * u) * v;
  };
}

/**
 * Direct sunlight (0..1) at every texel center of a `size` x `size` texture laid over the grid.
 * Normals use central differences over ±1 grid cell, like the mesh normals the game lights.
 */
export function directLight({ heights, count, sizeM, size, sun }) {
  const step = sizeM / (count - 1);
  const texel = sizeM / size;
  const H = heightSampler(heights, count);
  const az = sun.azimuthDeg * DEG;
  const el = sun.elevationDeg * DEG;
  const [le, lu, ln] = [Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)]; // east, up, north
  let maxH = -Infinity;
  for (const h of heights) maxH = Math.max(maxH, h);
  // Cast shadows: march toward the sun in half-cell steps until the ray clears the highest point.
  const march = step / 2;
  const dgx = (Math.sin(az) * march) / step; // grid cells per march step (east)
  const dgy = (-Math.cos(az) * march) / step; // rows go south
  const rise = Math.tan(el) * march;

  const direct = new Float32Array(size * size);
  let shadowed = 0;
  for (let y = 0; y < size; y++) {
    const gy = ((y + 0.5) * texel) / step;
    for (let x = 0; x < size; x++) {
      const gx = ((x + 0.5) * texel) / step;
      const dhde = (H(gx + 1, gy) - H(gx - 1, gy)) / (2 * step);
      const dhdn = (H(gx, gy - 1) - H(gx, gy + 1)) / (2 * step);
      let light = (-dhde * le + lu - dhdn * ln) / Math.hypot(dhde, 1, dhdn);
      if (light > 0) {
        let px = gx;
        let py = gy;
        let ray = H(gx, gy) + SHADOW_EPSILON_M;
        while (ray < maxH) {
          px += dgx;
          py += dgy;
          ray += rise;
          if (px < 0 || py < 0 || px > count - 1 || py > count - 1) break; // left the site: lit
          if (H(px, py) > ray) {
            light = 0;
            break;
          }
        }
      }
      if (light <= 0) shadowed++;
      direct[y * size + x] = Math.max(0, light);
    }
  }
  return { direct, shadowFraction: shadowed / direct.length };
}

/**
 * Divides the photo by the fitted light model. `values` are the raw photo samples (any linear
 * scale); the result keeps their mean brightness. Returns the input untouched when the photo
 * shows no relief shading to remove (the fit gives b <= 0).
 */
export function deshade(values, direct) {
  const n = values.length;
  let mp = 0;
  let md = 0;
  for (let k = 0; k < n; k++) {
    mp += values[k];
    md += direct[k];
  }
  mp /= n;
  md /= n;
  let cov = 0;
  let vd = 0;
  for (let k = 0; k < n; k++) {
    cov += (values[k] - mp) * (direct[k] - md);
    vd += (direct[k] - md) ** 2;
  }
  const b = vd > 0 ? cov / vd : 0;
  if (!(b > 0)) return { values, ambientRatio: null };
  const ambientRatio = Math.max(MIN_AMBIENT_RATIO, (mp - b * md) / b);
  const out = new Float32Array(n);
  for (let k = 0; k < n; k++) out[k] = (values[k] * (ambientRatio + md)) / (ambientRatio + direct[k]);
  return { values: out, ambientRatio };
}
