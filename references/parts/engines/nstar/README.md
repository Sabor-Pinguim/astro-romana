---
id: nstar
name: "NSTAR 30 cm xenon ion thruster (Deep Space 1 / Dawn)"
category: engine
role: electric
tier: 2
propellants: [xenon]
manufacturer: NASA Glenn / JPL design; built by Hughes Electron Dynamics (later Boeing EDD, L-3 ETI)
vehicles: ["Deep Space 1 (1 thruster)", "Dawn (3 thrusters on 2-axis gimbals)"]
status: retired (checked 2026-11)
---

# NSTAR

NSTAR is NASA's first deep-space ion engine: a 30 cm (28.6 cm active grid) gridded xenon thruster that ionises xenon in a magnetic-cusp discharge chamber and accelerates the ions through two molybdenum grids at ~1,100 V. Its thrust is tiny (20–93 mN) but its Isp (2,000–3,200 s) is ten times a chemical engine's, so it can run for years. One flew on Deep Space 1 (1998) and three on Dawn (2007), which used them for a record ~11.5 km/s of Δv to orbit Vesta and Ceres; Dawn also flew past Mars (gravity assist, 2009).

**Why tier 2:** proven, mid-power (≤ 2.6 kW) electric engine; the tier-3 NEXT-C gives 2.5× the thrust and higher Isp but needs ~3× the power and a heavier PPU.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 8.9 | kg | [2] ⚠ | Dawn thruster, each; the NSTAR-derived ST4 mass list gives 8.34 kg [5]. PPU, gimbal and feed system not included (see Notes below) |
| `thrust_sl` | n/a | kN | | vacuum only |
| `thrust_vac` | 0.0000927 | kN | [1] | 92.7 mN at TH15 (full power); range 20.7–92.7 mN (TH0–TH15). Dawn press kit: 19–91 mN [2] |
| `isp_sl` | n/a | s | | |
| `isp_vac` | 3127 | s | [1] | at TH15; range 1,979 (TH0) – 3,196 s (TH11) |
| `mass_flow` | 0.00000302 | kg/s | derived | `0.0927 N / (3127 · g0)` = 3.02 mg/s (beam). Dawn press kit: ~3.25 mg/s total xenon at max thrust (includes cathode flows) [2] |
| `mixture_ratio` | n/a | O/F by mass | | |
| `cycle` | gridded ion | — | [1] | ring-cusp DC electron-bombardment discharge, 2 grids, hollow-cathode neutraliser |
| `chamber_pressure` | n/a | MPa | | |
| `expansion_ratio` | n/a | — | | |
| `throttle_min` | 22 | % | derived [1] | TH0 thrust / TH15 thrust = 20.7 / 92.7 |
| `gimbal_range` | n/f | ° | | Dawn: 2-axis gimbal per thruster [2], range n/f; the ST4 design specified ±10° [5] ⚠ |
| `restarts` | n/f | count | | many hundreds of starts in flight; no rated number found |
| `burn_time_max` | 58554000 | s | [3] | DS1 flight thruster: 16,265 h of operation. Ground life test of the DS1 spare: 30,352 h [3][6] |
| `total_impulse` | 7.1 | MN·s | est. [6] | 235 kg xenon processed in the 30,352 h life test × ~3,100 s · g0 (mixed throttle levels, so approximate) |
| `power_electric` | 2567 | W | [1] | PPU input at TH15 (thruster input 2,325 W); range 577–2,567 W PPU input (518–2,325 W thruster input) across TH0–TH15 |
| `ignition` | hollow cathode | — | [1] | heated discharge and neutraliser cathodes with keeper electrodes |
| `reusable` | n/a | — | | runs for years on one mission |
| `cost_unit` | n/f | USD (year) | | |
| `twr` | 0.00106 | — | derived | `0.0927 N / (8.9 kg · g0)` |
| `height` | 0.33 | m | [2] | thruster length (Dawn press kit) |
| `diameter_max` | 0.41 | m | [2] | thruster diameter (Dawn press kit) |
| `first_flight` | 1998 | year | [4] | Deep Space 1, launched 24 Oct 1998 |
| `flights` | 2 | count | [2][4] | spacecraft: Deep Space 1 (1 thruster), Dawn (3 thrusters) |

**Thruster efficiency η (for `P_in = F · Isp · g0 / (2η)`):** 61.8 % at TH15, 63.1 % peak (TH11), 42.0 % at TH0 [1]. Check at TH15: 0.0927 · 3127 · 9.80665 / (2 · 0.618) = 2,300 W ≈ 2,325 W thruster input.

