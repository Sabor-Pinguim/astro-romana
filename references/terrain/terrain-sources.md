# Mars terrain sites: data sources

Real-data terrains built by `tools/terrain/` (see AGENTS.md §14). Measured values
(elevations, relief, sun position) live in `assets/terrain/manifest.json`, which
the build writes from the source files listed there (URL + ETag of the exact version).

## Products

| Product | Role | Source | License |
|---|---|---|---|
| HiRISE stereo DTM (~1 m/post) | Heights | USGS Astrogeology STAC, collection `mro_hirise_socet_dtms` (COG on AWS `astrogeo-ard`) | CC0-1.0 |
| HiRISE orthoimage `*_RED_A_01_ORTHO` (0.25 m/pixel) or `*_RED_C_01_ORTHO` (1 m/pixel) | Texture (grayscale) | Same STAC item as the DTM | CC0-1.0 |
| HiRISE RDR PDS label `<obs>_RED.LBL` | Sun position of the photo | https://hirise-pds.lpl.arizona.edu/PDS/RDR/ | NASA/UA public data |
| MRO CTX stereo DTM (~20 m/post) and its orthoimage (~6 m/pixel), USGS ASP pipeline | Heights and texture of the horizon ring, ~1.8 to ~45 km | USGS Astrogeology STAC, collection `mro_ctx_controlled_usgs_dtms` (COG); items listed in `sites.mjs` (`ctx`) and in the manifest (`horizon.source.middle`) | CC0-1.0 |
| **Mars MGS MOLA - MEX HRSC Blended DEM Global 200m v2** (one 11 GB GeoTIFF, int16, simple cylindrical, sphere 3,396,190 m) | Heights of the horizon ring beyond ~1.8 km | [USGS Astrogeology](https://astrogeology.usgs.gov/search/map/mars_mgs_mola_mex_hrsc_blended_dem_global_200m); file read from `asc-pds-services` on AWS (the `planetarymaps.usgs.gov` link redirects there). Cite: Fergason, R.L., Hare, T.M., Laura, J. (2018). *HRSC and MOLA Blended Digital Elevation Model at 200m v2*. Astrogeology PDS Annex, U.S. Geological Survey. | MOLA data CC0; HRSC data CC BY-SA 3.0 IGO (attribution required) |

- STAC API: https://stac.astrogeology.usgs.gov/api
- Docs: https://stac.astrogeology.usgs.gov/docs/data/mars/hirise_dtms/

## Sites

| id | DTM item | Orthoimage | Center | USGS rationale |
|---|---|---|---|---|
| `jezero` | `DTEEC_045994_1985_046060_1985_U01` | `ESP_045994_1985_RED_A_01_ORTHO` | 18.4447°N, 77.4508°E | "Candidate landing site for 2020 mission in Jezero Crater" |
| `gale` | `DTEEC_010573_1755_010639_1755_U01` | `PSP_010573_1755_RED_A_01_ORTHO` | 4.5895°S, 137.4417°E | "Possible MSL landing site in Gale Crater" |
| `north_polar_scarp` | `DTEPC_036506_2640_036546_2640_A01` | `ESP_036506_2640_RED_C_01_ORTHO` | 83.87°N, 235.129°E (−124.871°) | "Steepest north polar scarp" |

- **Jezero:** the center is the Perseverance landing site, Octavia E. Butler Landing,
  given as 18°26′N 77°27′E (≈18.44°N 77.45°E) by
  [Wikipedia](https://en.wikipedia.org/wiki/Octavia_E._Butler_Landing). See also
  [JPL PIA24483](https://www.jpl.nasa.gov/images/pia24483-welcome-to-octavia-e-butler-landing/).
  The extra decimals only place the crop; do not show them to players as a fact.
- **Gale:** the center is the Curiosity landing site, Bradbury Landing, given as
  4°35′22″S 137°26′30″E (≈4.5895°S 137.4417°E) by
  [Wikipedia](https://en.wikipedia.org/wiki/Bradbury_Landing).
- **Landing sites (`jezero`, `gale`):** 512 × 512 m crops (game choice), a walkable area
  around the landing point; 2 m between mesh vertices, 0.5 m texture pixels.
- **North polar scarp:** the center is on the scarp face, chosen from the DTM itself.
  The plateau is to the east and the dune-covered base is to the west.

## Horizon ring

- **What:** the land around each landing site out to 100 km (`horizonKm`, game choice), so the real skyline shows:
  Mount Sharp (Aeolis Mons) and the north rim at Gale, the crater rim and the delta at Jezero.
- **Near the site** (up to ~1.8 km): the site's own HiRISE DTM and orthoimage (16 m and 4 m overviews).
  **Middle** (up to ~45 km): three CTX DTMs and orthoimages per site, chosen to cover the most of 2–45 km
  around the site among the ones that cover the site itself (Gale 76/82/87%, Jezero 77/84/89%). Jezero's
  first one (`J03_045994…J03_046060`) was taken on the same orbits as the HiRISE pair. **Far:** the HRSC–MOLA blend.
  Every value is averaged over the footprint of its vertex or texel.
- **Matching near the site** (0.3–1.8 km): CTX and blend heights are shifted by the median difference to the
  HiRISE DTM (`heightShiftM`, `globalDemShiftM`; two of the Gale CTX DTMs sit ~120 m off). Each CTX photo is
  mapped to the HiRISE photo by mean and spread (`brightness`, correlation 0.84–0.85 at Gale).
- **Datum:** the blend is shifted by the median difference to the DTM between 0.3 and 1.8 km
  (`horizon.globalDemShiftM`: +0.6 m at Jezero, −8.9 m at Gale).
- **Curvature:** each ring drops by R·(1 − cos(d/R)) with R = 3,396,190 m, the sphere of the DEM's GeoTIFF keys
  (about 1.5 km at 100 km). From 1.7 m eye height the flat horizon is only ~3.4 km away, so only high ground shows beyond.
- **Skyline check** (`horizon.highestDeg`): Gale 11.9° at azimuth 135°, the north flank of Mount Sharp
  (+4.0 km at 19 km); Jezero 4.4° at azimuth 261°, the west rim (+0.7 km at ~10 km). Values are `derived` from the DEMs;
  do not show them to players as facts without checking.
- **Texture:** a polar image (2048 azimuths × 1024 log distances) in the photo's units: the HiRISE and CTX photos
  themselves, and beyond them the site's mean brightness × (k + direct light) / (k + direct light on level ground),
  the direct light computed on the 200 m DEM with the photo's sun and cast shadows (k: the site's ambient/direct
  ratio). That far part is matched in mean and spread to the CTX photos where they fully cover the ground.
  Stretch: the terrain's near the site, the region's 1–99% from 4 km on, with a soft roll-off (game).
  The game lights the ring as level ground, so the shading comes only from the texture.

## Caveats

- ⚠ **Sun angles in the STAC catalog are wrong.** In `mro_hirise_uncontrolled_observations`,
  `view:sun_elevation` holds the label's `LOCAL_TIME`, and `view:sun_azimuth` is the label's
  `SUB_SOLAR_AZIMUTH`, which is measured clockwise from the image's 3 o'clock direction,
  not from north. The build reads the PDS label instead and computes:
  - elevation = 90° − `INCIDENCE_ANGLE`;
  - azimuth from north = `SUB_SOLAR_AZIMUTH` − `NORTH_AZIMUTH`.

  Checked for `ESP_036506_2640` against the solar position formula for 83.9°N,
  Ls 128.8° and 14.42 h local time: 24.2°, against 24.25° from the label.
- **n/f Vertical datum:** this file does not confirm it. HiRISE DTMs are usually
  referenced to the Mars areoid; check the PDS DTM label before quoting absolute
  elevations to players. The relief (max − min) of a site does not depend on the datum.
- **Texture:** a single-band (red) image, tinted by a game color (`tint`); not true color.
  Before the 1–99 percentile stretch, the build divides it by `k + direct light` computed from the DTM with the
  photo's sun (normals and cast shadows; `k`, the ambient/direct ratio, is fitted on the photo itself, minimum 0.25).
  This removes the shading the mesh will get from the game light; shading of details finer than the DTM stays.
  `deshading.photoVsRelief` / `textureVsRelief` in the manifest record the correlation before and after
  (Gale 0.66 → −0.01, Jezero 0.23 → 0.03). Stored as JPEG (quality 90) to fit the 5 MB GLB limit.
