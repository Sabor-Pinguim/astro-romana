// Minimal baseline JPEG encoder for 8-bit grayscale images (one component, standard Huffman tables).
// The photo textures are far smaller as JPEG than as PNG, which leaves room in the 5 MB GLB.
// Integer arithmetic only (the IJG "islow" forward DCT and integer quantization), so the output is
// byte-identical on every machine.

const ZIGZAG = [
  0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28,
  35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63,
];
// ITU-T T.81 Annex K.1, luminance, natural order.
const LUMA_QUANT = [
  16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62,
  18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99,
];
// Annex K.3, luminance DC and AC tables: code counts per length 1..16, then the symbols.
const DC_BITS = [0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
const DC_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const AC_BITS = [0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d];
const AC_VALUES = [
  0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08,
  0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0, 0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
  0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
  0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
  0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6,
  0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
  0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa,
];

/** Canonical Huffman codes: symbol -> [code, length]. */
function huffmanCodes(bits, values) {
  const codes = new Map();
  let code = 0;
  let k = 0;
  for (let length = 1; length <= 16; length++) {
    for (let n = 0; n < bits[length - 1]; n++) codes.set(values[k++], [code++, length]);
    code <<= 1;
  }
  return codes;
}
const DC_CODES = huffmanCodes(DC_BITS, DC_VALUES);
const AC_CODES = huffmanCodes(AC_BITS, AC_VALUES);

/** IJG quality scaling (1..100) of the standard table, natural order. */
function quantTable(quality) {
  const q = Math.min(100, Math.max(1, quality));
  const scale = q < 50 ? Math.floor(5000 / q) : 200 - 2 * q;
  return LUMA_QUANT.map((v) => Math.min(255, Math.max(1, Math.floor((v * scale + 50) / 100))));
}

// IJG jfdctint.c: slow-but-accurate integer forward DCT (output scaled by 8).
const CONST_BITS = 13;
const PASS1_BITS = 2;
const F0298 = 2446;
const F0390 = 3196;
const F0541 = 4433;
const F0765 = 6270;
const F0899 = 7373;
const F1175 = 9633;
const F1501 = 12299;
const F1847 = 15137;
const F1961 = 16069;
const F2053 = 16819;
const F2562 = 20995;
const F3072 = 25172;
const descale = (x, n) => (x + (1 << (n - 1))) >> n;

function fdct(d) {
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < 8; i++) {
      const at = pass === 0 ? (k) => i * 8 + k : (k) => k * 8 + i;
      const tmp0 = d[at(0)] + d[at(7)];
      const tmp7 = d[at(0)] - d[at(7)];
      const tmp1 = d[at(1)] + d[at(6)];
      const tmp6 = d[at(1)] - d[at(6)];
      const tmp2 = d[at(2)] + d[at(5)];
      const tmp5 = d[at(2)] - d[at(5)];
      const tmp3 = d[at(3)] + d[at(4)];
      const tmp4 = d[at(3)] - d[at(4)];
      const tmp10 = tmp0 + tmp3;
      const tmp13 = tmp0 - tmp3;
      const tmp11 = tmp1 + tmp2;
      const tmp12 = tmp1 - tmp2;
      const shift = pass === 0 ? CONST_BITS - PASS1_BITS : CONST_BITS + PASS1_BITS;
      if (pass === 0) {
        d[at(0)] = (tmp10 + tmp11) << PASS1_BITS;
        d[at(4)] = (tmp10 - tmp11) << PASS1_BITS;
      } else {
        d[at(0)] = descale(tmp10 + tmp11, PASS1_BITS);
        d[at(4)] = descale(tmp10 - tmp11, PASS1_BITS);
      }
      let z1 = (tmp12 + tmp13) * F0541;
      d[at(2)] = descale(z1 + tmp13 * F0765, shift);
      d[at(6)] = descale(z1 - tmp12 * F1847, shift);
      z1 = tmp4 + tmp7;
      let z2 = tmp5 + tmp6;
      let z3 = tmp4 + tmp6;
      let z4 = tmp5 + tmp7;
      const z5 = (z3 + z4) * F1175;
      const t4 = tmp4 * F0298;
      const t5 = tmp5 * F2053;
      const t6 = tmp6 * F3072;
      const t7 = tmp7 * F1501;
      z1 *= -F0899;
      z2 *= -F2562;
      z3 = z3 * -F1961 + z5;
      z4 = z4 * -F0390 + z5;
      d[at(7)] = descale(t4 + z1 + z3, shift);
      d[at(5)] = descale(t5 + z2 + z4, shift);
      d[at(3)] = descale(t6 + z2 + z3, shift);
      d[at(1)] = descale(t7 + z1 + z4, shift);
    }
  }
}

