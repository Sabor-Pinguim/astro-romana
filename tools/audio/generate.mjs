// Renders the radiation soundscape from real Curiosity RAD dose-rate data
// (references/datasets/msl-rad/) into godot/assets/audio/:
//
//   rad_surface_bed.wav        seamless loop: 4 quiet sols on the surface of Gale crater
//   rad_storm_2024_05_20.wav   one-shot: the 20 May 2024 solar particle event, 48 h in 32 s
//   geiger_click_<n>.wav       short clicks the game fires at a rate set by the dose
//   manifest.json              files, data windows, mappings and the storm's dose envelope
//
// Musical choices (key, scale, levels, time compression) are game-balance;
// every event and curve that drives them comes from the data.
//
//   npm run audio:build
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as D from './lib/dsp.mjs';
import { closeLoop, encodeWav } from './lib/wav.mjs';
import { SOL_SECONDS, gaussianSmooth, isoUtc, loadRadCsv, median, percentile, sampler, std } from './lib/rad-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DATA_DIR = path.join(ROOT, 'references/datasets/msl-rad');
const OUT_DIR = path.join(ROOT, 'godot/assets/audio');
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

const ROOT_MIDI = 38; // D2: every stem shares the key so they layer cleanly
const PENTATONIC = [0, 3, 5, 7, 10]; // minor pentatonic intervals
const AMBIENCE_RATE = 24000; // ambience is dark and low; keeps each file < 5 MB
const SFX_RATE = 44100;

/** `count` notes of the minor pentatonic scale, upwards from `fromMidi`. */
function scaleNotes(fromMidi, count) {
  return Array.from({ length: count }, (_, i) => fromMidi + 12 * Math.floor(i / 5) + PENTATONIC[i % 5]);
}

/** Samples f(seconds) every `step` frames and interpolates linearly in between. */
function controlCurve(frames, sampleRate, f, step = 64) {
  const n = Math.ceil(frames / step) + 2;
  const v = new Float32Array(n);
  for (let k = 0; k < n; k++) v[k] = f((k * step) / sampleRate);
  return (i) => {
    const x = i / step;
    const k = Math.floor(x);
    return v[k] + (v[k + 1] - v[k]) * (x - k);
  };
}

/**
 * Adds a harmonic tone to one channel. `amp` and `bright` hold one value per
 * frame; higher `bright` lets more upper harmonics through.
 */
function addTone(out, sampleRate, freq, phase, amp, bright, { harmonics = 6, maxHz = 5000 } = {}) {
  for (let k = 1; k <= harmonics && freq * k <= maxHz; k++) {
    const w = (D.TAU * freq * k) / sampleRate;
    const roll = 1 / k ** 1.4;
    const ph = phase * k;
    for (let i = 0; i < out.length; i++) {
      out[i] += amp[i] * roll * Math.exp(-(k - 1) / bright[i]) * Math.sin(ph + w * i);
    }
  }
}

/**
 * Stereo tone that stays solid in mono: the main voice is identical in both
 * channels, and a quieter pair detuned by ±`detune` Hz adds slow movement and
 * width (L/R-only detuning would cancel itself periodically when summed to mono).
 */
function addStereoTone(dst, sampleRate, freq, detune, random, amp, bright) {
  const center = new Float32Array(dst[0].length);
  addTone(center, sampleRate, freq, random() * D.TAU, amp, bright);
  const side = amp.map((a) => a * 0.35);
  addTone(dst[0], sampleRate, freq - detune, random() * D.TAU, side, bright);
  addTone(dst[1], sampleRate, freq + detune, random() * D.TAU, side, bright);
  for (let i = 0; i < center.length; i++) {
    dst[0][i] += center[i];
    dst[1][i] += center[i];
  }
}

