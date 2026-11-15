// Downloads the global Earth grids used by the celestial-body generator and writes them,
// reduced to 0.25°, as small PNG grids in references/datasets/earth/ (see the README there).
// The list of grids lives in bodies/earth-datasets.mjs.
//
// The generator reads only those committed files, so this needs to run again only to
// change a source, a date or the resolution.
//
//   npm run models:fetch:bodies
//
// On networks that intercept HTTPS, run with NODE_OPTIONS=--use-system-ca.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodePng, encodePng } from './lib/png.mjs';
import { EARTH_DATA_DIR, EARTH_DATASETS, ELEVATION_OFFSET } from './bodies/earth-datasets.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT_DIR = path.join(ROOT, EARTH_DATA_DIR);

const STEP_DEG = 0.25;
const WIDTH = 360 / STEP_DEG; // pixel-registered grids (WMS): 1440 × 720
const HEIGHT = 180 / STEP_DEG;
const GIBS_COLORMAPS = 'https://gibs.earthdata.nasa.gov/colormaps/v1.3';

async function download(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    const code = error.cause?.code ?? '';
    const hint = /CERT|SELF_SIGNED/.test(code) ? ' (HTTPS interception? retry with NODE_OPTIONS=--use-system-ca)' : '';
    throw new Error(`${url}: ${error.message} ${code}${hint}`);
  }
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

/** ERDDAP esriAscii → 16-bit grid (first row = north). */
async function fetchElevation(dataset) {
  const lines = (await download(dataset.url)).toString('utf8').split('\n');
  const header = {};
  let row = 0;
  for (; row < lines.length; row++) {
    const m = lines[row].match(/^([a-z_]+)\s+(\S+)$/i);
    if (!m) break;
    header[m[1].toLowerCase()] = Number(m[2]);
  }
  const width = header.ncols;
  const height = header.nrows;
  const data = new Uint16Array(width * height);
  let i = 0;
  for (; row < lines.length && i < data.length; row++) {
    for (const token of lines[row].trim().split(/\s+/)) {
      if (!token) continue;
      const meters = Number(token);
      if (meters === header.nodata_value) throw new Error(`${dataset.file}: unexpected nodata cell`);
      data[i++] = Math.round(meters) + ELEVATION_OFFSET;
    }
  }
  if (i !== data.length) throw new Error(`${dataset.file}: expected ${data.length} values, got ${i}`);
  return { width, height, channels: 1, depth: 16, data };
}

/** Parses a GIBS colormap: rgb → source value (the last value when several share a color). */
function parseColormap(xml) {
  const lookup = new Map();
  for (const m of xml.matchAll(/<ColorMapEntry\s+rgb="(\d+),(\d+),(\d+)"\s+transparent="(true|false)"([^>]*)\/>/g)) {
    const [, r, g, b, transparent, rest] = m;
    const value = rest.match(/sourceValue="[[(]?(?:\d+,)*(\d+)/); // last value: IGBP water is "0,17" → 17
    if (transparent === 'true' || !value) continue;
    lookup.set((+r << 16) | (+g << 8) | +b, Number(value[1]));
  }
  return lookup;
}

/**
 * GIBS WMS classified PNG → 8-bit grid of source values (first row = north).
 * Transparent pixels (no data, or no sea ice) become 0. Colors outside the colormap fail the run.
 */
async function fetchClasses(dataset) {
  const colormap = parseColormap((await download(`${GIBS_COLORMAPS}/${dataset.colormap}`)).toString('utf8'));
  const params = new URLSearchParams({
    SERVICE: 'WMS',
    REQUEST: 'GetMap',
    VERSION: '1.3.0',
    LAYERS: dataset.layer,
    STYLES: '',
    CRS: 'EPSG:4326',
    BBOX: '-90,-180,90,180',
    WIDTH: String(WIDTH),
    HEIGHT: String(HEIGHT),
    FORMAT: 'image/png',
    TIME: dataset.time,
  });
  const image = decodePng(await download(`${dataset.wms}?${params}`));
  if (image.width !== WIDTH || image.height !== HEIGHT) throw new Error(`${dataset.file}: unexpected image size`);
  const data = new Uint8Array(WIDTH * HEIGHT);
  const unknown = new Map();
  for (let i = 0; i < data.length; i++) {
    const p = i * image.channels;
    if (image.channels === 4 && image.data[p + 3] === 0) continue;
    const key = (image.data[p] << 16) | (image.data[p + 1] << 8) | image.data[p + 2];
    const value = colormap.get(key);
    if (value === undefined) unknown.set(key, (unknown.get(key) ?? 0) + 1);
    else data[i] = value;
  }
  if (unknown.size) {
    const list = [...unknown].map(([k, n]) => `#${k.toString(16).padStart(6, '0')}×${n}`).join(', ');
    throw new Error(`${dataset.file}: colors not in ${dataset.colormap}: ${list}`);
  }
  return { width: WIDTH, height: HEIGHT, channels: 1, depth: 8, data };
}

await mkdir(OUT_DIR, { recursive: true });
for (const dataset of Object.values(EARTH_DATASETS)) {
  const grid = dataset.kind === 'elevation' ? await fetchElevation(dataset) : await fetchClasses(dataset);
  const png = encodePng(grid);
  await writeFile(path.join(OUT_DIR, dataset.file), png);
  console.log(`✔ ${dataset.file}: ${grid.width}×${grid.height}, ${grid.depth} bits, ${(png.length / 1024).toFixed(0)} KB`);
}
