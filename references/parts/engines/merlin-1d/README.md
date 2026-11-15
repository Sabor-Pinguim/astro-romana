---
id: merlin-1d
name: "Merlin 1D (Falcon 9 Block 5, sea level)"
category: engine
role: booster
tier: 2
propellants: [LOX, RP-1]
manufacturer: SpaceX
vehicles: ["Falcon 9 stage 1", "Falcon Heavy stage 1 (27 engines)"]
status: operational (checked 2026-11)
---

# Merlin 1D (Falcon 9 Block 5, sea level)

Merlin 1D is SpaceX's kerosene gas-generator engine. Nine of them, eight in a ring around a centre engine (the "Octaweb"), power the reusable first stage of Falcon 9; Falcon Heavy uses 27 [1][2]. The Block 5 version (since 2018) gives 845 kN at sea level, throttles deeply and relights in flight so the booster can fly back and land [1][2]. It is the most-flown orbital booster engine today: Falcon 9 had flown 700 missions and boosters had landed 653 times by November 2026 [2].

**Why tier 2:** about 34× the thrust of a Rutherford for ~13× the mass, at a modest price per flight because boosters are reused; Raptor and RS-25 (tier 3) give 2.5–2.7× more thrust each and much higher Isp, at higher cost and complexity.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 470 ⚠ | kg | [8] | 1,030 lb "including the hydraulic steering (TVC) actuators", Tom Mueller (SpaceX propulsion CTO) on Quora, 2015, quoted by Wikipedia. SpaceX publishes no mass. |
| `thrust_sl` | 845 | kN | [1][2] | 190,000 lbf per engine at sea level. |
| `thrust_vac` | 914 | kN | derived [2] | 8,227 kN stage vacuum thrust ÷ 9 (SpaceX Falcon 9 page). |
| `isp_sl` | 282 ⚠ | s | [3] | SpaceX Falcon 9 page, 2013 (earlier, lower-thrust Merlin 1D). Not republished for Block 5. ⚠ With the Block 5 thrusts, 311 s vacuum would give 311 × 845/914 = 287 s at sea level (derived). |
| `isp_vac` | 311 ⚠ | s | [3] | Same 2013 source; ⚠ not confirmed for Block 5. |
| `mass_flow` | 300 | kg/s | derived | `thrust_vac / (isp_vac · g0)` = 914,100 / (311 × 9.80665). |
| `mixture_ratio` | n/f | O/F by mass | | |
| `cycle` | gas generator | — | [1] | Single-shaft turbopump (LOX pump, fuel pump, turbine); pintle injector; regeneratively cooled chamber and nozzle with a milled copper-alloy liner. |
| `chamber_pressure` | 9.7 ⚠ | MPa | [8] | 1,410 psi, a 2011 design goal (Aviation Week via Wikipedia). Block 5 value n/f. |
| `expansion_ratio` | 16 ⚠ | — | [8] | 2011 design goal (Aviation Week via Wikipedia). |
| `throttle_min` | 57 | % | [1] | Falcon User's Guide: 190,000 lbf down to 108,300 lbf at sea level. ⚠ Elon Musk (2016, via Wikipedia) said ~40% of one engine. |
| `gimbal_range` | n/f | ° | | All 9 engines gimbal (pitch, yaw, roll) [1]; range not published. TVC uses the high-pressure RP-1 as hydraulic fluid [1]. |
| `restarts` | 3 (typical) | count | [2] | Booster recovery reuses the engines "to reorient the first stage prior to reentry and to decelerate the vehicle for landing" [2]: boostback (not on drone-ship flights), entry and landing burns. Exact count varies per mission. |
| `burn_time_max` | 147 | s | [1] | MECO at T+147 s in the guide's sample GTO mission (T+145 s for LEO), with the booster recovered. Expendable flights burn longer (n/f). |
| `total_impulse` | 124 | MN·s | derived | `thrust_sl · burn_time_max` = 845 kN × 147 s (lower bound; thrust rises with altitude). |
| `power_electric` | n/f | W | | Turbine-driven pumps and fuel-hydraulic actuators: no electric pump power. Valve and controller power not published. |
| `ignition` | TEA-TEB ⚠ | — | [1][8] | The guide states TEA-TEB for the upper-stage MVac; Wikipedia says the same pyrophoric ignition for Merlin 1D. |
| `reusable` | yes | — | [2][8] | 653 booster landings and 619 reflights of Falcon 9 [2]; one engine had flown 22 missions by Feb 2024 (SpaceX post via Wikipedia ⚠). |
| `cost_unit` | n/f | USD (year) | | Not published. |
| `twr` | 183 | — | derived | `thrust_sl / (mass_dry · g0)` = 845,000 / (470 × 9.80665). The Falcon User's Guide calls it "the highest thrust-to-weight ratio of any boost engine ever made" [1]. |
| `height` | 2.2 | m | est. | Scaled from `side-1.jpg` using the nozzle exit diameter below. |
| `diameter_max` | 0.93 | m | derived | Nozzle exit. Exit area = (F_vac − F_sl) / p0 = (914.1 − 845.2) kN / 101.325 kPa = 0.68 m² → 0.93 m. Wikipedia gives 0.92 m. |
| `first_flight` | 2013 | year | [1][8] | Merlin 1D first flew on Falcon 9 v1.1 (Sept 2013); the 845 kN Block 5 version first flew in spring 2018 [1]. |
| `flights` | 714 | count | [2] | Falcon 9 (700) + Falcon Heavy (14) missions, SpaceX counters read 2026-11-14 (includes v1.1/Full Thrust Merlin 1D flights). |

