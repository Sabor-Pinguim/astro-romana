// Low-poly Earth for the launch / orbit-insertion scenes and the orbital map.
//
// Every face takes its class from real global data (references/datasets/earth/):
//   - land cover: MODIS IGBP land-cover classes (NASA, 2024);
//   - ocean depth and land relief: ETOPO1 ice-surface elevation (NOAA);
//   - sea ice: AMSR2 sea-ice concentration (NASA GIBS) at each hemisphere's yearly minimum,
//     so only ice that survives the whole year is drawn.
// Colors per class and the relief exaggeration are game-balance.
import path from 'node:path';
import * as THREE from 'three';
import { GeoGrid } from '../lib/geogrid.mjs';
import { createBodyPalette } from '../lib/palette.mjs';
import { addSite, addSurfaceMeshes, connectedGroups, createSphere, sampleFaces } from '../lib/planet.mjs';
import {
  EARTH_DATA_DIR,
  EARTH_DATASETS,
  ELEVATION_OFFSET,
  IGBP_WATER,
  SEA_ICE_EXTENT_PCT,
} from './earth-datasets.mjs';

const RADIUS_M = 6371000; // volumetric mean radius, NASA Earth Fact Sheet
const DETAIL = 5; // ~240 km edges over the whole globe
const SAMPLES_K = 4; // 16 data samples per face
const RELIEF_EXAGGERATION = 25; // game-balance: true-scale relief (±0.15% of the radius) is invisible
const SHELF_DEPTH_M = -200; // continental shelf break, the usual cut between shelf and deep ocean
const ICE_SHELF_MAX_LAT = -60; // MODIS marks Antarctic ice shelves as water; ETOPO1 puts their surface above 0 m

// IGBP land-cover class → palette material. 0 (no data) and 255 (unclassified) do not vote.
const IGBP_MATERIAL = {
  1: 'Forest', // evergreen needleleaf forests
  2: 'Jungle', // evergreen broadleaf forests
  3: 'Forest', // deciduous needleleaf forests
  4: 'Forest', // deciduous broadleaf forests
  5: 'Forest', // mixed forests
  6: 'Shrub', // closed shrublands
  7: 'Shrub', // open shrublands
  8: 'Savanna', // woody savannas
  9: 'Savanna', // savannas
  10: 'Grass', // grasslands
  11: 'Grass', // permanent wetlands
  12: 'Crop', // croplands
  13: 'Crop', // urban and built-up lands
  14: 'Crop', // cropland/natural vegetation mosaics
  15: 'Ice', // permanent snow and ice
  16: 'Desert', // barren
};
const LAND_MATERIALS = ['Ice', 'Desert', 'Shrub', 'Grass', 'Crop', 'Savanna', 'Forest', 'Jungle'];

export const MATERIAL_SOURCES = {
  OceanDeep: 'water faces where most samples are deeper than 200 m (ETOPO1)',
  OceanShelf: 'water faces where most samples are shallower than 200 m (ETOPO1)',
  SeaIce: `water faces where most samples have ≥ ${SEA_ICE_EXTENT_PCT}% sea ice at the yearly minimum (AMSR2)`,
  Ice: 'IGBP 15 permanent snow and ice; Antarctic ice shelves (MODIS water above 0 m in ETOPO1)',
  Jungle: 'IGBP 2 evergreen broadleaf forests',
  Forest: 'IGBP 1, 3, 4, 5 needleleaf, deciduous and mixed forests',
  Savanna: 'IGBP 8, 9 woody savannas and savannas',
  Grass: 'IGBP 10, 11 grasslands and permanent wetlands',
  Crop: 'IGBP 12, 13, 14 croplands, urban, cropland mosaics',
  Shrub: 'IGBP 6, 7 closed and open shrublands',
  Desert: 'IGBP 16 barren',
};

const LC39A = { lat: 28.6082, lon: -80.6041 };

// Finer faces around the launch site, for the launch and orbit-insertion views
// (Florida is ~150 km wide; the base faces are ~240 km).
const REFINE = [
  { ...LC39A, detail: 7, radiusKm: 1000 }, // ~60 km edges
  { ...LC39A, detail: 6, radiusKm: 2000 }, // ~120 km edges
];

const SITES = [
  {
    id: 'lc39a',
    node: 'Site_LC39A',
    name: 'Kennedy Space Center Launch Complex 39A',
    ...LC39A,
    source: 'https://en.wikipedia.org/wiki/Kennedy_Space_Center_Launch_Complex_39A',
  },
];

async function loadGrids(root) {
  const load = (key, offset = 0) => {
    const d = EARTH_DATASETS[key];
    return GeoGrid.load(path.join(root, EARTH_DATA_DIR, d.file), { registration: d.registration, offset });
  };
  return {
    elevation: await load('elevation', ELEVATION_OFFSET),
    landCover: await load('landCover'),
    seaIceNorth: await load('seaIceNorth'),
    seaIceSouth: await load('seaIceSouth'),
  };
}

function classifySample(grids, lat, lon) {
  const elevation = grids.elevation.bilinear(lat, lon);
  const igbp = grids.landCover.nearest(lat, lon);
  if (igbp === IGBP_WATER) {
    if (lat < ICE_SHELF_MAX_LAT && elevation >= 0) return { land: true, material: 'Ice', elevation };
    const seaIce = (lat >= 0 ? grids.seaIceNorth : grids.seaIceSouth).nearest(lat, lon);
    return { land: false, seaIce: seaIce >= SEA_ICE_EXTENT_PCT, shelf: elevation > SHELF_DEPTH_M, elevation };
  }
  return { land: true, material: IGBP_MATERIAL[igbp] ?? null, elevation };
}

