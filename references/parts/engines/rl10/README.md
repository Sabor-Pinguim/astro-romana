---
id: rl10
name: RL10C-1-1
category: engine
role: upper-stage
tier: 2
propellants: [LOX, LH2]
manufacturer: Rocketdyne (AE Industrial majority owner since 2026-08; formerly Aerojet Rocketdyne / L3Harris)
vehicles: ["Atlas V Centaur III (single-engine)", "Vulcan Centaur V (2 engines)"]
status: in-production (checked 2026-11)
---

# RL10C-1-1

The RL10 is the classic American hydrogen upper-stage engine (first flown 1963). The **RL10C-1-1** is the version that flies today on the single-engine Centaur III of Atlas V (for example the 2026 Amazon Leo launches) and, two per stage, on Vulcan's Centaur V. It uses the expander cycle — the hydrogen, warmed in the cooling tubes around the chamber, spins the turbopump — so it needs no gas generator and no electric pumps. It adds a 3D-printed injector and a lightweight composite nozzle extension to the earlier RL10C-1.

**Why tier 2:** about 1/9 of a Merlin Vacuum's thrust but ~30% more Isp; light and very reliable, but hydrogen needs huge, cold tanks.

**Other variants (notes):**

- **RL10C-1** — previous single-engine Centaur III engine (2014–2021): 101.8–101.9 kN, 449.7 s, 190 kg, ε 130 ⚠. Launched Mars 2020 / Perseverance [4]. ULA's generic Atlas V page still names it [5].
- **RL10A-4-2** — 99.2 kN, 450.5 s, fixed columbium (niobium) extension; the Common Centaur engine in the 2010 Atlas V guide [6]. Still flies in the **dual-engine** Centaur used for Starliner (2 × 22,300 lbf) [7].
- **RL10C-1-1** on Vulcan — Centaur V uses two (≈ 48,000 lbf total) [7]. The next version, **RL10E-1** (ex RL10C-X, 3D-printed copper chamber), was delivered in 2024 for Vulcan; first flight not confirmed [8].
- **RL10B-2** — Delta IV upper stage and SLS ICPS: 110 kN (24,750 lbf), 465.5 s, 301 kg, **extendible** carbon-carbon nozzle, ε 280, 2.2 m stowed / 4.15 m deployed ⚠ [3]. See diagram-1.png.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 188 ⚠ | kg | [3] | 415 lb, Aerojet Rocketdyne data sheet (now offline) via Wikipedia |
| `thrust_sl` | n/a | kN | | vacuum-only |
| `thrust_vac` | 106.0 | kN | [1] | 23,825 lbf ("RL10C-1-1 engine producing 23,825 lbs (106 kilo-Newtons)") |
| `isp_sl` | n/a | s | | |
| `isp_vac` | 453.8 ⚠ | s | [3] | data sheet via Wikipedia; ULA's generic Atlas V page gives 450.5 s for "RL10C" [5] |
| `mass_flow` | 23.8 | kg/s | derived | `thrust_vac / (isp_vac · g0)` = 105,979 / (453.8 × 9.80665) |
| `mixture_ratio` | 5.5 ⚠ | O/F by mass | [3] | Wikipedia table |
| `cycle` | expander (closed) | — | [6] | turbopump-fed, regeneratively cooled; hydrogen heated in the chamber jacket drives the turbine |
| `chamber_pressure` | n/f | MPa | | not found |
| `expansion_ratio` | 155 ⚠ | — | [3] | Wikipedia table; RL10C-1: 130 |
| `throttle_min` | n/f | % | | |
| `gimbal_range` | n/f | ° | | gimbaled by two electromechanical actuators (single-engine Centaur) [6] |
| `restarts` | ≥ 2 | count | [4] | Mars 2020 used two Centaur burns plus a blowdown; "restart capability" [5] |
| `burn_time_max` | n/f | s | | Mars 2020 (RL10C-1): 410 s first burn + 471 s second burn = 881 s total (derived from the ULA timeline [4]); Wikipedia lists 842 s (Atlas) / 1,077 s (Vulcan) ⚠ |
| `total_impulse` | 9.3 | MN·s | derived | Centaur III propellant × Isp × g0 = 20,830 × 453.8 × 9.80665 |
| `power_electric` | n/f | W | | expander cycle: pumps need no electric power; actuator/valve power not published |
| `ignition` | spark ⚠ | — | [9] | RL10 family uses a spark igniter (NASA test reports on RL10A-3-3A); not stated for the C-1-1 |
| `reusable` | no | — | | Centaur is expended |
| `cost_unit` | n/f | USD (year) | | |
| `twr` | 57 | — | derived | `thrust_vac / (mass_dry · g0)` = 105,979 / (188.2 × 9.80665) |
| `height` | 2.46 ⚠ | m | [3] | 8 ft 0.7 in |
| `diameter_max` | 1.57 ⚠ | m | [3] | nozzle exit, 62 in (5 ft 2 in) |
| `first_flight` | 2021 | year | [7] | Atlas V, May 2021 (SBIRS GEO-5) |
| `flights` | n/f | count | | flies on every single-engine Atlas V since 2021 and on every Vulcan (2 per flight); exact count not compiled |

