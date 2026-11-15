// Preview images for choosing and checking a site (not used by the game):
//   <id>_overview.png  whole DTM, shaded, with the site square in red
//   <id>_crop.png      site texture (left) next to the DTM shaded with the photo's sun (right)
import { encodePng } from './png.mjs';
import { borderPoints } from './raster.mjs';
import { hillshade } from './terrain-mesh.mjs';

const OVERVIEW_MAX_WIDTH = 1024;

export async function renderOverview(dtm, frame, sizeM) {
  let level = dtm.levels[dtm.levels.length - 1];
  for (const l of dtm.levels) if (l.width <= OVERVIEW_MAX_WIDTH) { level = l; break; }
  const { width, height } = level;
  const [data] = await level.image.readRasters({ samples: [0] });

  const heights = new Float32Array(width * height);
  for (let k = 0; k < heights.length; k++) heights[k] = data[k] < -1e30 || !Number.isFinite(data[k]) ? NaN : data[k];

  const step = Math.abs(level.resX);
  const rgb = new Uint8Array(width * height * 3);
  // Hillshade with a fixed north-west light (map convention), on a square-free grid.
  const at = (i, j) => heights[Math.min(height - 1, Math.max(0, j)) * width + Math.min(width - 1, Math.max(0, i))];
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const dhdx = (at(i + 1, j) - at(i - 1, j)) / (2 * step);
      const dhdy = (at(i, j - 1) - at(i, j + 1)) / (2 * step); // raster rows go south
      const len = Math.hypot(dhdx, dhdy, 1);
      const shade = (-dhdx * -0.5 + -dhdy * 0.5 + 0.707) / len;
      const v = Number.isNaN(shade) ? 0 : Math.round(255 * Math.min(1, Math.max(0, shade)));
      rgb.fill(v, (j * width + i) * 3, (j * width + i) * 3 + 3);
    }
  }

  for (const [x, y] of borderPoints(frame, sizeM, 400)) {
    const col = Math.round((x - dtm.originX) / level.resX - 0.5);
    const row = Math.round((y - dtm.originY) / level.resY - 0.5);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const c = col + dx;
        const r = row + dy;
        if (c < 0 || r < 0 || c >= width || r >= height) continue;
        rgb.set([255, 40, 40], (r * width + c) * 3);
      }
    }
  }
  return encodePng(width, height, 3, rgb);
}

/** Side by side: texture | shaded relief with the photo's sun. Both north-up. */
export function renderCrop({ texture, textureSize, heights, gridCount, step, sun, size = 512 }) {
  const shade = hillshade(heights, gridCount, step, sun.azimuthDeg, sun.elevationDeg);
  let maxShade = 0;
  for (const s of shade) maxShade = Math.max(maxShade, s);
  const rgb = new Uint8Array(size * 2 * size * 3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const t = texture[Math.floor((y * textureSize) / size) * textureSize + Math.floor((x * textureSize) / size)];
      const gx = Math.min(gridCount - 1, Math.round((x * (gridCount - 1)) / (size - 1)));
      const gy = Math.min(gridCount - 1, Math.round((y * (gridCount - 1)) / (size - 1)));
      const s = Math.round((255 * shade[gy * gridCount + gx]) / (maxShade || 1));
      const left = (y * size * 2 + x) * 3;
      const right = (y * size * 2 + size + x) * 3;
      rgb.fill(t, left, left + 3);
      rgb.fill(s, right, right + 3);
    }
  }
  return encodePng(size * 2, size, 3, rgb);
}