class BitWriter {
  constructor() {
    this.bytes = [];
    this.acc = 0;
    this.count = 0;
  }
  write(code, length) {
    for (let b = length - 1; b >= 0; b--) {
      this.acc = (this.acc << 1) | ((code >> b) & 1);
      if (++this.count === 8) {
        this.bytes.push(this.acc);
        if (this.acc === 0xff) this.bytes.push(0); // byte stuffing
        this.acc = 0;
        this.count = 0;
      }
    }
  }
  flush() {
    while (this.count) this.write(1, 1); // pad with 1-bits
  }
}

const category = (v) => (v === 0 ? 0 : 32 - Math.clz32(Math.abs(v)));
const amplitude = (v, size) => (v < 0 ? v + (1 << size) - 1 : v);

/** Encodes an 8-bit grayscale image (row-major bytes) as a baseline JPEG. */
export function encodeJpegGray(width, height, pixels, quality = 85) {
  const quant = quantTable(quality);
  const out = new BitWriter();
  const block = new Int32Array(64);
  let previousDc = 0;
  for (let by = 0; by < height; by += 8) {
    for (let bx = 0; bx < width; bx += 8) {
      for (let y = 0; y < 8; y++) {
        const row = Math.min(height - 1, by + y) * width; // edge blocks repeat the last row/column
        for (let x = 0; x < 8; x++) block[y * 8 + x] = pixels[row + Math.min(width - 1, bx + x)] - 128;
      }
      fdct(block);
      const coefficients = new Int32Array(64);
      for (let k = 0; k < 64; k++) {
        const natural = ZIGZAG[k];
        const divisor = quant[natural] << 3;
        const v = block[natural];
        coefficients[k] = v < 0 ? -Math.floor((-v + (divisor >> 1)) / divisor) : Math.floor((v + (divisor >> 1)) / divisor);
      }
      const diff = coefficients[0] - previousDc;
      previousDc = coefficients[0];
      const dcSize = category(diff);
      out.write(...DC_CODES.get(dcSize));
      if (dcSize) out.write(amplitude(diff, dcSize), dcSize);
      let run = 0;
      for (let k = 1; k < 64; k++) {
        const v = coefficients[k];
        if (v === 0) {
          run++;
          continue;
        }
        while (run > 15) {
          out.write(...AC_CODES.get(0xf0));
          run -= 16;
        }
        const size = category(v);
        out.write(...AC_CODES.get((run << 4) | size));
        out.write(amplitude(v, size), size);
        run = 0;
      }
      if (run) out.write(...AC_CODES.get(0x00));
    }
  }
  out.flush();

  const header = [0xff, 0xd8]; // SOI
  header.push(0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0); // APP0 JFIF 1.01
  header.push(0xff, 0xdb, 0, 67, 0, ...ZIGZAG.map((n) => quant[n])); // DQT, table 0
  header.push(0xff, 0xc0, 0, 11, 8, height >> 8, height & 255, width >> 8, width & 255, 1, 1, 0x11, 0); // SOF0
  header.push(0xff, 0xc4, 0, 3 + 16 + DC_VALUES.length, 0x00, ...DC_BITS, ...DC_VALUES); // DHT DC 0
  header.push(0xff, 0xc4, 0, 3 + 16 + AC_VALUES.length, 0x10, ...AC_BITS, ...AC_VALUES); // DHT AC 0
  header.push(0xff, 0xda, 0, 8, 1, 1, 0x00, 0, 63, 0); // SOS
  return Buffer.concat([Buffer.from(header), Buffer.from(out.bytes), Buffer.from([0xff, 0xd9])]);
}
