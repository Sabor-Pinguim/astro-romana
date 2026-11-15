// Global Earth grids committed in references/datasets/earth/ (sources in the README there).
// Shared by fetch-bodies.mjs (writes them) and bodies/earth.mjs (reads them).

const GIBS_WMS = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';
const ERDDAP = 'https://coastwatch.pfeg.noaa.gov/erddap/griddap';

export const EARTH_DATA_DIR = 'references/datasets/earth';

/** Elevation is stored as uint16 = meters + ELEVATION_OFFSET (ETOPO1 spans about −10.9 km to +8.4 km). */
export const ELEVATION_OFFSET = 11000;

/** IGBP class for water bodies in the land-cover grid. */
export const IGBP_WATER = 17;

/** Sea ice "extent" threshold: cells with at least 15% concentration (the usual NSIDC convention). */
export const SEA_ICE_EXTENT_PCT = 15;

export const EARTH_DATASETS = {
  elevation: {
    file: 'etopo1_ice_0p25deg.png',
    kind: 'elevation',
    registration: 'node',
    // ETOPO1 "Ice Surface", every 15th 1-arc-minute node = 0.25°.
    url: `${ERDDAP}/etopo180.esriAscii?altitude%5B(-90.0):15:(90.0)%5D%5B(-180.0):15:(180.0)%5D`,
  },
  landCover: {
    file: 'modis_igbp_2024_0p25deg.png',
    kind: 'classes',
    registration: 'pixel',
    wms: GIBS_WMS,
    layer: 'MODIS_Combined_L3_IGBP_Land_Cover_Type_Annual',
    time: '2024-01-01',
    colormap: 'MODIS_IGBP_Land_Cover_Type.xml',
  },
  seaIceNorth: {
    file: 'amsr2_sea_ice_2024-09-15_0p25deg.png',
    kind: 'classes',
    registration: 'pixel',
    wms: GIBS_WMS,
    layer: 'AMSRU2_Sea_Ice_Concentration_12km',
    time: '2024-09-15', // Arctic: the yearly minimum falls in September
    colormap: 'AMSR_Sea_Ice_Concentration.xml',
  },
  seaIceSouth: {
    file: 'amsr2_sea_ice_2025-02-20_0p25deg.png',
    kind: 'classes',
    registration: 'pixel',
    wms: GIBS_WMS,
    layer: 'AMSRU2_Sea_Ice_Concentration_12km',
    time: '2025-02-20', // Antarctic: the yearly minimum falls in February
    colormap: 'AMSR_Sea_Ice_Concentration.xml',
  },
};
