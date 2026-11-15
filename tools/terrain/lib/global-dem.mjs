// Reads a window of a global Mars DEM stored as one uncompressed, stripped GeoTIFF in simple
// cylindrical lon/lat degrees (the USGS HRSC–MOLA blend: 11 GB, not cloud optimized).
// Each row is one strip, so a window costs one HTTP range request per row, for its columns only.
import { fromUrl } from 'geotiff';
import { fetchRange, mapLimit, withRetry } from './net.mjs';

const CONCURRENCY = 16;
const GEOGRAPHIC = 2; // GTModelTypeGeoKey: lon/lat degrees

export async function openGlobalDem(url) {
  const tiff = await fromUrl(url, { allowFullFile: false });
  const image = await tiff.getImage(0);
  const fd = image.fileDirectory;
  const geoKeys = image.getGeoKeys();
  const supported = fd.getValue('Compression') === 1 && fd.getValue('RowsPerStrip') === 1 &&
    image.getSamplesPerPixel() === 1 && image.getBitsPerSample() === 16 && image.getSampleFormat() === 2 &&
    geoKeys.GTModelTypeGeoKey === GEOGRAPHIC;
  if (!supported) throw new Error(`${url}: expected an uncompressed int16 lon/lat GeoTIFF with one row per strip`);
  const [lon0, lat0] = image.getOrigin();
  const [resLon, resLat] = image.getResolution();
  return {
    url,
    width: image.getWidth(),
    height: image.getHeight(),
    lon0,
    lat0,
    resLon,
    resLat, // negative: rows go south
    radius: geoKeys.GeogSemiMajorAxisGeoKey,
    nodata: image.getGDALNoData(),
    littleEndian: tiff.littleEndian,
    rowOffset: (row) => fd.loadValueIndexed('StripOffsets', row),
  };
}

/**
 * Reads every pixel whose center falls in the lon/lat box and returns box-filtered samplers:
 * `mean(lon, lat, radiusLonDeg, radiusLatDeg)` averages the valid heights in the box (NaN if none);
 * `directLight(sun)` gives the same kind of sampler for the direct sunlight on the terrain.
 */
export async function readGlobalDemBox(dem, { lonMin, lonMax, latMin, latMax }) {
  if (lonMin < -180 || lonMax > 180) throw new Error('DEM window crosses the ±180° meridian (not supported)');
  const col0 = Math.max(0, Math.floor((lonMin - dem.lon0) / dem.resLon));
  const col1 = Math.min(dem.width, Math.ceil((lonMax - dem.lon0) / dem.resLon) + 1);
  const row0 = Math.max(0, Math.floor((latMax - dem.lat0) / dem.resLat));
  const row1 = Math.min(dem.height, Math.ceil((latMin - dem.lat0) / dem.resLat) + 1);
  const width = col1 - col0;
  const height = row1 - row0;
  const rows = Array.from({ length: height }, (_, r) => row0 + r);
  const data = new Float32Array(width * height);
  await mapLimit(rows, CONCURRENCY, async (row, r) => {
    const bytes = await withRetry(async () => {
      const offset = Number(await dem.rowOffset(row));
      return fetchRange(dem.url, offset + col0 * 2, offset + col1 * 2);
    });
    for (let c = 0; c < width; c++) {
      const v = dem.littleEndian ? bytes.readInt16LE(c * 2) : bytes.readInt16BE(c * 2);
      data[r * width + c] = v === dem.nodata ? NaN : v;
    }
  });

  const geo = { dem, col0, row0, width, height };
  return {
    mean: boxMeanSampler(data, geo),
    rows: height,
    columns: width,
    pixelM: Math.abs(dem.resLat) * (Math.PI / 180) * dem.radius,
    /** Box-mean sampler of the direct sunlight (0..1) on this window, cast shadows included. */
    directLight: (sun) => boxMeanSampler(directLightGrid(data, geo, sun), geo),
  };
}

