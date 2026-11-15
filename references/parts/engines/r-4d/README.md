---
id: r-4d
name: "R-4D-11 (490 N, ε 164:1)"
category: engine
role: in-space
tier: 2
propellants: [MMH, NTO (MON-3)]
manufacturer: Marquardt (original), now L3Harris Aerojet Rocketdyne
vehicles: ["Orion European Service Module, auxiliary thrusters (8)"]
status: in-production (checked 2026-11)
---

# R-4D-11

The R-4D is a ~490 N (110 lbf) bipropellant thruster that burns MMH with nitrogen tetroxide; the two liquids ignite on contact (hypergolic), so it can restart tens of thousands of times. The family began as the Apollo reaction-control thruster and is now the standard "apogee engine" for satellites. The **R-4D-11** has the most complete public data sheet (two nozzle sizes, 164:1 and 300:1); the 164:1 version is used here. The newer **R-4D-15 HiPAT** (445 N, Isp 320–322 s, 5.2–5.44 kg) is noted in section 6.

**Why tier 2:** about 4× the mass of the tier-1 MR-107 but with Isp ~311 s instead of ~230 s; much smaller and cheaper than the tier-3 AJ10-190 (26.7 kN, 118 kg).

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 3.76 | kg | [1] | ε 164:1; 4.31 kg with the 300:1 nozzle |
| `thrust_sl` | n/a | kN | | vacuum-only engine |
| `thrust_vac` | 0.490 | kN | [1] | nominal; steady-state range 378–511 N (set by inlet pressure) |
| `isp_sl` | n/a | s | | |
| `isp_vac` | 311 | s | [1] | at MR 1.65, ε 164:1; 315.5 s with ε 300:1 |
| `mass_flow` | 0.161 | kg/s | derived | `490 N / (311 · g0)` |
| `mixture_ratio` | 1.65 | O/F by mass | [1] | range 1.17–2.13 |
| `cycle` | pressure-fed | — | [1] | radiation-cooled C-103 niobium chamber/nozzle |
| `chamber_pressure` | 0.745 | MPa | [1] | 7.45 bar (108 psia) at nominal thrust; inlet ≥ 1.4 MPa (range 0.41–2.93 MPa) |
| `expansion_ratio` | 164 | — | [1] | 300:1 option |
| `throttle_min` | n/a | % | | fixed-thrust on/off engine; 378 N (77 %) is the low end of the inlet-pressure range [1] |
| `gimbal_range` | none | ° | | fixed |
| `restarts` | 31950 | count | [1] | qualified starts (performed on different engines) |
| `burn_time_max` | 12000 | s | [1] | demonstrated steady-state firing |
| `total_impulse` | 20.0 | MN·s | [1] ⚠ | 20,016,000 N·s demonstrated (2020 sheet); the 2024 L3Harris table lists 21.7 [2] |
| `power_electric` | n/f | W | | single-coil valve power not given in the sheets read |
| `ignition` | hypergolic | — | [1] | |
| `reusable` | no | — | | no recovered flights |
| `cost_unit` | n/f | USD (year) | | not published |
| `twr` | 13.3 | — | derived | `490 N / (3.76 kg · g0)` |
| `height` | 0.55 | m | est. | n/f in sources read; estimated as ~0.18 m valve/injector/chamber + 0.37 m bell nozzle (80 % bell, 15° equivalent cone, from the derived throat and exit radii in section 3) |
| `diameter_max` | 0.27 | m | derived ⚠ | nozzle exit `√(4 · 164 · A_t / π)` with `A_t = F / (p_c · C_F)`, C_F ≈ 1.93 assumed → 0.267 m. In `in-context-1.jpg` the auxiliary nozzles scale to ~0.3 m against the 1.17 m OMS-E exit (perspective) |
| `first_flight` | n/f | year | | R-4D family flew on Apollo (1960s) [2]; first R-4D-11 flight not found |
| `flights` | n/f | count | | "over 300 apogee-insertion missions" for the family [2] |

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | Orion (European Service Module) | — | [3] | |
| `stage` | service module auxiliary thrusters | — | [3] | back-up to the AJ10-190 main engine and for trajectory corrections |
| `parts_per_stage` | 8 | count | [3] | NASA caption: "Orion's 8 auxiliary thrusters". Their model (R-4D-11) is assumed by the catalogue, not confirmed by a primary source ⚠ |
| `stage_mass_dry` | n/f | kg | | |
| `stage_propellant_mass` | n/f | kg | | |
| `stage_burn_time` | n/f | s | | |
| `stage_delta_v` | n/f | m/s | | |
| `vehicle_liftoff_mass` | n/f | kg | | |
| `vehicle_height` | n/f | m | | |
| `vehicle_diameter` | n/f | m | | |
| `payload_leo` | n/a | kg | | spacecraft, not a launcher |
| `payload_gto` | n/a | kg | | |
| `payload_mars` | n/a | kg | | |
| `cost_launch` | n/f | USD (year) | | |
| `mars_heritage` | n/f | — | | no Mars orbiter confirmed with R-4D in the sources read; MRO used 170 N hydrazine engines [4] |

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Overall height | 0.55 | est. | see `height` |
| Nozzle exit diameter | 0.27 | derived ⚠ | ε 164:1; 0.36 m for ε 300:1 by the same method |
| Throat diameter | 0.021 | derived | `A_t = 490 / (745,000 · 1.93)` = 3.41×10⁻⁴ m² |
| Chamber diameter / length | 0.06 / 0.10 | est. | proportion typical of 100-lbf radiation-cooled thrusters; no drawing found |
| Valve + injector block | 0.10 × 0.08 × 0.08 | est. | |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A compact block on top (bipropellant valve with two feed tubes, fuel and oxidiser), a short narrow cylindrical chamber, then a long, thin-walled bell nozzle that flares from a 2 cm throat to a ~27 cm mouth. The nozzle is more than half of the length. In `in-context-1.jpg` (Orion service module, Artemis I) the auxiliary thrusters appear as pale, smooth bells grouped around the big OMS-E nozzle, canted slightly outward.