## 2. Vehicle and stage data

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | Falcon 9 Block 5 | — | [1][2] | Two-stage, LOX/RP-1; the same booster core (×3) forms Falcon Heavy. |
| `stage` | stage 1 | — | [1] | Al-Li tanks with common dome, 4 grid fins, 4 landing legs. |
| `parts_per_stage` | 9 | count | [1] | 8 around 1 (Octaweb). Falcon Heavy: 27. |
| `stage_mass_dry` | n/f | kg | | SpaceX does not publish stage masses. |
| `stage_propellant_mass` | n/f | kg | | |
| `stage_burn_time` | 145–147 | s | [1] | Sample timelines, recoverable booster. |
| `stage_delta_v` | n/f | m/s | derived | Needs stage masses. |
| `vehicle_liftoff_mass` | 549,054 | kg | [2] | |
| `vehicle_height` | 70 | m | [1][2] | With standard fairing (75.2 m with extended fairing [1]). |
| `vehicle_diameter` | 3.7 | m | [2] | 3.66 m in the user's guide [1]. |
| `payload_leo` | 22,800 | kg | [2] | Expendable; less when the booster is recovered. |
| `payload_gto` | 8,300 | kg | [2] | Expendable. |
| `payload_mars` | 4,020 | kg | [2] | "Payload to Mars" on SpaceX's Falcon 9 page (C3 not stated). |
| `cost_launch` | 74 M | USD (2026) | [4] ⚠ | List price for up to 5.5 t to GTO, as reported by Spaceflight Now from SpaceX's price sheet ($70 M in 2025). The sheet itself was not retrievable. |
| `mars_heritage` | Mars flybys only | — | [5][6] | ESA's **Hera** (launched on Falcon 9, Oct 2024) flew past Mars and Deimos on 12 Mar 2025 [5]; NASA's **Psyche** (Falcon Heavy, 27 Merlin 1D, Oct 2023) used a Mars gravity assist on 15 May 2026 [6]. No Mars orbiter or lander has launched on Falcon yet. |

## 3. Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Nozzle exit diameter | 0.93 | derived | From the SL/vacuum thrust difference (see `diameter_max`). Known dimension used to scale the photo. |
| Overall height (mount to exit) | 2.2 | est. | `side-1.jpg`: 615 px mount-to-exit vs. 257 px exit width. |
| Throat diameter | 0.23 | derived | exit / √16 (expansion ratio 16 ⚠). |
| Combustion chamber diameter / length | 0.50 / 0.55 | est. | `side-1.jpg`: banded cylinder 138 px wide; ~150 px tall. |
| Powerhead (turbopump, valves, gimbal block) height | 0.45 | est. | `side-1.jpg`, from the mount plate to the top of the chamber. |
| Nozzle coolant manifold ring | Ø 0.69 at 1.47 below mount | est. | `side-1.jpg`, torus around the upper bell. |
| Engine spacing (Octaweb) | 9 engines inside the 3.66 m base | [1] | `bottom-1.jpg`: exits almost touch. |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

