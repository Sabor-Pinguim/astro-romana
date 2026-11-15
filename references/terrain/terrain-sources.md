# Mars terrain sites: data sources

Real-data terrains built by `tools/terrain/` (see AGENTS.md §14). Measured values
(elevations, relief, sun position) live in `godot/assets/terrain/manifest.json`, which
the build writes from the source files listed there (URL + ETag of the exact version).

## Products

| Product | Role | Source | License |
|---|---|---|---|
| HiRISE stereo DTM (~1 m/post) | Heights | USGS Astrogeology STAC, collection `mro_hirise_socet_dtms` (COG on AWS `astrogeo-ard`) | CC0-1.0 |
| HiRISE orthoimage `*_RED_A_01_ORTHO` (0.25 m/pixel) or `*_RED_C_01_ORTHO` (1 m/pixel) | Texture (grayscale) | Same STAC item as the DTM | CC0-1.0 |
| HiRISE RDR PDS label `<obs>_RED.LBL` | Sun position of the photo | https://hirise-pds.lpl.arizona.edu/PDS/RDR/ | NASA/UA public data |

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
- **Texture:** a 1–99 percentile stretch of a single-band (red) image, tinted by a game
  color (`tint`). It shows real brightness and baked shadows, not true color.
