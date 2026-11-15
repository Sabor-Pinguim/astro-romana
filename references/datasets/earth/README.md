# Earth global grids (land cover, relief, sea ice)

Global 0.25° grids that drive the low-poly Earth (`tools/modeling/bodies/earth.mjs`, output in `godot/assets/models/bodies/earth.glb`). The generator reads only these files. `npm run models:fetch:bodies` downloads them again (dataset list in `tools/modeling/bodies/earth-datasets.mjs`).

## Sources

| Grid | Product | Provider / access | Date | Use |
|---|---|---|---|---|
| Land cover | **MCD12Q1 V061**, MODIS/Terra+Aqua Land Cover Type Yearly L3 Global 500 m, IGBP scheme | NASA LP DAAC, served as the GIBS layer `MODIS_Combined_L3_IGBP_Land_Cover_Type_Annual` ([GIBS API](https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api)) | 2024 (latest year on GIBS at retrieval) | NASA Earth science data, no restrictions on use. Credit NASA LP DAAC / GIBS. |
| Relief | **ETOPO1** 1 arc-minute Global Relief Model, *Ice Surface* (top of the Antarctic and Greenland ice sheets), vertical datum mean sea level | NOAA NGDC (now NCEI), served by NOAA CoastWatch ERDDAP, dataset [`etopo180`](https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180.html). Reference: Amante, C. and B. W. Eakins (2009), NOAA Technical Memorandum NESDIS NGDC-24 | static | "May be used and redistributed for free but is not intended for legal use" (ERDDAP metadata). |
| Sea ice (north) | **AU_SI12 V001**, AMSR-E/AMSR2 Unified L3 Daily 12.5 km sea ice concentration (GCOM-W1/AMSR2) | NSIDC, served as the GIBS layer `AMSRU2_Sea_Ice_Concentration_12km` | 2024-09-15 | Arctic sea ice that survives the summer. Credit NSIDC / GIBS. |
| Sea ice (south) | same | same | 2025-02-20 | Antarctic sea ice that survives the summer. |

- **Retrieved:** 2026-11-15. NASA NEO, the older source for these maps, was shut down in September 2026, so the grids come from GIBS instead.
- **Product names:** taken from the GIBS layer metadata (`https://gibs.earthdata.nasa.gov/layer-metadata/v1.0/<layer>.json`).

## Files

All files are equirectangular. The first row is the north and the first column is 180° W.

| File | Size (px) | Registration | Value |
|---|---|---|---|
| `etopo1_ice_0p25deg.png` | 1441 × 721, 16-bit gray | node: samples on the grid lines, both ±180° present | elevation in meters + 11 000 |
| `modis_igbp_2024_0p25deg.png` | 1440 × 720, 8-bit gray | pixel: cell centers | IGBP class 1–16, 17 = water, 255 = unclassified |
| `amsr2_sea_ice_2024-09-15_0p25deg.png` | 1440 × 720, 8-bit gray | pixel | sea ice concentration, % (0 = none or no data) |
| `amsr2_sea_ice_2025-02-20_0p25deg.png` | 1440 × 720, 8-bit gray | pixel | same |

- **Relief, processing:** every 15th node of the 1-arc-minute grid (point samples, not averages), via ERDDAP `esriAscii`.
- **Classes, processing:** GIBS WMS `GetMap` at 1440 × 720 (EPSG:4326). Each color is mapped back to its value with the layer's GIBS colormap; a color outside the colormap fails the fetch. The server downsamples the 500 m / 12.5 km data, so each cell is one value from the source, not the dominant class in the cell.

## How the generator uses them

- **Land or water:** from the land cover. Water connected to the world ocean sits at sea level. Some seas are cut off at this resolution because their straits are narrower than a face (Mediterranean, Black Sea, Red Sea, Hudson Bay). Cut-off water whose mean ETOPO1 value is below 0 m also stays at sea level. The rest is a lake (Great Lakes, Victoria…) and sits at its lowest shore.
- **Shelf vs deep ocean:** a water face is "shelf" when most of its samples are shallower than 200 m (the usual shelf-break depth).
- **Sea ice:** a water face is sea ice when most of its samples have ≥ 15% concentration. That is the usual threshold for sea ice *extent* (NSIDC). The north uses the September grid and the south the February grid; those are the months when each hemisphere usually reaches its yearly minimum. Only ice that lasts all year is drawn.
- **Antarctic ice shelves:** MCD12Q1 marks the floating ice shelves (Ross, Filchner-Ronne…) as water, but ETOPO1's ice surface puts them above 0 m. Water cells south of 60° S that are above 0 m are drawn as ice.
- **Relief:** a vertex height is the mean land elevation of the faces around it (negative values clamped to 0), exaggerated 25× (`game-balance`). At true scale, Earth's relief is about ±0.15% of the radius and would not show.
- **Speckle filter:** one pass of a modal filter. A land face whose class none of its neighbours share takes the class that two of them agree on.

## Values used next to the data

| Value | Number | Source |
|---|---|---|
| Earth volumetric mean radius | 6 371.000 km | [NASA Earth Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html) |
| Kennedy Space Center LC-39A | 28.6082° N, 80.6041° W | [Wikipedia, LC-39A](https://en.wikipedia.org/wiki/Kennedy_Space_Center_Launch_Complex_39A) (28°36′30.2″N 80°36′15.6″W); same in the AIAA vehicle guide |

## Caveats

- **ETOPO1 is superseded** by [ETOPO 2022](https://www.ncei.noaa.gov/products/etopo-global-relief-model). At 0.25° the difference does not show, but switch if a finer grid is ever needed.
- **North Pole gap:** the AMSR2 polar grid has no data at the pole itself (the last 0.25° row is 0). Faces there take the majority of their samples, so the gap does not show.
- **Sea ice dates:** chosen inside the month of the usual minimum, not on the exact minimum day of that year.
- **Sampling:** each grid holds point samples (see Processing), so a feature narrower than ~28 km can be missed.