From the side (`side-1.jpg`): at the top, a dense, boxy powerhead of valves and lines with the turbopump on one side; below it a short, fat, polished cylindrical chamber with two or three raised bands; a pinch at the throat hidden by a collar; then a long, almost straight-sided bell that flares slowly to the widest point at the exit (about 1.9× the chamber diameter). A thick torus manifold rings the upper third of the bell, fed by one or two curved pipes coming down from the powerhead (`in-context-1.jpg` shows the pipe and ring on every engine). New nozzles are bright polished steel; flown nozzles turn dark grey to black with soot (`bottom-1.jpg`). On the vehicle, only the bells and manifolds hang below the black Octaweb heat shield. Must keep: the long bell (≈ 50% of the height), the manifold ring, the chamber barrel.

### 4.2 Node hierarchy

```text
Merlin1D                      origin: mount interface (top of the gimbal block)
├─ Attach_Top                 (0, 0, 0)
├─ Gimbal                     pivot at (0, -0.05, 0); all meshes below are its children
│  ├─ Gimbal_Metal            powerhead block, turbopump, pipes
│  ├─ Gimbal_Steel            chamber + nozzle lathe, manifold ring
│  └─ Gimbal_Copper           (optional) throat collar
└─ FX_Exhaust                 (0, -2.20, 0), rotation [180, 0, 0], preset exhaust_kerolox
```

### 4.3 Parts

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Gimbal | cylinder (gimbal block) | r 0.12, r 0.12, h 0.10 | (0, -0.05, 0) | (0, 0, 0) | Metal | 8 |
| 2 | Gimbal | box (powerhead, valves) | 0.55 × 0.35 × 0.45 (w, h, d) | (0, -0.28, 0) | (0, 0, 0) | Metal | — |
| 3 | Gimbal | cylinder (turbopump) | r 0.14, r 0.14, h 0.45 | (0.36, -0.40, 0) | (0, 0, 0) | Metal | 8 |
| 4 | Gimbal | cylinder (turbine exhaust duct) | r 0.06, r 0.06, h 0.55 | (0.36, -0.88, 0) | (0, 0, 0) | Metal | 6 |
| 5 | Gimbal | lathe (chamber + nozzle) | see 4.4 | (0, 0, 0) | (0, 0, 0) | Steel | 16 |
| 6 | Gimbal | torus (nozzle manifold) | R 0.345, r 0.04 | (0, -1.47, 0) | (90, 0, 0) | Steel | 16 × 6 |
| 7 | Gimbal | cylinder (fuel coolant pipe) | r 0.045, r 0.045, h 0.95 | (0.30, -1.00, 0.10) | (0, 0, -4) | Metal | 6 |
| 8 | Gimbal | cylinder (throat collar) | r 0.17, r 0.17, h 0.08 | (0, -1.14, 0) | (0, 0, 0) | Copper | 16 |

### 4.4 Revolved profiles

```text
ChamberNozzle: (0.25, -0.45) (0.25, -1.00) (0.18, -1.10) (0.117, -1.15) (0.20, -1.30) (0.30, -1.50) (0.38, -1.75) (0.43, -2.00) (0.465, -2.20)
```

### 4.5 Simplify

