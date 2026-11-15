---
id: rs-25
name: "RS-25D (SLS core stage, 109% power level)"
category: engine
role: booster
tier: 3
propellants: [LOX, LH2]
manufacturer: L3Harris (Aerojet Rocketdyne)
vehicles: ["SLS Block 1 core stage (4 engines)", "Space Shuttle orbiter (3 engines, retired 2011)"]
status: operational (checked 2026-11)
---

# RS-25D (SLS core stage)

The RS-25 is the former Space Shuttle Main Engine: a hydrogen–oxygen **staged-combustion** engine with the highest efficiency (452 s in vacuum) of any booster engine in the catalogue [1][2]. Four of them burn for about 8 minutes at the bottom of NASA's SLS core stage, next to two solid boosters [2]. The first four SLS flights use 16 reflown shuttle engines (RS-25D), now run at 109% instead of the shuttle's 104.5% and thrown away after flight [2]. Artemis I (2022) and the crewed Artemis II (1–10 Apr 2026) flew on them; the four Artemis III engines were installed in Aug 2026 for a crewed low-Earth-orbit test flight in 2027 [5][6][7]. From Artemis V, newly built **RS-25E** engines take over (see 1.1).

**Why tier 3:** the most efficient booster engine (hydrogen), with deep heritage, but huge cost (~$100 M per engine) and a bulky, cold, low-density fuel that needs the largest tanks; Merlin 1D (tier 2) is far cheaper but has ~140 s less Isp.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 3,526 ⚠ | kg | [1] | 7,774 lb dry (L3Harris). NASA gives 7,750 lb (3.5 t) [2] and 7,775 lb [3]. |
| `thrust_sl` | 1,859 ⚠ | kN | [1] | 418,000 lb at 109% power level. NASA SLS guide converts it to 1,852 kN [2]. |
| `thrust_vac` | 2,279 | kN | [1][2] | 512,300 lb at 109%. |
| `isp_sl` | 369 ⚠ | s | derived | `isp_vac · thrust_sl / thrust_vac` = 452.3 × 418,000 / 512,300. Wikipedia lists 366 s [12]. |
| `isp_vac` | 452.3 | s | [1] | |
| `mass_flow` | 514 | kg/s | derived | `thrust_vac / (isp_vac · g0)` = 2,278,800 / (452.3 × 9.80665). |
| `mixture_ratio` | 6.03 | O/F by mass | [1] | "6-to-1" in the shuttle-era manual [4]. |
| `cycle` | staged combustion | — | [1][4] | Two fuel-rich preburners drive the high-pressure fuel and oxidizer turbopumps; two low-pressure pumps (mounted on the vehicle) feed them. |
| `chamber_pressure` | 20.6 | MPa | [1] | 2,994 psia. Pump discharge 6,276 psia (H2) and 7,268 psia (O2) [1]. |
| `expansion_ratio` | 69 ⚠ | — | [1] | L3Harris data sheet. The 1988 shuttle manual gives 77.5:1 [4]. |
| `throttle_min` | 67 ⚠ | % | [1] | Throttle range 67–109% [1]; NASA SLS guide says 65–109% [2]. SLS throttles to 67% just before cutoff [2]. |
| `gimbal_range` | 10.5 | ° | [4] | ±10.5° in pitch and yaw on the shuttle, hydraulic actuators [4]. On SLS the engines also gimbal for pitch, yaw and roll [2]; SLS range n/f. |
| `restarts` | 0 | count | [2] | One start per flight. |
| `burn_time_max` | 480 | s | [2] | Core-stage burn ("8.5 minutes" in the 2015 NASA fact sheet [3]). Engines need 4 starts and 1,700 s of life remaining to be assigned to SLS [2]. |
| `total_impulse` | 1,094 | MN·s | derived | `thrust_vac · burn_time_max` = 2,279 kN × 480 s (upper bound). |
| `power_electric` | n/f | W | | Pumps are turbine-driven: high-pressure fuel pump 71,140 hp (53 MW) and oxygen pump 23,260 hp (17 MW) of shaft power [1]. Controller power n/f. |
| `ignition` | spark | — | [4] | Dual-redundant augmented spark igniters in the main injector and both preburners. |
| `reusable` | no (on SLS) | — | [2][8] | Reused up to ~19 times on the shuttle; expended on SLS because recovery would cost too much payload [2][8]. |
| `cost_unit` | 104.5 M | USD (2015) | [8] | NASA's calculated manufacturing cost of a Shuttle-era engine. RS-25E target: $70.5 M manufacturing after Artemis VI (30% less); the OIG adds $2.3 B of restart and overhead costs not in that figure [8]. |
| `twr` | 53.8 | — | derived | `thrust_sl / (mass_dry · g0)` = 1,859,400 / (3,526 × 9.80665). |
| `height` | 4.27 | m | [1] | 168 in "long" [1]; 14 ft (4.3 m) [2]. |
| `diameter_max` | 2.44 ⚠ | m | [1] | 96 in "wide" [1]; 8 ft (2.4 m) [2]. Nozzle exit 94 in (2.39 m) outside diameter [4]; NASA fact sheet: 7.5 ft (2.29 m) [11]. |
| `first_flight` | 1981 | year | [4] | Shuttle STS-1. First SLS flight: Artemis I, 16 Nov 2022 [2]. |
| `flights` | 137 | count | [2][5] | 135 shuttle missions (3 engines each) + Artemis I (2022) + Artemis II (Apr 2026). |

