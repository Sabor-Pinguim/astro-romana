---
id: aj10-190
name: "AJ10-190 (Space Shuttle OMS engine, flown on Orion as OMS-E)"
category: engine
role: in-space
tier: 3
propellants: [MMH, NTO (MON-3)]
manufacturer: Aerojet (now L3Harris Aerojet Rocketdyne)
vehicles: ["Orion European Service Module, main engine (1)"]
status: operational (checked 2026-11)
---

# AJ10-190 (OMS-E)

The AJ10-190 is the 26.7 kN (6,000 lbf) hypergolic engine that flew in the Space Shuttle's two Orbital Maneuvering System pods. Refurbished Shuttle units now serve as the **OMS-E**, the main engine of Orion's European Service Module: it performed the big lunar burns of Artemis I (2022) and Artemis II (crewed lunar flyby, splashdown 10 April 2026). It is pressure-fed, gimbals ±7° and has a large, dark radiation-cooled niobium nozzle extension.

**Why tier 3:** ~55× the thrust of the tier-2 R-4D with similar Isp (316 s), but 118 kg, out of production and rated for human spaceflight.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 118 | kg | [1] | 260 lbm |
| `thrust_sl` | n/a | kN | | vacuum engine |
| `thrust_vac` | 26.7 | kN | [1] | 6,000 lbf at rated thrust |
| `isp_sl` | n/a | s | | |
| `isp_vac` | 316 | s | [1] | |
| `mass_flow` | 8.61 | kg/s | derived | `26.7 kN / (316 · g0)` = 8.61; the data sheet also gives 8.61 kg/s [1] |
| `mixture_ratio` | n/f | O/F by mass | | not in the data sheet read; 1.65 is often quoted for the Shuttle OMS ⚠ (unverified) |
| `cycle` | pressure-fed | — | [1] | regeneratively cooled chamber + radiation-cooled nozzle extension |
| `chamber_pressure` | 0.862 | MPa | [1] | 125 psia |
| `expansion_ratio` | 55 | — | [1] | |
| `throttle_min` | n/a | % | | not throttleable |
| `gimbal_range` | 7 | ° | [1] | ±7° |
| `restarts` | 1000 | count | [1] | rated total starts |
| `burn_time_max` | 350 | s | [3] ⚠ | Artemis II free-return burn as reported for ESA (read from a search summary of [3], not the page itself); rated cumulative firing 54,000 s [1] |
| `total_impulse` | 1440 | MN·s | [1] | rated life (324,000,000 lbf·s) |
| `power_electric` | 125 | W | [1] | valves, all coils energised, 28 V |
| `ignition` | hypergolic | — | [1] | |
| `reusable` | yes | — | [1] | reused across Shuttle missions; each Orion ESM is expended at re-entry [3] |
| `cost_unit` | n/f | USD (year) | | not published |
| `twr` | 23.1 | — | derived | `26.7 kN / (118 kg · g0)` |
| `height` | 1.956 | m | [1] | 77 in |
| `diameter_max` | 1.168 | m | [1] | 46 in (nozzle exit) |
| `first_flight` | n/f | year | | Shuttle era (1981 ⚠, not verified this session); first Orion use: Artemis I, 2022 [2] |
| `flights` | 2 | count | [2][3] | Orion missions (Artemis I, Artemis II) as of 2026-11; Shuttle flights not counted |

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | Orion (Artemis I, Artemis II) | — | [2][3] | launched on SLS Block 1 |
| `stage` | European Service Module main engine | — | [2] | |
| `parts_per_stage` | 1 | count | [2] | plus 8 auxiliary thrusters (see [R-4D](../r-4d/README.md)) and reaction-control thrusters |
| `stage_mass_dry` | n/f | kg | | |
| `stage_propellant_mass` | n/f | kg | | |
| `stage_burn_time` | n/f | s | | |
| `stage_delta_v` | n/f | m/s | | |
| `vehicle_liftoff_mass` | n/f | kg | | |
| `vehicle_height` | n/f | m | | ESA: the service module is ~4 m long including main engine and tanks [4] |
| `vehicle_diameter` | n/f | m | | |
| `payload_leo` | n/a | kg | | spacecraft |
| `payload_gto` | n/a | kg | | |
| `payload_mars` | n/a | kg | | |
| `cost_launch` | n/f | USD (year) | | |
| `mars_heritage` | none | — | | lunar missions only |

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Overall height | 1.956 | [1] | |
| Nozzle exit diameter | 1.168 | [1] | engine envelope diameter; `side-1.jpg` exit rim scales to 1.20 m |
| Nozzle extension length | 1.32 | est. | `side-1.jpg`, scaled with the 1.956 m height (2.56 mm/px) |
| Chamber/nozzle joint outer diameter | 0.45 | est. | `side-1.jpg`, same scale |
| Valve and plumbing block | 0.64 wide × 0.54 tall | est. | `side-1.jpg`, same scale |
| Throat diameter | 0.146 | derived | `A_t = F / (p_c · C_F)` with C_F ≈ 1.85 assumed → 0.0167 m² |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