**Throttle table** (DS1, from Brophy via [1]; PPU input W / thruster input W / thrust mN / Isp s / η %): TH15 2567/2325/92.7/3127/61.8 · TH12 2137/1960/78.4/3181/62.8 · TH8 1579/1456/57.9/3115/61.1 · TH4 1111/1018/37.4/2942/55.4 · TH0 577/518/20.7/1979/42.0.

**PPU and other ion-system parts (not in `mass_dry`):** PPU 14.82 kg, DCIU (controller) 2.80 kg per unit in the NSTAR-based ST4 mass list [5]; NSTAR PPU efficiency ~0.92 at full power [7]; DS1's whole ion subsystem (thruster, PPU, controller, cables, xenon feed) was 48 kg dry [4]. Dawn carried 2 PPUs for its 3 thrusters [8].

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Deep Space 1 | Dawn | Unit | Source | Note |
|---|---|---|---|---|---|
| `vehicle` | Deep Space 1 | Dawn | — | [4][2] | |
| `stage` | spacecraft primary propulsion | spacecraft primary propulsion | — | | |
| `parts_per_stage` | 1 | 3 | count | [4][2] | Dawn fires one thruster at a time [2] |
| `stage_mass_dry` | ~419 | 747.1 | kg | derived [4] / [2] | DS1: ~500 kg wet − 81 kg xenon (hydrazine not subtracted) |
| `stage_propellant_mass` | 81 | 425 | kg | [4][2] | xenon; Dawn also carried 45.6 kg hydrazine for attitude control |
| `stage_burn_time` | 58554000 | 184982400 | s | [3][9] | DS1 16,265 h; Dawn 2,141 days of thrusting (5.9 years) |
| `stage_delta_v` | 5400 | 11500 | m/s | derived / [9] | DS1: `3100 · g0 · ln(500/419)`, est.; Dawn: 41,400 km/h ≈ 11.5 km/s achieved [9] |
| `vehicle_liftoff_mass` | n/f | n/f | kg | | |
| `vehicle_height` | n/f | n/f | m | | |
| `vehicle_diameter` | n/f | n/f | m | | |
| `payload_leo` | n/a | n/a | kg | | |
| `payload_gto` | n/a | n/a | kg | | |
| `payload_mars` | n/a | n/a | kg | | |
| `cost_launch` | n/f | n/f | USD (year) | | |
| `mars_heritage` | none | Mars gravity assist, 4 Feb 2009 | — | [2] | |

Launch vehicles: DS1 on a Delta II 7326 [7]; Dawn on a Delta II 7925H-9.5 [8] (the Dawn press kit prints "2925H" ⚠ [2]); Dawn launch mass 1,217.7 kg [2].

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Thruster length | 0.33 | [2] | |
| Thruster diameter (overall) | 0.41 | [2] | outer plasma-screen/mask |
| Active grid diameter | 0.286 | [1] | "30 cm" class |
| Mask inner opening | 0.30 | est. | `in-context-1.jpg`, grid fills ~73 % of the mask width |
| Discharge chamber rear (cone top) diameter | 0.20 | est. | typical NSTAR cylinder-plus-cone chamber; no drawing found |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A squat drum, wider than it is long. The front (exhaust) face is a flat annular mask around a large, very slightly domed, finely perforated metal grid (it reads as a smooth grey disc). The side is a cylindrical metal plasma screen; at the back the body steps in to a smaller cone/cylinder where the propellant line and cables enter and the gimbal mounts attach. A small neutraliser cathode (a short tube on a bracket) sits at the edge of the front face, pointing along the beam (visible at the bottom of `in-context-1.jpg`). In operation (`three-quarter-1.jpg`) the grid glows blue and the plume is a faint blue cone.

### 4.2 Node hierarchy

```text
Nstar                         origin: mount interface (centre of the rear gimbal mounting plane)
├─ Attach_Top                 (0, 0, 0)
├─ Gimbal                     pivot at (0, 0, 0), 2-axis; all meshes go here
│  └─ Gimbal_Aluminum / _Titanium / _Steel
└─ FX_Exhaust                 child of Gimbal, (0, -0.33, 0), rotation [180, 0, 0], preset exhaust_ion
```

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Gimbal | lathe | profile `Body` (rear cone + drum) | (0, 0, 0) | (0,0,0) | Aluminum | 16 |
| 2 | Gimbal | cylinder | r 0.143, h 0.005 (grid disc) | (0, -0.327, 0) | (0,0,0) | Titanium | 16 |
| 3 | Gimbal | torus | R 0.18, r 0.025 (front mask ring) | (0, -0.325, 0) | (90,0,0) | Steel | 16×4 |
| 4 | Gimbal | cylinder | r 0.012, h 0.06 (neutraliser) | (0, -0.30, 0.19) | (0,0,0) | Steel | 6 |