### 1.1 RS-25E (new production) differences

| Item | RS-25E | Source | Note |
|---|---|---|---|
| Power level | 111% (tested up to 113%) | [2][9] | RS-25D runs at 109%. |
| Thrust at 111% | ≈ 2,321 kN vac, ≈ 1,894 kN SL | derived | 109% values × 111/109 (assumes thrust ∝ power level). |
| Cost | 30% cheaper to manufacture ($70.5 M target vs $104.5 M) | [8][1] | 3D-printed parts, fewer parts, RS-68 practices [8]. |
| Status | 24 engines on contract; certification test series completed 2023–2024; first flight planned on Artemis V | [1][8][9] | Artemis V timing depends on NASA's 2026 Artemis changes (see §6). |

## 2. Vehicle and stage data

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | SLS Block 1 | — | [2] | Core stage + 2 five-segment solid boosters + upper stage (ICPS on Artemis I/II/IV; a non-propulsive spacer on Artemis III [6]). |
| `stage` | core stage | — | [2] | Boeing; burns from lift-off to orbit insertion. |
| `parts_per_stage` | 4 | count | [2] | Shuttle orbiter: 3. |
| `stage_mass_dry` | 85,300 | kg | [2] | "Without engines"; with 4 engines ≈ 99,400 kg (derived, + 4 × 3,526 kg). |
| `stage_propellant_mass` | 987,500 ⚠ | kg | [2] | 143.8 t LH2 + 843.7 t LOX; the same guide also says 998 t in total. |
| `stage_burn_time` | 480 | s | [2] | MECO at T+483 s on Artemis I profile. |
| `stage_delta_v` | n/f | m/s | derived | Needs boosters, upper stage and payload masses; not computed. |
| `vehicle_liftoff_mass` | 2,603,000 | kg | [2] | 5.74 million lb fueled. |
| `vehicle_height` | 98.3 | m | [2] | Core stage alone: 64.6 m. |
| `vehicle_diameter` | 8.4 | m | [2] | Core stage. |
| `payload_leo` | 95,000 | kg | [2] | Block 1, crew configuration. |
| `payload_gto` | n/f | kg | | |
| `payload_mars` | n/f | kg | [2] | Only the cancelled Block 2 cargo version was quoted (> 80,000 lb to Mars); Block 1 to TLI: > 27 t. |
| `cost_launch` | 4.1 B ⚠ | USD (2021) | [10] | NASA OIG estimate per Artemis I–IV launch for SLS + Orion + ground systems (not SLS alone). Not re-read for this README. |
| `mars_heritage` | none | — | | NASA still describes SLS as part of "Moon to Mars", but no Mars mission is planned on it. |