/** Bell-like ping: fundamental plus two fast-decaying inharmonic partials. */
function addPing(dst, sampleRate, start, freq, amp, pan) {
  const tau = D.clamp(1.6 - (freq - 150) / 800, 0.5, 1.6);
  const len = Math.min(Math.round(tau * 5 * sampleRate), dst[0].length - start);
  const [gl, gr] = D.panGains(pan);
  for (let n = 0; n < len; n++) {
    const t = n / sampleRate;
    const env = (1 - Math.exp(-t / 0.004)) * Math.exp(-t / tau) * amp;
    const s = Math.sin(D.TAU * freq * t)
      + 0.25 * Math.sin(D.TAU * freq * 2.76 * t) * Math.exp(-t / (tau * 0.3))
      + 0.1 * Math.sin(D.TAU * freq * 5.4 * t) * Math.exp(-t / (tau * 0.15));
    dst[0][start + n] += s * env * gl;
    dst[1][start + n] += s * env * gr;
  }
}

function scaleToRms(channels, db) {
  const g = D.dbToGain(db) / D.rms(channels);
  for (const ch of channels) for (let i = 0; i < ch.length; i++) ch[i] *= g;
  return channels;
}

function sum(frames, ...layers) {
  const out = D.stereo(frames);
  for (const [layer, gain] of layers) D.mixInto(out, layer, gain);
  return out;
}

const levels = (channels) => ({
  peakDb: +D.gainToDb(D.peak(channels)).toFixed(1),
  rmsDb: +D.gainToDb(D.rms(channels)).toFixed(1),
});

// ---------------------------------------------------------------------------
// Surface bed: 4 quiet sols, looped.

