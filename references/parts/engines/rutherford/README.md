---
id: rutherford
name: "Rutherford (sea level)"
category: engine
role: booster
tier: 1
propellants: [LOX, RP-1]
manufacturer: Rocket Lab
vehicles: ["Electron stage 1"]
status: operational (checked 2026-11)
---

# Rutherford (sea level)

Rutherford is Rocket Lab's small kerosene engine. Nine of them push the first stage of the Electron rocket. It is the first flight engine whose propellant pumps are driven by **electric motors and lithium-polymer batteries** instead of a gas turbine, and its chamber, injector, pumps and main valves are 3D printed [1][2]. For the game this makes it the only booster that spends **electrical power**: the stage carries a battery "power pack" rated at over 1 MW [3].

**Why tier 1:** about 25 kN and 35 kg per engine, roughly 1/34 of a Merlin 1D and 1/90 of a Raptor; cheap and light, but a whole Electron only lifts 300 kg to low Earth orbit.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 35 | kg | [2] | "Weighing in at just 35 kilograms" (Rocket Lab, 2020). Does not include the batteries. |
| `thrust_sl` | 24.9 ⚠ | kN | [1][2] | 5,600 lbf "sea level (per engine)" in the Payload User's Guide (rounded there to 24 kN). ⚠ Rocket Lab's Electron page gives stage-1 **lift-off** thrust 190 kN (= 21.1 kN per engine) and **peak** thrust 224 kN (= 24.9 kN per engine) [4], so 24.9 kN may be the peak at altitude. |
| `thrust_vac` | n/f | kN | | Not published for the sea-level engine. The Rutherford **Vacuum** (stage 2, larger nozzle) is a different part: 25.8 kN, 343 s [4]. |
| `isp_sl` | 311 ⚠ | s | [1][2][4] | Rocket Lab lists 311 s for the sea-level engine without saying at which pressure. ⚠ If 311 s is the high-altitude value, the 190/224 kN thrust ratio gives ~264 s at lift-off (311 × 190/224, derived). |
| `isp_vac` | n/f | s | | |
| `mass_flow` | 8.2 | kg/s | derived | `thrust_sl / (isp_sl · g0)` = 24,910 / (311 × 9.80665); vacuum values not published. |
| `mixture_ratio` | n/f | O/F by mass | | |
| `cycle` | electric pump | — | [1][2] | Brushless DC motors + lithium-polymer batteries drive the LOX and RP-1 pumps; regeneratively cooled chamber. Rocket Lab claims "90% efficiency" for the cycle [2]. |
| `chamber_pressure` | n/f | MPa | | |
| `expansion_ratio` | n/f | — | | ~10 est. from the press photo (see §3); not data. |
| `throttle_min` | n/f | % | | |
| `gimbal_range` | n/f | ° | | Engines are steered by electromechanical thrust-vector actuators in two axes [1]; range not published. |
| `restarts` | 0 | count | [1] | Stage 1 burns once per flight. |
| `burn_time_max` | n/f | s | | Stage-1 burn time not in the user's guide. |
| `total_impulse` | n/f | MN·s | | Needs the burn time. |
| `power_electric` | 111,000 ⚠ | W | derived [3] | **≈ 111 kW per engine** = "over 1 Megawatt of battery power" in the Electron stage-1 power pack [3] ÷ 9 engines (a lower bound). ⚠ Aviation Week (2015, quoted only by Wikipedia [9]) says each engine has two motors of 50 hp (37 kW) at 40,000 rpm, i.e. ~74 kW per engine (or 37 kW if the figure is per engine; the wording is ambiguous). |
| `ignition` | n/f | — | | |
| `reusable` | partly | — | [9] ⚠ | Rocket Lab recovers some stage-1 boosters from the sea; one recovered engine was reflown in 2023 (Rocket Lab post quoted by Wikipedia). Normal flights are expendable. |
| `cost_unit` | n/f | USD (year) | | |
| `twr` | 72.6 | — | derived | `thrust_sl / (mass_dry · g0)` = 24,910 / (35 × 9.80665). |
| `height` | 0.72 | m | est. | Scaled from the Rocket Lab press photo (linked in §5) using the nozzle exit diameter below. |
| `diameter_max` | 0.24 ⚠ | m | est. | Nozzle exit scaled from the linked ELaNa-19 base photo (≈ 1/5 of the 1.2 m stage base). Wikipedia gives 0.25 m without a source [9]. |
| `first_flight` | 2017 | year | [5] | Electron "It's a Test", 25 May 2017. |
| `flights` | 100 ⚠ | count | [4][5] | Electron launches (9 engines each). Rocket Lab announced its 100th Electron launch in Nov 2026; its Electron page counter still read 99. ⚠ The count may include HASTE suborbital flights. |