## 3. Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Overall height (gimbal to exit) | 4.27 | [1] | |
| Maximum width | 2.44 | [1] | Includes the nozzle lip and the turbopumps. |
| Nozzle exit outside diameter | 2.39 | [4] | 94 in. |
| Nozzle length | 2.87 | [4] | 113 in, bolted to the main combustion chamber. |
| Throat diameter | 0.26 | derived | 2.29 m inner exit / √77.5 (0.28 m with ε = 69). |
| High-pressure fuel turbopump | 0.56 × 1.12 | [4] | 22 × 44 in. |
| High-pressure oxidizer turbopump | 0.61 × 0.91 | [4] | 24 × 36 in. |
| Powerhead + chamber above the nozzle | 1.40 | derived | 4.27 − 2.87. |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A huge, long bell (two thirds of the height) under a compact, busy powerhead. From the side (`side-1.jpg`, engine lying horizontally; `three-quarter-1.jpg`, standing): the bell is made of hundreds of fine tubes and wrapped with dark grey insulation blankets on SLS, ringed by several raised "hatband" stiffener rings and with a few thin coolant lines running down it. A thick manifold ring encircles the top of the bell, fed by two curved "steerhorn" ducts from the powerhead. The powerhead is a short wide drum (hot-gas manifold) with two big turbopump cylinders hanging down on opposite sides of the short main chamber, the fuel pump slightly longer than the oxygen pump. On top: the gimbal bearing, two large propellant inlet ducts with elbows, and the electronic controller box (`detail-1.jpg`). Red and white covers in the photos are ground protection: ignore them.

### 4.2 Node hierarchy

```text
RS25                          origin: top of the gimbal bearing (mount interface)
├─ Attach_Top                 (0, 0, 0)
├─ Gimbal                     pivot at (0, -0.08, 0); all meshes below are its children
│  ├─ Gimbal_Metal            gimbal bearing, powerhead, inlet ducts, steerhorns
│  ├─ Gimbal_Steel            turbopumps, main combustion chamber
│  ├─ Gimbal_Aluminum         controller
│  └─ Gimbal_NozzleDark       nozzle lathe, manifold, hatbands
└─ FX_Exhaust                 (0, -4.27, 0), rotation [180, 0, 0], preset exhaust_hydrolox
```

### 4.3 Parts

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Gimbal | cylinder (gimbal bearing) | r 0.15, r 0.15, h 0.15 | (0, -0.075, 0) | (0, 0, 0) | Metal | 8 |
| 2 | Gimbal | cylinder (powerhead / hot-gas manifold) | r 0.42, r 0.42, h 0.55 | (0, -0.425, 0) | (0, 0, 0) | Metal | 8 |
| 3 | Gimbal | cylinder (LH2 inlet duct) | r 0.15, r 0.15, h 0.45 | (0.30, -0.20, -0.25) | (90, 0, 0) | Metal | 8 |
| 4 | Gimbal | cylinder (LOX inlet duct) | r 0.13, r 0.13, h 0.45 | (-0.30, -0.20, -0.25) | (90, 0, 0) | Metal | 8 |
| 5 | Gimbal | box (controller) | 0.60 × 0.50 × 0.25 | (0, -0.45, 0.52) | (0, 0, 0) | Aluminum | — |
| 6 | Gimbal | cylinder (HP fuel turbopump) | r 0.28, r 0.28, h 0.95 | (0.62, -1.15, 0) | (0, 0, 0) | Steel | 8 |
| 7 | Gimbal | cylinder (HP oxidizer turbopump) | r 0.30, r 0.30, h 0.80 | (-0.62, -1.08, 0) | (0, 0, 0) | Steel | 8 |
| 8 | Gimbal | lathe (main combustion chamber) | see 4.4 `MCC` | (0, 0, 0) | (0, 0, 0) | Steel | 16 |
| 9 | Gimbal | lathe (nozzle) | see 4.4 `Nozzle` | (0, 0, 0) | (0, 0, 0) | NozzleDark | 16 |
| 10 | Gimbal | cylinder ×2 (steerhorn ducts) | r 0.07, r 0.07, h 0.95 | (0.40, -1.25, ±0.28) | (0, 0, -12) | Metal | 6 |
| 11 | Gimbal | torus (nozzle inlet manifold) | R 0.52, r 0.07 | (0, -1.75, 0) | (90, 0, 0) | NozzleDark | 16 × 6 |
| 12 | Gimbal | torus ×3 (hatbands) | R 0.80 / 0.96 / 1.08, r 0.03 | y = -2.40 / -3.00 / -3.60 | (90, 0, 0) | NozzleDark | 16 × 4 |

