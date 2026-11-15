// Local copy of every source a terrain site is built from, kept in references/datasets/mars-terrain/<site>/
// so the build runs offline and gives the same terrain on every machine, even if a server changes or
// drops a file. `npm run terrain:fetch` downloads and rewrites it; `npm run terrain` only reads it.
//
// Rasters are stored as PNG (8- or 16-bit gray): value = offset + scale × (u − 1), u = 0 is nodata.
// sources.json lists every stored file with its origin (URL, version, license) and, for rasters,
// where the window sits in the source raster (to sample it exactly as the source).
// In fetch mode every raster is written, then read back from the PNG, so a fetch run and an
// offline run build from the very same numbers.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { decodePng, encodePng } from '../../modeling/lib/png.mjs';

/** Chooses the PNG encoding of a window. kinds: 'height' (float m), 'photo' (any → 8-bit), 'integer' (ints, kept exactly). */
function encodingFor(data, kind, stepM = 0) {
  const valid = [];
  for (const v of data) if (!Number.isNaN(v)) valid.push(v);
  if (!valid.length) throw new Error('window has no valid samples');
  valid.sort((a, b) => a - b);
  if (kind === 'integer') {
    const min = valid[0];
    const max = valid[valid.length - 1];
    if (max - min > 65534 || !valid.every(Number.isInteger)) throw new Error('integer window does not fit 16 bits');
    return { bits: 16, offset: min, scale: 1 };
  }
  if (kind === 'height') {
    const min = valid[0];
    const max = valid[valid.length - 1];
    return { bits: 16, offset: min, scale: Math.max((max - min) / 65534, stepM) || 1 }; // stepM: precision worth keeping
  }
  // photo: 8 bits over the 0.05–99.95 percentile (the camera data itself is 8-bit for CTX; HiRISE uses 'integer')
  const lo = valid[Math.floor(valid.length * 0.0005)];
  const hi = valid[Math.ceil(valid.length * 0.9995) - 1];
  return { bits: 8, offset: lo, scale: (hi - lo) / 254 || 1 };
}

function encodeWindow(data, encoding) {
  const max = encoding.bits === 16 ? 65535 : 255;
  const out = encoding.bits === 16 ? new Uint16Array(data.length) : new Uint8Array(data.length);
  for (let k = 0; k < data.length; k++) {
    const v = data[k];
    out[k] = Number.isNaN(v) ? 0 : Math.min(max, Math.max(1, Math.round((v - encoding.offset) / encoding.scale) + 1));
  }
  return out;
}

function decodeWindow(image, encoding) {
  const data = new Float32Array(image.data.length);
  for (let k = 0; k < data.length; k++) {
    const u = image.data[k];
    data[k] = u === 0 ? NaN : encoding.offset + encoding.scale * (u - 1);
  }
  return data;
}

/**
 * @param {string} dir         references/datasets/mars-terrain/<site>
 * @param {object} o
 * @param {boolean} o.online   true: download and (re)write; false: read only
 * @param {(fn: () => Promise<any>) => Promise<any>} o.retry
 */
export async function openStore(dir, { online, retry }) {
  const indexFile = path.join(dir, 'sources.json');
  let index;
  if (online) {
    await mkdir(dir, { recursive: true });
    index = { retrieved: new Date().toISOString().slice(0, 10), files: {}, versions: {} };
  } else {
    try {
      index = JSON.parse(await readFile(indexFile, 'utf8'));
    } catch {
      throw new Error(`${path.relative(process.cwd(), dir)}/sources.json missing: run npm run terrain:fetch`);
    }
  }
  const entry = (name) => {
    const e = index.files[name];
    if (!e) throw new Error(`${name} is not in ${indexFile}: run npm run terrain:fetch`);
    return e;
  };

  return {
    dir,
    online,
    index,

    /** JSON document (e.g. a STAC item), stored as <name>.json. */
    async json(name, url, meta = {}) {
      const file = `${name}.json`;
      if (online) {
        const doc = await retry(async () => {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
          return response.json();
        });
        await writeFile(path.join(dir, file), `${JSON.stringify(doc, null, 2)}\n`);
        index.files[name] = { file, url, ...meta };
      }
      return JSON.parse(await readFile(path.join(dir, entry(name).file), 'utf8'));
    },

    /** Text document (e.g. a PDS label), stored as is. */
    async text(name, url, meta = {}) {
      if (online) {
        const body = await retry(async () => {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
          return response.text();
        });
        await writeFile(path.join(dir, name), body);
        index.files[name] = { file: name, url, ...meta };
      }
      return readFile(path.join(dir, entry(name).file), 'utf8');
    },

    /**
     * Raster window: `read()` downloads it ({ data, width, height, ...georeference }); stored as <name>.png.
     * Returns the window decoded from the PNG, with the same georeference fields.
     */
    async raster(name, kind, read, meta = {}, { stepM = 0 } = {}) {
      const file = `${name}.png`;
      if (online) {
        const { data, width, height, ...geo } = await read();
        const encoding = encodingFor(data, kind, stepM);
        const bytes = encodePng({ width, height, channels: 1, depth: encoding.bits, data: encodeWindow(data, encoding) });
        await writeFile(path.join(dir, file), bytes);
        index.files[name] = { file, ...meta, size: [width, height], encoding, georeference: geo };
      }
      const e = entry(name);
      const image = decodePng(await readFile(path.join(dir, e.file)));
      return { data: decodeWindow(image, e.encoding), width: image.width, height: image.height, ...e.georeference };
    },

    /** ETag / Last-Modified of a source file (HEAD request when online). */
    async version(url) {
      if (online && !index.versions[url]) {
        index.versions[url] = await retry(async () => {
          const response = await fetch(url, { method: 'HEAD' });
          if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
          return { etag: response.headers.get('etag')?.replaceAll('"', '') ?? null, lastModified: response.headers.get('last-modified') };
        });
      }
      const v = index.versions[url];
      if (!v) throw new Error(`no stored version for ${url}: run npm run terrain:fetch`);
      return v;
    },

    /** Writes sources.json (fetch mode). Keys sorted so the file is stable. */
    async save() {
      if (!online) return;
      const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
      const out = { ...index, files: sorted(index.files), versions: sorted(index.versions) };
      await writeFile(indexFile, `${JSON.stringify(out, null, 2)}\n`); // exact numbers: offline decoding must match
    },
  };
}
