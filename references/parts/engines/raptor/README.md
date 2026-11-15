---
id: raptor
name: "Raptor 2 (sea level); Raptor 3 noted per row"
category: engine
role: booster
tier: 3
propellants: [LOX, CH4]
manufacturer: SpaceX
vehicles: ["Super Heavy (33 engines)", "Starship ship (3 sea-level engines + 3 Raptor Vacuum)"]
status: retired (checked 2026-11)
---

# Raptor 2 (sea level)

Raptor is SpaceX's methane–oxygen engine for the fully reusable Starship system: 33 sea-level Raptors on the Super Heavy booster (13 gimballing centre engines, 20 fixed outer engines) and 3 sea-level Raptors plus 3 Raptor Vacuums on the Starship ship [1]. It uses the **full-flow staged-combustion** cycle at about 300 bar, the highest chamber pressure of any flight engine [5][9]. **Status (Nov 2026):** Raptor 2 flew Starship flights 1–11 (2023–2025) and is now **retired**; Starship V3 with **Raptor 3** has flown since Flight 12 (22 May 2026), and reached orbit on Flight 14 (28 Sep 2026) [6][7][8]. This README keeps Raptor 2 as the main variant and gives SpaceX's published Raptor 3 figures in the Note column.

**Why tier 3:** 2.7× the thrust of a Merlin 1D at ~3.5× the mass, with higher Isp (methane) and full reuse; it is the most powerful and most complex booster engine in the catalogue, and only flies on the largest launch system.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 1,630 ⚠ | kg | [2] | SpaceX comparison table (Aug 2024), engine only; 2,875 kg with "vehicle-side commodities and hardware". **Raptor 3: 1,525 kg** (1,720 kg with vehicle-side hardware). ⚠ Table seen only as reproduced by news sites; SpaceX's original post not retrieved. |
| `thrust_sl` | 2,256 | kN | [2] | 230 tf × 9.80665. **Raptor 3: 280 tf = 2,746 kN** in the Aug 2024 table [2]; ⚠ SpaceX's current Starship page (V3) lists Raptor at **250 tf = 2,452 kN** [1]. |
| `thrust_vac` | 2,391 | kN | derived | `thrust_sl + p0 · A_exit` = 2,256 + 101.325 kPa × π × 0.6532² m² (exit radius from [4]). |
| `isp_sl` | 327 | s | derived | `isp_vac · thrust_sl / thrust_vac` = 347 × 2,256 / 2,391. Wikipedia gives 327 s [9]. |
| `isp_vac` | 347 ⚠ | s | [2] | SpaceX table value for the sea-level engine; a SpaceX spokesperson said the table Isp is the vacuum value (reported by news sites). **Raptor 3: 350 s.** |
| `mass_flow` | 703 | kg/s | derived | `thrust_vac / (isp_vac · g0)` = 2,391,000 / (347 × 9.80665). |
| `mixture_ratio` | 3.6 | O/F by mass | [3][4] | "LOX and liquid methane in a 3.6:1 mass ratio" (FAA/SpaceX 2021); nominal MR 3.60 in the 2019 plume analysis. |
| `cycle` | full-flow staged combustion | — | [1][9] | SpaceX: "reusable methane-oxygen staged-combustion engine" [1]; full-flow (oxidizer-rich and fuel-rich preburners). |
| `chamber_pressure` | 30 ⚠ | MPa | [9] | "Raptor 2 now operates routinely at 300 bar main chamber pressure" (E. Musk, 2022, via news/Wikipedia). The 2019 booster engine (Raptor 1) analysis used 25.3 MPa (3,669.5 psia) [4]. |
| `expansion_ratio` | 34.34 ⚠ | — | [4] | Sea-level Raptor (2019 analysis, Raptor 1). Raptor 2 nozzle exit radius is 25.718 in (0.653 m) [4]; its throat is not published. |
| `throttle_min` | 40 ⚠ | % | [9] | E. Musk (2020, Raptor 1): max ~225 t, min ~90 t. Raptor 2 n/f. |
| `gimbal_range` | n/f | ° | | On Super Heavy only the 13 centre engines gimbal; the 20 outer engines are fixed [1]. |
| `restarts` | 2 (centre engines) | count | [1] | Super Heavy relights centre engines for the boostback and the landing (tower catch) burns [1]. Ship sea-level engines also relight for landing. |
| `burn_time_max` | n/f | s | | |
| `total_impulse` | n/f | MN·s | | |
| `power_electric` | n/f | W | | Turbine-driven pumps; actuators and controllers not published. |
| `ignition` | n/f | — | | |
| `reusable` | yes ⚠ | — | [1] | Designed for full reuse; Super Heavy boosters are caught by the launch tower. Number of reflights per engine n/f. |
| `cost_unit` | n/f | USD (year) | | |
| `twr` | 141 | — | derived | `thrust_sl / (mass_dry · g0)` = 2,255,500 / (1,630 × 9.80665). Raptor 3 (280 tf, 1,525 kg): 184. |
| `height` | 2.9 ⚠ | m | [1] | Current SpaceX Starship page (variant not stated, probably Raptor 3). SpaceX's 2019 page gave 3.1 m for Raptor 1. |
| `diameter_max` | 1.3 | m | [1][4] | Nozzle exit: 2 × 25.718 in = 1.306 m [4]. |
| `first_flight` | 2023 | year | [9] | Raptor 2: Starship Flight 1, 20 Apr 2023. Raptor family: Starhopper, Jul 2019. Raptor 3: Flight 12, 22 May 2026 [6]. |
| `flights` | 11 | count | [9] | Starship flight tests flown with Raptor 2 (Flights 1–11). Raptor 3 has flown 3 (Flights 12–14) as of the check date [6][7][8]. |