### 4.4 Revolved profiles

```text
MCC:    (0.30, -0.70) (0.30, -1.00) (0.24, -1.15) (0.15, -1.32) (0.131, -1.40)
Nozzle: (0.131, -1.40) (0.28, -1.50) (0.48, -1.75) (0.68, -2.15) (0.86, -2.65) (1.00, -3.20) (1.10, -3.70) (1.195, -4.27)
```

### 4.5 Simplify

- Drop the hundreds of small lines, sensors, wiring and bolts; keep only the two inlet ducts, two steerhorns, two turbopumps and the controller.
- The low-pressure turbopumps are mounted on the vehicle, not on the engine: leave them to the tank/stage model.
- The four engines sit in a square under the core stage's aft heat shield; only the nozzles show below it.
- No NASA logo, flag or engine serial numbers (the photos show stencilled text).

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 1,200 |
| Meshes | 4 |
| Height / diameter | 4.27 m / 2.39 m exit (±2%) |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| `side-1.jpg` | side | Engine 2047 lying horizontally during installation in the Artemis II core stage (2023); a second engine already installed. Take: bell with hatbands and coolant lines, powerhead, turbopumps, inlet ducts; people for scale. | [NASA MAF_20230915_CS2_Eng2047Install1](https://images.nasa.gov/details/MAF_20230915_CS2_Eng2047Install1) | NASA / Michael Democker | Public domain (NASA) |
| `three-quarter-1.jpg` | three-quarter | The four Artemis III engines at Kennedy (Jul 2026), three standing, one horizontal. Take: overall proportions, powerhead vs. bell. | [NASA KSC-20260721-PH-JBS01_0004](https://images.nasa.gov/details/KSC-20260721-PH-JBS01_0004) | NASA / Ben Smegelsky | Public domain (NASA) |
| `detail-1.jpg` | detail | Top of an Artemis III engine on its handling stand: gimbal mounting flange, inlet duct elbows, turbopump, controller area. | [NASA KSC-20260616-PH-FMX01_0024](https://images.nasa.gov/details/KSC-20260616-PH-FMX01_0024) | NASA / Frank Michaux | Public domain (NASA) |

**Linked only** (free, not downloaded to stay within 3 images):

- https://images.nasa.gov/details/MAF_20191021_P_RS-25%20Engine%20Install%20Reveal-62 — first RS-25 attached to the Artemis I core stage (in-context).
- L3Harris RS-25 data sheet cover image (© L3Harris): https://l3harris.com/sites/default/files/2024-07/l3harris-ar-rs-25-spec-sheet.pdf

## 6. Gaps and cautions

- Small differences between L3Harris and NASA on mass (3,515–3,527 kg), sea-level thrust (1,852 vs 1,859 kN) and diameter (2.29–2.44 m, exit vs. overall); expansion ratio 69 vs 77.5 (⚠).
- Sea-level Isp is derived (369 s); 366 s appears only on Wikipedia.
- **Artemis status (Nov 2026):** Artemis II flew 1–10 Apr 2026 [5]. In Mar 2026 NASA turned Artemis III into a crewed low-Earth-orbit docking test with commercial landers (2027), moved the first landing to Artemis IV (early 2028), dropped the Exploration Upper Stage (so Block 1B/Block 2 will not fly) and plans a new SLS second stage from Artemis IV onward [6][7]. RS-25 core stage is unchanged.
- Launch cost (OIG $4.1 B) covers SLS + Orion + ground systems and was not re-read for this README (⚠).
- Do not model logos, flags or serial numbers.

## 7. Sources

1. L3Harris, *RS-25 Propulsion System* data sheet, Jul 2024. https://l3harris.com/sites/default/files/2024-07/l3harris-ar-rs-25-spec-sheet.pdf (accessed 2026-11-14)
2. NASA, *Space Launch System Reference Guide* (2022, v2), pp. 8, 17, 42–45. https://www.nasa.gov/wp-content/uploads/2022/03/sls-reference-guide-2022-v2-508-0.pdf (accessed 2026-11-14)
3. NASA MSFC, *Space Launch System RS-25 Core Stage Engines*, fact sheet FS-2015-07-064-MSFC. https://www.nasa.gov/wp-content/uploads/2020/09/final_sls_rs25_fact_sheet_508_07312015.pdf (accessed 2026-11-14)
4. NASA, *NSTS 1988 News Reference Manual*, Main Propulsion System section (gimbal, nozzle, turbopump sizes, igniters), text copy on the "Space and Astronomy" CD-ROM (Oct 1993). https://discmaster.textfiles.com/view/10606/Space%20and%20Astronomy%20(October%201993).iso/pc/text/shuttle/mps_info.txt (accessed 2026-11-14)
5. NASA, *NASA Welcomes Record-Setting Artemis II Moonfarers Back to Earth*, Apr 2026. https://www.nasa.gov/news-release/nasa-welcomes-record-setting-artemis-ii-moonfarers-back-to-earth/ (accessed 2026-11-14)
6. NASA, *NASA Marches Toward Artemis III Mission in 2027, Names Crew Members* (RELEASE 26-048), 9 Jun 2026; *NASA's Artemis III Mission to Test Future Moon Lander Operations*, 23 Oct 2026. https://www.nasa.gov/news-release/nasa-marches-toward-artemis-iii-mission-in-2027-names-crew-members/ ; https://www.nasa.gov/missions/artemis/nasas-artemis-iii-mission-to-test-future-moon-lander-operations/ (accessed 2026-11-14)
7. NASA, *NASA Strengthens Artemis: Adds Mission, Refines Overall Architecture*, 3 Mar 2026; NASA blog, *NASA Starts Artemis III Engine Install…*, 27 Aug 2026. https://www.nasa.gov/directorates/esdmd/nasa-strengthens-artemis-adds-mission-refines-overall-architecture/ ; https://www.nasa.gov/blogs/missions/2026/08/27/nasa-starts-artemis-iii-engine-install-boosters-crew-training-advance/ (accessed 2026-11-14)
8. NASA Office of Inspector General, *NASA's Management of the Space Launch System Booster and Engine Contracts*, IG-23-015, 25 May 2023, pp. 30–32. https://oig.nasa.gov/wp-content/uploads/2024/02/IG-23-015.pdf (accessed 2026-11-14)
9. NASA, *NASA Rocket Engines Re-engineered, Production Restarted for Next Era of Exploration*. https://www.nasa.gov/missions/artemis/nasa-rocket-engines-re-engineered-production-restarted-for-next-era-of-exploration/ (accessed 2026-11-14); L3Harris, *L3Harris Delivers SLS Core Stage Engines for Artemis III Mission*, 22 Jul 2026. https://www.l3harris.com/newsroom/press-release/2026/07/l3harris-delivers-sls-core-stage-engines-artemis-iii-mission (accessed 2026-11-14)
10. NASA Office of Inspector General, *NASA's Management of the Artemis Missions*, IG-22-003, Nov 2021 ($4.1 B per launch, Artemis I–IV). https://oig.nasa.gov/docs/IG-22-003.pdf (not re-read, ⚠)
11. NASA, *Space Shuttle Propulsion* fact sheet (14 ft long, 7.5 ft nozzle exit). https://www.nasa.gov/wp-content/uploads/2016/08/174533main_shuttle_propulsion.pdf (accessed 2026-11-14)
12. Wikipedia, *RS-25* (used only to find sources; 366 s sea-level Isp). https://en.wikipedia.org/wiki/RS-25 (accessed 2026-11-14)
