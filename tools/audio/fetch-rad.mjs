// Downloads the Curiosity RAD dose-rate windows used by the audio generator
// from NASA SPDF CDAWeb (dataset MSL_RAD_OBS-L2, variable DOSIMETRY_TOTAL_f)
// and writes them as small CSVs to references/datasets/msl-rad/.
//
// The generator reads only those committed CSVs, so this needs to run again
// only to add or change a window (see WINDOWS below and the README there).
//
//   npm run audio:fetch
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT_DIR = path.join(ROOT, 'references/datasets/msl-rad');
const API = 'https://cdaweb.gsfc.nasa.gov/WS/cdasr/1/dataviews/sp_phys/datasets/MSL_RAD_OBS-L2/data';
const VARIABLE = 'DOSIMETRY_TOTAL_f'; // quality-filtered dose rate
const FILL_THRESHOLD = -1e30; // CDAWeb fill value is -1e31

export const WINDOWS = [
  { file: 'quiet_2024-05-01.csv', start: '2024-05-01T00:00:00Z', end: '2024-05-06T00:00:00Z' },
  { file: 'storm_2024-05-20.csv', start: '2024-05-19T12:00:00Z', end: '2024-05-23T00:00:00Z' },
];

const compact = (iso) => iso.replace(/[-:]/g, '').replace('.000', '');

async function fetchWindow({ start, end }) {
  const url = `${API}/${compact(start)},${compact(end)}/${VARIABLE}?format=text`;
  const meta = await fetch(url, { headers: { Accept: 'application/json' } }).then((r) => r.json());
  const fileUrl = meta.FileDescription?.[0]?.Name;
  if (!fileUrl) throw new Error(`CDAWeb returned no file for ${start}..${end}: ${JSON.stringify(meta.Status ?? meta)}`);
  const text = await fetch(fileUrl).then((r) => r.text());

  // Data lines: "dd-mm-yyyy hh:mm:ss.mil.mic.nan  TOTAL_DOSE_B  RTG_CORRECTED_DOSE_B  TOTAL_DOSE_E"
  const rows = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^(\d\d)-(\d\d)-(\d{4}) (\d\d:\d\d:\d\d)\S*\s+(\S+)\s+(\S+)\s+(\S+)\s*$/);
    if (!m) continue;
    const [, dd, mm, yyyy, hms, , rtgB, e] = m;
    if (+rtgB < FILL_THRESHOLD || +e < FILL_THRESHOLD) continue;
    rows.push(`${yyyy}-${mm}-${dd}T${hms}Z,${(+rtgB).toFixed(3)},${(+e).toFixed(3)}`);
  }
  return rows;
}

for (const window of WINDOWS) {
  const rows = await fetchWindow(window);
  const header = 'time_utc,dose_rate_b_si_rtg_corrected_ugy_per_day,dose_rate_e_plastic_ugy_per_day';
  await writeFile(path.join(OUT_DIR, window.file), [header, ...rows].join('\n') + '\n');
  console.log(`✔ ${window.file}: ${rows.length} rows (${window.start} → ${window.end})`);
}
