// Minimal PNG reader and writer for the data grids used by the generators.
// No dependencies: node:zlib does the (de)compression.
//   decode: non-interlaced, 8 or 16 bits, grayscale / RGB / palette / gray+alpha / RGBA
//   encode: grayscale (8 or 16 bits), RGB or RGBA (8 bits)
import { deflateSync, inflateSync } from 'node:zlib';

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }; // by PNG color type

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

/**
 * Decodes PNG bytes. Palette images are expanded to RGB(A).
 * @returns {{width: number, height: number, channels: number, depth: 8|16, data: Uint8Array|Uint16Array}}
 */
export function decodePng(bytes) {
  const buf = Buffer.from(bytes);
  if (!buf.subarray(0, 8).equals(SIGNATURE)) throw new Error('not a PNG file');
  let width = 0;
  let height = 0;
  let depth = 0;
  let colorType = 0;
  let palette = null;
  let alpha = null;
  const idat = [];
  for (let off = 8; off < buf.length; ) {
    const length = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      depth = data[8];
      colorType = data[9];
      if (data[12] !== 0) throw new Error('interlaced PNG is not supported');
    } else if (type === 'PLTE') palette = data;
    else if (type === 'tRNS') alpha = data;
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    off += 12 + length;
  }
  const channels = CHANNELS[colorType];
  if (!channels || (depth !== 8 && depth !== 16) || (colorType === 3 && depth !== 8)) {
    throw new Error(`unsupported PNG: color type ${colorType}, ${depth} bits`);
  }

  const bpp = channels * (depth / 8); // bytes per pixel, used by the filters
  const stride = width * bpp;
  const raw = inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const row = pixels.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? row[x - bpp] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= bpp ? prev[x - bpp] : 0;
      let predictor = 0;
      if (filter === 1) predictor = a;
      else if (filter === 2) predictor = b;
      else if (filter === 3) predictor = (a + b) >> 1;
      else if (filter === 4) predictor = paeth(a, b, c);
      row[x] = (src[x] + predictor) & 0xff;
    }
  }

  if (colorType === 3) {
    const outChannels = alpha ? 4 : 3;
    const data = new Uint8Array(width * height * outChannels);
    for (let i = 0; i < width * height; i++) {
      const index = pixels[i];
      for (let k = 0; k < 3; k++) data[i * outChannels + k] = palette[index * 3 + k];
      if (alpha) data[i * outChannels + 3] = index < alpha.length ? alpha[index] : 255;
    }
    return { width, height, channels: outChannels, depth: 8, data };
  }
  if (depth === 16) {
    const data = new Uint16Array(width * height * channels);
    for (let i = 0; i < data.length; i++) data[i] = pixels.readUInt16BE(i * 2);
    return { width, height, channels, depth, data };
  }
  return { width, height, channels, depth, data: new Uint8Array(pixels) };
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  Buffer.from(data).copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

/**
 * Encodes pixels as PNG bytes. `data` is row-major: Uint8Array for 8 bits,
 * Uint16Array for 16 bits (grayscale only). Rows use adaptive filtering.
 */
export function encodePng({ width, height, channels, depth = 8, data }) {
  const colorType = { 1: 0, 3: 2, 4: 6 }[channels];
  if (colorType === undefined) throw new Error(`unsupported channel count ${channels}`);
  if (depth === 16 && channels !== 1) throw new Error('16-bit output is grayscale only');
  const bpp = channels * (depth / 8);
  const stride = width * bpp;
  const pixels = Buffer.alloc(stride * height);
  if (depth === 16) for (let i = 0; i < data.length; i++) pixels.writeUInt16BE(data[i], i * 2);
  else Buffer.from(data.buffer, data.byteOffset, data.byteLength).copy(pixels);

  const raw = Buffer.alloc((stride + 1) * height);
  const candidate = Buffer.alloc(stride);
  const best = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const row = pixels.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;
    let bestFilter = 0;
    let bestScore = Infinity;
    for (let filter = 0; filter <= 4; filter++) {
      let score = 0;
      for (let x = 0; x < stride; x++) {
        const a = x >= bpp ? row[x - bpp] : 0;
        const b = prev ? prev[x] : 0;
        const c = prev && x >= bpp ? prev[x - bpp] : 0;
        let predictor = 0;
        if (filter === 1) predictor = a;
        else if (filter === 2) predictor = b;
        else if (filter === 3) predictor = (a + b) >> 1;
        else if (filter === 4) predictor = paeth(a, b, c);
        const value = (row[x] - predictor) & 0xff;
        candidate[x] = value;
        score += value < 128 ? value : 256 - value;
      }
      if (score < bestScore) {
        bestScore = score;
        bestFilter = filter;
        candidate.copy(best);
      }
    }
    raw[y * (stride + 1)] = bestFilter;
    best.copy(raw, y * (stride + 1) + 1);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = depth;
  header[9] = colorType;
  return Buffer.concat([
    SIGNATURE,
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