## 2. Vehicle and stage data

| Key | Atlas V (Centaur III, single engine) | Vulcan (Centaur V) | Unit | Source | Note |
|---|---|---|---|---|---|
| `vehicle` | Atlas V 401–551 | Vulcan VC0S–VC6S | — | [1] [10] | |
| `stage` | Centaur III | Centaur V | — | [1] [10] | |
| `parts_per_stage` | 1 | 2 | count | [1] [10] | Starliner's dual-engine Centaur uses 2 × RL10A-4-2 |
| `stage_mass_dry` | 2,243 | n/f | kg | [6] | Centaur inert mass, single-engine (4X1), 2010 guide (RL10A-4-2 era) |
| `stage_propellant_mass` | 20,830 | n/f | kg | [6] | LH2 + LO2 |
| `stage_burn_time` | 875 | n/f | s | derived | 20,830 / 23.8 kg/s (all propellant, one engine) |
| `stage_delta_v` | 6,530 | n/f | m/s | derived | 453.8 × 9.80665 × ln((2,243 + 20,830 + 4,000) / (2,243 + 4,000)), with an assumed 4,000 kg payload and adapters ignored |
| `vehicle_liftoff_mass` | n/f | n/f | kg | | |
| `vehicle_height` | ≈ 60 (541) | n/f | m | [4] | Atlas V 541 with 5-m short fairing |
| `vehicle_diameter` | 3.81 | 5.4 | m | [6] [10] | booster core |
| `payload_leo` | 17,410 (541) / 18,850 (551) | 27,200 (VC6S) | kg | [11] | 200 km, 28.7° |
| `payload_gto` | 8,290 (541) / 8,900 (551) | 14,500 (VC6S) | kg | [11] | |
| `payload_mars` | n/f | 7,600 (VC6S) | kg | [10] | Vulcan: C3 = 20 km²/s². Atlas V 541 sent Mars 2020 to C3 = 14.49 km²/s² [4] |
| `cost_launch` | n/f | n/f | USD (year) | | |
| `mars_heritage` | MRO (2005), Curiosity (2011), MAVEN (2013), InSight (2018), Perseverance (2020) | none | — | [4] [6] | all on Atlas V/Centaur; MRO and Curiosity flew the RL10A-4-2 [6], Perseverance the RL10C-1 [4]; MAVEN/InSight engine not checked. The C-1-1 itself has no Mars launch yet |

## 3. Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Overall height | 2.46 ⚠ | [3] | gimbal mount to nozzle exit |
| Nozzle exit diameter | 1.57 ⚠ | [3] | |
| Throat diameter | 0.13 (est.) | derived | 1.57 / √155 |
| Tube-wall bell / extension joint | y ≈ -1.35, r ≈ 0.50 (est.) | est. | side-1.jpg: the tube bell is ~45% of the height, measured from the mount |
| Powerhead width (pump + injector) | ≈ 0.75 (est.) | est. | three-quarter-1.jpg, ≈ 0.48 × the exit diameter of that engine |

## 4. Low-poly model

Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

