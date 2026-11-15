---
# Copy this file to references/parts/<engines|tanks>/<id>/README.md and fill every field.
# Keep the section order and the key names. Unknown values: n/f. Do not delete rows.
id: <kebab-case, same as the folder>
name: <official name and variant, e.g. "Merlin 1D (Full Thrust)">
category: <engine | tank>
role: <engine: booster | upper-stage | in-space | electric — tank: stage | in-space>
tier: <1 | 2 | 3>
propellants: [<e.g. LOX, RP-1>]
manufacturer: <company or agency>
vehicles: [<vehicle and stage, e.g. "Falcon 9 stage 1">]
status: <operational | retired | in-development | in-production> (checked <YYYY-MM>)
---

# <Name>

<2–4 sentences: what it is, where it flies, what makes it different. Plain English.>

**Why tier <n>:** <one sentence comparing it with the other tiers of the same role (cost, size, performance).>

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

<!-- ENGINE rows (delete the TANK block) -->
| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | | kg | | engine only, without propellant |
| `thrust_sl` | | kN | | sea level; `n/a` for vacuum-only engines |
| `thrust_vac` | | kN | | |
| `isp_sl` | | s | | |
| `isp_vac` | | s | | |
| `mass_flow` | | kg/s | derived | `thrust_vac / (isp_vac · g0)` |
| `mixture_ratio` | | O/F by mass | | `n/a` for monopropellant/electric |
| `cycle` | | — | | gas generator, staged combustion, electric pump, pressure-fed, gridded ion, Hall… |
| `chamber_pressure` | | MPa | | |
| `expansion_ratio` | | — | | nozzle exit area / throat area |
| `throttle_min` | | % | | minimum throttle as % of rated thrust |
| `gimbal_range` | | ° | | ± degrees; `none` if fixed |
| `restarts` | | count | | in-flight restarts (`unlimited`, a number, or `0`) |
| `burn_time_max` | | s | | longest qualified/typical single burn |
| `total_impulse` | | MN·s | | mainly for electric and small in-space engines |
| `power_electric` | | W | | electric input power (pumps, controller, valves, thruster PPU) |
| `ignition` | | — | | TEA-TEB, spark, torch, hypergolic, catalyst bed… |
| `reusable` | | — | | yes/no and flights demonstrated |
| `cost_unit` | | USD (year) | | per engine; say the year of the dollars |
| `twr` | | — | derived | `thrust_sl (or vac) / (mass_dry · g0)` |
| `height` | | m | | overall, mount to nozzle exit |
| `diameter_max` | | m | | usually the nozzle exit |
| `first_flight` | | year | | |
| `flights` | | count | | as of the check date |

<!-- TANK rows (delete the ENGINE block) -->
| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | | kg | | tank structure only (no engines); say if it includes skirts/insulation |
| `propellant_mass` | | kg | | total usable propellant |
| `fuel_mass` | | kg | | |
| `oxidizer_mass` | | kg | | `n/a` for mono/electric |
| `mixture_ratio` | | O/F by mass | | of the engines it feeds |
| `volume_total` | | m³ | | |
| `volume_fuel` | | m³ | | |
| `volume_oxidizer` | | m³ | | |
| `propellant_fraction` | | — | derived | `propellant_mass / (propellant_mass + mass_dry)` |
| `material` | | — | | alloy/composite and construction (common bulkhead, balloon, COPV…) |
| `pressure_operating` | | MPa | | MEOP or flight pressure |
| `pressurant` | | — | | helium, autogenous, regulated… |
| `storage_temperature` | | K | | cryogenic propellants |
| `boil_off` | | %/day | | cryogenics; `n/a` for storable |
| `insulation` | | — | | foam, MLI, none |
| `power_electric` | | W | | heaters, sensors; `n/f` is common |
| `cost_unit` | | USD (year) | | |
| `diameter` | | m | | |
| `length` | | m | | overall, including domes and skirts |
| `first_flight` | | year | | |
| `flights` | | count | | as of the check date |

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | | — | | name and version |
| `stage` | | — | | which stage uses this part |
| `parts_per_stage` | | count | | e.g. 9 engines, 1 tank set |
| `stage_mass_dry` | | kg | | |
| `stage_propellant_mass` | | kg | | |
| `stage_burn_time` | | s | | |
| `stage_delta_v` | | m/s | derived | Tsiolkovsky with the payload/upper stages stated in Note |
| `vehicle_liftoff_mass` | | kg | | |
| `vehicle_height` | | m | | |
| `vehicle_diameter` | | m | | |
| `payload_leo` | | kg | | say orbit and recovery mode |
| `payload_gto` | | kg | | |
| `payload_mars` | | kg | | trans-Mars injection (TMI) or C3 stated; `n/f` if none |
| `cost_launch` | | USD (year) | | |
| `mars_heritage` | | — | | Mars missions that used this part/vehicle, if any |

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| <e.g. Overall height> | | | |
| <e.g. Nozzle exit diameter> | | | |
| <e.g. Throat diameter> | | | |
| <e.g. Combustion chamber diameter / length> | | | |
| <e.g. Tank barrel length, dome height> | | | |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

<What you see from each side, top to bottom. Which features define the silhouette and must stay. Refer to the images by file name.>

### 4.2 Node hierarchy

```text
<Id in PascalCase>            origin: <mount interface | bottom interface>
├─ Attach_Top                 (0, 0, 0)
├─ Gimbal                     engines: pivot at (x, y, z); moving meshes go here
│  └─ ...
└─ FX_Exhaust                 engines: nozzle exit centre, rotation [180, 0, 0], preset <exhaust_*>
```

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | | cylinder / cone / lathe / sphere / box / torus | r_top, r_bottom, h — or w, h, d | | | | |

### 4.4 Revolved profiles

For each `lathe` row: points `(radius, y)` from top to bottom, in metres. 5–10 points per profile.

```text
<Name>: (r, y) …
```

### 4.5 Simplify

- <What to merge or drop (bolts, wiring, small lines), what to keep even if small.>

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ <n> |
| Meshes | ≤ <n> |
| Height / diameter | <values from section 3, ±2%> |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| | | | | | |

**Linked only** (useful but not freely licensed, so not downloaded):

- <url> — <what it shows>

## 6. Gaps and cautions

- <Values not found, sources that disagree, status to recheck, symbols to leave off the model.>

## 7. Sources

1. <Author/organization, *title*, year. URL (accessed YYYY-MM-DD)>