### 1.1 Batteries (electrical power is a game resource)

| Item | Value | Source | Note |
|---|---|---|---|
| Stage-1 power pack | > 1 MW peak power | [3] | One battery pack in the stage-1 core feeds the pumps of all 9 engines at once. |
| Per engine | ≈ 111 kW | derived | 1 MW ÷ 9. ⚠ 37–74 kW from motor ratings (see `power_electric`). |
| Motors | 2 brushless DC motors per engine, ~40,000 rpm | [9] ⚠ | Aviation Week 2015 via Wikipedia only. |
| Stage 2 | 3 "High Voltage Batteries" (HVB) | [1] | Two power the pumps until empty and are **jettisoned**; the third finishes the burn. |
| Battery chemistry | lithium polymer | [1][2] | 2020 thrust increase "primarily made possible through advances in the battery technology" [2]. |
| Battery mass / energy | n/f | | Not published. Game value: size the pack as power × burn time / efficiency (`game-balance`). |

## 2. Vehicle and stage data

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | Electron | — | [1] | Two stages plus optional Kick Stage, carbon-composite structure. |
| `stage` | stage 1 | — | [1] | 9 sea-level Rutherfords, linerless common-bulkhead LOX/RP-1 tanks, battery power pack. |
| `parts_per_stage` | 9 | count | [1] | 8 in a ring + 1 in the centre. |
| `stage_mass_dry` | n/f | kg | | |
| `stage_propellant_mass` | n/f | kg | | Stage 2 holds ~2,000 kg [1]. |
| `stage_burn_time` | n/f | s | | Stage 2 burns ~5 min [1]. |
| `stage_delta_v` | n/f | m/s | derived | Needs stage masses. |
| `vehicle_liftoff_mass` | 13,000 | kg | [1][4] | |
| `vehicle_height` | 18 | m | [1][4] | |
| `vehicle_diameter` | 1.2 | m | [1][4] | |
| `payload_leo` | 300 | kg | [2][4] | Low LEO, expendable; 200 kg to 500 km SSO [1]. |
| `payload_gto` | n/f | kg | | |
| `payload_mars` | n/f | kg | | Interplanetary only with the high-energy Photon kick stage (used for CAPSTONE to the Moon); no Mars figure published. |
| `cost_launch` | ~7.5 M ⚠ | USD (2020) | [9] | Bloomberg 2020 as quoted by Wikipedia; Rocket Lab publishes no list price. |
| `mars_heritage` | none | — | | Rocket Lab built the ESCAPADE Mars orbiters, but they launched on New Glenn, not Electron. |

## 3. Geometry

No dimensioned drawing is public. All values below are `est.` unless a source is given.

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Stage base diameter | 1.2 | [1] | Known dimension used for scaling. |
| Nozzle exit diameter | 0.24 | est. | the linked ELaNa-19 base photo: each nozzle ≈ 120 px against a ~615 px base plate (1.2 m). |
| Overall height (mount to exit) | 0.72 | est. | Press photo: length ≈ 3.0 × exit diameter. |
| Throat diameter | 0.075 | est. | Press photo: throat ≈ 0.32 × exit diameter (area ratio ≈ 10). |
| Combustion chamber diameter / length | 0.15 / 0.18 | est. | Press photo: chamber ≈ 0.6 × exit diameter, straight barrel ≈ 0.75 × exit diameter. |
| Pump and motor block (top) | 0.18 dia × 0.22 | est. | Press photo, between mount plate and chamber. |
| Nozzle below the stage heat shield | ~0.22 | est. | the linked ELaNa-19 base photo: only the bell sticks out below the base plate. |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A short, stubby engine: a compact block of pumps and electric motors on top, a smooth satin-grey cylindrical chamber, a narrow throat and a short, wide-mouthed bell that ends at about twice the chamber width. The printed metal is matte light grey with faint layer texture (ignore it). A thin fuel pipe runs from the top block down the outside of the bell to a small ring near the exit. Two cylindrical actuators (anodised blue and red in the press photo; model them in `Aluminum`) sit beside the chamber, one running diagonally from the mount down to the chamber. In flight only the bells stick out below a flat round heat shield (the linked ELaNa-19 base photo, `in-context-1.jpg`): nine bells, eight in a ring and one in the centre, close together. Silhouette must-haves: barrel chamber → pinched throat → bell, with exit ≈ 3× throat.