On top, a small conical **gimbal mount** (the tripod-like cone in three-quarter-1.jpg). Below it a compact grey **powerhead**: a horizontal turbopump/gearbox body with valves sticking out sideways and a round injector dome under it. Two big curved **hydrogen pipes** loop down from the powerhead and enter the nozzle wall about a third of the way down. The upper nozzle is a ribbed **tube-wall bell** (silver, hundreds of brazed tubes with hoop bands, side-1.jpg). On the C-1-1 a smooth, dark **composite extension** continues the bell to the 1.57 m exit (older engines in the photos stop at the tube bell). Proportions: wide bell, short powerhead — a "bell with a fist on top".

### 4.2 Node hierarchy

```text
Rl10                          origin: gimbal mount interface (top)
├─ Attach_Top                 (0, 0, 0)
├─ Gimbal                     pivot at (0, -0.08, 0); all engine meshes go here
│  └─ Gimbal_Metal, Gimbal_Steel, Gimbal_NozzleDark
└─ FX_Exhaust                 (0, -2.46, 0), rotation [180, 0, 0], preset exhaust_hydrolox
```

### 4.3 Parts

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Gimbal | cone (gimbal mount) | r_top 0.06, r_bottom 0.22, h 0.22 | (0, -0.11, 0) | (0, 0, 0) | Metal | 8 |
| 2 | Gimbal | cylinder (turbopump + gearbox) | r 0.13, h 0.70 | (0, -0.32, 0) | (0, 0, 90) | Steel | 8 |
| 3 | Gimbal | sphere (injector dome) | r 0.20 | (0, -0.45, 0) | (0, 0, 0) | Steel | 8 |
| 4 | Gimbal | lathe (chamber + tube-wall bell) | profile A | (0, 0, 0) | (0, 0, 0) | Steel | 16 |
| 5 | Gimbal | lathe (composite extension) | profile B | (0, 0, 0) | (0, 0, 0) | NozzleDark | 16 |
| 6 | Gimbal | torus (hoop band at bell/extension joint) | R 0.50, tube r 0.02 | (0, -1.35, 0) | (90, 0, 0) | Metal | 16 × 4 |
| 7 | Gimbal | cylinder (LH2 loop pipe, down) | r 0.05, h 0.75 | (0.32, -0.75, 0) | (0, 0, 8) | Metal | 6 |
| 8 | Gimbal | cylinder (LH2 loop pipe, down) | r 0.05, h 0.75 | (-0.32, -0.75, 0) | (0, 0, -8) | Metal | 6 |
| 9 | Gimbal | box (valve/actuator cluster) | 0.18 × 0.14 × 0.14 | (0, -0.30, 0.20) | (0, 0, 0) | Metal | — |

### 4.4 Revolved profiles

```text
A chamber+bell: (0.13, -0.55) (0.13, -0.72) (0.065, -0.82) (0.10, -0.88) (0.22, -1.00) (0.36, -1.18) (0.50, -1.35)
B extension:    (0.50, -1.35) (0.58, -1.62) (0.66, -1.90) (0.73, -2.20) (0.785, -2.46)
```

### 4.5 Simplify

- Merge valves, sensors and small lines into the box (part 9); keep only the two big hydrogen loop pipes.
- Represent the tube-wall texture only through the Steel material (no geometry ribs); keep one hoop band at the joint.
- RL10B-2 variant: replace profile B by a longer extension to y ≈ -4.15 with r ≈ 1.07 (2.15 m exit), and for the stowed state translate it up around the bell.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 1,500 (est. ~700) |
| Meshes | ≤ 4 |
| Height / diameter | 2.46 / 1.57 (±2%) |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| side-1.jpg | side | Museum RL10 (early RL10A, Science Museum London), front view: powerhead, two hydrogen loop pipes, ribbed tube-wall bell with hoop bands. Older variant, no extension. | https://commons.wikimedia.org/wiki/File:An_RL-10_engine_at_LSM.jpg | Les Chatfield | CC BY 2.0 |
| three-quarter-1.jpg | three-quarter | Same museum engine from a lower three-quarter angle: shows the conical gimbal mount on top and the side valves. | https://commons.wikimedia.org/wiki/File:RL10_rocket_engine_-_Science_Museum_Feb_2007.jpg | Robin P. Doveton | Public domain |
| diagram-1.png | diagram | Cutaway of the RL10B-2 (French labels): turbopumps, injector, chamber, fixed bell and the **extendible** nozzle on screw drives. Use for internal layout and the RL10B-2 note. | https://commons.wikimedia.org/wiki/File:RL-10-%C3%A0-divergent-extensible.png | NASA | Public domain |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://www.ulalaunch.com/docs/default-source/rockets/vulcancentaur.pdf — Vulcan cutaway with twin RL10s.