async function buildSurfaceBed() {
  const csv = path.join(DATA_DIR, 'quiet_2024-05-01.csv');
  const LOOP_S = 40;
  const FADE_S = 4; // extra render crossfaded into the start for a seamless loop
  const SOLS = 4;
  const SMOOTH_S = 1.5 * 3600; // Gaussian σ in real time: keeps the slow trend, drops counting noise
  const PING_Z = 1.25; // a measurement this many σ above the trend fires a ping
  const sr = AMBIENCE_RATE;

  const rows = await loadRadCsv(csv);
  const t0 = rows[0].t;
  const timeScale = (SOLS * SOL_SECONDS) / LOOP_S; // real seconds per audio second
  const tEnd = t0 + (LOOP_S + FADE_S) * timeScale;
  if (rows.at(-1).t < tEnd) throw new Error(`${rel(csv)} ends before ${isoUtc(tEnd)}: fetch a longer window`);
  const loopFrames = LOOP_S * sr;
  const fadeFrames = FADE_S * sr;
  const renderFrames = loopFrames + fadeFrames;
  const random = D.rng(0xbed);
  const inWindow = rows.flatMap((r, i) => (r.t <= tEnd ? [i] : []));

  // Control curve: smoothed detector-B dose rate, scaled to 0..1 over the window.
  const smoothB = gaussianSmooth(rows, 'b', SMOOTH_S);
  const lo = percentile(inWindow.map((i) => smoothB[i]), 5);
  const hi = percentile(inWindow.map((i) => smoothB[i]), 95);
  const smoothAt = sampler(rows, smoothB);
  const level = (s) => D.clamp((smoothAt(t0 + s * timeScale) - lo) / (hi - lo));
  // Same curve made periodic (end blends into start) for the drone, which loops sample-exactly.
  const levelLoop = (s) => {
    const u = s % LOOP_S;
    return u < FADE_S ? D.lerp(level(u + LOOP_S), level(u), u / FADE_S) : level(u);
  };

  // 1. Drone: an open chord whose upper tones and harmonics come in as the dose rises.
  //    Frequencies are rounded to multiples of 1/LOOP_S, so it repeats exactly every loop.
  const drone = D.stereo(loopFrames);
  const droneLevel = controlCurve(loopFrames, sr, levelLoop);
  const quant = (f) => Math.round(f * LOOP_S) / LOOP_S;
  const CHORD = [
    { semi: 0, gain: 1.0, opensAt: null },
    { semi: 7, gain: 0.55, opensAt: null },
    { semi: 12, gain: 0.4, opensAt: 0.15 },
    { semi: 15, gain: 0.3, opensAt: 0.4 },
    { semi: 19, gain: 0.22, opensAt: 0.6 },
    { semi: 22, gain: 0.16, opensAt: 0.8 },
  ];
  for (const tone of CHORD) {
    const amp = new Float32Array(loopFrames);
    const bright = new Float32Array(loopFrames);
    for (let i = 0; i < loopFrames; i++) {
      const lv = droneLevel(i);
      amp[i] = tone.gain * (tone.opensAt === null ? 1 : D.smoothstep(tone.opensAt - 0.25, tone.opensAt + 0.1, lv));
      bright[i] = 0.8 + 3 * lv;
    }
    addStereoTone(drone, sr, quant(D.midiToHz(ROOT_MIDI + tone.semi)), 2 / LOOP_S, random, amp, bright);
  }

  // 2. Hiss: filtered noise that opens up with the same curve.
  const hissLevel = controlCurve(renderFrames, sr, level);
  const hiss = [0, 1].map(() => {
    const filtered = D.biquad(D.whiteNoise(renderFrames, random), sr, 'lowpass', (i) => 220 + 1300 * hissLevel(i), 0.6);
    for (let i = 0; i < renderFrames; i++) filtered[i] *= 0.55 + 0.45 * hissLevel(i);
    return filtered;
  });

  // 3. Pings: every measurement well above the trend is one note. Detector B
  //    (silicon) plays high on the left; detector E (plastic) lower on the right.
  const pings = D.stereo(renderFrames);
  const voices = [
    { key: 'b', pan: -0.4, notes: scaleNotes(ROOT_MIDI + 24, 11) },
    { key: 'e', pan: 0.4, notes: scaleNotes(ROOT_MIDI + 12, 11) },
  ];
  const pingCounts = {};
  for (const voice of voices) {
    const smooth = voice.key === 'b' ? smoothB : gaussianSmooth(rows, voice.key, SMOOTH_S);
    const resid = rows.map((r, i) => r[voice.key] - smooth[i]);
    const sd = std(inWindow.map((i) => resid[i]));
    pingCounts[voice.key] = 0;
    for (const i of inWindow) {
      const z = resid[i] / sd;
      if (z < PING_Z) continue;
      const strength = D.clamp((z - PING_Z) / 2);
      const note = voice.notes[Math.round(strength * (voice.notes.length - 1))];
      const start = Math.round(((rows[i].t - t0) / timeScale) * sr);
      addPing(pings, sr, start, D.midiToHz(note), 0.35 + 0.65 * strength, voice.pan + (random() - 0.5) * 0.5);
      pingCounts[voice.key]++;
    }
  }

  scaleToRms(drone, -26);
  scaleToRms(hiss, -40);
  scaleToRms(pings, -33);
  const wet = scaleToRms(D.reverb(sum(renderFrames, [pings, 1], [hiss, 0.5]), sr, { roomSize: 0.9, damping: 0.3 }), -32);
  const looped = D.loopCrossfade(sum(renderFrames, [hiss, 1], [pings, 1], [wet, 1]), loopFrames, fadeFrames);
  const out = D.normalize(sum(loopFrames, [drone, 1], [looped, 1]), { rmsDb: -22, peakDb: -1 });
  const closed = closeLoop(out);

  return {
    file: 'rad_surface_bed.wav',
    wav: encodeWav(closed.channels, sr, { loop: closed.loop }),
    entry: {
      id: 'rad_surface_bed',
      file: 'rad_surface_bed.wav',
      kind: 'loop',
      role: 'Surface ambience: quiet-time radiation at Gale crater (Curiosity)',
      sampleRate: sr,
      channels: 2,
      frames: loopFrames + 1,
      loopFrames,
      durationS: LOOP_S,
      data: {
        csv: rel(csv),
        startUtc: isoUtc(t0),
        endUtc: isoUtc(t0 + LOOP_S * timeScale),
        sols: SOLS,
        realSecondsPerAudioSecond: +timeScale.toFixed(1),
        doseRateRangeUgyPerDay: [+lo.toFixed(1), +hi.toFixed(1)],
      },
      mapping: [
        `Detector B dose rate, smoothed (σ = ${SMOOTH_S / 3600} h), scaled 0–1 between its 5th and 95th percentiles → drone brightness and how many chord tones sound`,
        'Same curve → hiss low-pass cutoff and level',
        `Each measurement > ${PING_Z} σ above its smoothed trend → one ping; a bigger deviation plays a higher note (detector B: high, left; detector E: lower, right)`,
      ],
      pings: pingCounts,
      levels: levels(out),
    },
  };
}