### 4.2 Node hierarchy

```text
Rutherford                    origin: mount interface (top of the pump block)
├─ Attach_Top                 (0, 0, 0)
├─ Rutherford_Aluminum        mount plate (fixed)
├─ Gimbal                     pivot at (0, -0.03, 0); all other meshes go here
│  ├─ Gimbal_Aluminum         pump/motor block, actuators
│  ├─ Gimbal_Titanium         chamber + nozzle (one lathe)
│  └─ Gimbal_Metal            fuel pipe + exit manifold ring
└─ FX_Exhaust                 (0, -0.72, 0), rotation [180, 0, 0], preset exhaust_kerolox
```

### 4.3 Parts

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Rutherford | cylinder | r 0.13, r 0.13, h 0.03 | (0, -0.015, 0) | (0, 0, 0) | Aluminum | 8 |
| 2 | Gimbal | cylinder | r 0.09, r 0.09, h 0.22 | (0, -0.14, 0) | (0, 0, 0) | Aluminum | 8 |
| 3 | Gimbal | cylinder (motor/pump housing) | r 0.05, r 0.05, h 0.21 | (0, -0.16, -0.12) | (0, 0, 0) | Aluminum | 8 |
| 4 | Gimbal | cylinder (TVC actuator) | r 0.03, r 0.03, h 0.33 | (0.10, -0.19, 0) | (0, 0, 15) | Aluminum | 6 |
| 5 | Gimbal | lathe (chamber + nozzle, profile below) | see 4.4 | (0, 0, 0) | (0, 0, 0) | Titanium | 16 |
| 6 | Gimbal | cylinder (fuel pipe) | r 0.012, r 0.012, h 0.44 | (0.105, -0.47, 0) | (0, 0, -3) | Metal | 6 |
| 7 | Gimbal | torus (exit manifold) | R 0.115, r 0.012 | (0, -0.68, 0) | (90, 0, 0) | Metal | 16 × 5 |

### 4.4 Revolved profiles

```text
ChamberNozzle: (0.075, -0.25) (0.075, -0.41) (0.055, -0.445) (0.038, -0.47) (0.055, -0.50) (0.085, -0.57) (0.106, -0.64) (0.120, -0.72)
```

### 4.5 Simplify

