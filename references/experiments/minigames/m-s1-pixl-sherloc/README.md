---
id: m-s1-pixl-sherloc
experiment: M-S1
name: Biosignature hunter
owner: maya
minigame: '"Leopard spots" (pattern search)'
real_basis: ["PIXL X-ray fluorescence spectrometer (Mars 2020 Perseverance)", "SHERLOC deep-UV Raman/fluorescence spectrometer with the WATSON camera (Mars 2020 Perseverance)", "Rock 'Cheyava Falls' / core 'Sapphire Canyon', Bright Angel formation, Jezero crater (2024–25)"]
catalog_refs: [BI1, GE3, B14]
models: [arm-turret, cheyava-falls-rock]
status: operating (checked 2026-11)
---

# M-S1 · Biosignature hunter

PIXL and SHERLOC sit on the turret at the end of Perseverance's robotic arm. In July 2024 they studied "Cheyava Falls", a reddish mudstone with white calcium-sulfate veins and millimetre "leopard spots" (pale cores, dark rims). In September 2025 NASA called these spots a **potential biosignature**: a feature that might have a biological origin but needs more data before any conclusion [2][3]. In the minigame the rock surface is a grid. Maya scans cells with PIXL (slow, precise) or SHERLOC (fast, power-hungry), reads the colour clues and must find the hidden spots before the instrument time runs out. The models are the arm turret (both instruments, at real size) and the rock (real size, with exaggerated spots).

## 1. Real data

