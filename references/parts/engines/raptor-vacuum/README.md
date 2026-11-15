---
id: raptor-vacuum
name: Raptor Vacuum (Raptor 3 RVac, Starship V3)
category: engine
role: upper-stage
tier: 3
propellants: [LOX, CH4]
manufacturer: SpaceX
vehicles: ["Starship ship (upper stage), V3/Block 3"]
status: in-development (checked 2026-11)
---

# Raptor Vacuum

The vacuum version of SpaceX's Raptor, a full-flow staged-combustion methane/oxygen engine. It keeps the Raptor powerhead and regeneratively cooled chamber and adds a large nozzle extension made of brazed steel tubes, for higher Isp in space. The Starship ship carries **3 Raptor Vacuum + 3 sea-level Raptors**; on the current V3 ship (first flight 2026-05-22) these are Raptor 3 engines. The vacuum engines do not gimbal: steering is done by the sea-level engines.

**Why tier 3:** about 2.7× the thrust of a Merlin Vacuum with ~9% more Isp, designed for reuse and in-orbit refilling; still in flight testing.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | n/f | kg | | SpaceX gives 1,525 kg for the sea-level Raptor 3 only [1]; the vacuum nozzle adds mass |
| `thrust_sl` | n/a | kN | | vacuum-only (cannot fire at sea level without flow separation) |
| `thrust_vac` | 2,697 ⚠ | kN | [1] | 275 tf, SpaceX "Introducing Starship V3" (2026-05-12) as quoted by Wikipedia (the SpaceX page needs JavaScript). Raptor 2 RVac: 258 tf = 2,530 kN |
| `isp_sl` | n/a | s | | |
| `isp_vac` | 380 ⚠ | s | [1] | long-standing SpaceX target for the vacuum Raptor; no measured value published |
| `mass_flow` | 724 | kg/s | derived | `thrust_vac / (isp_vac · g0)` = 2,696,800 / (380 × 9.80665) |
| `mixture_ratio` | 3.6 ⚠ | O/F by mass | [1] | Wikipedia infobox (78% O2 / 22% CH4) |
| `cycle` | full-flow staged combustion | — | [1] | oxygen-rich and fuel-rich preburners, two turbopumps |
| `chamber_pressure` | ≈ 30 ⚠ | MPa | [1] | "roughly 300 bar" target stated by Musk in 2018 for Raptor; Raptor 3 value not published |
| `expansion_ratio` | n/f | — | | not published; 2016 plan was 200:1 ⚠; our geometry estimate gives ≈ 117 (section 3) |
| `throttle_min` | 40 ⚠ | % | [1] | Wikipedia "40–100%", not specific to the vacuum version |
| `gimbal_range` | none ⚠ | ° | [1] | RVac are fixed on the ship; the 3 sea-level engines gimbal |
| `restarts` | n/f | count | | in-space relights so far used a sea-level Raptor (flights 13, 14) [1] |
| `burn_time_max` | n/f | s | | |
| `total_impulse` | n/f | MN·s | | |
| `power_electric` | n/f | W | | turbine-driven; ignition and avionics power not published |
| `ignition` | torch igniters ⚠ | — | [1] | torch igniters in the preburners; Raptor 3 has a "redesigned ignition system" |
| `reusable` | yes (design), not yet reflown ⚠ | — | [1] | first ship tower catch reported on flight 15 (2026-11-14); recheck |
| `cost_unit` | n/f | USD (year) | | Musk's 2019 goals (< US$1 M per Raptor 1, < US$250 k for Raptor 2) are targets, not prices |
| `twr` | n/f | — | derived | needs `mass_dry` |
| `height` | 4.7 (est.) | m | est. | see section 3 |
| `diameter_max` | 2.4 ⚠ | m | [1] | nozzle exit; SpaceX 2018 figure for Raptor Vacuum, not confirmed for Raptor 3 |
| `first_flight` | 2023 | year | [1] | first in-flight RVac ignition on Starship flight 2 (Ship 25); Raptor 3 RVac first flew 2026-05-22 (flight 12) |
| `flights` | 14 ⚠ | count | [1] | Starship flights 2–15 fired RVacs (flight 15 launched 2026-11-13); 3 engines per flight; Raptor 3 RVac: 4 flights (12–15) |