function classifyFace(samples) {
  const water = samples.filter((s) => !s.land);
  if (water.length > samples.length / 2) {
    const seaIce = water.filter((s) => s.seaIce).length;
    const shelf = water.filter((s) => s.shelf).length;
    const material = seaIce * 2 >= water.length ? 'SeaIce' : shelf * 2 >= water.length ? 'OceanShelf' : 'OceanDeep';
    const elevation = water.reduce((sum, s) => sum + s.elevation, 0) / water.length; // bottom or surface
    return { water: true, material, elevation };
  }
  const land = samples.filter((s) => s.land);
  const votes = new Map();
  for (const s of land) if (s.material) votes.set(s.material, (votes.get(s.material) ?? 0) + 1);
  let material = 'Desert';
  let best = 0;
  for (const key of LAND_MATERIALS) {
    if ((votes.get(key) ?? 0) > best) {
      best = votes.get(key);
      material = key;
    }
  }
  const elevation = land.reduce((sum, s) => sum + Math.max(0, s.elevation), 0) / land.length;
  return { water: false, material, elevation };
}

/**
 * Map generalization (one pass of a modal filter): a land face whose class none of its three
 * neighbours share takes the class that at least two land neighbours agree on. It removes
 * single-face speckles; water/land and relief are not changed.
 */
function removeSpeckles(sphere, faceInfo) {
  const next = faceInfo.map((info, f) => {
    if (info.water) return info.material;
    const around = sphere.neighbours[f].map((n) => faceInfo[n]).filter((n) => !n.water).map((n) => n.material);
    if (around.includes(info.material)) return info.material;
    const agreed = around.find((m, i) => around.indexOf(m) !== i);
    return agreed ?? info.material;
  });
  next.forEach((material, f) => {
    faceInfo[f].material = material;
  });
}

export default {
  id: 'earth',
  name: 'Earth',
  nodeName: 'Earth',
  radiusMeters: RADIUS_M,
  radiusSource: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html',
  detail: DETAIL,
  refine: REFINE,
  reliefExaggeration: RELIEF_EXAGGERATION,
  budget: { triangles: 26000, meshes: 12, bytes: 2 * 1024 * 1024 },
  materialSources: MATERIAL_SOURCES,
  sites: SITES,
  data: Object.values(EARTH_DATASETS).map((d) => `${EARTH_DATA_DIR}/${d.file}`),
  references: [
    { label: 'MODIS land cover (MCD12Q1) via NASA GIBS', url: 'https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api' },
    { label: 'ETOPO1 Global Relief Model (NOAA NCEI)', url: 'https://www.ncei.noaa.gov/products/etopo-global-relief-model' },
    { label: 'AMSR2 sea-ice concentration via NASA GIBS', url: 'https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api' },
  ],

  async build({ root: repoRoot }) {
    const grids = await loadGrids(repoRoot);
    const sphere = createSphere(DETAIL, REFINE, RADIUS_M / 1000);
    const faceInfo = sampleFaces(sphere, SAMPLES_K, (lat, lon) => classifySample(grids, lat, lon)).map(classifyFace);
    removeSpeckles(sphere, faceInfo);

    // Water connected to the largest body of water is the ocean (sea level). Other water is a sea
    // cut off by a strait narrower than a face (Mediterranean, Red Sea…) when its ETOPO1 depth is
    // below sea level on average, and stays at sea level; otherwise it is a lake at its lowest shore.
    const { group, groups } = connectedGroups(sphere, (f) => faceInfo[f].water);
    const ocean = groups.reduce((best, g, i) => (g.length > groups[best].length ? i : best), 0);

    const landHeight = sphere.vertices.map((_, v) => {
      const land = sphere.vertexFaces[v].filter((f) => !faceInfo[f].water);
      return land.length ? land.reduce((sum, f) => sum + faceInfo[f].elevation, 0) / land.length : null;
    });
    const level = groups.map((members, i) => {
      if (i === ocean) return 0;
      if (members.reduce((sum, f) => sum + faceInfo[f].elevation, 0) / members.length < 0) return 0;
      let lowest = Infinity;
      for (const f of members) for (const v of sphere.faces[f]) if (landHeight[v] !== null) lowest = Math.min(lowest, landHeight[v]);
      return Number.isFinite(lowest) ? lowest : 0;
    });

    const heights = sphere.vertices.map((_, v) => {
      const wet = sphere.vertexFaces[v].filter((f) => faceInfo[f].water);
      if (wet.length) return Math.min(...wet.map((f) => level[group[f]]));
      return landHeight[v];
    });
    const radii = heights.map((h) => 1 + (RELIEF_EXAGGERATION * h) / RADIUS_M);

    const root = new THREE.Group();
    root.name = 'Earth';
    addSurfaceMeshes(root, 'Earth', createBodyPalette(), sphere, radii, faceInfo.map((f) => f.material));
    const sites = SITES.map((site) => ({ ...site, radius: addSite(root, sphere, radii, site) }));

    const counts = {};
    for (const f of faceInfo) counts[f.material] = (counts[f.material] ?? 0) + 1;
    return {
      root,
      sites,
      info: {
        faceCounts: counts,
        maxHeightM: Math.max(...heights),
        waterGroups: groups.length,
        inlandWaterFaces: groups.reduce((n, g, i) => (i === ocean ? n : n + g.length), 0),
      },
    };
  },
};
