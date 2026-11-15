# Mars terrain sources (HiRISE, CTX, HRSC–MOLA)

The real terrains of the game (`assets/terrain/`, built by `tools/terrain/`) come only from the files in this
folder. The build reads them offline, so a fresh clone builds the very same terrain, byte for byte, even if a
server changes or removes a file. `npm run terrain:fetch` downloads them again (only the bytes of each crop) and
rewrites this folder.

Each site has its own folder with a generated `README.md` that lists every file: what it is, the product id, a link
to the catalog entry and to the original file, the exact version used (ETag, Last-Modified), the license and the
credit. `sources.json` holds the same list plus what the build needs to read the files.

| Folder | Site | Contents |
|---|---|---|
| [jezero/](jezero/) | Jezero Crater, Perseverance landing site | HiRISE crop + horizon (3 CTX strips, global DEM) |
| [gale/](gale/) | Gale Crater, Curiosity landing site | HiRISE crop + horizon (3 CTX strips, global DEM) |
| [north_polar_scarp/](north_polar_scarp/) | North polar cap scarp (not used by the game yet) | HiRISE crop only |

## Products

| Product | Mission / instrument | Used for | Catalog | License | Credit |
|---|---|---|---|---|---|
| HiRISE stereo DTM (~1 m/post) | NASA MRO, HiRISE | Heights of the walkable terrain and of the horizon up to ~1.8 km | USGS Astrogeology STAC, collection `mro_hirise_socet_dtms` | CC0-1.0 | NASA/JPL-Caltech/University of Arizona; DTMs made by the University of Arizona |
| HiRISE orthoimage `*_RED_A_01_ORTHO` (0.25 m/px) or `*_RED_C_01_ORTHO` (1 m/px) | NASA MRO, HiRISE | Texture of the walkable terrain and of the horizon up to ~1.8 km | Same STAC item as the DTM | CC0-1.0 | NASA/JPL-Caltech/University of Arizona |
| HiRISE RDR PDS label `<obs>_RED.LBL` | NASA MRO, HiRISE | Sun position of each photo | [HiRISE PDS](https://hirise-pds.lpl.arizona.edu/PDS/RDR/) | NASA PDS public data | NASA/JPL-Caltech/University of Arizona |
| CTX stereo DTM and orthoimage (~20 m/px) | NASA MRO, CTX | Heights and texture of the horizon from ~1.8 to ~45 km | USGS Astrogeology STAC, collection `mro_ctx_controlled_usgs_dtms` | CC0-1.0 | NASA/JPL-Caltech/Malin Space Science Systems; DTMs by USGS Astrogeology (Ames Stereo Pipeline) |
| Mars MGS MOLA - MEX HRSC Blended DEM Global 200m v2 | NASA MGS, MOLA + ESA Mars Express, HRSC | Heights of the horizon beyond the CTX strips, out to 100 km | [USGS Astrogeology](https://astrogeology.usgs.gov/search/map/mars_mgs_mola_mex_hrsc_blended_dem_global_200m) | MOLA data CC0; **HRSC data CC BY-SA 3.0 IGO** (attribution required) | Fergason, R.L., Hare, T.M., Laura, J. (2018). *HRSC and MOLA Blended Digital Elevation Model at 200m v2*. Astrogeology PDS Annex, U.S. Geological Survey. MOLA: NASA/GSFC; HRSC: ESA/DLR/FU Berlin |

- STAC API: https://stac.astrogeology.usgs.gov/api (docs: https://stac.astrogeology.usgs.gov/docs/data/mars/hirise_dtms/).
- The global DEM is one 11 GB uncompressed GeoTIFF (not cloud optimized); the fetch reads one HTTP range per row,
  from `asc-pds-services` on AWS (the `planetarymaps.usgs.gov` link redirects there).
- **Credits in the game:** everything is NASA mission data except the HRSC part of the global DEM (ESA/DLR), whose
  license asks for attribution; list the credits above wherever the game names its data sources.

## Sites

| id | HiRISE DTM | Photo | Center | USGS rationale for the DTM |
|---|---|---|---|---|
| `jezero` | `DTEEC_045994_1985_046060_1985_U01` | `ESP_045994_1985_RED_A_01_ORTHO` | 18.4447°N, 77.4508°E | "Candidate landing site for 2020 mission in Jezero Crater" |
| `gale` | `DTEEC_010573_1755_010639_1755_U01` | `PSP_010573_1755_RED_A_01_ORTHO` | 4.5895°S, 137.4417°E | "Possible MSL landing site in Gale Crater" |
| `north_polar_scarp` | `DTEPC_036506_2640_036546_2640_A01` | `ESP_036506_2640_RED_C_01_ORTHO` | 83.87°N, 235.129°E (−124.871°) | "Steepest north polar scarp" |

- **Jezero:** the center is the Perseverance landing site, Octavia E. Butler Landing, given as 18°26′N 77°27′E
  (≈18.44°N 77.45°E) by [Wikipedia](https://en.wikipedia.org/wiki/Octavia_E._Butler_Landing); see also
  [JPL PIA24483](https://www.jpl.nasa.gov/images/pia24483-welcome-to-octavia-e-butler-landing/).
  The extra decimals only place the crop; do not show them to players as a fact.
- **Gale:** the center is the Curiosity landing site, Bradbury Landing, given as 4°35′22″S 137°26′30″E
  (≈4.5895°S 137.4417°E) by [Wikipedia](https://en.wikipedia.org/wiki/Bradbury_Landing).
- **Walkable crops** (`jezero`, `gale`): 512 × 512 m (game choice), 2 m between mesh vertices, 0.5 m texture pixels.
- **North polar scarp:** 2 × 2 km, centered on the scarp face (chosen from the DTM): ice plateau to the east,
  dune-covered base ~700 m lower to the west.
- **CTX strips** (3 per landing site, listed in `tools/terrain/sites.mjs`): among the CTX DTMs that cover the site,
  the ones that cover the most of the ground 2–45 km around it (Gale 76/82/87%, Jezero 77/84/89%, cumulative).
  Jezero's first one (`J03_045994…J03_046060`) was taken on the same orbits as the HiRISE pair, with the same sun.

## How the build uses them

- **Walkable terrain:** HiRISE DTM heights on a 255 × 255 grid; the photo as texture, divided by `k + direct light`
  computed from the DTM with the photo's sun (normals and cast shadows; `k`, the ambient/direct ratio, fitted on
  the photo, minimum 0.25), so the game light can shade the mesh without doubling the shadows. The manifest records
  the photo/relief correlation before and after (`deshading`: Gale 0.66 → 0.00, Jezero 0.23 → 0.03).
- **Horizon ring** (landing sites, to 100 km, game choice): HiRISE near the site, CTX in the middle, global DEM
  beyond; every value averaged over the footprint of its vertex or texel. Near the site (0.3–1.8 km) the coarser
  sources are matched to HiRISE: heights by the median difference (`heightShiftM`, `globalDemShiftM`), CTX photos
  by mean and spread (`brightness`). Mars curvature: R·(1 − cos(d/R)), R = 3,396,190 m (the DEM's sphere).
- **Horizon texture** (2048 azimuths × 1024 log distances), in the HiRISE photo's units: the HiRISE and CTX photos
  themselves; beyond them, relief shading computed on the global DEM with the photo's sun (cast shadows included),
  matched in mean and spread to the CTX photos. Contrast: the terrain's near the site, the region's 1–99% from 4 km
  on, with a soft roll-off (game). The game lights the ring as level ground, so the shading comes from the texture.
- **Skyline check** (`horizon.highestDeg` in the manifest, `derived`): Gale 12.3° at azimuth 135°, the north flank
  of Mount Sharp; Jezero 4.9° at azimuth 263°, the west rim of the crater. Do not show them to players as facts
  without checking.

## Stored format

- **Crops, not whole products:** each file is the window of the source the build samples, at the resolution it
  uses: HiRISE DTM ~1 m (4 m at the scarp), HiRISE photo 0.5 m (2 m at the scarp), HiRISE overviews 16 m / 8 m for
  the near horizon, CTX DTM ~80 m and photo ~40 m within 45 km, global DEM 200 m within 100 km. About 14 MB in all,
  every file under 4 MB.
- **PNG, 8- or 16-bit gray:** value = offset + scale × (u − 1), u = 0 is nodata; `offset`, `scale` and where the
  window sits in the source raster (`georeference`) are in each `sources.json`. Photos are 8-bit (CTX images are
  8-bit at the camera; the HiRISE photos span fewer than 256 levels in these crops); heights are 16-bit meters,
  with steps of at most 0.5 m for CTX (its vertical precision is several meters), 5 cm for the HiRISE overview and
  finer for the HiRISE crop; the global DEM keeps its whole meters.
- **Also stored:** the STAC item of every DTM (`stac_*.json`: projection, assets, provenance), the PDS label of
  each photo (`*_RED.LBL`), and `overview.png`, the whole HiRISE DTM shaded with the site square in red.
- `hirise_ortho.png` is the HiRISE photo of the walkable crop and opens in any image viewer.

## Caveats

- ⚠ **Sun angles in the STAC catalog are wrong.** In `mro_hirise_uncontrolled_observations`, `view:sun_elevation`
  holds the label's `LOCAL_TIME`, and `view:sun_azimuth` is the label's `SUB_SOLAR_AZIMUTH`, measured clockwise
  from the image's 3 o'clock direction, not from north. The build reads the PDS label instead:
  elevation = 90° − `INCIDENCE_ANGLE`; azimuth from north = `SUB_SOLAR_AZIMUTH` − `NORTH_AZIMUTH`. Checked for
  `ESP_036506_2640` against the solar position formula for 83.9°N, Ls 128.8° and 14.42 h local time: 24.2°,
  against 24.25° from the label.
- **n/f Vertical datum:** not confirmed here. HiRISE DTMs are usually referenced to the Mars areoid; check the PDS
  DTM label before quoting absolute elevations to players. The relief (max − min) of a site does not depend on it.
- **CTX heights:** two of the Gale CTX DTMs sit ~120 m above the HiRISE DTM (the third, ~3 m); the build shifts
  each onto HiRISE. **CTX photos** were taken on other days than the HiRISE photo (except Jezero's first strip),
  so their shadows differ a little. At Jezero the second strip's photo correlates weakly with HiRISE near the site
  (0.38), so its brightness match is less certain.
- **Texture colors:** the photos are single-band (red) images tinted by game colors (`tint`); not true color.