### 4.2 Node hierarchy

```text
R4d                           origin: mount interface (top of the valve block)
├─ Attach_Top                 (0, 0, 0)
├─ R4d_Steel / _NozzleDark    fixed engine, no Gimbal node
└─ FX_Exhaust                 (0, -0.55, 0), rotation [180, 0, 0], preset exhaust_hypergolic
```

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | R4d | box | 0.10, 0.08, 0.08 (valve + injector) | (0, -0.04, 0) | (0,0,0) | Steel | — |
| 2 | R4d | cylinder | r 0.006, h 0.08 (fuel tube) | (0.035, 0.03, 0) | (0,0,0) | Metal | 5 |
| 3 | R4d | cylinder | r 0.006, h 0.08 (oxidiser tube) | (-0.035, 0.03, 0) | (0,0,0) | Metal | 5 |
| 4 | R4d | lathe | profile `ChamberNozzle` | (0, 0, 0) | (0,0,0) | NozzleDark | 12 |

### 4.4 Revolved profiles

```text
ChamberNozzle: (0.030, -0.08) (0.030, -0.17) (0.0105, -0.185) (0.030, -0.22) (0.065, -0.30) (0.100, -0.40) (0.125, -0.49) (0.1335, -0.55)
```

### 4.5 Simplify

- Merge valve body, injector and heat-dam flange into one box; drop bolts, heaters and wiring.
- Keep the long, thin nozzle: it is what identifies the engine.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 300 |
| Meshes | ≤ 2 |
| Height / diameter | 0.55 / 0.27 m (both est.), ±2% |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| in-context-1.jpg | in-context | Aft of the Orion service module in flight (Artemis I, 30 Nov 2022): OMS-E at centre "surrounded by some of Orion's 8 auxiliary thrusters". Take nozzle shape, colour and size relative to OMS-E | https://images.nasa.gov/details/art001e001619 | NASA JSC | Public domain (NASA) |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://satcatalog.com/component/r-4d-11-490n-164-to-1 — R-4D-11 product photo (side view).

## 6. Gaps and cautions

- No dimensioned drawing found: height, exit and chamber sizes are derived/estimated; replace with data-sheet values if found.
- Valve power n/f. Total impulse 20.0 vs 21.7 MN·s ⚠.
- Heritage claims (Apollo, ATV, Orion ESM auxiliary thrusters) come from the manufacturer/catalogue only; the ESM count of 8 is confirmed by NASA, the model is not. No Mars orbiter with R-4D was confirmed.
- Alternative variant: R-4D-15 HiPAT — 445 N, Isp 320.6–322.2 s (ε 375:1), Pc 0.944 MPa, 5.2 kg (300:1) / 5.44 kg (375:1), 13.0 MN·s qualified [1].

## 7. Sources

1. Aerojet Rocketdyne, *In-Space Propulsion Data Sheets*, "R-4D-11 490 N" and "R-4D-15 HiPAT 445 N", 4/8/2020. https://web.archive.org/web/20221105032748/https://www.rocket.com/sites/default/files/documents/In-Space%20Data%20Sheets%204.8.20.pdf (accessed 2026-11-14)
2. L3Harris, *Bipropellant Rocket Engines* spec sheet, 2024. https://web.archive.org/web/20250208104943/https://www.l3harris.com/sites/default/files/2024-10/l3harris-ar-bipropellant-rocket-engines-2.pdf (accessed 2026-11-14)
3. NASA Image and Video Library, *The business end of Orion*, art001e001619, 2022 (caption). https://images.nasa.gov/details/art001e001619 (accessed 2026-11-14)
4. NASA/JPL, *Mars Reconnaissance Orbiter Launch Press Kit*, 2005. https://www.jpl.nasa.gov/news/press_kits/mro-launch.pdf (accessed 2026-11-14)