## 2. Vehicle and stage data

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | Starship V3 (Block 3) | — | [1] [2] | |
| `stage` | ship (upper stage) | — | [2] | |
| `parts_per_stage` | 3 | count | [2] | plus 3 sea-level Raptor 3 |
| `stage_mass_dry` | n/f | kg | | "about 100 t" is quoted for earlier ships ⚠ [2] |
| `stage_propellant_mass` | 1,600,000 ⚠ | kg | [2] | Wikipedia infobox for Block 3 |
| `stage_burn_time` | n/f | s | | |
| `stage_delta_v` | n/f | m/s | derived | needs dry mass |
| `vehicle_liftoff_mass` | ≈ 5,000,000 ⚠ | kg | [2] | |
| `vehicle_height` | 124.4 ⚠ | m | [2] | Block 3 stack |
| `vehicle_diameter` | 9 | m | [2] | |
| `payload_leo` | ≈ 100,000 ⚠ | kg | [2] | Block 3, reusable, not yet demonstrated; flight 14 deployed 26 Starlink V3 |
| `payload_gto` | n/f | kg | | needs in-orbit refilling |
| `payload_mars` | n/f | kg | | Mars missions need several refilling flights; no figure published |
| `cost_launch` | n/f | USD (year) | | |
| `mars_heritage` | none | — | [3] | SpaceX's plan for uncrewed Starships in the late-2026 Mars window was reportedly dropped in early 2026 ⚠; next window late 2028 |

## 3. Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Nozzle exit diameter | 2.4 ⚠ | [1] | 2018 SpaceX figure |
| Sea-level Raptor height / exit diameter | 3.1 / 1.3 ⚠ | [1] | Wikipedia infobox; used to scale the shared powerhead |
| Throat diameter | 0.22 (est.) | derived | 1.3 / √34.34 (sea-level ε ⚠) |
| Powerhead + chamber (mount to throat) | 1.45 (est.) | est. | 3.1 m − 1.6 m sea-level bell (80% bell rule, 15° cone: 0.8 × (0.65 − 0.11) / tan 15°) |
| Vacuum bell length (throat to exit) | 3.25 (est.) | est. | 80% bell rule: 0.8 × (1.20 − 0.11) / tan 15° |
| Overall height | 4.7 (est.) | est. | 1.45 + 3.25. Implied ε ≈ (2.4 / 0.22)² ≈ 117 |
| Regen section / tube extension joint | y ≈ -2.3, r ≈ 0.72 (est.) | est. | side-1.jpg: the green regen nozzle is ~⅓ of the bell length |

## 4. Low-poly model

Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

Top: the Raptor **powerhead** — a short wide steel "puck" (thrust mount) with two stacked turbopump housings left and right, a fat curved hot-gas duct, and tightly packed plumbing (Raptor 3 has almost no external pipes). Middle: the **main chamber and regenerative nozzle**, olive-green/brown oxidised copper-steel (side-1.jpg, engines "57" and "33"). Bottom half: a wide, almost straight-sided **extension of vertical steel tubes**, bright silver with fine vertical lines, ending in a 2.4 m mouth. The whole engine is bigger than a person (side-1.jpg). No gimbal actuators.

### 4.2 Node hierarchy

```text
RaptorVacuum                  origin: mount interface (top of thrust puck)
├─ Attach_Top                 (0, 0, 0)
├─ (no Gimbal: fixed engine)  meshes are children of the root: RaptorVacuum_Steel, _Copper, _Metal
└─ FX_Exhaust                 (0, -4.70, 0), rotation [180, 0, 0], preset exhaust_methalox
```

