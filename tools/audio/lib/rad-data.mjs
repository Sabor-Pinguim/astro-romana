// Loads and shapes the Curiosity RAD dose-rate CSVs in references/datasets/msl-rad/.
import { readFile } from 'node:fs/promises';

/** Mean solar day on Mars, 24 h 39 min 35.244 s (the NSSDCA Mars fact sheet rounds it to 24.6597 h). */
export const SOL_SECONDS = 88775.244;

/**
 * @returns {Promise<{ t: number, b: number, e: number }[]>} rows sorted by time;
 *   t in Unix seconds, b = silicon detector B (MMRTG-corrected), e = plastic
 *   detector E, both in µGy/day
 */
export async function loadRadCsv(file) {
  const [header, ...lines] = (await readFile(file, 'utf8')).trim().split('\n');
  if (!header.startsWith('time_utc,')) throw new Error(`${file}: unexpected header "${header}"`);
  return lines
    .map((line) => {
      const [time, b, e] = line.split(',');
      return { t: Date.parse(time) / 1000, b: +b, e: +e };
    })
    .sort((x, y) => x.t - y.t);
}

/** Linear interpolation of `values` (one per row) at time t, clamped at the ends. */
export function sampler(rows, values) {
  return (t) => {
    if (t <= rows[0].t) return values[0];
    if (t >= rows.at(-1).t) return values.at(-1);
    let lo = 0;
    let hi = rows.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (rows[mid].t <= t) lo = mid; else hi = mid;
    }
    const u = (t - rows[lo].t) / (rows[hi].t - rows[lo].t);
    return values[lo] + (values[hi] - values[lo]) * u;
  };
}

/** Gaussian smoothing in real time (handles the uneven RAD cadence and gaps). */
export function gaussianSmooth(rows, key, sigmaSeconds) {
  return rows.map((row) => {
    let sum = 0;
    let weight = 0;
    for (const other of rows) {
      const d = (other.t - row.t) / sigmaSeconds;
      if (Math.abs(d) > 3) continue;
      const w = Math.exp(-0.5 * d * d);
      sum += other[key] * w;
      weight += w;
    }
    return sum / weight;
  });
}

export function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * (p / 100);
  const lo = Math.floor(idx);
  return sorted[lo] + (sorted[Math.min(lo + 1, sorted.length - 1)] - sorted[lo]) * (idx - lo);
}

export const median = (values) => percentile(values, 50);

export function std(values) {
  const mean = values.reduce((a, v) => a + v, 0) / values.length;
  return Math.sqrt(values.reduce((a, v) => a + (v - mean) ** 2, 0) / values.length);
}

export const isoUtc = (t) => new Date(t * 1000).toISOString().replace('.000Z', 'Z');
