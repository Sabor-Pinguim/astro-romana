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
  maxHoleFraction: 0.005, // fail if more than 0.5% of the site has no DTM data
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
