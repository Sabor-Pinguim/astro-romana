// Reads only the needed part of a Cloud Optimized GeoTIFF (HTTP range requests) and
// samples it on the local grid of a site.
import { fromUrl } from 'geotiff';

/** Opens a COG and lists its full-resolution image and overviews (finest first). */
export async function openCog(url) {
  const tiff = await fromUrl(url, { allowFullFile: false });
  const base = await tiff.getImage(0);
  const [originX, originY] = base.getOrigin();
  const [resX, resY] = base.getResolution();
  const nodata = base.getGDALNoData();
  const levels = [];
  const count = await tiff.getImageCount();
  for (let i = 0; i < count; i++) {
    const image = i === 0 ? base : await tiff.getImage(i);
    const scale = base.getWidth() / image.getWidth();
    levels.push({ image, width: image.getWidth(), height: image.getHeight(), resX: resX * scale, resY: resY * scale });
  }
  return { url, originX, originY, nodata, levels };
}

/** Coarsest level whose pixel size is still <= `maxPixelSize` meters, 5% tolerance (or the full image). */
export function pickLevel(cog, maxPixelSize) {
  let chosen = cog.levels[0];
  for (const level of cog.levels) if (Math.abs(level.resX) <= maxPixelSize * 1.05) chosen = level;
  return chosen;
}

function isInvalid(value, nodata) {
  if (!Number.isFinite(value)) return true;
  if (nodata === null || nodata === undefined) return false;
  if (nodata < -1e30) return value < -1e30; // float "-FLT_MAX" style nodata
  return value === nodata;
}

/**
 * Reads the window of `level` that covers every projected point in `points` (plus a small
 * margin). Returns the raw window: values (nodata already NaN) and where it sits in the raster.
 */
export async function readWindow(cog, level, points, marginPx = 3) {
  let minCol = Infinity;
  let maxCol = -Infinity;
  let minRow = Infinity;
  let maxRow = -Infinity;
  for (const [x, y] of points) {
    const col = (x - cog.originX) / level.resX - 0.5;
    const row = (y - cog.originY) / level.resY - 0.5;
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    minRow = Math.min(minRow, row);
    maxRow = Math.max(maxRow, row);
  }
  const x0 = Math.max(0, Math.floor(minCol) - marginPx);
  const y0 = Math.max(0, Math.floor(minRow) - marginPx);
  const x1 = Math.min(level.width, Math.ceil(maxCol) + 1 + marginPx);
  const y1 = Math.min(level.height, Math.ceil(maxRow) + 1 + marginPx);
  if (x1 <= x0 || y1 <= y0) throw new Error(`site falls outside ${cog.url}`);

  const [raw] = await level.image.readRasters({ window: [x0, y0, x1, y1], samples: [0] });
  const data = new Float32Array(raw.length);
  for (let k = 0; k < raw.length; k++) data[k] = isInvalid(raw[k], cog.nodata) ? NaN : raw[k];
  return { data, width: x1 - x0, height: y1 - y0, x0, y0, originX: cog.originX, originY: cog.originY, resX: level.resX, resY: level.resY };
}

/**
 * Bilinear sampler over a window from readWindow (or loaded from disk): (x, y) in projected
 * meters -> value, or NaN when the point falls outside the data or next to a nodata pixel.
 */
export function regionFromWindow({ data, width, height, x0, y0, originX, originY, resX, resY }) {
  const read = (c, r) => (c < 0 || r < 0 || c >= width || r >= height ? NaN : data[r * width + c]);
  const sample = (x, y) => {
    const col = (x - originX) / resX - 0.5 - x0;
    const row = (y - originY) / resY - 0.5 - y0;
    const c = Math.floor(col);
    const r = Math.floor(row);
    const fx = col - c;
    const fy = row - r;
    const top = read(c, r) * (1 - fx) + read(c + 1, r) * fx;
    const bottom = read(c, r + 1) * (1 - fx) + read(c + 1, r + 1) * fx;
    return top * (1 - fy) + bottom * fy; // NaN propagates from any missing neighbor
  };
  return { sample, window: [x0, y0, x0 + width, y0 + height], pixelSize: Math.abs(resX) };
}

/** Local east/north positions of a square grid, row 0 = north edge. */
export function gridPositions(count, sizeM, pixelCenters) {
  const half = sizeM / 2;
  const step = pixelCenters ? sizeM / count : sizeM / (count - 1);
  const offset = pixelCenters ? step / 2 : 0;
  const coords = new Float64Array(count);
  for (let i = 0; i < count; i++) coords[i] = -half + offset + i * step;
  return { east: coords, north: Float64Array.from(coords, (v) => -v), step };
}

/** Samples `region` on a count x count grid of the site. Returns values and invalid count. */
export function sampleGrid(region, frame, count, sizeM, pixelCenters) {
  const { east, north } = gridPositions(count, sizeM, pixelCenters);
  const values = new Float32Array(count * count);
  let invalid = 0;
  for (let j = 0; j < count; j++) {
    for (let i = 0; i < count; i++) {
      const [x, y] = frame.toProjected(east[i], north[j]);
      const v = region.sample(x, y);
      if (Number.isNaN(v)) invalid++;
      values[j * count + i] = v;
    }
  }
  return { values, invalid };
}

/** Projected points along the border of the site, used to size the read window. */
export function borderPoints(frame, sizeM, perEdge = 16) {
  const half = sizeM / 2;
  const points = [];
  for (let k = 0; k <= perEdge; k++) {
    const t = -half + (k * sizeM) / perEdge;
    points.push(frame.toProjected(t, half), frame.toProjected(t, -half));
    points.push(frame.toProjected(half, t), frame.toProjected(-half, t));
  }
  return points;
}

/** Fills NaN cells with the mean of their valid neighbors, pass by pass (deterministic). */
export function fillHoles(values, count) {
  let holes = 0;
  for (const v of values) if (Number.isNaN(v)) holes++;
  if (holes === values.length) throw new Error('no valid samples in the site');
  let remaining = holes;
  while (remaining > 0) {
    const snapshot = Float32Array.from(values);
    remaining = 0;
    for (let j = 0; j < count; j++) {
      for (let i = 0; i < count; i++) {
        const k = j * count + i;
        if (!Number.isNaN(snapshot[k])) continue;
        let sum = 0;
        let n = 0;
        for (let dj = -1; dj <= 1; dj++) {
          for (let di = -1; di <= 1; di++) {
            const ii = i + di;
            const jj = j + dj;
            if (ii < 0 || jj < 0 || ii >= count || jj >= count) continue;
            const v = snapshot[jj * count + ii];
            if (!Number.isNaN(v)) {
              sum += v;
              n++;
            }
          }
        }
        if (n > 0) values[k] = sum / n;
        else remaining++;
      }
    }
  }
  return holes;
}