/** Box means over a lon/lat grid window via summed-area tables of values and valid counts (O(1) per query). */
function boxMeanSampler(data, { dem, col0, row0, width, height }) {
  const W = width + 1;
  const sum = new Float64Array(W * (height + 1));
  const cnt = new Float64Array(W * (height + 1));
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const v = data[r * width + c];
      const k = (r + 1) * W + c + 1;
      sum[k] = (Number.isNaN(v) ? 0 : v) + sum[k - 1] + sum[k - W] - sum[k - W - 1];
      cnt[k] = (Number.isNaN(v) ? 0 : 1) + cnt[k - 1] + cnt[k - W] - cnt[k - W - 1];
    }
  }
  const at = (table, r, c) => table[r * W + c];
  return (lon, lat, radiusLonDeg, radiusLatDeg) => {
    const cc = (lon - dem.lon0) / dem.resLon - 0.5 - col0; // fractional pixel-center coordinates
    const rr = (lat - dem.lat0) / dem.resLat - 0.5 - row0;
    const hc = Math.max(0.5, Math.abs(radiusLonDeg / dem.resLon));
    const hr = Math.max(0.5, Math.abs(radiusLatDeg / dem.resLat));
    const c0 = Math.max(0, Math.round(cc - hc));
    const c1 = Math.min(width, Math.round(cc + hc) + 1);
    const r0 = Math.max(0, Math.round(rr - hr));
    const r1 = Math.min(height, Math.round(rr + hr) + 1);
    if (c1 <= c0 || r1 <= r0) return NaN;
    const n = at(cnt, r1, c1) - at(cnt, r0, c1) - at(cnt, r1, c0) + at(cnt, r0, c0);
    if (!n) return NaN;
    return (at(sum, r1, c1) - at(sum, r0, c1) - at(sum, r1, c0) + at(sum, r0, c0)) / n;
  };
}

/**
 * Direct sunlight per DEM pixel: max(0, N·L), or 0 where the terrain casts a shadow (ray march toward
 * the sun, one pixel per step). The sun is taken as fixed over the window (it moves < 2° over 100 km).
 */
function directLightGrid(data, { dem, col0, row0, width, height }, sun) {
  const DEG = Math.PI / 180;
  const az = sun.azimuthDeg * DEG;
  const el = sun.elevationDeg * DEG;
  const [le, lu, ln] = [Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)]; // east, up, north
  const dy = Math.abs(dem.resLat) * DEG * dem.radius; // meters per row
  let maxH = -Infinity;
  for (const v of data) if (v > maxH) maxH = v;
  const h = (c, r) => {
    const v = data[Math.min(height - 1, Math.max(0, r)) * width + Math.min(width - 1, Math.max(0, c))];
    return Number.isNaN(v) ? 0 : v;
  };
  const bilinear = (x, y) => {
    const c = Math.floor(x);
    const r = Math.floor(y);
    const u = x - c;
    const v = y - r;
    return (h(c, r) * (1 - u) + h(c + 1, r) * u) * (1 - v) + (h(c, r + 1) * (1 - u) + h(c + 1, r + 1) * u) * v;
  };
  const out = new Float32Array(width * height);
  for (let r = 0; r < height; r++) {
    const lat = dem.lat0 + (row0 + r + 0.5) * dem.resLat;
    const dx = Math.abs(dem.resLon) * DEG * dem.radius * Math.cos(lat * DEG); // meters per column
    const step = Math.min(dx, dy);
    const dc = (Math.sin(az) * step) / dx;
    const dr = (-Math.cos(az) * step) / dy;
    const rise = Math.tan(el) * step;
    for (let c = 0; c < width; c++) {
      if (Number.isNaN(data[r * width + c])) {
        out[r * width + c] = NaN;
        continue;
      }
      const dhde = (h(c + 1, r) - h(c - 1, r)) / (2 * dx);
      const dhdn = (h(c, r - 1) - h(c, r + 1)) / (2 * dy);
      let light = (-dhde * le + lu - dhdn * ln) / Math.hypot(dhde, 1, dhdn);
      if (light > 0) {
        let x = c;
        let y = r;
        let ray = h(c, r) + 1;
        while (ray < maxH) {
          x += dc;
          y += dr;
          ray += rise;
          if (x < 0 || y < 0 || x > width - 1 || y > height - 1) break;
          if (bilinear(x, y) > ray) {
            light = 0;
            break;
          }
        }
      }
      out[r * width + c] = Math.max(0, light);
    }
  }
  return out;
}