- **Source** column: `[n]` points to section 9; `derived` = calculated from other rows (formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass` | PIXL 6.9; SHERLOC 4.72 ⚠ | kg | [4] [5] | PIXL: sensor head 4.3 + body electronics 2.6 + cal. target 0.015 = 6.9 (derived). SHERLOC: NASA page 3.11 (turret) + 1.61 (body) = 4.72; Bhartia et al. give 6.83 (turret assembly) + 2.90 (body) = 9.73 ⚠ |
| `power_electric` | PIXL ~25; SHERLOC 48.8 | W | [4] | SHERLOC = 32.2 (turret) + 16.6 (body) |
| `size` | PIXL head 0.215 × 0.27 × 0.23; SHERLOC turret unit 0.352 × 0.176 × 0.276 ⚠ | m | [4] [5] | NASA page gives SHERLOC 0.260 × 0.200 × 0.067 ⚠; we use the paper's envelope (excludes connectors) |
| `operating_time` | PIXL ~36,000 (≈10 h); SHERLOC < 600 per map | s | [7] [5] | PIXL 5 × 7 mm map, 2,337 points, ~10 h, run overnight (10–14 h by size [7]; "eight or nine hours" in 2020 [9] ⚠). SHERLOC 7 × 7 mm map in < 10 min; a nominal operation is ~60 min [5] |
| `data_volume` | PIXL ~16; SHERLOC 79.7 (raw) | Mbit | [4] | per experiment |
| `first_use_on_mars` | 2021 | year | [4] [16] | first PIXL chemical maps released Jul 2021 (PIA24762) |
| `uses_on_mars` | n/f | count | | 9 abrasion patches with proximity science by sol 554 [13]; Sapphire Canyon was one of 27 rock cores by Sep 2025 [2] |
| `pixl_xray_spot` | 120 | µm | [7] [8] | FWHM at 8 keV; larger at low energy (Na ~230 µm). Analyst's Notebook says ~150 µm ⚠ [14] |
| `pixl_dwell_per_point` | 10 | s | [7] [8] | optional long dwells of 30 s |
| `pixl_step` | 0.120–0.125 | mm | [7] [8] | distance between points |
| `pixl_standoff` | 25.5 | mm | [7] [13] | placed "as little as 2.5 cm" from the rock, slowly, by its own camera [16 PIA26204] |
| `pixl_xray_tube` | 28 | kV | [14] | |
| `pixl_leds` | 4 colours × 6 LEDs (735, 530, 450, 385 nm) | — | [14] | the ring around the X-ray opening (front-1.jpg) |
| `pixl_hexapod_step` | ~100 | µm | [9] | six-legged mount; moves the head for the raster and corrects arm drift [13]. Travel range n/f |
| `arm_thermal_drift` | up to 13 | mm | [9] | why PIXL scans at night |
| `sherloc_laser_wavelength` | 248.6 | nm | [5] [3] | deep UV, NeCu laser, 40 µs pulses |
| `sherloc_pulse_rate` | 80 (10–160) | Hz | [5] | typical; range in brackets |
| `sherloc_laser_spot` | ~100 | µm | [4] [5] | |
| `sherloc_working_distance` | ~48 | mm | [5] [13] | blog: 4.8 cm |
| `sherloc_map_field` | 7 × 7 | mm | [4] [5] | survey: 200 µm steps, 10 pulses/point; detail: 1 × 1 mm, 100 µm steps, 300 pulses/point [5] |
| `sherloc_scan_half_angle` | ~4.2 | ° | derived | atan(3.5 mm / 48 mm), beam deflection; the mirror turns half of it |
| `watson_resolution` | 15.9 (best) | µm/px | [4] | Cheyava Falls WATSON image: 21.0 µm/px at 3.91 cm [3] |
| `turret_mass` | 45 ⚠ | kg | [11] | Moeller et al. 2021 give 40.1 kg (seen only in a search excerpt) [12] |
| `arm_length` | 2.1 | m | [10] | five joints [10] |
| `core_hole_diameter` | 27 | mm | [10] | core 13 mm × 60 mm [11] |
| `abrasion_patch` | ~50 × 5–10 deep | mm | [3] | diameter × depth |
| `rock_size` | 1.0 × 0.6 | m | [1] [2] | "arrowhead-shaped"; height n/f |
| `spot_diameter` | 0.2–1 | mm | [3] | "circular to crenulated dark-toned rims and lighter-toned cores"; JPL 2024: "millimeter-size", "dozens" [1] |
| `poppy_seed_diameter` | 0.1–0.2 | mm | [3] | black to dark blue/green Fe-phosphate nodules |
| `vein_thickness` | ~10 | mm | [3] | light-toned Ca-sulfate layer at the Cheyava Falls target; olivine grain 0.5–1 mm inside it |
| `g_band` | ~1,600 | cm⁻¹ | [3] | SHERLOC Raman signal of organic carbon in Cheyava Falls |

## 2. Minigame

- **Goal:** find the hidden leopard spots on the rock grid with PIXL and SHERLOC scans before the night's instrument time or the energy runs out.
- **Mechanic:** pattern search
- **Loop:**
  1. `turret_approach` plays; a nitrogen puff (gDRT) clears dust (`FX_DustPuff`).
  2. The rock band shows an 8 × 6 grid. Maya picks a cell and a tool:
     - **PIXL** (one cell, `pixl_raster_loop`): shows the element colour of that cell. Spot cell = purple ring with a yellow-green centre (the spot is revealed: found). Next to a spot = faint purple. Poppy-seed cell = purple dots (decoy). Plain mudstone = tan.
     - **SHERLOC** (a 3 × 3 block, `sherloc_scan_loop`): shows an organic glow per cell. Strong on spot cells, weak next to them, none elsewhere.
  3. Each scan subtracts time and energy (bars on screen).
  4. When the time or the energy reaches zero, or the player stops, `turret_retract` plays.
- **Success / failure:** success = at least 3 of the 5 spots found with PIXL **and** at least one found spot also scanned by SHERLOC. That gives "possible biosignature", the highest science score, but it only counts if the sample is stored (M-S4). Failure: the rock stays unanalysed. Cost: robotic arm busy; PIXL 6.9 kg / 25 W + SHERLOC 4.72 kg / 48.8 W.
- **Fact card:** "In September 2025 NASA said the 'leopard spots' on the Cheyava Falls rock are a 'potential biosignature': they might have a biological origin, but more data are needed before any conclusion. Confirming it needs the sample on Earth, and in January 2026 the Mars Sample Return plan was cancelled." [2] [15]

The colours follow NASA's mineral map (PIA26640): vivianite (Fe-phosphate, in rims and poppy seeds) purple/pink; greigite (Fe-sulfide, in spot interiors) dull yellow/green [16]. Organics tied to spots is a game simplification: the real G band was found in the mudstone of Cheyava Falls and its neighbours, not only in the spots [3].

Numbers that drive the minigame:

| Parameter | Value | Unit | Real or `game-balance` | From (section 1 key or source) |
|---|---|---|---|---|
| Grid | 8 × 6 = 48 | cells | game-balance | |
| Cell size on the model | 0.035 | m | game-balance | real map cells are ~0.1 mm |
| Spot slots on the model / active per game | 10 / 5 | count | game-balance | real: "dozens" [1] |
| PIXL time per cell | 12.5 | min | derived | `operating_time` 10 h / 48 cells |
| PIXL energy per cell | 5.2 | Wh | derived | 25 W × 12.5 min |
| SHERLOC time per 3 × 3 block | 10 | min | real (upper bound) | `operating_time` < 10 min per map |
| SHERLOC energy per block | 8.1 | Wh | derived | 48.8 W × 10 min |
| Instrument time budget | 300 | min | game-balance | 24 PIXL cells at most |
| Energy budget | 120 | Wh | game-balance | |
| Success threshold | 3 of 5 spots + 1 SHERLOC hit on a found spot | — | game-balance | PIXL minerals + SHERLOC organics, as in [3] |

## 3. Models

| Model id | What it is | Shown where | Budget (triangles / meshes) |
|---|---|---|---|
| `arm-turret` | End of Perseverance's arm: turret with PIXL (on its hexapod), SHERLOC/WATSON, corer, gas dust tool, contact sensor, arm stub | minigame scene above the rock | ≤ 1,500 / ≤ 20 |
| `cheyava-falls-rock` | The 1.0 × 0.6 m rock with veins, the hematite band and 10 spot slots on the grid | minigame scene; can also sit in the Jezero terrain | ≤ 1,200 / ≤ 30 |

## 4. Low-poly models

Instructions for whoever (person or AI) generates the models. Same conventions as the avatars and rocket parts ([AGENTS.md](../../../../AGENTS.md) §5, [parts.md](../../../parts/parts.md#3d-model-conventions)):

- **Units and axes:** metres at real size (1:1); +Y up; the front faces +Z; the origin is stated per model.
- **Style:** non-indexed geometry with one normal per face (flat shading); no textures; cylinders with 5 to 10 sides.
- **Materials:** only from `tools/modeling/lib/palette.mjs`; new ones in "New materials".
- **Moving parts:** children of an empty pivot node placed at the joint; meshes are named `<Node>_<Material>`. No negative scale.
- **Symbols:** no real logos, flags or insignia; no red cross.

Primitives below use the helpers in `tools/modeling/lib/shapes.mjs` (`box(w,h,d)`, `cyl(rTop,rBottom,h,seg)`, `ball(r,w,h)`, `lathe(profile,seg)`). A cylinder's axis is local Y before rotation.

### 4.1 arm-turret

#### Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| PIXL head + hexapod | 0.215 (along boresight) × 0.27 × 0.23 | [4] | which side is which: est. from front-1.jpg |
| SHERLOC turret unit | 0.176 (along boresight) × 0.276 × 0.352 | [5] | orientation est. from PIA23621 |
| PIXL standoff (face to rock) | 0.0255 | [7] | |
| SHERLOC standoff (window to rock) | 0.048 | [5] | |
| Turret axis height above the rock in the scan pose | 0.3605 | derived | PIXL face at 0.335 from the axis (est.) + 0.0255 |
| SHERLOC window distance from the axis | 0.3125 | derived | 0.3605 − 0.048, so both tools work from the same arm position |
| Corer bit diameter | 0.027 | [10] | hole diameter |
| Whole model (X × Y × Z) | ≈ 0.43 × 1.18 × 0.83 | est. | turret layout and sizes not published; from photos |

#### Shape in words

A dark grey turret hangs from a white forearm tube (three-quarter-1.jpg). The forearm comes down into a large dark drum: the turret joint, with its axis horizontal (model X). Around that axis, like a revolver, sit the tools: under the turret the white rounded box of **PIXL** on six thin legs (the hexapod), its face showing a round opening with a ring of LEDs (front-1.jpg); at the front (+Z) the white box of **SHERLOC** with two gold lens housings (ACI and the WATSON camera, which sticks out further); at the back (−Z) the long grey **corer** with a short steel bit. A small tank and nozzle (gas dust removal tool, gDRT) and a short contact probe (FCS) sit on the side and top. Keep: the drum, the PIXL box on legs with its LED ring, the white SHERLOC box with the proud WATSON lens, the long corer. The real angles between tools are not published; this layout (PIXL down, SHERLOC +90°, corer −90°) is ours.

#### Node hierarchy

```text
ArmTurret                    origin: turret rotation axis, centre of the turret (scan pose)
└─ Arm                       pivot (0, 0, 0); moves the whole arm end (approach/retract)
   ├─ Arm_HullBlack, Arm_Hull, Arm_FoilGold
   └─ Turret                 pivot (0, 0, 0); turret joint, rotates about X
      │                      X = 0°: PIXL faces −Y; X = +90°: SHERLOC faces −Y; X = −90°: corer faces −Y
      ├─ Turret_HullBlack, Turret_Titanium, Turret_Steel, Turret_Aluminum,
      │  Turret_Hull, Turret_FoilGold, Turret_Visor, Turret_Lamp
      ├─ PixlHexapod         pivot (0, −0.185, 0) (top of PIXL head); hexapod raster/tilt
      │  ├─ PixlHexapod_Aluminum, PixlHexapod_Hull, PixlHexapod_Lamp, PixlHexapod_Visor
      │  └─ FX_XRay          (0, −0.152, 0.04), rotation [180, 0, 0]; preset xray_spot
      └─ SherlocScanner      pivot (−0.07, 0, 0.2925) (scan mirror, inside SHERLOC); no mesh
         └─ FX_UVLaser       (0, 0, 0.02), rotation [90, 0, 0]; preset uv_spot
```

#### Parts

Positions are relative to the node in column 2.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Arm | cyl (turret joint drum) | r 0.12, h 0.10 | (−0.19, 0, 0) | (0, 0, 90) | HullBlack | 10 |
| 2 | Arm | box (wrist) | 0.10 × 0.14 × 0.12 | (−0.19, 0.17, 0) | (0, 0, 0) | HullBlack | — |
| 3 | Arm | cyl (forearm stub) | r 0.05, h 0.60 | (−0.19, 0.54, 0) | (0, 0, 0) | Hull | 8 |
| 4 | Arm | cyl (forearm tape band) | r 0.053, h 0.06 | (−0.19, 0.36, 0) | (0, 0, 0) | FoilGold | 8 |
| 5 | Turret | box (core / feed structure) | 0.24 × 0.24 × 0.24 | (0, 0, 0) | (0, 0, 0) | HullBlack | — |
| 6 | Turret | cyl (joint shaft) | r 0.06, h 0.03 | (−0.135, 0, 0) | (0, 0, 90) | Titanium | 10 |
| 7 | Turret | box (PIXL mount plate) | 0.22 × 0.015 × 0.20 | (0, −0.1275, 0) | (0, 0, 0) | Aluminum | — |
| 8 | Turret | box (SHERLOC turret unit) | 0.276 × 0.352 × 0.176 | (0, 0, 0.2045) | (0, 0, 0) | Hull | — |
| 9 | Turret | cyl (ACI lens housing) | r 0.032, h 0.02 | (−0.07, 0, 0.3025) | (90, 0, 0) | FoilGold | 10 |
| 10 | Turret | cyl (ACI window) | r 0.02, h 0.003 | (−0.07, 0, 0.3135) | (90, 0, 0) | Visor | 10 |
| 11 | Turret | cyl (WATSON housing, proud) | r 0.025, h 0.035 | (0.08, 0.10, 0.31) | (90, 0, 0) | FoilGold | 10 |
| 12 | Turret | cyl (WATSON lens) | r 0.015, h 0.003 | (0.08, 0.10, 0.3285) | (90, 0, 0) | Visor | 8 |
| 13 | Turret | 2 × box (ACI white/UV LEDs) | 0.012 × 0.012 × 0.004 | (−0.12, 0, 0.294), (−0.02, 0, 0.294) | (0, 0, 0) | Lamp | — |
| 14 | Turret | cyl (corer housing) | r 0.07, h 0.30 | (0, 0, −0.25) | (90, 0, 0) | Titanium | 10 |
| 15 | Turret | cyl (bit chuck) | r 0.045, h 0.04 | (0, 0, −0.42) | (90, 0, 0) | HullBlack | 8 |
| 16 | Turret | cyl (coring bit) | r 0.0135, h 0.06 | (0, 0, −0.47) | (90, 0, 0) | Steel | 8 |
| 17 | Turret | ball (gDRT nitrogen tank) | r 0.035 | (0.155, 0.05, −0.05) | (0, 0, 0) | Titanium | 8 × 6 |
| 18 | Turret | cyl (gDRT nozzle) | r 0.006, h 0.07 | (0.155, −0.02, −0.05) | (0, 0, 0) | Steel | 6 |
| 19 | Turret | box (contact sensor body) | 0.05 × 0.08 × 0.05 | (0, 0.16, −0.06) | (0, 0, 0) | HullBlack | — |
| 20 | Turret | cyl (contact probe) | r 0.008, h 0.04 | (0, 0.22, −0.06) | (0, 0, 0) | Steel | 6 |
| 21 | PixlHexapod | box (PIXL head) | 0.27 × 0.15 × 0.23 | (0, −0.075, 0) | (0, 0, 0) | Hull | — |
| 22 | PixlHexapod | cyl (LED ring) | r 0.034, h 0.004 | (0, −0.152, 0.04) | (0, 0, 0) | Lamp | 10 |
| 23 | PixlHexapod | cyl (X-ray opening) | r 0.02, h 0.005 | (0, −0.1535, 0.04) | (0, 0, 0) | Visor | 10 |
| 24 | PixlHexapod | cyl (upper round window) | r 0.018, h 0.004 | (0, −0.152, −0.06) | (0, 0, 0) | Visor | 8 |
| 25–30 | PixlHexapod | 6 × cyl (hexapod legs) | r 0.008, h 0.053 | (0.065, 0.025, 0.0375), (0, 0.025, 0.075), (−0.065, 0.025, 0.0375), (−0.065, 0.025, −0.0375), (0, 0.025, −0.075), (0.065, 0.025, −0.0375) | (0, −120, 20), (0, 180, −20), (0, 120, 20), (0, 60, −20), (0, 0, 20), (0, −60, −20) | Aluminum | 5 |

The legs lean 20° sideways in alternating directions so neighbouring legs form a V (a Stewart platform). They are children of `PixlHexapod`, so they move with the head; the mount plate (part 7) hides their upper ends.

#### Simplify

- No cables, connectors, thermal blankets, bolts or stabiliser details. The real corer's bit carousel and abrading bit are left off.
- Keep the LED ring and the proud WATSON lens: they make the two instruments readable.
- `SherlocScanner` has no mesh (the mirror is inside the box); it only carries the FX anchor.

#### New materials

None. `Lamp` is the LEDs; the beams are particles (section 6).

#### Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 1,500 (est. ~850) |
| Meshes | ≤ 20 (15 by the hierarchy above) |
| Main dimensions | PIXL face 0.335 below the axis; SHERLOC window 0.3125 from the axis; PIXL head 0.27 × 0.23 (±2%) |

### 4.2 cheyava-falls-rock

#### Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Length × width | 1.00 × 0.60 | [1] [2] | "arrowhead-shaped" |
| Height above ground | 0.20 | est. | not published; from top-1.jpg and the selfie PIA26344 |
| Buried depth | 0.03 | game-balance | so it sits in the sand |
| Main veins | 2 × (0.66 × 0.012 × 0.020) | est. | real veins "run the length of the rock" [1]; one layer ~0.01 thick [3] |
| Hematite band (between the veins) | 0.62 × 0.23 | est. | from detail-1.jpg |
| Spot rim / core diameter | 0.022–0.030 / 0.015–0.021 | game-balance | ×~25 the real 0.2–1 mm [3] |
| Poppy seed diameter | 0.006 | game-balance | real 0.1–0.2 mm [3] |
| Grid | 8 × 6 cells of 0.035 = 0.28 × 0.21 | game-balance | |

#### Shape in words

A low, flat-topped slab with sloping faceted sides, pointed at one end like an arrowhead (+X), light reddish tan (top-1.jpg, left block). Two raised white calcium-sulfate veins run along its length. Between them lies a slightly redder band (hematite) where the leopard spots are: small pale discs with a dark rim, plus a few tiny black dots (poppy seeds) (detail-1.jpg). No drill hole or abrasion patch: the minigame happens before coring.

#### Node hierarchy

```text
CheyavaFallsRock             origin: ground (y = 0), centre of the footprint; tip toward +X
├─ CheyavaFallsRock_Rock, _RockDark, _Vein
├─ Grid                      (−0.20, 0.204, −0.105): outer corner of cell A1, on the band surface
│  │                         columns A→H along +X, rows 1→6 along +Z, cell 0.035 m
│  ├─ Grid_SpotRim           poppy seeds (always visible)
│  └─ Spot_B1 … Spot_H6      10 slots; meshes Spot_<cell>_SpotRim, Spot_<cell>_SpotCore
└─ FX_DustPuff               (−0.06, 0.205, 0); emits +Y; preset dust
```

Spot slots start hidden; the game shows the 5 active ones when PIXL finds them. Cell (c, r) centre in `Grid` = ((c + 0.5)·0.035, 0, (r + 0.5)·0.035). To vary the layout, the game may also turn the rock 180° about Y and remap the cells.

#### Parts

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | root | lathe (body, pentagonal frustum), then scale geometry (1, 1, 0.57) | profile (0.553, −0.03) (0.49, 0.20) (0, 0.20) | (−0.053, 0, 0) | (0, 90, 0) | Rock | 5 |
| 2 | root | box (hematite band) | 0.62 × 0.004 × 0.23 | (−0.09, 0.202, 0) | (0, 0, 0) | RockDark | — |
| 3 | root | box (vein, north) | 0.66 × 0.012 × 0.020 | (−0.09, 0.206, 0.125) | (0, 0, 0) | Vein | — |
| 4 | root | box (vein, south) | 0.66 × 0.012 × 0.020 | (−0.09, 0.206, −0.125) | (0, 0, 0) | Vein | — |
| 5 | root | box (short diagonal vein near the tip) | 0.16 × 0.008 × 0.012 | (0.30, 0.204, 0.02) | (0, 35, 0) | Vein | — |
| 6 | Grid | 12 × cyl (poppy seeds) | r 0.003, h 0.002 | (0.095, 0, 0.045), (0.185, 0, 0.050), (0.030, 0, 0.130), (0.150, 0, 0.125), (0.205, 0, 0.115), (0.270, 0, 0.130), (0.120, 0, 0.190), (0.230, 0, 0.170), (0.060, 0, 0.115), (0.125, 0, 0.030), (0.215, 0, 0.020), (0.270, 0, 0.060) | (0, 0, 0) | SpotRim | 5 |
| 7 | Spot_<cell> | cyl (rim, inset) | r = rim, h 0.002 | (0, −0.0005, 0) | (0, yaw, 0) | SpotRim | 7 |
| 8 | Spot_<cell> | cyl (core) | r = core, h 0.002 | (0, 0, 0) | (0, yaw, 0) | SpotCore | 7 |

Spot slots (position of the `Spot_<cell>` node in `Grid`; sizes S = rim 0.011 / core 0.0075, M = 0.013 / 0.009, L = 0.015 / 0.0105):

| Slot | Position (m) | Size | Yaw (°) |
|---|---|---|---|
| Spot_B1 | (0.0565, 0, 0.0145) | M | 0 |
| Spot_E1 | (0.1525, 0, 0.0215) | S | 17 |
| Spot_H1 | (0.2595, 0, 0.0195) | L | 34 |
| Spot_A3 | (0.0225, 0, 0.0835) | S | 8 |
| Spot_D3 | (0.1225, 0, 0.0925) | L | 25 |
| Spot_G3 | (0.2315, 0, 0.0875) | M | 42 |
| Spot_C5 | (0.0835, 0, 0.1605) | M | 12 |
| Spot_F5 | (0.1955, 0, 0.1535) | S | 30 |
| Spot_A6 | (0.0195, 0, 0.1895) | L | 47 |
| Spot_H6 | (0.2585, 0, 0.1935) | M | 21 |

No two slots touch (not even diagonally), so the "next to a spot" clue points to one slot only.

#### Simplify

- Real spots are 0.2–1 mm and "dozens"; the model shows 10 slots, ~25× larger.
- Leave off the olivine crystals in the veins (mm-size, [1]) and the real drill hole and abrasion patch.
- Optional: a slight random vertex jitter (≤ 0.01 m) on the body top edges for a rougher look, keeping the top face flat under the grid.

#### New materials

| Name | Hex | Why |
|---|---|---|
| `Rock` | `#B88466` | Bright Angel mudstone, light reddish tan (top-1.jpg) |
| `RockDark` | `#9C5E45` | redder band "whose reddish color suggests hematite" [16 PIA26368] |
| `Vein` | `#E4DFD2` | white calcium-sulfate veins [1] |
| `SpotRim` | `#2B3135` | "black material" rims [1]; poppy seeds are black to dark blue/green [3] |
| `SpotCore` | `#D9CDB8` | "off-white" cores, less red than the mudstone [1] [3] |

Roughness 0.95, metalness 0 for all five. Colours are stylized from the images (`game-balance`).

#### Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 1,200 (est. ~600) |
| Meshes | ≤ 30 (3 + 1 + 20 + 0 = 24) |
| Main dimensions | 1.00 × 0.60 footprint, top at y = 0.20 (±2%); grid 0.28 × 0.21 inside the band |

## 5. Animations

| Clip | Model | Duration (s) | Loop | What it shows | Used when (minigame state) |
|---|---|---|---|---|---|
| `turret_approach` | arm-turret | 4.0 | no | arm swings in, turret turns from corer-down to PIXL-down, slow final descent | start |
| `pixl_raster_loop` | arm-turret | 4.0 | yes | hexapod moves the PIXL head back and forth across one cell | PIXL scan of a cell |
| `sherloc_scan_loop` | arm-turret | 2.5 | yes | turret at +90° (SHERLOC down); scan mirror sweeps the laser over the cell | SHERLOC scan of a block |
| `turret_retract` | arm-turret | 3.0 | no | arm lifts and turns back to corer-down (hand-off to the drill, L-S2) | end |

The game moves the `Arm` node over the chosen cell (as the real arm "nudges" in ~3 mm steps [5]) and cross-fades clips over ~1 s when switching tools. Durations and sweep sizes are `game-balance`: a real PIXL map takes ~10 h, a SHERLOC map < 10 min (section 1). The real field is only ±4.2° and a few mm.

```text
turret_approach (4.0 s)                   ease-out on the last key
u=0.00  Arm: p [0, 0.45, -0.30]   Turret: r [-90, 0, 0]
u=0.40  Arm: p [0, 0.20, -0.05]   Turret: r [-45, 0, 0]
u=0.75  Arm: p [0, 0.06, 0]       Turret: r [0, 0, 0]     (game fires FX_DustPuff on the rock)
u=0.85  Arm: p [0, 0.03, 0]
u=1.00  Arm: p [0, 0, 0]          Turret: r [0, 0, 0]     (real: PIXL does the last cm itself, slowly [16 PIA26204])

pixl_raster_loop (4.0 s)                  PixlHexapod positions; boustrophedon over one 0.035 m cell
u=0.00  PixlHexapod: p [-0.0125, 0, -0.0125]
u=0.20  PixlHexapod: p [ 0.0125, 0, -0.0125]
u=0.25  PixlHexapod: p [ 0.0125, 0, -0.0042]
u=0.45  PixlHexapod: p [-0.0125, 0, -0.0042]
u=0.50  PixlHexapod: p [-0.0125, 0,  0.0042]
u=0.70  PixlHexapod: p [ 0.0125, 0,  0.0042]
u=0.75  PixlHexapod: p [ 0.0125, 0,  0.0125]
u=0.95  PixlHexapod: p [-0.0125, 0,  0.0125]
u=1.00  same as u=0.00 (loop)

sherloc_scan_loop (2.5 s)                 Turret: r [90, 0, 0] at every key; SherlocScanner rotations
u=0.00  SherlocScanner: r [ 10, -10, 0]
u=0.20  SherlocScanner: r [ 10,  10, 0]
u=0.25  SherlocScanner: r [3.3,  10, 0]
u=0.45  SherlocScanner: r [3.3, -10, 0]
u=0.50  SherlocScanner: r [-3.3, -10, 0]
u=0.70  SherlocScanner: r [-3.3,  10, 0]
u=0.75  SherlocScanner: r [-10,  10, 0]
u=0.95  SherlocScanner: r [-10, -10, 0]
u=1.00  same as u=0.00 (loop)
        (±10° moves the beam ±0.012 m on the rock from 0.068 m; game-balance, real ±4.2°)

turret_retract (3.0 s)                    ease-in on the first segment
u=0.00  Arm: p [0, 0, 0]          Turret: r [0, 0, 0]
u=0.30  Arm: p [0, 0.08, 0]
u=0.60  Arm: p [0, 0.25, -0.10]   Turret: r [-45, 0, 0]
u=1.00  Arm: p [0, 0.45, -0.30]   Turret: r [-90, 0, 0]
```

## 6. Particles and effects

| Anchor | Model | Preset (`tools/modeling/lib/fx-presets.mjs`) or new | Clips | Note |
|---|---|---|---|---|
| `FX_XRay` | arm-turret | new `xray_spot` | `pixl_raster_loop` | a short particle stream from the opening to the rock (0.0255 m) that blooms at the surface |
| `FX_UVLaser` | arm-turret | new `uv_spot` | `sherloc_scan_loop` | same idea over 0.048 m; the rate equals the real 80 Hz pulse rate [5] |
| `FX_DustPuff` | cheyava-falls-rock | `dust` (existing) | none (fired by the game at `turret_approach` u ≈ 0.75, 0.4 s burst) | stands for the gDRT nitrogen puff; on Mars it is used to clean abraded patches [11] [13] |

Both beams are invisible in reality (X-rays and 248.6 nm UV); the visible stream is a game stylization.

```js
xray_spot: {
  description: 'Feixe de raios X do PIXL (estilizado; o real é invisível)',
  colors: ['#E8F7FF', '#7FD4FF'], blending: 'additive',
  rate: 40, life: [0.08, 0.09], speed: [0.28, 0.30], spread: 2,
  size: [0.004, 0.012], gravity: 0,
},
uv_spot: {
  description: 'Laser UV profundo do SHERLOC, 248,6 nm (estilizado; o real é invisível)',
  colors: ['#F0D8FF', '#9B5CFF'], blending: 'additive',
  rate: 80, life: [0.09, 0.10], speed: [0.48, 0.52], spread: 2,
  size: [0.003, 0.010], gravity: 0,
},
```

Speed × life ≈ standoff, so the particles end on the rock surface.

## 7. Images

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| `detail-1.jpg` | detail | WATSON close-up of Cheyava Falls (18 Jul 2024, sol 1212): white Ca-sulfate veins with greenish olivine, the reddish band between them, pale spots with dark rims. Colours of `Rock`, `RockDark`, `Vein`, `SpotRim`, `SpotCore` | [NASA PIA26368](https://images.nasa.gov/details/PIA26368) | NASA/JPL-Caltech/MSSS | Public domain (NASA) |
| `top-1.jpg` | top | Mastcam-Z mosaic of the workspace (sol 1217): Cheyava Falls (left) with veins, the drill hole and the white abrasion patch; outline and proportions of the rock | [NASA PIA26401](https://images.nasa.gov/details/PIA26401) | NASA/JPL-Caltech/ASU/MSSS | Public domain (NASA) |
| `three-quarter-1.jpg` | three-quarter | Hazcam view of the turret on Mars (sol 185): forearm, big joint drum, corer, instruments; the silhouette to keep | [NASA PIA24831](https://images.nasa.gov/details/PIA24831) | NASA/JPL-Caltech | Public domain (NASA) |
| `front-1.jpg` | front | PIXL sensor head in test at JPL with its cover open: white rounded box, X-ray opening with the LED ring, round window above, hexapod legs behind | [NASA PIA24093](https://images.nasa.gov/details/PIA24093) | NASA/JPL-Caltech | Public domain (NASA) |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://www.nature.com/articles/s41586-025-09413-0 — Hurowitz et al. 2025, Fig. 3 (spots, poppy seeds, SHERLOC/PIXL scan footprints) and Fig. 5 (PIXL map); CC BY-NC-ND, not allowed here.
- Free but not downloaded (to keep 4 images): [PIA26640](https://images.nasa.gov/details/PIA26640) mineral map colours; [PIA25245](https://images.nasa.gov/details/PIA25245) SHERLOC 10 × 10 scan grid; [PIA23621](https://images.nasa.gov/details/PIA23621) SHERLOC on the turret; [PIA26344](https://images.nasa.gov/details/PIA26344) selfie with the rock.

## 8. Gaps and cautions

- **Biosignature wording:** always "potential biosignature" (NASA) / "warrant consideration as potential biosignatures" (paper). It is Step 1 of NASA's CoLD scale; non-biological explanations are less likely but "cannot be ruled out" [1] [2] [3]. Never "life found".
- ⚠ **SHERLOC mass and size:** NASA page 4.72 kg and 26.0 × 20.0 × 6.7 cm; Bhartia et al. 2021: turret assembly 6.83 kg (352 × 176 × 276 mm) + body 2.90 kg = 9.73 kg. The NASA page's "6.86 lb" for the turret part is close to the paper's 6.83 kg, so a unit mix-up is possible (our guess). The repo uses 4.72 kg everywhere.
- ⚠ **Turret mass:** 45 kg [11] vs 40.1 kg [12] (excerpt only). GE6 in the catalog says 33–45 kg.
- ⚠ **PIXL scan time:** ~10 h for 5 × 7 mm, 10–14 h by size [7] vs "eight or nine hours" [9]. X-ray spot 120 µm [7] [8] vs ~150 µm [14].
- **n/f:** rock height; turret dimensions and tool angles (layout here is est.); PIXL hexapod travel (a 2018 talk is quoted online as 50 mm XY / 38 mm Z, not checked); number of PIXL/SHERLOC uses on Mars.
- **SHERLOC health:** its focus motor failed on sol 1024; since then focus is set by moving the arm, and the Bright Angel spectra were taken 1.1–1.8 mm out of focus [3]. The instrument was out for ~6 months in 2024 and came back. No newer status found; Perseverance has been in its extended mission since Jan 2026 (prime mission ended then, per the 2026 Senior Review, seen only in a search excerpt).
- **Sample numbering:** JPL 2024 calls the core the rover's "22nd rock core sample" [1]; `references/experiments/experiments.md` (G8) says "sample #25" (maybe counting non-rock samples; not checked).
- **Mars Sample Return:** the FY2026 law (signed 23 Jan 2026) gives no MSR money and $110 M to "Mars Future Missions"; the Planetary Society calls MSR "formally canceled" [15]. The catalog's ⚠ on this can likely be removed.
- **Game simplifications:** spots hidden under dust (the real ones were visible in WATSON images); organics shown only around spots; gDRT used on a natural surface (on Mars it cleans abraded patches); visible beams.
- **Discrepancies with `tools/modeling/parts/equipment.mjs` (`sci-pixl-sherloc-supercam`)**: it draws PIXL as a hexagonal steel head (6-sided cylinder): the real head is a white rounded box; "hexapod" is the six-legged mount. SHERLOC is drawn as a matte black box with a UV ring: the real unit is white with gold lens housings. `dataRateKbps: 111200` in `specs.mjs` is the sum of per-experiment volumes in Mbit (16 + 79.7 + 15.5 = 111.2 Mbit), not a rate.

## 9. Sources

1. NASA JPL, *NASA's Perseverance Rover Scientists Find Intriguing Mars Rock*, 2024-07-25. https://www.jpl.nasa.gov/news/nasas-perseverance-rover-scientists-find-intriguing-mars-rock/ (accessed 2026-11-15)
2. NASA, *NASA Says Mars Rover Discovered Potential Biosignature Last Year* (release 25-061), 2025-09-10. https://www.nasa.gov/news-release/nasa-says-mars-rover-discovered-potential-biosignature-last-year/ (accessed 2026-11-15)
3. Hurowitz J. A. et al., *Redox-driven mineral and organic associations in Jezero Crater, Mars*, Nature 645, 332–340, 2025. doi:10.1038/s41586-025-09413-0; full text via Europe PMC PMC12422973 (CC BY-NC-ND 4.0) (accessed 2026-11-15)
4. NASA Science, *Mars 2020 Perseverance: Science Instruments* (PIXL, SHERLOC, WATSON). https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/ (accessed 2026-11-15)
5. Bhartia R. et al., *Perseverance's Scanning Habitable Environments with Raman and Luminescence for Organics and Chemicals (SHERLOC) Investigation*, Space Sci. Rev. 217, 58, 2021 (CC BY 4.0). https://link.springer.com/article/10.1007/s11214-021-00812-z (accessed 2026-11-15)
6. Allwood A. C. et al., *PIXL: Planetary Instrument for X-Ray Lithochemistry*, Space Sci. Rev. 216, 134, 2020 (abstract only). https://link.springer.com/article/10.1007/s11214-020-00767-7 (accessed 2026-11-15)
7. Lawson P. R. et al., *Adaptive Sampling with PIXL on the Mars Perseverance Rover*, arXiv:2405.14471, 2024. https://arxiv.org/abs/2405.14471 (accessed 2026-11-15)
8. Tice M. M. et al., *Alteration history of Séítah formation rocks inferred by PIXL x-ray fluorescence, x-ray diffraction, and multispectral imaging on Mars*, Sci. Adv. 8, eabp9084, 2022. doi:10.1126/sciadv.abp9084 (accessed 2026-11-15)
9. NASA JPL, *NASA's New Mars Rover Will Use X-Rays to Hunt Fossils*, 2020-09-22. https://www.jpl.nasa.gov/news/nasas-new-mars-rover-will-use-x-rays-to-hunt-fossils/ (accessed 2026-11-15)
10. NASA Science, *Mars 2020 Perseverance: Rover Components* (robotic arm, turret, drill). https://science.nasa.gov/mission/mars-2020-perseverance/rover-components/ (accessed 2026-11-15)
11. NASA JPL, *Mars 2020 Launch Press Kit: Perseverance Rover*, 2020. https://www.jpl.nasa.gov/news/press_kits/mars_2020/launch/mission/spacecraft/perseverance_rover/ (accessed 2026-11-15)
12. Moeller R. C. et al., *The Sampling and Caching Subsystem (SCS) for the Scientific Exploration of Jezero Crater by the Mars 2020 Perseverance Rover*, Space Sci. Rev. 217, 5, 2021 (abstract only; 40.1 kg from a search excerpt). https://link.springer.com/article/10.1007/s11214-020-00783-7 (accessed 2026-11-15)
13. Verma V. (NASA JPL), *The Perseverance Robotic Arm: Tightrope of Abrasion & Proximity Science*, NASA blog, 2022-09-16. https://science.nasa.gov/missions/mars-2020-perseverance/the-perseverance-robotic-arm-tightrope-of-abrasion-proximity-science/ (accessed 2026-11-15)
14. Washington University in St. Louis, *Analyst's Notebook: M20 PIXL*. https://an.rsl.wustl.edu/help/Content/About%20the%20mission/M20/Instruments/M20%20PIXL.htm (accessed 2026-11-15)
15. Kiraly J., Koeppel A. (The Planetary Society), *NASA is funded. Now what?*, 2026-01-30. https://www.planetary.org/articles/nasa-is-funded-now-what (accessed 2026-11-15)
16. NASA/JPL Photojournal via NASA Image and Video Library: PIA26368, PIA26401, PIA24831, PIA24093, PIA24762, PIA26204, PIA26640, PIA25245. https://images.nasa.gov/ (accessed 2026-11-15)