## 2. Vehicle and stage data

Figures are SpaceX's **current (Starship V3, Raptor 3)** published values [1]; SpaceX no longer lists V2 (Raptor 2) figures.

| Key | Super Heavy (booster) | Starship (ship) | Unit | Source | Note |
|---|---|---|---|---|---|
| `vehicle` | Starship V3 | Starship V3 | — | [1] | Two-stage, fully reusable; 124 m stack. |
| `stage` | stage 1 | stage 2 | — | [1] | |
| `parts_per_stage` | 33 | 3 (+3 Raptor Vacuum) | count | [1] | |
| `stage_mass_dry` | n/f | n/f | kg | | Not published. |
| `stage_propellant_mass` | 3,650,000 | 1,600,000 | kg | [1] | "Propellant capacity 3,650 t / 1,600 t". |
| `stage_burn_time` | n/f | n/f | s | | |
| `stage_delta_v` | n/f | n/f | m/s | derived | Needs dry masses. |
| `vehicle_liftoff_mass` | n/f | — | kg | | ≈ 5,250 t of propellant alone (3,650 + 1,600, derived). |
| `vehicle_height` | 72 (124 stacked) | 52 | m | [1] | |
| `vehicle_diameter` | 9 | 9 | m | [1] | |
| `payload_leo` | 100,000+ | — | kg | [1] | "100+ t", fully reusable. |
| `payload_gto` | n/f | — | kg | | |
| `payload_mars` | n/f | n/f | kg | [1] | SpaceX: with refilling in Earth orbit, "several hundred tonnes of cargo per ship" to Mars (no figure). |
| `cost_launch` | n/f | — | USD (year) | [1] | Mars cargo price: **$100 M per tonne** delivered to the surface, flights "no earlier than 2028" (SpaceX page, 2026). |
| `mars_heritage` | none yet | none yet | — | [1] | Uncrewed Mars cargo flights NET 2028 (SpaceX). Starship HLS is NASA's Artemis lunar lander. |

Thrust (stage totals, [1]): Super Heavy 8,240 tf (= 33 × ~250 tf), Starship 1,614 tf.

## 3. Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Overall height | 2.9 ⚠ | [1] | 3.1 m on the 2019 SpaceX page (Raptor 1). |
| Nozzle exit diameter | 1.306 | [4] | Raptor 2 exit radius 25.718 in (2022 analysis). |
| Throat diameter | 0.222 | [4] | Raptor 1 booster engine: throat radius 4.362 in (2019). Use for Raptor 2 (`est.`). |
| Throat-to-exit length | 1.53 | [4] | 60.06 in (Raptor 1, 2019). Wall angle 32° just after the throat, 6° at the lip [4]. |
| Combustion chamber diameter / length | 0.42 / 0.35 | est. | `side-1.jpg`, scaled from the 1.3 m exit. |
| Powerhead (pumps, preburners, gimbal block) | 1.0 tall × 1.0 wide | est. | `side-1.jpg`: everything above the chamber. |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