- Drop sensor lines, bolts, flanges, the small valves and the printed text on the chamber.
- Keep the actuators and the single fuel pipe: they break the round silhouette when seen from the side.
- For the 9-engine stage, instance this engine; the stage heat shield belongs to the tank part.
- No logos or flags (the Electron diagram and photos show a flag and the company logo: leave them off).

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 600 (well under 1,500) |
| Meshes | 4 |
| Height / diameter | 0.72 m / 0.24 m (±2%) |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| `in-context-1.jpg` | in-context | Electron lifting off (TROPICS, 2023), four bells visible below the round base. Take: bell length vs. stage diameter. | [Commons](https://commons.wikimedia.org/wiki/File:TROPICS_Rocket_Launch_(KSC-20230507-PH-RLS01_0004-reupload).jpg) | NASA Kennedy Space Center / Rocket Lab | Public domain (NASA release; photo credited to Rocket Lab) |
| `diagram-1.png` | diagram | Side diagram of the whole Electron. Take: stage proportions, nozzles at the base. The flag and logo are not to be modelled. | [Commons](https://commons.wikimedia.org/wiki/File:Electron_Rocket_Diagram.png) | UnknownM1 | CC BY-SA 4.0 |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://images.nasa.gov/details/KSC-20181218-PH_RKL01_0001 — Nozzle bells under the stage base plate at ignition (ELaNa-19, 2018). Take: bell shape, spacing, how little of the engine shows below the heat shield; scale for exit diameter. (photo credited to Rocket Lab; NASA's library gives no licence, so it is linked, not copied)
- https://rocketlabcorp.com/assets/Uploads/Rutherford-Photo2.jpg — full side view of a Rutherford on its mount plate (press photo, © Rocket Lab). **Main shape reference**: pump block, actuators, chamber, throat, bell, fuel pipe.
- https://rocketlabcorp.com/assets/Uploads/Web-Rutherford2__ScaleHeightWzg1MF0.jpg — stage-1 base in flight (© Rocket Lab).

## 6. Gaps and cautions

- **Thrust/Isp labels are unclear** (⚠): 5,600 lbf / 311 s are called "sea level" by Rocket Lab, but its own lift-off thrust (190 kN for 9 engines) is 15% lower. Use 24.9 kN / 311 s as the published pair and treat lift-off as ~21 kN if the game models altitude.
- **Electric power** is derived from a 2016 company presentation ("over 1 MW" for the stage) [3]; per-motor ratings (37 kW, 50 hp) come only from Wikipedia citing Aviation Week [9]. Battery mass and energy are not published.
- Chamber pressure, mixture ratio, expansion ratio, gimbal range, burn time, unit cost and all dimensions: `n/f` or estimated.
- Launch count may include HASTE suborbital launches; recheck before showing it to players.
- No flags or the company logo on the model.

## 7. Sources

1. Rocket Lab, *Launch: Payload User Guide*, version 7.0, 1 Nov 2022. https://rocketlabusa.com/assets/Electron-Payload-User-Guide-7.0-v6.pdf (accessed 2026-11-14)
2. Rocket Lab, *Rocket Lab Increases Electron Payload Capacity, Enabling Interplanetary Missions and Reusability*, 4 Aug 2020. https://rocketlabcorp.com/updates/rocket-lab-increases-electron-payload-capacity-enabling-interplanetary-missions-and-reusability/ (accessed 2026-11-14)
3. Rocket Lab, *Rocket Lab Introduction* (USGIF presentation), 2016, slide "Power Pack (Electron Stage 1 Core) with over 1 Megawatt of battery power". https://web.archive.org/web/20160920143833/http://usgif.org/system/uploads/4606/original/ROCKET_LAB_INTRO_USGIF.pdf (accessed 2026-11-14)
4. Rocket Lab, *Electron* vehicle page (overview, lift-off/peak thrust, launch counter). https://rocketlabcorp.com/launch/electron/ (accessed 2026-11-14)
5. Rocket Lab, *Rocket Lab Hits 100 Electron Launches, Fastest Commercial Rocket to Reach the Milestone*, Nov 2026. https://rocketlabcorp.com/updates/rocket-lab-hits-100-electron-launches-fastest-commercial-rocket-to-reach-the-milestone/ (accessed 2026-11-14)
6. Rocket Lab, *Rocket Lab Reveals First Battery-Powered Rocket for Commercial Launches to Space*, Apr 2015 (original 4,600 lbf rating). https://rocketlabcorp.com/news/updates/rocket-lab-reveals-first-battery-powered-rocket-for-commercial-launches-to-space (accessed 2026-11-14)
7. NASA Image and Video Library, KSC-20181218-PH_RKL01_0001. https://images.nasa.gov/details/KSC-20181218-PH_RKL01_0001 (accessed 2026-11-14)
8. Wikimedia Commons, *Electron Rocket Diagram.png*. https://commons.wikimedia.org/wiki/File:Electron_Rocket_Diagram.png (accessed 2026-11-14)
9. Wikipedia, *Rutherford (rocket engine)* and *Rocket Lab Electron* (used only to find sources; values marked ⚠: motor ratings citing Aviation Week 14 Apr 2015, 0.25 m diameter, engine reflight, US$7.5 M price citing Bloomberg 2020). https://en.wikipedia.org/wiki/Rutherford_(rocket_engine) (accessed 2026-11-14)