// ---------------------------------------------------------------------------
// Storm: the 20 May 2024 solar particle event, one-shot.

async function buildStorm() {
  const csv = path.join(DATA_DIR, 'storm_2024-05-20.csv');
  const START = Date.parse('2024-05-20T00:00:00Z') / 1000;
  const REAL_S = 48 * 3600;
  const DUR_S = 32;
  const CLICKS_PER_S_AT_BASELINE = 0.4; // ~31 clicks/s at the peak (79× baseline)
  const CLICK_GAIN_DB = -5; // fixed per-click level, so fewer clicks never means louder clicks
  const ENVELOPE_STEP_S = 0.25;
  const sr = AMBIENCE_RATE;

  const rows = await loadRadCsv(csv);
  const timeScale = REAL_S / DUR_S;
  const frames = DUR_S * sr;
  const random = D.rng(0x5707);

  // Onset = the largest jump between consecutive measurements; baseline = median before it.
  let onset = 1;
  for (let i = 1; i < rows.length; i++) if (rows[i].b / rows[i - 1].b > rows[onset].b / rows[onset - 1].b) onset = i;
  const baseline = median(rows.filter((r) => r.t < rows[onset].t - 3600).map((r) => r.b));
  const peakRow = rows.reduce((a, r) => (r.b > a.b ? r : a));
  const maxRatio = peakRow.b / baseline;
  const doseAt = sampler(rows, rows.map((r) => r.b));
  const doseAtAudio = (s) => doseAt(START + s * timeScale);
  // Loudness follows the dose on a log scale: 0 at baseline, 1 at the peak.
  const intensity = (s) => D.clamp(Math.log(doseAtAudio(s) / baseline) / Math.log(maxRatio));
  const I = controlCurve(frames, sr, intensity);
  let onsetS = 0;
  while (onsetS < DUR_S && intensity(onsetS) < 0.5) onsetS += 0.005;

  // 1. Crackle: Poisson clicks at a rate proportional to the dose rate (a Geiger counter, baked in).
  const crackle = D.stereo(frames);
  const lambdaMax = CLICKS_PER_S_AT_BASELINE * maxRatio;
  let clicks = 0;
  for (let t = 0; ;) {
    t += -Math.log(1 - random()) / lambdaMax;
    if (t >= DUR_S) break;
    if (random() > doseAtAudio(t) / baseline / maxRatio) continue; // thinning
    const [gl, gr] = D.panGains((random() * 2 - 1) * 0.8);
    const amp = (0.3 + 0.7 * random()) * D.dbToGain(CLICK_GAIN_DB);
    const len = Math.round((0.002 + 0.003 * random()) * sr);
    const at = Math.round(t * sr);
    let prev = 0;
    for (let n = 0; n < len && at + n < frames; n++) {
      const w = random() * 2 - 1;
      const s = (w - prev) * Math.exp(-n / (0.0008 * sr)) * amp;
      prev = w;
      crackle[0][at + n] += s * gl;
      crackle[1][at + n] += s * gr;
    }
    clicks++;
  }

  // 2. Wash: band-passed noise that brightens and swells with intensity.
  const wash = [0, 1].map(() => {
    const filtered = D.biquad(D.whiteNoise(frames, random), sr, 'bandpass', (i) => 250 + 2600 * I(i), 0.9);
    for (let i = 0; i < frames; i++) filtered[i] *= I(i) ** 0.9;
    return filtered;
  });

  // 3. Drone in the bed's key; dissonant tones (minor 9th, tritone) and a flutter rise with intensity.
  const drone = D.stereo(frames);
  const STORM_CHORD = [
    { semi: 0, gain: 0.8, dissonant: false },
    { semi: 7, gain: 0.5, dissonant: false },
    { semi: 13, gain: 0.55, dissonant: true },
    { semi: 6, gain: 0.5, dissonant: true },
  ];
  const flutter = new Float32Array(frames);
  for (let i = 0, ph = 0; i < frames; i++) {
    ph += (D.TAU * (3 + 6 * I(i))) / sr;
    flutter[i] = 1 - 0.4 * I(i) * (0.5 + 0.5 * Math.sin(ph));
  }
  for (const tone of STORM_CHORD) {
    const amp = new Float32Array(frames);
    const bright = new Float32Array(frames);
    for (let i = 0; i < frames; i++) {
      amp[i] = tone.gain * (tone.dissonant ? I(i) : 0.35 + 0.65 * I(i)) * flutter[i];
      bright[i] = 0.8 + 3.5 * I(i);
    }
    addStereoTone(drone, sr, D.midiToHz(ROOT_MIDI + tone.semi), 0.15, random, amp, bright);
  }

  // 4. Impact where the dose jumps: falling sine plus a low noise thump.
  const boom = D.stereo(frames);
  const boomStart = Math.round(onsetS * sr);
  const boomLen = Math.min(Math.round(2.5 * sr), frames - boomStart);
  const thump = D.biquad(D.whiteNoise(boomLen, random), sr, 'lowpass', () => 500, 0.7);
  for (let n = 0, ph = 0; n < boomLen; n++) {
    const t = n / sr;
    ph += (D.TAU * (38 + 57 * Math.exp(-t / 0.35))) / sr;
    const s = Math.sin(ph) * (1 - Math.exp(-t / 0.003)) * Math.exp(-t / 0.9) + 0.6 * thump[n] * Math.exp(-t / 0.2);
    boom[0][boomStart + n] += s;
    boom[1][boomStart + n] += s;
  }

  scaleToRms(wash, -27);
  scaleToRms(drone, -25);
  D.normalize(boom, { peakDb: -9 });
  const send = sum(frames, [crackle, 0.3], [wash, 0.5], [drone, 0.25], [boom, 0.4]);
  const wet = scaleToRms(D.reverb(send, sr, { roomSize: 0.88, damping: 0.4 }), -28);
  const out = sum(frames, [crackle, 1], [wash, 1], [drone, 1], [boom, 1], [wet, 1]);
  D.fade(out, { inFrames: Math.round(0.75 * sr), outFrames: 5 * sr });
  // Dense clicks have a high crest factor: bring the body up, then round off the click peaks.
  D.normalize(out, { rmsDb: -24, peakDb: 6 });
  const limited = D.softLimit(out, { kneeDb: -6, ceilingDb: -1 });

  const envelope = [];
  for (let s = 0; s <= DUR_S + 1e-9; s += ENVELOPE_STEP_S) envelope.push(+doseAtAudio(s).toFixed(1));

  return {
    file: 'rad_storm_2024_05_20.wav',
    wav: encodeWav(out, sr),
    entry: {
      id: 'rad_storm_2024_05_20',
      file: 'rad_storm_2024_05_20.wav',
      kind: 'one-shot',
      role: 'Solar particle event of 20 May 2024 as measured by Curiosity RAD; plays over the bed',
      sampleRate: sr,
      channels: 2,
      frames,
      durationS: DUR_S,
      data: {
        csv: rel(csv),
        startUtc: isoUtc(START),
        endUtc: isoUtc(START + REAL_S),
        realSecondsPerAudioSecond: timeScale,
        baselineUgyPerDay: +baseline.toFixed(1),
        peakUgyPerDay: peakRow.b,
        peakUtc: isoUtc(peakRow.t),
        onsetS: +onsetS.toFixed(3),
        peakS: +((peakRow.t - START) / timeScale).toFixed(3),
      },
      mapping: [
        `Detector B dose rate (linear between measurements) → click rate: Poisson, ${CLICKS_PER_S_AT_BASELINE} clicks/s at the pre-event baseline, proportional above it`,
        'log(dose / baseline) / log(peak / baseline) → noise-band level and centre, drone dissonance and flutter',
        'Largest jump between consecutive measurements → impact sound at the moment the dose crosses half of that log scale',
      ],
      clicks,
      levels: { ...levels(out), limitedFraction: +limited.toFixed(5) },
      envelope: { stepS: ENVELOPE_STEP_S, doseRateUgyPerDay: envelope },
    },
  };
}

