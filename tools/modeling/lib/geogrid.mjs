// Global latitude/longitude grids (equirectangular, first row = north) read from the
// PNG files in references/datasets/, plus the body-frame convention shared by all bodies.
//
// Body frame: +Y = north pole (rotation axis), +Z = latitude 0° / longitude 0°,
// +X = longitude 90° E. Godot's MODEL_FRONT (+Z) therefore faces the prime meridian.
import { readFile } from 'node:fs/promises';
import { decodePng } from './png.mjs';

const DEG = Math.PI / 180;

/** Unit vector for a latitude/longitude in degrees (east-positive longitude). */
export function latLonToVector(latDeg, lonDeg) {
  const lat = latDeg * DEG;
  const lon = lonDeg * DEG;
  return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
}

/** Latitude/longitude in degrees for a (not necessarily unit) vector. */
export function vectorToLatLon([x, y, z]) {
  const r = Math.hypot(x, y, z);
  return [Math.asin(y / r) / DEG, Math.atan2(x, z) / DEG];
}

/**
 * A global grid of values.
 * - `node` registration: samples sit on the grid lines; width = 360/step + 1 (both ±180° present).
 * - `pixel` registration: samples sit at cell centers; width = 360/step.
 */
export class GeoGrid {
  constructor({ width, height, data, registration, offset = 0 }) {
    this.width = width;
    this.height = height;
    this.data = data;
    this.registration = registration;
    this.offset = offset;
    const columns = registration === 'node' ? width - 1 : width;
    this.stepLon = 360 / columns;
    this.stepLat = 180 / (registration === 'node' ? height - 1 : height);
    this.columns = columns;
  }

  static async load(file, { registration, offset = 0 }) {
    const image = decodePng(await readFile(file));
    if (image.channels !== 1) throw new Error(`${file}: expected a single-channel grid`);
    return new GeoGrid({ width: image.width, height: image.height, data: image.data, registration, offset });
  }

  #position(latDeg, lonDeg) {
    const half = this.registration === 'pixel' ? 0.5 : 0;
    return [(lonDeg + 180) / this.stepLon - half, (90 - latDeg) / this.stepLat - half];
  }

  #at(column, row) {
    const c = ((column % this.columns) + this.columns) % this.columns;
    const r = Math.min(this.height - 1, Math.max(0, row));
    return this.data[r * this.width + c] - this.offset;
  }

  /** Value of the closest sample (for classes). */
  nearest(latDeg, lonDeg) {
    const [x, y] = this.#position(latDeg, lonDeg);
    return this.#at(Math.round(x), Math.round(y));
  }

  /** Bilinear interpolation (for continuous values such as elevation). */
  bilinear(latDeg, lonDeg) {
    const [x, y] = this.#position(latDeg, lonDeg);
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = x - x0;
    const fy = y - y0;
    const top = this.#at(x0, y0) * (1 - fx) + this.#at(x0 + 1, y0) * fx;
    const bottom = this.#at(x0, y0 + 1) * (1 - fx) + this.#at(x0 + 1, y0 + 1) * fx;
    return top * (1 - fy) + bottom * fy;
  }
}