### 4.4 Revolved profiles

```text
Body: (0.10, 0.0) (0.10, -0.04) (0.17, -0.10) (0.205, -0.13) (0.205, -0.32) (0.15, -0.325)
```

### 4.5 Simplify

- No grid holes: a flat disc is enough. Drop cables, propellant isolators and thermal blankets.
- Keep the neutraliser stub: it breaks the symmetry and shows which way the engine faces.
- The perforated ring in `in-context-1.jpg` is DS1's spacecraft adapter, not part of the thruster.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 500 |
| Meshes | ≤ 3 |
| Height / diameter | 0.33 / 0.41 m, ±2% |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| three-quarter-1.jpg | three-quarter | NSTAR thruster firing in a JPL vacuum chamber: blue grid glow, faint beam, mask ring | https://images.nasa.gov/details/PIA04247 | NASA/JPL | Public domain (NASA) |
| in-context-1.jpg | in-context | DS1 lifted at KSC, looking into the aft end: grid disc, mask, neutraliser at bottom, inside the perforated adapter ring | https://images.nasa.gov/details/PIA04232 | NASA | Public domain (NASA) |

**Linked only** (useful but not freely licensed, so not downloaded):

- none (Commons "Deep Space 1 ion engine.jpg" and "Ion engine.svg" are public domain; not downloaded because Commons rate-limited the session).

## 6. Gaps and cautions

- Thruster mass: 8.9 kg (Dawn) vs 8.34 kg (ST4 list) ⚠. Dawn PPU mass and gimbal range not found; the PPU mass given is the NSTAR-based ST4 value.
- Total impulse is an estimate; no rated value found.
- No side-view photo or dimensioned drawing; the body profile is estimated from the 0.33 × 0.41 m envelope.

## 7. Sources

1. Goebel, D. M.; Katz, I., *Fundamentals of Electric Propulsion: Ion and Hall Thrusters*, JPL Space Science and Technology Series, 2008, ch. 9, Table 9-2 (NSTAR throttle table, from Brophy 2002). https://descanso.jpl.nasa.gov/SciTechBook/series1/Goebel_09_Chap9_Flight.pdf (accessed 2026-11-14)
2. NASA/JPL, *Dawn Launch Press Kit*, Sept 2007 (Quick Facts; Ion Propulsion System). https://www.jpl.nasa.gov/news/press_kits/dawn-launch.pdf (accessed 2026-11-14)
3. JPL, *Ion Engine Records No Tuneups, No Problems*, 30 July 2003. https://www.jpl.nasa.gov/news/ion-engine-records-no-tuneups-no-problems/ (accessed 2026-11-14)
4. Sovey, J. S., *Ion Thruster Used to Propel the Deep Space 1 Spacecraft to Comet Encounters*, NASA Glenn Research & Technology. https://ntrs.nasa.gov/citations/20050192364 (accessed 2026-11-14)
5. Brophy, J. R. et al., *The Ion Propulsion System on NASA's Space Technology 4/Champollion Comet Rendezvous Mission*, AIAA-99-2856, Table 1. https://ntrs.nasa.gov/citations/20000057277 (accessed 2026-11-14)
6. Herman, D. A., *Status of the NEXT Long-Duration Test After 30,352 Hours of Operation*, NASA/TM-2010-216817 (states NSTAR ELT: 30,352 h, 235 kg). https://ntrs.nasa.gov/citations/20110000522 (accessed 2026-11-14)
7. Sovey, J. S. et al., *Development of an Ion Thruster and Power Processor for New Millennium's Deep Space 1 Mission*, NASA TM-113129 / AIAA-97-2778. https://ntrs.nasa.gov/citations/19980017550 and Glenn summary https://ntrs.nasa.gov/citations/20050187017 (accessed 2026-11-14)
8. JPL Dawn IPS team, *In-Flight Operation of the Dawn Ion Propulsion System – The First Nine Months* (abstract: Delta-II 7925H-9.5) and *Dawn Ion Propulsion System – Initial Checkout After Launch* (3 thrusters with gimbals, 2 PPUs), NTRS records. https://ntrs.nasa.gov/citations/20150014763 and https://ntrs.nasa.gov/citations/20150014772 (accessed 2026-11-14)
9. Rayman, M., *Dear Dawnniversaries* (Dawn Journal), JPL blog, Sept 2018. https://www.jpl.nasa.gov/blog/2018/9/dear-dawnniversaries (accessed 2026-11-14)