## 6. Gaps and cautions

- The Aerojet Rocketdyne/L3Harris RL10 data sheets went offline after the business became Rocketdyne (sale closed 2026-08-04); mass, Isp, ε, mixture ratio and dimensions come from Wikipedia's copy of them (⚠).
- ULA documents disagree: the 2025 cutaway poster says 99.2 kN (RL10A-4-2 value) [2]; the generic Atlas V page (RL10C-1, 22,900 lbf, 450.5 s, 46 in, 367 lb — a mix of C-1 and A-4-2 data) vs. 2026 mission pages (RL10C-1-1, 23,825 lbf). The mission pages are newer.
- Chamber pressure, gimbal range, cost and flight count not found. RL10E-1 first flight not confirmed.
- Free photos show older RL10 versions without the composite extension.
- No ULA/Rocketdyne logos on the model.

## 7. Sources

1. United Launch Alliance, *Atlas V Amazon Leo (LA-06)* mission page, April 2026. https://www.ulalaunch.com/missions/atlas-v/amazon-leo-la-06 (accessed 2026-11-14)
2. United Launch Alliance, *Atlas V cutaway poster*, 2025-10-15 (still states a single RL10 of 99.2 kN / 22,300 lbf). https://www.ulalaunch.com/docs/default-source/rockets/251015_atlas_cutawayposter.pdf (accessed 2026-11-14)
3. Wikipedia, *RL10*, table of versions (secondary; cites the Aerojet Rocketdyne *RL10 Propulsion System* data sheet, archived 2022). https://en.wikipedia.org/wiki/RL10 (accessed 2026-11-14)
4. United Launch Alliance, *Atlas V Mars 2020 mission overview*, 2020-07. https://www.ulalaunch.com/docs/default-source/launch-booklets/mars2020_mobrochure_200717.pdf (accessed 2026-11-14)
5. United Launch Alliance, *Atlas V* rocket page. https://www.ulalaunch.com/rockets/atlas-v (accessed 2026-11-14)
6. United Launch Alliance, *Atlas V Launch Services User's Guide*, Rev. 11, March 2010, Fig. 1.4.1-3 and App. A.2.7. https://www.ulalaunch.com/docs/default-source/rockets/atlasvusersguide2010a.pdf (accessed 2026-11-14)
7. L3Harris, *Vulcan Rocket Set to Debut with Aerojet Rocketdyne Propulsion*, 2024-01; and *RL10 Engine Makes Human Spaceflight Debut on ULA's Atlas V Launch of Starliner*, 2024-06. https://www.l3harris.com/newsroom/editorial/2024/01/vulcan-rocket-set-debut-aerojet-rocketdyne-propulsion (accessed 2026-11-14)
8. L3Harris, *L3Harris Delivers New Generation RL10 Rocket Engines*, 2024-11-21. https://www.l3harris.com/newsroom/press-release/2024/11/l3harris-delivers-new-generation-rl10-rocket-engines (accessed 2026-11-14)
9. NASA, *RL10 ignition limits test for Shuttle Centaur*, NTRS 19910001736. https://ntrs.nasa.gov/citations/19910001736 (accessed 2026-11-14)
10. United Launch Alliance, *Vulcan Launch Systems User's Guide*, October 2023, §1.4 and Table 2.2.5-1. https://www.ulalaunch.com/docs/default-source/default-document-library/2023_vulcan_user_guide.pdf (accessed 2026-11-14)
11. United Launch Alliance, *Atlas V and Delta IV Technical Summary* (performance table). https://www.ulalaunch.com/docs/default-source/rockets/atlas-v-and-delta-iv-technical-summary.pdf (accessed 2026-11-14)
12. Defense Daily / press, *AE Industrial Partners completes acquisition of Rocketdyne from L3Harris*, 2026-08. https://www.defensedaily.com/ae-industrial-partners-completes-acquisition-of-rocketdyne-from-l3harris/business-financial/ (accessed 2026-11-14)