In `side-1.jpg` and `three-quarter-1.jpg` the engine stands nozzle-up on a test fixture; flip it for the model. Top of the model (mount): a dense, roughly cubic block of valves, ball-valve actuators and bent tubes (silver steel with a few red caps), about 0.64 m wide. Below it, a dark, rounded chamber section (~0.45 m) where the nozzle joins. Then the dominant feature: a huge, smooth, dark charcoal nozzle extension that flares almost conically to a 1.17 m mouth with a thin lip ring; faint circumferential weld seams every ~0.25 m. In flight (`in-context-1.jpg`) only the nozzle and a ring of smaller auxiliary thrusters are visible behind the white service module.

### 4.2 Node hierarchy

```text
Aj10190                       origin: mount interface (top of the valve block)
├─ Attach_Top                 (0, 0, 0)
├─ Gimbal                     pivot at (0, -0.54, 0), ±7°; chamber and nozzle go here
│  └─ Gimbal_NozzleDark / Gimbal_Steel
├─ Aj10190_Steel / _Metal     valve and plumbing block (fixed)
└─ FX_Exhaust                 (0, -1.956, 0), rotation [180, 0, 0], preset exhaust_hypergolic
```

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Aj10190 | box | 0.64, 0.54, 0.50 (valves/injector head) | (0, -0.27, 0) | (0,0,0) | Steel | — |
| 2 | Aj10190 | torus | R 0.22, r 0.03 (propellant manifold) | (0, -0.45, 0) | (90,0,0) | Metal | 8×5 |
| 3 | Aj10190 | cylinder | r 0.03, h 0.40 (fuel line) | (0.28, -0.25, 0.10) | (0,0,15) | Metal | 6 |
| 4 | Aj10190 | cylinder | r 0.03, h 0.40 (oxidiser line) | (-0.28, -0.25, 0.10) | (0,0,-15) | Metal | 6 |
| 5 | Gimbal | lathe | profile `Chamber` | (0, 0, 0) | (0,0,0) | NozzleDark | 12 |
| 6 | Gimbal | lathe | profile `Extension` | (0, 0, 0) | (0,0,0) | NozzleDark | 16 |

### 4.4 Revolved profiles

```text
Chamber:   (0.18, -0.54) (0.225, -0.58) (0.225, -0.62) (0.20, -0.64)
Extension: (0.20, -0.64) (0.27, -0.80) (0.35, -1.05) (0.43, -1.35) (0.51, -1.65) (0.565, -1.90) (0.584, -1.94) (0.584, -1.956)
```

### 4.5 Simplify

- Merge all valves, actuators and small lines into the box plus two feed lines; drop wiring, thermocouples and test-stand legs.
- Keep the nozzle lip ring (last two profile points) and the size contrast between the small head and the big bell.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 900 |
| Meshes | ≤ 4 |
| Height / diameter | 1.956 / 1.168 m, ±2% |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| side-1.jpg | side | OMS engine at JSC, 28 Mar 2016, nozzle up, one person for scale; best view of the plumbing head and nozzle proportions | https://images.nasa.gov/details/jsc2022e045018 | NASA JSC | Public domain (NASA) |
| three-quarter-1.jpg | three-quarter | Same engine from a higher, frontal angle with the team; shows the nozzle seams and the valve block layout | https://images.nasa.gov/details/jsc2022e045016 | NASA JSC | Public domain (NASA) |
| in-context-1.jpg | in-context | Artemis I in flight: aft of the service module, OMS-E nozzle at centre with auxiliary thrusters around it | https://images.nasa.gov/details/art001e001619 | NASA JSC | Public domain (NASA) |

**Linked only** (useful but not freely licensed, so not downloaded):

- none

## 6. Gaps and cautions

- Mixture ratio, first Shuttle flight year and Orion stage masses not verified in this pass (n/f).
- Only a limited stock of ex-Shuttle OMS engines exists; a replacement Orion main engine for later Artemis missions is widely reported but was not verified here ⚠.
- Artemis II press coverage reported a helium-pressurisation leak in the service module oxidiser system, handled by blow-down for the last burns ⚠ (search summaries only): a possible "real event" card once checked, not an engine fault.
- No logos: the service module carries ESA/NASA marks in photos.

## 7. Sources

1. Aerojet Rocketdyne, *In-Space Propulsion Data Sheets*, "AJ10-190 Space Shuttle OMS Rocket Engine", 4/8/2020. https://web.archive.org/web/20221105032748/https://www.rocket.com/sites/default/files/documents/In-Space%20Data%20Sheets%204.8.20.pdf (accessed 2026-11-14)
2. NASA Image and Video Library, *The business end of Orion*, art001e001619 (Artemis I, 2022), caption. https://images.nasa.gov/details/art001e001619 (accessed 2026-11-14)
3. ESA, *N° 19-2026: Splashdown for Artemis II*, press release, April 2026. https://www.esa.int/Newsroom/Press_Releases/Splashdown_for_Artemis_II (accessed 2026-11-14)
4. ESA, *European Service Module*. https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Orion/European_Service_Module (accessed 2026-11-14)
5. NASA Image and Video Library, *OMS-E Engine*, jsc2022e045018 and jsc2022e045016. https://images.nasa.gov/details/jsc2022e045018 (accessed 2026-11-14)
