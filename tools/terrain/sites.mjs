// Fixed terrain sites built from real Mars data (HiRISE stereo DTMs, USGS catalog).
// To add a site: pick a DTM in the STAC catalog (collection mro_hirise_socet_dtms),
// set its item id, one of its orthoimages and a center inside the DTM footprint, then
// run `npm run terrain:build -- <id> --preview` and look at tools/terrain/preview/.
//
// Values marked "game" are art/balance choices, not data.

export const STAC_API = 'https://stac.astrogeology.usgs.gov/api';

/** Defaults shared by every site (game choices sized for the web build). */
export const DEFAULTS = {
  sizeM: 2048, // edge of the square site, meters
  gridVertices: 255, // 255 x 255 vertices = 129k triangles; the most that fits 16-bit indices (65535 is reserved)
  textureSize: 1024, // texture pixels per edge (2 m/pixel for a 2048 m site)
  textureJpegQuality: 90, // the photo is stored as JPEG (half the bytes of PNG)
  maxHoleFraction: 0.005, // fail if more than 0.5% of the site has no DTM data
};

/**
 * Horizon ring (sites with `horizonKm`): the land around the walkable terrain, so the real
 * crater rims and mountains show on the horizon. Near the site it comes from the HiRISE DTM
 * and orthoimage themselves; farther out from a global DEM (HORIZON_DEM).
 */
export const HORIZON = {
  innerFraction: 0.5, // first ring at half the site edge (under the walkable terrain)
  rings: 128, // geometric spacing: ~5% of the distance between rings (game; GLB ≤ 5 MB)
  segments: 384, // vertices per ring, ~0.94° apart (game; rings × (segments + 1) ≤ 65535)
  texture: [2048, 1024], // polar texture: texels around × outward (~0.18° × 0.65% of the distance; powers of two)
  jpegQuality: 85,
  nearPixelM: 16, // HiRISE DTM overview used near the site (heights)
  nearPhotoPixelM: 8, // HiRISE orthoimage overview used near the site (texture)
  nearFadeM: [1000, 1800], // HiRISE weight goes from 1 to 0 between these distances
  ctxPixelM: 80, // CTX DTM overview (heights; ~ the ring spacing past 10 km)
  ctxPhotoPixelM: 40, // CTX orthoimage overview (texture)
  ctxFadeM: [38000, 45000], // CTX weight goes from 1 to 0 between these distances
  ctxFeatherM: 4000, // soft edge where a CTX strip ends
};

/** Credit lines for the source products (also written in each site's README in references). */
export const CREDITS = {
  hirise: 'NASA/JPL-Caltech/University of Arizona (HiRISE on MRO); DTM by the University of Arizona, distributed by USGS Astrogeology',
  ctx: 'NASA/JPL-Caltech/Malin Space Science Systems (CTX on MRO); DTM and orthoimage by USGS Astrogeology (Ames Stereo Pipeline)',
  hrscMola: 'MOLA: NASA/GSFC (Mars Global Surveyor); HRSC: ESA/DLR/FU Berlin (Mars Express); blend by USGS Astrogeology (Fergason, Hare & Laura 2018)',
};

/** Middle distance of the horizon: USGS CTX stereo DTMs and their orthoimages (~20 m). */
export const CTX_COLLECTION = 'mro_ctx_controlled_usgs_dtms';

/** Global DEM used beyond the HiRISE data (one uncompressed GeoTIFF; read row by row). */
export const HORIZON_DEM = {
  name: 'Mars MGS MOLA - MEX HRSC Blended DEM Global 200m v2',
  url: 'https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Mars/HRSC_MOLA_Blend/Mars_HRSC_MOLA_BlendDEM_Global_200mp_v2.tif',
  page: 'https://astrogeology.usgs.gov/search/map/mars_mgs_mola_mex_hrsc_blended_dem_global_200m',
  citation: 'Fergason, R.L., Hare, T.M., Laura, J. (2018). HRSC and MOLA Blended Digital Elevation Model at 200m v2. Astrogeology PDS Annex, U.S. Geological Survey.',
  license: 'MOLA data CC0-1.0; HRSC data CC BY-SA 3.0 IGO (attribution required)',
};

export const SITES = [
  {
    id: 'jezero',
    name: 'Jezero Crater',
    collection: 'mro_hirise_socet_dtms',
    item: 'DTEEC_045994_1985_046060_1985_U01',
    ortho: 'ESP_045994_1985_RED_A_01_ORTHO', // 0.25 m/pixel orthoimage of the same stereo pair
    // Perseverance landing site (Octavia E. Butler Landing), ~18.44°N 77.45°E.
    center: { lat: 18.4447, lon: 77.4508 },
    sizeM: 512, // game: a walkable area around the landing point (2 m between vertices)
    horizonKm: 100, // game: the crater rim (~10 km to the west) and the delta stand on the horizon
    // CTX DTMs that cover the site, best horizon coverage first (77%, 84%, 89% of 2–45 km). The first
    // one is from the same orbits as the HiRISE pair (same day, same sun).
    ctx: [
      'J03_045994_1986_XN_18N282W__J03_046060_1986_XN_18N282W',
      'K14_058996_1985_XN_18N282W__K14_058930_1986_XN_18N282W',
      'F05_037752_2008_XN_20N282W__F05_037607_2008_XN_20N282W',
    ],
    tint: [0.86, 0.62, 0.44, 1], // game: dusty butterscotch over the grayscale photo
  },
  {
    id: 'gale',
    name: 'Gale Crater',
    collection: 'mro_hirise_socet_dtms',
    item: 'DTEEC_010573_1755_010639_1755_U01', // USGS rationale: "Possible MSL landing site in Gale Crater"
    ortho: 'PSP_010573_1755_RED_A_01_ORTHO', // 0.25 m/pixel orthoimage of the same stereo pair
    // Curiosity landing site (Bradbury Landing), ~4.59°S 137.44°E.
    center: { lat: -4.5895, lon: 137.4417 },
    sizeM: 512, // game: a walkable area around the landing point
    horizonKm: 100, // game: Mount Sharp (~40 km) and the north rim stand on the horizon
    // CTX DTMs that cover the site, best horizon coverage first (76%, 82%, 87% of 2–45 km).
    ctx: [
      'P22_009571_1756_XI_04S222W__D04_028612_1764_XN_03S222W',
      'P22_009716_1773_XI_02S223W__J09_048273_1747_XN_05S222W',
      'P22_009571_1756_XI_04S222W__J19_052031_1751_XN_04S222W',
    ],
    tint: [0.84, 0.6, 0.45, 1], // game: dusty butterscotch over the grayscale photo
  },
  {
    id: 'north_polar_scarp',
    name: 'North polar cap scarp',
    collection: 'mro_hirise_socet_dtms',
    item: 'DTEPC_036506_2640_036546_2640_A01', // USGS rationale: "Steepest north polar scarp"
    ortho: 'ESP_036506_2640_RED_C_01_ORTHO',
    // Middle of the scarp face: ice plateau to the east, dune-covered base ~700 m lower to the west.
    center: { lat: 83.87, lon: -124.871 },
    tint: [0.93, 0.88, 0.84, 1], // game: dusty ice
  },
];
