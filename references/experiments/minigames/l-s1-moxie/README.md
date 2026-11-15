---
id: l-s1-moxie
experiment: L-S1
name: Oxygen oven
owner: lucas
minigame: "Make oxygen" (keep in range)
real_basis: ["MOXIE, Mars Oxygen In-Situ Resource Utilization Experiment (Perseverance rover, Mars 2020)"]
catalog_refs: [EN1]
models: [moxie]
status: retired (checked 2026-11)
---

# L-S1 · Oxygen oven

MOXIE was a gold-plated box inside Perseverance. It pulled in Martian air through a filter, compressed it with a scroll pump, heated it to 800 °C and split the CO₂ in a solid oxide electrolysis (SOXE) stack. Between 2021 and 2023 it made 122 g of oxygen in 16 runs [1][2][5]. In the minigame, Lucas heats the stack to about 800 °C and keeps it in the green zone while the battery drains. Too hot damages the cell; too cold makes nothing. The model is MOXIE at 1:1 with its front cover removable, so the player sees the compressor shaking and the stack glowing.

## 1. Real data

Numbers the minigame uses or shows to the player. One row per key.

- **Source** column: `[n]` points to section 9; `derived` = calculated from other rows (formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass` | 17.1 | kg | [1] | "About 37.7 pounds (17.1 kilograms) on Earth" |
| `power_electric` | 300 ⚠ | W | [1] | Pre-flight budget: 320 W total = SOXE current 60 + pump 110 + stack heaters 72 + sensors 9 + electronics 67 [6] |
| `size` | 0.239 × 0.239 × 0.309 ⚠ | m | [1], [2] | Chassis 23.9 × 23.9 × 30.9 cm. No source says which side is vertical (see section 8) |
| `operating_time` | ~3600 | s | [1], [2], [3] | O₂ production per run: "approximately one hour" [1]; 59–96 min in the 7 runs of 2021 [2]. A whole run, with warm-up, lasts ~3.5 h (12,600 s) [4] |
| `data_volume` | n/f | Mbit | | Telemetry sampled at 1 Hz, archived per run in the PDS [4]; size n/f |
| `first_use_on_mars` | 2021 | year | [3] | 20 Apr 2021 (sol 60): 5.4 g after ~1 h, at 6 g/h |
| `uses_on_mars` | 16 | count | [5] | 16th and final run on 7 Aug 2023 (9.8 g). Hoffman counts "operational cycles" differently (OC8 was a heat-only checkout) [2] |
| `operating_temperature` | 800 | °C | [2], [3] | SOXE stack; heated by two heater plates above and below the stack [2] |
| `warm_up_time` | 7200 ⚠ | s | [3], [4] | NASA: "After a 2-hour warmup period" (first run) [3]. PDS: "in excess of 2 hours" and "2.5 hours of warmup" [4] |
| `cool_down_time` | n/f | s | | |
| `o2_rate_required` | 6 | g/h | [7], [4] | Requirement at 5 Torr intake, 0 °C (rover interior) |
| `o2_rate_typical` | 6–8 | g/h | [2] | MOXIE's normal output |
| `o2_rate_design_max` | 10 | g/h | [1], [3] | "up to 10 grams per hour" |
| `o2_rate_peak` | 12 | g/h | [5] | Best achieved; twice the goal |
| `o2_per_run` | 5.4–9.8 | g | [2], [5] | 2021 runs: 5.4–8.9 g [2]; final run 9.8 g [5]. Best single run n/f |
| `o2_total` | 122 | g | [5] | "roughly what a small dog breathes in 10 hours" |
| `o2_purity` | ≥ 98 | % | [5], [7] | > 99.6 % is recommended for propellant and breathing [2] |
| `o2_fate` | vented | — | [3], [4] | O₂ is measured, then released to the Martian air; no storage. CO is vented as waste |
| `co2_intake_reference` | 55 | g/h | [2] | Reference segment: 55 g/h of intake → 6 g/h of O₂ |
| `compressor_type` | scroll pump | — | [2], [8] | Air Squared P09H026A-BLDC-SH [8] |
| `compressor_speed_max` | 3500 | rpm | [2] | ≈ 58 Hz |
| `compressor_outlet_pressure` | 0.5–1 ⚠ | bar | [4] | Air Squared: boosts 3.5–7 Torr "up to 760 Torr" (1.01 bar) [8] |
| `intake_pressure` | 631–768 | Pa | [2] | Mars air during the 2021 runs |
| `soxe_cells` | 10 | count | [2] | Wired in series as two 5-cell halves (top and bottom) |
| `soxe_cell_area` | 22.7 | cm² | [6] | Pre-flight value |
| `soxe_current_nominal` | 2 | A | [2] | 2 A ↔ 6 g/h. Check (`derived`): 2 A / (4 · 96,485 C/mol) × 32 g/mol × 3600 s × 10 cells = 5.97 g/h (4 electrons per O₂ [4]) |
| `stack_thermal_gradient` | ≤ 10 | °C | [2] | Cooler middle cells vs warmer cells near the heaters |
| `safe_voltage_window` | ~0.17 | V per cell | [2] | Above it the cathode cokes (carbon deposits); 30 °C cooler shrinks the window by 0.027 V |
| `energy_per_run` | ~650 ⚠ | Wh | [4] | PDS: a run "consumes the nominal payload power allocation of ~650 W-hrs for a typical martian sol". Upper bound `derived`: 300 W × 3.5 h ≈ 1.05 kWh (catalog says ~1 kWh ⚠) |
| `degradation` | rises each heat/cool cycle | — | [2] | Cell resistance grows a little per thermal cycle; still expected to meet 6 g/h for > 60 cycles |
| `location` | inside rover, front right | — | [1] | |
| `insulation` | gold coating + aerogel | — | [3] | Gold reflects infrared heat; aerogel holds heat in; 3D-printed nickel-alloy parts |

## 2. Minigame

- **Goal:** Heat the SOXE stack to ~800 °C, then hold it in the green zone for the production hour to make as many grams of O₂ as possible before the battery runs out.
- **Mechanic:** keep in range
- **Loop:**
  1. Warm-up: a vertical thermometer starts at 0 °C. The player holds ↑ (heaters); the stack glow grows (`heat_up`, or the game drives `SoxeCore` scale from the temperature).
  2. When the temperature enters the green zone, the compressor starts (`produce_loop`) and a grams counter rises. The temperature drifts on its own; the player corrects with ↑/↓.
  3. Too hot: the unit shakes, the red lamp blinks (`overheat_loop`) and cell damage grows. Too cold: production stops ("cells too cold").
  4. The battery bar drains the whole time. The run ends when the production timer ends or the battery is empty; `cooldown` plays and the grams are added to the "prepare human arrival" goal.
- **Success / failure:** Success = grams of O₂ for the "preparar a chegada humana" goal. Failure = cell damage, which lowers production in later runs. Cost: 17.1 kg and 300 W, competing for power with Maya's instruments (docs/minigames.md).
- **Fact card:** "MOXIE made 122 g of oxygen in 16 runs on Mars, peaking at 12 g per hour, twice NASA's goal [5]. It was the first time a resource was made from another planet's air [2]." (PT-BR text in `docs/minigames.md`.)

Numbers that drive the minigame:

| Parameter | Value | Unit | Real or `game-balance` | From (section 1 key or source) |
|---|---|---|---|---|
| Target temperature | 800 | °C | real | `operating_temperature` |
| Start temperature | 0 | °C | real (design assumption) | rover interior in the requirement [7] |
| Green zone | 785–815 | °C | game-balance | real stack spread ≤ 10 °C (`stack_thermal_gradient`) |
| Too cold (no O₂) | < 770 | °C | game-balance | real cut-off n/f; −30 °C shrinks the safe window [2] |
| Too hot (damage) | > 830 | °C | game-balance | real limit n/f; 800 °C was a compromise against damaging heat-sensitive materials [2] |
| Warm-up on screen | 8 | s | game-balance | real ~2 h ⚠ (`warm_up_time`) |
| Production on screen | 30 | s | game-balance | real ~1 h (`operating_time`); 1 s on screen = 2 min |
| O₂ rate, zone centre | 12 | g/h | real | `o2_rate_peak` |
| O₂ rate, zone edge | 6 | g/h | real | `o2_rate_required` |
| Max O₂ per run | 12 | g | derived | 12 g/h × 1 h; real runs 5.4–9.8 g |
| Power while running | 300 | W | real | `power_electric` |
| Battery for one run | 650 | Wh | real ⚠ | `energy_per_run`; a perfect run uses ~100 % |
| Drift | ±6 random, −3 toward cold | °C/s | game-balance | |
| Player correction | ±25 | °C/s | game-balance | |
| Damage over 830 °C | 2 | % per s | game-balance | |
| Wear per run (thermal cycle) | 1 | % | game-balance | real: resistance rises each heat/cool cycle [2] |
| Rate penalty | −1 % rate per 1 % damage | — | game-balance | real: higher resistance → less O₂ at a safe voltage [2] |

## 3. Models

One row per model the minigame needs; each gets a subsection in section 4.

| Model id | What it is | Shown where | Budget (triangles / meshes) |
|---|---|---|---|
| `moxie` | MOXIE at 1:1: gold chassis, scroll compressor, SOXE stack with glow, sensor panel, top plumbing; front cover can be hidden | L-S1 close-up (cover hidden); rover/equipment views (cover shown) | ≤ 1,200 / ≤ 14 |

No `oxygen-gauge` prop: the real MOXIE stored no oxygen, it vented it [3][4]. A filling tank would teach something false, so the grams live in the UI.

## 4. Low-poly models

Instructions for whoever (person or AI) generates the models. Same conventions as the avatars and rocket parts ([AGENTS.md](../../../../AGENTS.md) §5, [parts.md](../../../parts/parts.md#3d-model-conventions)):

- **Units and axes:** metres at real size (1:1); +Y up; the front faces +Z; the origin is stated per model (usually on the ground, between the feet or wheels, or at the mounting point).
- **Style:** non-indexed geometry with one normal per face (flat shading); no textures; cylinders with 5 to 10 sides.
- **Materials:** only from `tools/modeling/lib/palette.mjs` (`Suit`, `SuitGrey`, `Helmet`, `Visor`, `VisorGold`, `Pack`, `Metal`, `Glove`, `GloveTip`, `Boot`, `Sole`, `Strap`, `Bag`, `Lamp`, `LedGreen`, `LedRed`, `Hull`, `HullBlack`, `Foam`, `Steel`, `Aluminum`, `Titanium`, `Copper`, `NozzleDark`, `FoilGold`, `FoilSilver`, plus `Accent` and `Screen` for the owner's color). A new material goes in the "New materials" table with a hex color and a reason.
- **Moving parts:** children of an empty pivot node placed at the joint; meshes are named `<Node>_<Material>`. No negative scale (mirror by position).
- **Symbols:** no real logos, flags or insignia; no red cross.

### 4.1 moxie

#### Geometry

Orientation chosen: 0.309 m along X (left–right), 0.239 m deep (Z), 0.239 m tall (Y), as in `diagram-1.jpg` (components side by side behind the front cover). See section 8 ⚠.

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Chassis width (X) | 0.309 | [1], [2] | axis choice est. ⚠ |
| Chassis depth (Z) | 0.239 | [1], [2] | |
| Chassis height (Y) | 0.239 | [1], [2] | axis choice est. ⚠ |
| Height with top plumbing | 0.265 | est. | fittings and tubes above the top plate (`top-1.jpg`) |
| Base plate / top plate thickness | 0.008 | est. | copper-coloured base plate in `three-quarter-1.jpg` |
| Side walls / electronics wall | 0.004 / 0.035 | est. | electronics sit "inside the larger sidewall" (PIA24201 caption) |
| Scroll compressor (housing + motor) | 0.10 × 0.10 base, motor Ø 0.08, h 0.162 | est. | scaled from Hoffman Fig. 1 and `diagram-1.jpg` |
| SOXE assembly | 0.11 × 0.12 footprint, h 0.179 incl. cans | est. | same |
| SOXE stack (glow zone) | 0.07 × 0.05 × 0.07 | est. | 10 cells of 22.7 cm² (≈ 4.8 cm square) [2][6]; stack height n/f |
| Sensor panel | 0.04 × 0.19 × 0.15 | est. | `diagram-1.jpg` |

#### Shape in words

A gold box a bit longer than it is tall, sitting on a thin copper-coloured plate. The outer walls carry raised ribs: a big diagonal X on the left end wall and on the back wall; a waffle grid on the thicker right end wall, which holds the electronics (`three-quarter-1.jpg`). The flat gold top plate carries a large connector block, a filter housing, white tubes with silver fittings and small round vent screens (`top-1.jpg`). With the front cover hidden (as in `diagram-1.jpg`), you see, from left to right: a tall silver sensor panel, the dark scroll compressor (square base with a cylindrical motor on top), and the SOXE assembly: a grey base block, the glowing stack between two heater plates, a clamp plate held by four spring-loaded rods, and two gold cans on top. Keep for the silhouette: the gold box, the X and waffle ribs, the white tubes on top, the dark compressor cylinder and the four springs. The glow is game art: the real stack sits behind insulation and cannot be seen.

#### Node hierarchy

```text
Moxie                        origin: centre of the bottom face of the base plate (y = 0)
└─ Body                      pivot (0, 0, 0); all static meshes; shakes in overheat_loop
   ├─ FrontCover             pivot (-0.0165, 0.1195, 0.1145); front panel; the game hides it for the cutaway
   ├─ Compressor             pivot (-0.054, 0.008, 0.015), bottom centre of the pump; vibrates
   ├─ SoxeCore               pivot (0.055, 0.099, 0.015), centre of the stack; glow mesh, scaled by temperature
   ├─ LampOk                 pivot (0.095, 0.2415, 0.105); green lamp (game art)
   ├─ LampWarn               pivot (0.125, 0.2415, 0.105); red lamp (game art)
   ├─ FX_O2Vent              (-0.04, 0.243, -0.085), rot (0, 0, 0); emits along local +Y; preset o2_vent
   └─ FX_HeatShimmer         (0.055, 0.239, 0.015), rot (0, 0, 0); emits along local +Y; preset heat_shimmer
```

#### Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to its node; rotations in degrees (X, Y, Z).

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Body | box (base plate) | 0.309 × 0.008 × 0.239 | (0, 0.004, 0) | (0, 0, 0) | Copper | — |
| 2 | Body | box (top plate) | 0.309 × 0.008 × 0.239 | (0, 0.235, 0) | (0, 0, 0) | FoilGold | — |
| 3 | Body | box (left end wall) | 0.004 × 0.223 × 0.239 | (-0.1495, 0.1195, 0) | (0, 0, 0) | FoilGold | — |
| 4 | Body | box ×2 (left wall X ribs) | 0.003 × 0.30 × 0.008 | (-0.153, 0.1195, 0) | (±46.7, 0, 0) | FoilGold | — |
| 5 | Body | box (electronics wall) | 0.035 × 0.223 × 0.239 | (0.133, 0.1195, 0) | (0, 0, 0) | FoilGold | — |
| 6 | Body | box ×3 (waffle ribs, vertical) | 0.004 × 0.223 × 0.006 | (0.1525, 0.1195, z = -0.06 / 0 / 0.06) | (0, 0, 0) | FoilGold | — |
| 7 | Body | box ×3 (waffle ribs, horizontal) | 0.004 × 0.006 × 0.239 | (0.1525, y = 0.064 / 0.12 / 0.176, 0) | (0, 0, 0) | FoilGold | — |
| 8 | Body | box (back wall) | 0.264 × 0.223 × 0.004 | (-0.0165, 0.1195, -0.1145) | (0, 0, 0) | FoilGold | — |
| 9 | Body | box ×2 (back wall X ribs) | 0.008 × 0.33 × 0.003 | (-0.0165, 0.1195, -0.118) | (0, 0, ±49.8) | FoilGold | — |
| 10 | FrontCover | box (cover) | 0.264 × 0.223 × 0.004 | (0, 0, 0) | (0, 0, 0) | FoilGold | — |
| 11 | FrontCover | box ×2 (X ribs) | 0.008 × 0.33 × 0.003 | (0, 0, 0.0035) | (0, 0, ±49.8) | FoilGold | — |
| 12 | Body | box (sensor panel) | 0.04 × 0.19 × 0.15 | (-0.1275, 0.103, 0) | (0, 0, 0) | FoilSilver | — |
| 13 | Compressor | box (scroll housing) | 0.10 × 0.06 × 0.10 | (0, 0.03, 0) | (0, 0, 0) | NozzleDark | — |
| 14 | Compressor | cylinder (motor) | r 0.040, h 0.09 | (0, 0.105, 0) | (0, 0, 0) | NozzleDark | 8 |
| 15 | Compressor | cylinder (motor cap) | r 0.028, h 0.012 | (0, 0.156, 0) | (0, 0, 0) | Metal | 8 |
| 16 | Compressor | cylinder (outlet to SOXE) | r 0.006, h 0.03 | (0.055, 0.03, 0.02) | (0, 0, 90) | Metal | 6 |
| 17 | Body | box (SOXE base block) | 0.11 × 0.06 × 0.12 | (0.055, 0.038, 0.015) | (0, 0, 0) | Aluminum | — |
| 18 | Body | box (manifold bolt block, front of base) | 0.04 × 0.035 × 0.006 | (0.055, 0.045, 0.078) | (0, 0, 0) | Steel | — |
| 19 | Body | box ×2 (heater plates) | 0.08 × 0.006 × 0.08 | (0.055, y = 0.071 / 0.127, 0.015) | (0, 0, 0) | Steel | — |
| 20 | SoxeCore | box (stack glow) | 0.07 × 0.05 × 0.07 | (0, 0, 0) | (0, 0, 0) | HeatGlow (new) | — |
| 21 | Body | box (clamp plate) | 0.11 × 0.012 × 0.12 | (0.055, 0.136, 0.015) | (0, 0, 0) | Aluminum | — |
| 22 | Body | cylinder ×4 (tie rods) | r 0.004, h 0.074 | (0.055 ± 0.045, 0.105, 0.015 ± 0.05) | (0, 0, 0) | Steel | 5 |
| 23 | Body | cylinder ×4 (springs) | r 0.010, h 0.04 | (0.055 ± 0.045, 0.162, 0.015 ± 0.05) | (0, 0, 0) | Steel | 6 |
| 24 | Body | cylinder ×2 (cans on the SOXE) | r 0.022, h 0.045 | (0.055 ± 0.026, 0.1645, 0.015) | (0, 0, 0) | FoilGold | 8 |
| 25 | Body | box (inlet filter housing) | 0.075 × 0.022 × 0.07 | (-0.105, 0.250, 0.055) | (0, 0, 0) | FoilSilver | — |
| 26 | Body | box (filter grille) | 0.06 × 0.002 × 0.055 | (-0.105, 0.262, 0.055) | (0, 0, 0) | Strap | — |
| 27 | Body | box (intake elbow fitting) | 0.024 × 0.025 × 0.03 | (-0.105, 0.2515, 0.005) | (0, 0, 0) | Aluminum | — |
| 28 | Body | cylinder, open (CO₂ intake tube) | r 0.0065, h 0.11 | (-0.105, 0.2515, -0.065) | (90, 0, 0) | Hull | 6 |
| 29 | Body | box (O₂ fitting) | 0.018 × 0.02 × 0.018 | (0.06, 0.249, 0.05) | (0, 0, 0) | Steel | — |
| 30 | Body | cylinder, open (O₂ tube, along X) | r 0.004, h 0.091 | (0.0055, 0.249, 0.05) | (0, 0, 90) | Hull | 6 |
| 31 | Body | cylinder, open (O₂ tube, along Z) | r 0.004, h 0.12 | (-0.04, 0.249, -0.01) | (90, 0, 0) | Hull | 6 |
| 32 | Body | box (O₂ elbow at vent) | 0.018 × 0.02 × 0.018 | (-0.04, 0.249, -0.075) | (0, 0, 0) | Steel | — |
| 33 | Body | cylinder ×2 (vent screens) | r 0.012, h 0.003 | (-0.04, 0.2405, -0.095) and (0.09, 0.2405, -0.06) | (0, 0, 0) | Strap | 8 |
| 34 | Body | box (connector block) | 0.06 × 0.03 × 0.045 | (0.115, 0.254, 0.03) | (0, 0, 0) | Aluminum | — |
| 35 | LampOk | box | 0.016 × 0.005 × 0.006 | (0, 0, 0) | (0, 0, 0) | LedGreen | — |
| 36 | LampWarn | box | 0.016 × 0.005 × 0.006 | (0, 0, 0) | (0, 0, 0) | LedRed | — |

#### Simplify

- Drop cable harnesses, bolts, labels, Kapton tape and the CO/CO₂ exhaust line (the real unit vents CO separately [3]; add one more tube only if the budget allows).
- Merge the white tubes into the 3 segments above; keep the big intake tube thicker than the O₂ tube (`top-1.jpg` caption: largest tube = intake, smallest = O₂).
- Keep the 4 springs and the 2 cans: they make the SOXE readable. Keep the glow box visible between the rods from the front.
- Real insulation partly covers the stack sides [2]; leave it off so the glow shows (game art).

#### New materials

| Name | Hex | Why |
|---|---|---|
| `HeatGlow` | `#FF6A1A` (emissive same, intensity 2.5, roughness 0.3) | Shows the SOXE stack at ~800 °C (orange incandescence). No palette entry glows orange; `Lamp` is white |

#### Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 1,200 (estimate ~820) |
| Meshes | ≤ 14 (Body: FoilGold, Copper, Aluminum, Steel, Hull, FoilSilver, Strap; FrontCover_FoilGold; Compressor_NozzleDark, Compressor_Metal; SoxeCore_HeatGlow; LampOk_LedGreen; LampWarn_LedRed = 13) |
| Main dimensions | 0.309 × 0.239 × 0.239 m chassis (±2%); 0.265 m tall with plumbing |

## 5. Animations

Same format as the avatar animations (AGENTS.md §5.5): each clip is a function `pose(u)` with u ∈ [0, 1], rotations in degrees and positions in metres, relative to the rest pose. Clips that loop end in `_loop` and need pose(0) = pose(1). Here `s` is the **absolute** scale of a node; rest pose = all scales [1, 1, 1] (full glow, lamps on), so the viewer shows the hot state.

| Clip | Model | Duration (s) | Loop | What it shows | Used when (minigame state) |
|---|---|---|---|---|---|
| `compressor_loop` | moxie | 0.4 | yes | Compressor vibrates (4 cycles = 10 Hz on screen) | Compressor on, no glow change (viewer, other scenes) |
| `heat_up` | moxie | 8 | no | Glow grows from cold to 800 °C; green lamp turns on at the end | Warm-up (or the game drives `SoxeCore` from the temperature) |
| `produce_loop` | moxie | 2 | yes | Compressor vibrates, glow breathes, O₂ puffs | In the green zone |
| `overheat_loop` | moxie | 0.8 | yes | Body shakes, glow swells, red lamp blinks | Above 830 °C |
| `cooldown` | moxie | 6 | no | Glow shrinks to cold; lamps off | Run ended |

In Godot the `_loop` suffix is removed: `compressor`, `produce`, `overheat`.

Keyframes for each clip (linear between keys unless the Note says ease):

```text
compressor_loop (0.4 s)   pattern repeats every Δu = 0.25 (4 cycles)
u=0.0000  Compressor: r [0, 0, 0]        p [0, 0, 0]
u=0.0625  Compressor: r [0.6, 0, 0.4]    p [0.0008, 0.0004, 0]
u=0.1250  Compressor: r [0, 0, 0]        p [0, 0, 0]
u=0.1875  Compressor: r [-0.6, 0, -0.4]  p [-0.0008, 0.0004, 0]
u=0.2500  Compressor: r [0, 0, 0]        p [0, 0, 0]   (repeat to u=1.00)
u=1.0000  same as u=0.00 (loop)

heat_up (8 s)   ease-in (heaters are slow at first)
u=0.00  SoxeCore: s [0.6, 0.05, 0.6]   LampOk: s [0, 0, 0]   LampWarn: s [0, 0, 0]
u=0.30  SoxeCore: s [0.75, 0.3, 0.75]
u=0.70  SoxeCore: s [0.9, 0.75, 0.9]
u=0.95  SoxeCore: s [1, 1, 1]          LampOk: s [0, 0, 0]
u=1.00  SoxeCore: s [1, 1, 1]          LampOk: s [1, 1, 1]

produce_loop (2 s)
Compressor: same pattern as compressor_loop, repeated every Δu = 0.05 (20 cycles = 10 Hz)
SoxeCore:   s = 1 + 0.03·sin(2πu) on all axes   (u=0 → [1,1,1], u=0.25 → [1.03,1.03,1.03], u=0.75 → [0.97,0.97,0.97])
LampOk: s [1, 1, 1]   LampWarn: s [0, 0, 0]
u=1.00  same as u=0.00 (loop)

overheat_loop (0.8 s)
Body:       r [0, 0, 0.8·sin(8πu)]   p [0.0015·sin(8πu), 0, 0]        (4 shakes = 5 Hz)
Compressor: same pattern as compressor_loop, every Δu = 0.125
SoxeCore:   s [1.15, 1.3 + 0.05·sin(8πu), 1.15]
LampWarn:   step: s [1,1,1] for u ∈ [0, 0.5), s [0,0,0] for u ∈ [0.5, 1); key back to [1,1,1] at u=1.00
LampOk:     s [0, 0, 0]
u=1.00  same as u=0.00 (loop)

cooldown (6 s)   ease-out
u=0.00  SoxeCore: s [1, 1, 1]          LampOk: s [0, 0, 0]   LampWarn: s [0, 0, 0]
u=0.40  SoxeCore: s [0.85, 0.55, 0.85]
u=1.00  SoxeCore: s [0.6, 0.05, 0.6]
```

Live control (game-balance): during the minigame the game sets `SoxeCore` scale from the temperature T: `s_y = clamp(T / 800, 0.05, 1.3)`, `s_x = s_z = 0.6 + 0.4·min(T / 800, 1)`.

Real rates: compressor up to 3500 rpm (≈ 58 Hz) [2], too fast to read, so 10 Hz on screen is `game-balance`. Real warm-up ~2 h ⚠ → 8 s; production ~1 h → 30 s; cool-down n/f → 6 s (all `game-balance`).

## 6. Particles and effects

| Anchor | Model | Preset (`tools/modeling/lib/fx-presets.mjs`) or new | Clips | Note |
|---|---|---|---|---|
| `FX_O2Vent` | moxie | new `o2_vent` | `produce_loop` | Game art: real O₂ is invisible. It is vented after the purity sensor [3][4]. Placed on a vent screen seen on the top plate (`top-1.jpg`; our reading) |
| `FX_HeatShimmer` | moxie | new `heat_shimmer` | `heat_up` (u > 0.7), `produce_loop`, `overheat_loop` (game sets rate ×3) | Game art: the real unit is gold-coated and insulated so heat stays in [3] |

New presets (SI units, same fields as the existing ones):

```js
o2_vent: {
  description: 'O2 puff vented by MOXIE (game art; real O2 is invisible)',
  colors: ['#F2FAFF', '#A9D4F5'],
  blending: 'normal',
  rate: 18,            // particles/s
  life: [0.5, 1.0],    // s
  speed: [0.12, 0.3],  // m/s
  spread: 20,          // half-angle, degrees
  size: [0.012, 0.05], // m, start → end
  gravity: 0,
},
heat_shimmer: {
  description: 'Heat shimmer above the 800 °C SOXE stack (game art)',
  colors: ['#FFE2B8', '#FF8A3D'],
  blending: 'additive',
  rate: 24,
  life: [0.6, 1.1],
  speed: [0.08, 0.2],
  spread: 12,
  size: [0.03, 0.09],
  gravity: 0,
},
```

If new presets are not wanted, `signal` can stand in for `o2_vent`.

## 7. Images

All images in this folder, only with a free license (public domain, CC0, CC BY, CC BY-SA). File name: `<view>-<n>.jpg`; views: `side`, `three-quarter`, `front`, `top`, `detail`, `diagram`, `in-context`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| `three-quarter-1.jpg` | three-quarter | MOXIE engineering model (near-identical twin) on a test stand: gold-plated aluminium box, X-ribbed wall (left), thick waffle-grid electronics wall (right), copper-coloured base plate, white tubes on top | [NASA PIA24201](https://images.nasa.gov/details/PIA24201) | NASA/JPL-Caltech | Public domain (NASA/JPL) |
| `diagram-1.jpg` | diagram | Exploded illustration: sensor panel assembly, scroll compressor, SOXE assembly (4 spring rods, 2 cans on top), top plate, walls. Use for the interior layout | [NASA PIA24177](https://images.nasa.gov/details/PIA24177) | NASA/JPL-Caltech | Public domain (NASA/JPL) |
| `top-1.jpg` | top | Flight unit installed in Perseverance, seen from above: top plate with connector block, intake tube (largest white tube), O₂ tube (smallest), round vent screens | [NASA PIA24203](https://images.nasa.gov/details/PIA24203) | NASA/JPL-Caltech | Public domain (NASA/JPL) |
| `in-context-1.jpg` | in-context | Engineers lowering MOXIE into the rover chassis (JPL clean room, 20 Mar 2019): size next to people and the rover body | [NASA PIA23154](https://images.nasa.gov/details/PIA23154) | NASA/JPL-Caltech | Public domain (NASA/JPL) |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://pmc.ncbi.nlm.nih.gov/articles/PMC9432831/figure/F1/ — Hoffman et al. 2022, Fig. 1: MOXIE with the front cover removed (compressor + SOXE side by side). CC BY-NC, so not copied.

## 8. Gaps and cautions

- **Orientation ⚠:** sources give 23.9 × 23.9 × 30.9 cm but never say which side is vertical. `diagram-1.jpg`, `in-context-1.jpg` and PIA24202 (EM on the vibration table) read as a low box with one 30.9 cm side; `three-quarter-1.jpg` reads as a tall box. We chose 0.309 along X. If a better source shows the unit stands 0.309 m tall, swap X and Y in the Geometry and Parts tables (the interior layout still fits).
- **Interior sizes are est.:** compressor, SOXE, sensor panel and stack sizes are scaled from the illustration and Hoffman Fig. 1. Hecht et al. 2021 [7] (the full hardware paper) is paywalled; only its abstract was read, and the MIT author copy was rate-limited.
- **Power ⚠:** 300 W (NASA) vs 320 W pre-flight budget [6]. **Energy per run ⚠:** ~650 Wh [4] vs ~1.05 kWh if 300 W were drawn for the whole 3.5 h run.
- **Warm-up ⚠:** 2 h [3] vs "in excess of 2 hours" / 2.5 h [4]. Cool-down time n/f.
- **Inlet filter:** MOXIE had a HEPA inlet filter [2] (pleated, 264 cm² pre-flight [6]), but its exact location is n/f; the housing on the top plate is our placement.
- **Gold cans on the SOXE:** shown in the NASA illustration but not labelled; function n/f.
- **Game simplification:** the real controller set current and voltage; the main real risk was coking (carbon deposits) when voltage passed the safe window, and colder cells had a smaller window [2]. The minigame turns this into a temperature-only band. Real "too hot" and "too cold" limits are n/f.
- **Glow, lamps, vent puff and shimmer are game art:** the stack is hidden behind insulation and gold walls; MOXIE had no warning lamps.
- **Runs count:** 16 per NASA [5]; Hoffman numbers "operational cycles" including Earth tests and a heat-only checkout (OC8) [2].
- **Compressor:** flight model Air Squared P09H026A-BLDC-SH [8]; its mass is n/f (a 2 kg figure on Air Squared's site is for another model, P11H024A).
- **Status:** retired since the 16th run (7 Aug 2023) [5]; recheck only if NASA reports new runs.
- **Discrepancies with `isru-moxie-rodwell`** (`tools/modeling/parts/equipment.mjs`, `references/parts/stage-equipment.md` B3):
  - The gold box is a 0.28 m cube; real chassis is 0.239 × 0.239 × 0.309 m (a normalized bay display, so acceptable, but not 1:1).
  - The compressor is drawn as an aluminium cylinder on top; the real scroll compressor is inside the chassis. The top carries tubes, fittings and connectors.
  - The two spherical "O₂ accumulator" tanks have no real basis: MOXIE stored no oxygen, it vented it [3][4][6]. Label them as game art or remove them.
  - The glowing exhaust grille on the outside is game art (the gold coating keeps heat in [3]).
  - B3 says "~1 kWh/run ⚠"; the PDS gives ~650 Wh per run [4].

## 9. Sources

1. NASA Science, *Mars 2020 Perseverance: Science Instruments* (MOXIE: 17.1 kg, 300 W, 23.9 × 23.9 × 30.9 cm, inside the rover front right, up to 10 g/h, ~1 h of O₂ per experiment). https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/ (accessed 2026-11-15)
2. Hoffman, J. A., Hecht, M. H., Rapp, D. et al., *Mars Oxygen ISRU Experiment (MOXIE)—Preparing for human Mars exploration*, Science Advances 8(35), eabp8636, 2022. https://doi.org/10.1126/sciadv.abp8636 (full text: https://pmc.ncbi.nlm.nih.gov/articles/PMC9432831/, accessed 2026-11-15; CC BY-NC, text cited only)
3. NASA, *NASA's Perseverance Mars Rover Extracts First Oxygen from Red Planet*, 21 Apr 2021. https://www.nasa.gov/news-release/nasas-perseverance-mars-rover-extracts-first-oxygen-from-red-planet/ (accessed 2026-11-15)
4. NASA PDS Atmospheres Node, *MOXIE Mars Oxygen ISRU Experiment* (data page). https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/PERSEVERANCE/moxie.html (accessed 2026-11-15)
5. NASA/JPL, *NASA's Oxygen-Generating Experiment MOXIE Completes Mars Mission*, 6 Sep 2023 (same text on MIT AeroAstro, 14 Sep 2023: https://aeroastro.mit.edu/news-impact/oxygen-generating-experiment-moxie-completes-mars-mission). https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/ (accessed 2026-11-15)
6. Hecht, M., *Mars Oxygen ISRU Experiment (MOXIE)*, presentation at the Keck Institute for Space Studies ISRU workshop, pre-flight (one slide dated 2 Dec 2015): power budget, 10 cells of 22.7 cm², pleated filter 264 cm², "no product storage". https://www.kiss.caltech.edu/workshops/isru/presentations/Hecht.pdf (accessed 2026-11-15)
7. Hecht, M., Hoffman, J., Rapp, D. et al., *Mars Oxygen ISRU Experiment (MOXIE)*, Space Science Reviews 217, 9, 2021 (abstract only: ≥ 6 g/h at 5 Torr and 0 °C intake, > 98 % purity, ≥ 10 cycles). https://doi.org/10.1007/s11214-020-00782-8 (accessed 2026-11-15)
8. Air Squared, *Scroll technology headed to Mars on board Perseverance rover* (P09H026A-BLDC-SH; boosts 3.5–7 Torr up to 760 Torr). https://airsquared.com/news/scroll-technology-headed-to-mars-on-board-perseverance-rover/ (accessed 2026-11-15)
9. NASA/JPL-Caltech, images PIA24201, PIA24177, PIA24203, PIA23154, NASA Image and Video Library. https://images.nasa.gov (accessed 2026-11-15)