### 4.3 Parts

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | RaptorVacuum | cylinder (thrust puck) | r 0.35, h 0.15 | (0, -0.075, 0) | (0, 0, 0) | Steel | 16 |
| 2 | RaptorVacuum | cylinder (oxygen turbopump) | r 0.22, h 0.55 | (0.32, -0.45, 0) | (0, 0, 0) | Steel | 8 |
| 3 | RaptorVacuum | cylinder (methane turbopump) | r 0.20, h 0.55 | (-0.32, -0.45, 0) | (0, 0, 0) | Steel | 8 |
| 4 | RaptorVacuum | cylinder (preburner / hot-gas manifold) | r 0.30, h 0.40 | (0, -0.55, 0) | (0, 0, 0) | Steel | 8 |
| 5 | RaptorVacuum | lathe (chamber + regen nozzle) | profile A | (0, 0, 0) | (0, 0, 0) | Copper | 16 |
| 6 | RaptorVacuum | lathe (tube extension) | profile B | (0, 0, 0) | (0, 0, 0) | Steel | 16 |
| 7 | RaptorVacuum | torus (manifold ring at joint) | R 0.73, tube r 0.05 | (0, -2.30, 0) | (90, 0, 0) | Metal | 16 × 4 |
| 8 | RaptorVacuum | cylinder (hot-gas duct) | r 0.10, h 0.70 | (0.30, -0.95, 0.15) | (0, 0, 20) | Metal | 6 |
| 9 | RaptorVacuum | cylinder (fuel coolant line) | r 0.06, h 1.30 | (-0.40, -1.55, 0) | (0, 0, -12) | Metal | 6 |

### 4.4 Revolved profiles

```text
A chamber+regen: (0.26, -0.75) (0.26, -1.20) (0.15, -1.38) (0.11, -1.45) (0.25, -1.65) (0.45, -1.95) (0.62, -2.15) (0.72, -2.30)
B extension:     (0.72, -2.30) (0.86, -2.80) (0.98, -3.35) (1.08, -3.90) (1.15, -4.35) (1.20, -4.70)
```

### 4.5 Simplify

- Raptor 3 hides most plumbing inside the structure: keep only the two pump housings, one duct and one line.
- Represent the extension tubes with the Steel material; do not model individual tubes.
- Keep the colour split (green regen nozzle / silver tube extension): it is how players recognise an RVac.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 1,500 (est. ~800) |
| Meshes | ≤ 3 (Steel, Copper, Metal) |
| Height / diameter | 4.7 (est.) / 2.4 ⚠ (±2%) |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| side-1.jpg | side | Two Raptor 2 Vacuum engines ("57", "33") behind a sea-level Raptor 2 (right), with a person for scale: powerhead, green regen nozzle, silver tube extension. Raptor 3 has a cleaner powerhead but the same nozzle layout. | https://commons.wikimedia.org/wiki/File:A_person_viewing_Raptor_Vacuum.jpg | NASA | Public domain |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://www.spacex.com/vehicles/starship/ — SpaceX Starship page and V3 update with Raptor 3 photos.
- https://www.spacex.com/launches/starship-flight-12/ — flight 12 (first V3 / Raptor 3) photos.

## 6. Gaps and cautions

- Almost every number is SpaceX-stated through Wikipedia or a target (⚠); mass, Isp (measured), expansion ratio and dimensions are not published.
- Height and throat are our estimates from the sea-level Raptor; recheck when SpaceX publishes Raptor 3 RVac data.
- Status: in flight testing; RVac early shutdowns on flights 12 and 14. Flight 15 (2026-11-13/14) outcome to recheck.
- No SpaceX logo or serial numbers on the model.

## 7. Sources

1. Wikipedia, *SpaceX Raptor* (secondary; cites SpaceX *Introducing Starship V3*, 2026-05-12, the 2020 SpaceX Starship page and Musk statements 2016–2024). https://en.wikipedia.org/wiki/SpaceX_Raptor (accessed 2026-11-14)
2. Wikipedia, *SpaceX Starship* (secondary; infobox and flight history to flight 15). https://en.wikipedia.org/wiki/SpaceX_Starship (accessed 2026-11-14)
3. Analytics Insight, *SpaceX Delays 2026 Mars Mission, Shifts Starship Focus to NASA Moon Landing*, 2026. https://www.analyticsinsight.net/news/spacex-delays-2026-mars-mission-shifts-starship-focus-to-nasa-moon-landing (accessed 2026-11-14)