`side-1.jpg` (right-hand engine): a wide, dark, straight-walled conical bell that takes up the lower half, with a slightly thickened lip; above the bell a short dark chamber; on top a tall, busy powerhead. Two turbopumps sit on opposite sides of the chamber top (oxygen pump on one side, methane pump on the other), each with a thick curved hot-gas duct that bends down and into the injector dome, giving the engine a "two elbows" look from the side. A thin gimbal post with a square thrust block crowns the engine. Raptor 2 has far fewer small lines than the Raptor 1 in the photo (cleaner outline), and Raptor 3 hides almost all plumbing inside the outer walls. The bell is wide and short compared with a Merlin: exit ≈ 45% of the height. On Super Heavy the bells sit packed under a flat aft heat shield.

### 4.2 Node hierarchy

```text
Raptor                        origin: mount interface (top of the thrust block)
├─ Attach_Top                 (0, 0, 0)
├─ Gimbal                     pivot at (0, -0.10, 0); all meshes below are its children
│  ├─ Gimbal_Metal            thrust block, turbopumps, hot-gas ducts
│  ├─ Gimbal_Steel            injector dome + chamber
│  └─ Gimbal_NozzleDark       nozzle lathe, lip ring
└─ FX_Exhaust                 (0, -2.90, 0), rotation [180, 0, 0], preset exhaust_methalox
```

### 4.3 Parts

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Gimbal | box (thrust block) | 0.40 × 0.20 × 0.40 | (0, -0.10, 0) | (0, 0, 0) | Metal | — |
| 2 | Gimbal | cylinder (gimbal post) | r 0.10, r 0.10, h 0.35 | (0, -0.375, 0) | (0, 0, 0) | Metal | 8 |
| 3 | Gimbal | cylinder (oxygen turbopump) | r 0.17, r 0.17, h 0.55 | (0.34, -0.70, 0) | (0, 0, 0) | Metal | 8 |
| 4 | Gimbal | cylinder (methane turbopump) | r 0.15, r 0.15, h 0.55 | (-0.34, -0.70, 0) | (0, 0, 0) | Metal | 8 |
| 5 | Gimbal | torus quarter (hot-gas duct, ox side) | R 0.25, r 0.09, arc 90° | (0.22, -1.00, 0) | (90, 0, 0) | Metal | 8 × 6 |
| 6 | Gimbal | torus quarter (hot-gas duct, fuel side) | R 0.25, r 0.09, arc 90° | (-0.22, -1.00, 0) | (90, 180, 0) | Metal | 8 × 6 |
| 7 | Gimbal | lathe (injector dome + chamber) | see 4.4 `Chamber` | (0, 0, 0) | (0, 0, 0) | Steel | 16 |
| 8 | Gimbal | lathe (nozzle) | see 4.4 `Nozzle` | (0, 0, 0) | (0, 0, 0) | NozzleDark | 16 |
| 9 | Gimbal | torus (lip stiffener) | R 0.65, r 0.02 | (0, -2.88, 0) | (90, 0, 0) | NozzleDark | 16 × 4 |

### 4.4 Revolved profiles

```text
Chamber: (0.10, -0.55) (0.25, -0.65) (0.25, -0.95) (0.21, -1.00) (0.21, -1.27) (0.15, -1.33) (0.111, -1.37)
Nozzle:  (0.111, -1.37) (0.16, -1.42) (0.25, -1.55) (0.36, -1.75) (0.46, -2.00) (0.55, -2.30) (0.61, -2.60) (0.653, -2.90)
```

### 4.5 Simplify

