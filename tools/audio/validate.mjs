// Validates the generated audio listed in assets/audio/manifest.json:
// WAV format, sizes, levels, seamless loops, clean one-shot edges and the
// storm's dose envelope.
//
//   npm run audio:validate
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gainToDb, peak, rms } from './lib/dsp.mjs';
import { decodeWav } from './lib/wav.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const AUDIO_DIR = path.join(ROOT, 'assets/audio');

const MAX_BYTES = 5 * 1024 * 1024; // AGENTS.md, "Git": larger binaries need the team's OK
const MAX_PEAK_DB = -0.5; // headroom against inter-sample clipping
const MIN_RMS_DB = -60; // anything quieter is a broken render
const EDGE_SILENCE = 1e-3; // one-shots must start and end silent (no click)

/**
 * Loops are closed (lib/wav.mjs closeLoop): the last frame repeats frame 0, and
 * the seam (frame N−1 → frame 0) must look like any other step.
 */
function seamProblem(channel) {
  if (Math.abs(channel.at(-1) - channel[0]) > 1.5 / 32767) return 'last frame does not repeat frame 0 (use closeLoop)';
  const steps = new Float32Array(channel.length - 1);
  for (let i = 1; i < channel.length; i++) steps[i - 1] = Math.abs(channel[i] - channel[i - 1]);
  steps.sort();
  const typical = steps[Math.floor(steps.length * 0.999)];
  const seam = Math.abs(channel[0] - channel.at(-2));
  return seam > Math.max(typical * 4, 1e-3) ? `loop seam jump ${seam.toFixed(4)} (p99.9 step ${typical.toFixed(4)})` : null;
}

async function checkWav(file, expect) {
  const problems = [];
  const bytes = await readFile(path.join(AUDIO_DIR, file));
  if (bytes.length > MAX_BYTES) problems.push(`${(bytes.length / 1048576).toFixed(1)} MB > 5 MB`);
  const wav = decodeWav(bytes);
  if (wav.format !== 1 || wav.bitsPerSample !== 16) problems.push(`format ${wav.format}/${wav.bitsPerSample}-bit, expected PCM 16-bit`);
  if (wav.sampleRate !== expect.sampleRate) problems.push(`sample rate ${wav.sampleRate} ≠ ${expect.sampleRate}`);
  if (expect.channels && wav.numChannels !== expect.channels) problems.push(`${wav.numChannels} channels ≠ ${expect.channels}`);
  if (expect.frames && wav.frames !== expect.frames) problems.push(`${wav.frames} frames ≠ ${expect.frames}`);

  const peakDb = gainToDb(peak(wav.channels));
  const rmsDb = gainToDb(rms(wav.channels));
  if (peakDb > MAX_PEAK_DB) problems.push(`peak ${peakDb.toFixed(1)} dBFS > ${MAX_PEAK_DB}`);
  if (rmsDb < MIN_RMS_DB) problems.push(`RMS ${rmsDb.toFixed(1)} dBFS: silent?`);

  if (expect.kind === 'loop') {
    if (!wav.loop) problems.push('no smpl loop chunk');
    else if (wav.loop.start !== 0 || wav.loop.end !== wav.frames - 1) problems.push(`loop ${wav.loop.start}–${wav.loop.end}, expected 0–${wav.frames - 1}`);
    for (const ch of wav.channels) {
      const p = seamProblem(ch);
      if (p) problems.push(p);
    }
  } else {
    if (wav.loop) problems.push('one-shot has a loop chunk');
    for (const ch of wav.channels) {
      if (Math.abs(ch[0]) > EDGE_SILENCE || Math.abs(ch.at(-1)) > EDGE_SILENCE) problems.push('does not start/end silent');
    }
  }
  return { problems, summary: `${(wav.frames / wav.sampleRate).toFixed(2)} s, peak ${peakDb.toFixed(1)} dBFS, RMS ${rmsDb.toFixed(1)} dBFS` };
}

let failures = 0;
const report = (name, problems, summary) => {
  if (problems.length === 0) {
    console.log(`✔ ${name}: ${summary}`);
  } else {
    failures++;
    console.log(`✘ ${name}${summary ? ` (${summary})` : ''}`);
    for (const p of problems) console.log(`    - ${p}`);
  }
};

const manifest = JSON.parse(await readFile(path.join(AUDIO_DIR, 'manifest.json'), 'utf8'));

for (const stem of manifest.stems) {
  const { problems, summary } = await checkWav(stem.file, stem);
  const playedFrames = stem.kind === 'loop' ? stem.loopFrames : stem.frames;
  if (Math.abs(playedFrames / stem.sampleRate - stem.durationS) > 1e-6) problems.push('durationS does not match the frame count');
  if (stem.kind === 'loop' && stem.frames !== stem.loopFrames + 1) problems.push('loop file should hold loopFrames + 1 frames');
  try {
    await access(path.join(ROOT, stem.data.csv));
  } catch {
    problems.push(`data file missing: ${stem.data.csv}`);
  }
  const env = stem.envelope;
  if (env) {
    const expected = Math.round(stem.durationS / env.stepS) + 1;
    if (env.doseRateUgyPerDay.length !== expected) problems.push(`envelope has ${env.doseRateUgyPerDay.length} points, expected ${expected}`);
    if (env.doseRateUgyPerDay.some((v) => !(v > 0))) problems.push('envelope has non-positive dose rates');
  }
  report(stem.file, problems, summary);
}

const g = manifest.geiger;
for (const file of g.files) {
  const { problems, summary } = await checkWav(file, { sampleRate: g.sampleRate, channels: 1, kind: 'one-shot' });
  report(file, problems, summary);
}
const gp = [];
if (!(g.real?.quietDoseRateUgyPerDay > 0)) gp.push('missing real.quietDoseRateUgyPerDay');
if (!(g.gameBalance?.clicksPerSecondAtQuiet > 0) || !(g.gameBalance?.maxClicksPerSecond > 0)) gp.push('missing gameBalance click rates');
report('geiger parameters', gp, 'ok');

console.log(failures === 0 ? '\nAll audio valid.' : `\n${failures} file(s) with problems.`);
process.exit(failures === 0 ? 0 : 1);