- Merge all valves, wiring, sensors and small lines into the powerhead box.
- Keep the turbopump cylinder and one coolant pipe + manifold ring: they are what makes a Merlin read as a Merlin from 20 m.
- For a flown booster, a variant can use `NozzleDark` on the bell; use `Steel` for a new engine.
- No SpaceX logo or text (`in-context-1.jpg` shows none on the engines; keep it so).

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 900 (×9 per stage) |
| Meshes | 3 |
| Height / diameter | 2.2 m / 0.93 m (±2%) |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| `side-1.jpg` | side | Merlin 1D on the McGregor test stand: powerhead, banded chamber, throat collar, polished bell, manifold ring. Main shape reference; +Z faces the camera. | [Commons](https://commons.wikimedia.org/wiki/File:A_SpaceX_Merlin_engine_is_on_a_test_stand_at_the_company%27s_facility_in_McGregor_KSC-20180102-PH_SPX01_0004~orig.jpg) | SpaceX | CC0 |
| `bottom-1.jpg` | bottom | Nine sooted nozzles of booster B1019 after landing (2015, Full Thrust). Take: exit rims, 8-around-1 layout, how close the bells sit. | [Commons](https://commons.wikimedia.org/wiki/File:Falcon_9_first_stage_in_hangar;_upgraded_Merlin_engines_close-up_(24175842635).jpg) | SpaceX Photos | CC0 |
| `in-context-1.jpg` | in-context | The flown Falcon 9 booster displayed at SpaceX HQ (B1019): engines below the Octaweb heat shield, a person for scale. Take: how much of each engine shows, the pipe into the manifold ring. | [Commons](https://commons.wikimedia.org/wiki/File:SpaceX_Falcon_9_Octaweb_(29255024784).jpg) | Steve Jurvetson | CC BY 2.0 |

**Linked only** (free licence, not downloaded to stay within 3 images):

- https://commons.wikimedia.org/wiki/File:Merlin_1D_engines_and_octaweb_harness----image-cropped.jpg — row of Merlin 1D engines, three-quarter view (CC BY 2.0).
- https://commons.wikimedia.org/wiki/File:SpaceX_Merlin_and_sea-level_Raptor_at_Hawthorne.jpg — Merlin beside a sea-level Raptor (CC BY-SA 4.0; copy in `../raptor/side-1.jpg`).

## 6. Gaps and cautions

- SpaceX publishes **no engine mass, Isp, chamber pressure or expansion ratio for Block 5**. Mass (470 kg), Isp (282/311 s), 9.7 MPa and ε = 16 come from 2011–2015 statements relayed by Wikipedia (⚠). The 282/311 s pair does not match the Block 5 SL/vac thrust ratio (it implies 287 s at sea level for 311 s vacuum).
- Stage dry and propellant masses are not published by SpaceX: `n/f`.
- Falcon 9 thrust totals differ inside the 2025 user's guide (7,605 kN in the text, 7,686 kN in the table) and the website (7,607 kN); 845 kN per engine is consistent.
- Do not model logos, flags or text.

## 7. Sources

1. SpaceX, *Falcon User's Guide*, 9 May 2025. https://www.spacex.com/assets/media/falcon-users-guide-2025-05-09.pdf (accessed 2026-11-14)
2. SpaceX, *Falcon 9* vehicle page (specs, Merlin section, mission/landing/reflight counters). https://www.spacex.com/vehicles/falcon-9/ (accessed 2026-11-14)
3. SpaceX, *Falcon 9* page, 2013 archive (Merlin Isp 282 s SL / 311 s vac), cited by Wikipedia. https://web.archive.org/web/20130715094112/http://www.spacex.com/falcon9 (accessed 2026-11-14 via Wikipedia)
4. Spaceflight Now, *Live coverage: SpaceX to launch 29 Starlink satellites…*, 24 Feb 2026 (Falcon 9 list price $74 M). https://spaceflightnow.com/2026/02/24/live-coverage-spacex-to-launch-29-starlink-satellites-on-falcon-9-rocket-from-cape-canaveral-8/ (accessed 2026-11-14)
5. ESA, *Hera Mars flyby*, Mar 2025. https://www.esa.int/ESA_Multimedia/Images/2025/03/Hera_Mars_flyby (accessed 2026-11-14)
6. NASA, *NASA's Psyche Mission to Fly by Mars for Gravity Assist*, 8 May 2026. https://science.nasa.gov/blogs/psyche/2026/05/08/nasas-psyche-mission-to-fly-by-mars-for-gravity-assist/ (accessed 2026-11-14)
7. Wikimedia Commons image pages listed in §5 (accessed 2026-11-14).
8. Wikipedia, *SpaceX Merlin* (used only to find sources; values marked ⚠: mass from T. Mueller 2015, Pc and ε from Aviation Week 11 Aug 2011, 40% throttle from E. Musk 2016, TEA-TEB, 22-flight engine). https://en.wikipedia.org/wiki/SpaceX_Merlin (accessed 2026-11-14)