- Merge the hundreds of small lines and wires into nothing; keep only the two turbopumps and the two big hot-gas ducts.
- For Super Heavy (33 engines) consider a cheaper LOD: nozzle + chamber + one box for the powerhead (~250 triangles).
- Raptor 3 variant: replace parts 3–6 with a single smooth cylinder r 0.42 from y −0.45 to −1.30 (the "shrink-wrapped" look).
- No text or logos.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 1,200 (≤ 250 for the Super Heavy LOD) |
| Meshes | 3 |
| Height / diameter | 2.9 m / 1.306 m (±2%) |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| `side-1.jpg` | side | Sea-level Raptor (right, probably Raptor 1) beside a Merlin (left) at SpaceX Hawthorne. Take: bell shape and its size against a Merlin, the two turbopumps and curved hot-gas ducts, the thrust block on top. | [Commons](https://commons.wikimedia.org/wiki/File:SpaceX_Merlin_and_sea-level_Raptor_at_Hawthorne.jpg) | Brandon De Young | CC BY-SA 4.0 |

**Linked only** (free licences, not downloaded because Wikimedia Commons was rate-limiting the download tool; add them later):

- https://commons.wikimedia.org/wiki/File:SpaceX_sea-level_Raptor_at_Hawthorne_-_1.jpg — same engine, vertical side view (CC BY-SA 4.0).
- https://commons.wikimedia.org/wiki/File:SpaceX_sea-level_Raptor_at_Hawthorne_-_2.jpg — another angle (CC BY-SA 4.0).
- https://commons.wikimedia.org/wiki/File:NASA_and_SpaceX_leadership_view_the_engines_of_Starship.jpg — Raptors installed on a Starship, bottom view (public domain; Raptor 1).
- https://www.spacex.com/vehicles/starship/ — SpaceX renders of Raptor 2/3 and the Super Heavy engine layout (© SpaceX, not free).

## 6. Gaps and cautions

- **Variant:** Raptor 2 is retired as of Nov 2026; every Starship since Flight 12 flies Raptor 3. Consider switching the game's main variant to Raptor 3 (280 tf ⚠ 250 tf, 350 s, 1,525 kg).
- **Raptor 3 thrust ⚠:** SpaceX's 2024 table says 280 tf; SpaceX's 2026 Starship page says 250 tf for the Raptor on V3 (8,240 tf / 33).
- The mass/thrust/Isp table (Aug 2024) was seen only as reproduced by news sites; SpaceX's original post was not retrieved.
- Sea-level Isp and vacuum thrust of the sea-level engine are derived, not published. Chamber pressure (300 bar) comes from E. Musk statements.
- Only one freely licensed photo was downloaded, and it probably shows a Raptor 1.
- Dry masses of Super Heavy and the ship are not published.

## 7. Sources

1. SpaceX, *Starship* vehicle page (stack, Super Heavy and Starship specs, Raptor/RVac dimensions and thrust, Mars cargo pricing). https://www.spacex.com/vehicles/starship/ (accessed 2026-11-14)
2. SpaceX, Raptor 1 / 2 / 3 comparison table posted on X, Aug 2024, as reproduced by Tesla Oracle, *Raptor 3 Starship engine is lighter, less complicated yet more powerful and reusable*, 8 Aug 2024. https://www.teslaoracle.com/2024/08/08/raptor-3-starship-engine-is-lighter-less-complicated-but-more-powerful-and-reusable/ (accessed 2026-11-14)
3. FAA / SpaceX, *Draft Programmatic Environmental Assessment for the SpaceX Starship/Super Heavy Launch Vehicle Program*, Sept 2021, p. 12 (3.6:1 mixture ratio), cited via Wikipedia.
4. Sierra Engineering & Software for SpaceX, *Exhaust Plume Calculations for SpaceX Raptor Booster Engine*, report 2019-001b (18 Jun 2019: Pc, MR, ε, throat and nozzle dimensions) and report 2022-001P (31 May 2022: Raptor 2 exit radius), FAA Starship EA Appendix G. https://www.faa.gov/sites/faa.gov/files/space/stakeholder_engagement/spacex_starship/Appendix_G_Exhaust_Plume_Calculations.pdf and https://www.faa.gov/sites/faa.gov/files/2022-06/AppendixG_ExhaustPlumeCalculations.pdf (accessed 2026-11-14)
5. Teslarati, *Elon Musk: Raptor 2 now operates routinely at 300 bar*, 2022. https://www.teslarati.com/elon-musk-spacex-starship-raptor-2-engine-progress (accessed 2026-11-14)
6. SpaceQ, *Starship flight 12 validates V3 reentry systems despite early booster termination*, May 2026. https://spaceq.ca/starship-flight-12-validates-v3-reentry-systems-despite-early-booster-termination/ (accessed 2026-11-14)
7. Space.com, *SpaceX Starship Flight 13 launch updates*, 24 Jul 2026. https://www.space.com/news/live/spacex-starship-flight-13-launch-updates-july-24-2026 (accessed 2026-11-14)
8. Space.com, *SpaceX launches Starship into orbit for 1st time… Flight 14*, 28 Sep 2026. https://www.space.com/space-exploration/launches-spacecraft/spacex-starship-megarocket-flight-14-orbital-launch-success (accessed 2026-11-14)
9. Wikipedia, *SpaceX Raptor* (used only to find sources; values marked ⚠: chamber pressure, throttle, 327 s, first flights). https://en.wikipedia.org/wiki/SpaceX_Raptor (accessed 2026-11-14)