// ---------------------------------------------------------------------------
// Geiger clicks for the game to trigger.

function buildGeigerClicks() {
  const sr = SFX_RATE;
  const frames = Math.round(0.05 * sr);
  return [1, 2, 3, 4].map((k) => {
    const random = D.rng(0x6e16e0 + k);
    const ring = 2300 + 1200 * random();
    const phase = random() * D.TAU;
    const out = new Float32Array(frames);
    for (let n = 0, prev = 0; n < frames; n++) {
      const t = n / sr;
      const w = random() * 2 - 1;
      out[n] = (w - prev) * Math.exp(-t / 0.0006)
        + 0.3 * Math.sin(D.TAU * ring * t + phase) * Math.exp(-t / 0.002) * (1 - Math.exp(-t / 0.0002));
      prev = w;
    }
    const ch = [out];
    D.fade(ch, { inFrames: 4, outFrames: Math.round(0.005 * sr) });
    D.normalize(ch, { peakDb: -12 }); // subtle by default; the game can raise it
    const file = `geiger_click_${k}.wav`;
    return { file, wav: encodeWav(ch, sr) };
  });
}

// ---------------------------------------------------------------------------

await mkdir(OUT_DIR, { recursive: true });
const bed = await buildSurfaceBed();
const storm = await buildStorm();
const clicks = buildGeigerClicks();
const bedRef = median((await loadRadCsv(path.join(DATA_DIR, 'quiet_2024-05-01.csv'))).map((r) => r.b));

