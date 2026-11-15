// Map projections used by the USGS Mars products (HiRISE/CTX DTMs) and a local
// east/north frame around a site. Everything here is plain spherical math, so the
// output is the same on every machine.
//
// The products use the "Mars (2015) - Sphere" (radius 3,396,190 m) with either an
// Equidistant Cylindrical projection (low latitudes) or Polar Stereographic (poles).

const DEG = Math.PI / 180;

function findRadius(node) {
  if (node && typeof node === 'object') {
    if (typeof node.radius === 'number') return node.radius;
    for (const value of Object.values(node)) {
      const found = findRadius(value);
      if (found) return found;
    }
  }
  return undefined;
}

function wrapAngle(radians) {
  return Math.atan2(Math.sin(radians), Math.cos(radians));
}

/**
 * Builds the forward projection (lon, lat in degrees) -> [x, y] in meters from the
 * PROJJSON stored in a STAC item (`proj:projjson`).
 */
export function projectionFromProjjson(projjson) {
  const radius = findRadius(projjson.base_crs);
  if (!radius) throw new Error('PROJJSON has no sphere radius');
  const method = projjson.conversion.method.name;
  const param = (name, fallback = 0) =>
    projjson.conversion.parameters.find((p) => p.name === name)?.value ?? fallback;
  const falseEasting = param('False easting');
  const falseNorthing = param('False northing');

  if (/Equidistant Cylindrical|Equirectangular/i.test(method)) {
    const lat1 = param('Latitude of 1st standard parallel') * DEG;
    const lat0 = param('Latitude of natural origin') * DEG;
    const lon0 = param('Longitude of natural origin') * DEG;
    return {
      radius,
      method,
      forward: (lon, lat) => [
        falseEasting + radius * wrapAngle(lon * DEG - lon0) * Math.cos(lat1),
        falseNorthing + radius * (lat * DEG - lat0),
      ],
    };
  }

  if (/Polar Stereographic/i.test(method)) {
    const north = param('Latitude of natural origin') > 0;
    const lon0 = param('Longitude of natural origin') * DEG;
    const k0 = param('Scale factor at natural origin', 1);
    return {
      radius,
      method,
      forward: (lon, lat) => {
        const phi = lat * DEG;
        const dLon = lon * DEG - lon0;
        if (north) {
          const rho = 2 * radius * k0 * Math.tan(Math.PI / 4 - phi / 2);
          return [falseEasting + rho * Math.sin(dLon), falseNorthing - rho * Math.cos(dLon)];
        }
        const rho = 2 * radius * k0 * Math.tan(Math.PI / 4 + phi / 2);
        return [falseEasting + rho * Math.sin(dLon), falseNorthing + rho * Math.cos(dLon)];
      },
    };
  }

  throw new Error(`Unsupported projection "${method}"`);
}

/**
 * Converts a point given in meters east/north of `center` (on the local tangent plane)
 * to [lon, lat] in degrees, using the azimuthal equidistant inverse. Over a few km this
 * keeps distances true and "north" pointing to the real north in every projection.
 */
export function localToLonLat(center, east, north, radius) {
  const distance = Math.hypot(east, north);
  if (distance === 0) return [center.lon, center.lat];
  const phi0 = center.lat * DEG;
  const c = distance / radius;
  const azimuth = Math.atan2(east, north);
  const sinPhi = Math.sin(phi0) * Math.cos(c) + Math.cos(phi0) * Math.sin(c) * Math.cos(azimuth);
  const phi = Math.asin(sinPhi);
  const lambda =
    center.lon * DEG +
    Math.atan2(Math.sin(azimuth) * Math.sin(c) * Math.cos(phi0), Math.cos(c) - Math.sin(phi0) * sinPhi);
  return [wrapAngle(lambda) / DEG, phi / DEG];
}

/**
 * Local frame of a square site: `toProjected(east, north)` gives the projected meters
 * of a point in the site, ready to be looked up in a raster.
 */
export function createSiteFrame(center, projection) {
  return {
    center,
    toLonLat: (east, north) => localToLonLat(center, east, north, projection.radius),
    toProjected: (east, north) => {
      const [lon, lat] = localToLonLat(center, east, north, projection.radius);
      return projection.forward(lon, lat);
    },
  };
}
