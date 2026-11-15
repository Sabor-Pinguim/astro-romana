// Small, dependency-free DSP toolkit for offline rendering.
// Everything is deterministic: randomness comes from seeded generators, so the
// same code and data always render the same files.

export const TAU = 2 * Math.PI;

/** Seeded PRNG (mulberry32): returns a function giving floats in [0, 1). */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const dbToGain = (db) => 10 ** (db / 20);
export const gainToDb = (g) => 20 * Math.log10(Math.max(g, 1e-12));
export const midiToHz = (midi) => 440 * 2 ** ((midi - 69) / 12);
export const clamp = (x, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
export const lerp = (a, b, u) => a + (b - a) * u;
export const smoothstep = (lo, hi, x) => {
  const u = clamp((x - lo) / (hi - lo));
  return u * u * (3 - 2 * u);
};

/** Two silent channels of `frames` samples. */
export const stereo = (frames) => [new Float32Array(frames), new Float32Array(frames)];

/** Equal-power pan gains for pan in [-1 (left), 1 (right)]. */
export function panGains(pan) {
  const th = ((clamp(pan, -1, 1) + 1) / 4) * Math.PI;
  return [Math.cos(th), Math.sin(th)];
}

/** White noise in [-1, 1]. */
export function whiteNoise(frames, random) {
  const out = new Float32Array(frames);
  for (let i = 0; i < frames; i++) out[i] = random() * 2 - 1;
  return out;
}

/**
 * RBJ biquad filter whose cutoff can move over time.
 * @param {'lowpass' | 'highpass' | 'bandpass'} type bandpass has 0 dB peak gain
 * @param {(frame: number) => number} freqAt cutoff/centre in Hz, sampled every `block` frames
 */
export function biquad(input, sampleRate, type, freqAt, q = Math.SQRT1_2, block = 32) {
  const out = new Float32Array(input.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  let b0 = 0, b1 = 0, b2 = 0, a1 = 0, a2 = 0;
  for (let i = 0; i < input.length; i++) {
    if (i % block === 0) {
      const f = clamp(freqAt(i), 10, sampleRate * 0.45);
      const w = (TAU * f) / sampleRate;
      const cos = Math.cos(w);
      const alpha = Math.sin(w) / (2 * q);
      const a0 = 1 + alpha;
      if (type === 'lowpass') { b0 = (1 - cos) / 2 / a0; b1 = (1 - cos) / a0; b2 = b0; }
      else if (type === 'highpass') { b0 = (1 + cos) / 2 / a0; b1 = -(1 + cos) / a0; b2 = b0; }
      else { b0 = alpha / a0; b1 = 0; b2 = -alpha / a0; }
      a1 = (-2 * cos) / a0;
      a2 = (1 - alpha) / a0;
    }
    const x = input[i];
    const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    out[i] = y;
  }
  return out;
}

// Freeverb (Jezar at Dreampoint, public domain) tunings at 44.1 kHz.
const COMBS = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
const ALLPASSES = [556, 441, 341, 225];
const STEREO_SPREAD = 23;

/**
 * Freeverb-style stereo reverb. Returns only the wet signal.
 * @param {Float32Array[]} input stereo pair
 */
export function reverb(input, sampleRate, { roomSize = 0.86, damping = 0.35, width = 1 } = {}) {
  const scale = sampleRate / 44100;
  const frames = input[0].length;
  const feedback = roomSize * 0.28 + 0.7;
  const mono = new Float32Array(frames);
  for (let i = 0; i < frames; i++) mono[i] = (input[0][i] + input[1][i]) * 0.015;

  const wetChannel = (spread) => {
    const out = new Float32Array(frames);
    const combs = COMBS.map((d) => ({ buf: new Float32Array(Math.round((d + spread) * scale)), i: 0, store: 0 }));
    const passes = ALLPASSES.map((d) => ({ buf: new Float32Array(Math.round((d + spread) * scale)), i: 0 }));
    for (let n = 0; n < frames; n++) {
      let acc = 0;
      for (const c of combs) {
        const y = c.buf[c.i];
        c.store = y * (1 - damping) + c.store * damping;
        c.buf[c.i] = mono[n] + c.store * feedback;
        if (++c.i === c.buf.length) c.i = 0;
        acc += y;
      }
      for (const p of passes) {
        const y = p.buf[p.i];
        p.buf[p.i] = acc + y * 0.5;
        if (++p.i === p.buf.length) p.i = 0;
        acc = y - acc;
      }
      out[n] = acc;
    }
    return out;
  };
  const l = wetChannel(0);
  const r = wetChannel(STEREO_SPREAD);
  const wet1 = width / 2 + 0.5;
  const wet2 = (1 - width) / 2;
  const outL = new Float32Array(frames);
  const outR = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    outL[i] = l[i] * wet1 + r[i] * wet2;
    outR[i] = r[i] * wet1 + l[i] * wet2;
  }
  return [outL, outR];
}

/** dst += src * gain, channel by channel, starting at frame `offset`. */
export function mixInto(dst, src, gain = 1, offset = 0) {
  for (let c = 0; c < dst.length; c++) {
    const d = dst[c];
    const s = src[c] ?? src[0];
    const n = Math.min(s.length, d.length - offset);
    for (let i = 0; i < n; i++) d[offset + i] += s[i] * gain;
  }
}

/**
 * Makes a seamless loop of `loopFrames` from a render that runs `fadeFrames`
 * past the loop end: the overshoot is equal-power crossfaded into the start,
 * so the last frame flows straight into the first.
 */
export function loopCrossfade(channels, loopFrames, fadeFrames) {
  return channels.map((x) => {
    const out = x.slice(0, loopFrames);
    for (let i = 0; i < fadeFrames; i++) {
      const th = (Math.PI / 2) * (i / fadeFrames);
      out[i] = x[i] * Math.sin(th) + x[loopFrames + i] * Math.cos(th);
    }
    return out;
  });
}

export function peak(channels) {
  let p = 0;
  for (const ch of channels) for (let i = 0; i < ch.length; i++) p = Math.max(p, Math.abs(ch[i]));
  return p;
}

export function rms(channels) {
  let sum = 0;
  let n = 0;
  for (const ch of channels) for (let i = 0; i < ch.length; i++) { sum += ch[i] * ch[i]; n++; }
  return Math.sqrt(sum / n);
}

/** Scales in place to the target RMS, lowered if needed so the peak stays at or below `maxPeakDb`. */
export function normalize(channels, { rmsDb = null, peakDb = -1 }) {
  const p = peak(channels);
  let gain = dbToGain(peakDb) / p;
  if (rmsDb !== null) gain = Math.min(gain, dbToGain(rmsDb) / rms(channels));
  for (const ch of channels) for (let i = 0; i < ch.length; i++) ch[i] *= gain;
  return channels;
}

/**
 * Soft limiter, in place: samples above `kneeDb` bend smoothly (tanh) towards
 * `ceilingDb` and never pass it. Returns the fraction of samples it touched.
 */
export function softLimit(channels, { kneeDb = -6, ceilingDb = -1 }) {
  const knee = dbToGain(kneeDb);
  const room = dbToGain(ceilingDb) - knee;
  let touched = 0;
  let total = 0;
  for (const ch of channels) {
    for (let i = 0; i < ch.length; i++) {
      const a = Math.abs(ch[i]);
      if (a > knee) {
        ch[i] = Math.sign(ch[i]) * (knee + room * Math.tanh((a - knee) / room));
        touched++;
      }
    }
    total += ch.length;
  }
  return touched / total;
}

/** Cosine fade-in/out over the first/last `frames` frames, in place. */
export function fade(channels, { inFrames = 0, outFrames = 0 }) {
  for (const ch of channels) {
    for (let i = 0; i < inFrames; i++) ch[i] *= 0.5 - 0.5 * Math.cos((Math.PI * i) / inFrames);
    for (let i = 0; i < outFrames; i++) ch[ch.length - 1 - i] *= 0.5 - 0.5 * Math.cos((Math.PI * i) / outFrames);
  }
  return channels;
}