const manifest = {
  generator: 'tools/audio/generate.mjs',
  dataset: {
    name: 'MSL RAD Level 2 dose rate (CDAWeb MSL_RAD_OBS-L2, DOSIMETRY_TOTAL_f)',
    reference: 'references/datasets/msl-rad/README.md',
    units: 'µGy/day (absorbed dose rate; detector B = silicon, MMRTG contribution removed; detector E = tissue-equivalent plastic)',
  },
  stems: [bed.entry, storm.entry],
  geiger: {
    files: clicks.map((c) => c.file),
    sampleRate: SFX_RATE,
    real: {
      quietDoseRateUgyPerDay: +bedRef.toFixed(1),
      note: 'Median detector-B dose rate in the quiet window (see reference README)',
    },
    gameBalance: {
      clicksPerSecondAtQuiet: 0.5,
      maxClicksPerSecond: 30,
      note: 'Rate = clicksPerSecondAtQuiet × doseRate / quietDoseRateUgyPerDay, capped; random (Poisson) intervals',
    },
  },
};

for (const { file, wav } of [bed, storm, ...clicks]) {
  await writeFile(path.join(OUT_DIR, file), wav);
  console.log(`✔ ${file} (${(wav.length / 1024).toFixed(0)} KB)`);
}
await writeFile(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`✔ manifest.json`);
console.log(`  bed: ${bed.entry.pings.b + bed.entry.pings.e} pings, levels ${JSON.stringify(bed.entry.levels)}`);
console.log(`  storm: ${storm.entry.clicks} clicks, onset at ${storm.entry.data.onsetS} s, peak ${storm.entry.data.peakUgyPerDay} µGy/day at ${storm.entry.data.peakS} s, levels ${JSON.stringify(storm.entry.levels)}`);
