---
id: rutherford-vacuum
name: Rutherford Vacuum (Electron stage 2 engine)
category: engine
role: upper-stage
tier: 1
propellants: [LOX, RP-1]
manufacturer: Rocket Lab
vehicles: ["Electron stage 2"]
status: operational (checked 2026-11)
---

# Rutherford Vacuum

The vacuum version of Rocket Lab's Rutherford, a small 3D-printed LOX/kerosene engine whose propellant pumps are driven by **electric motors and lithium-polymer batteries** instead of a turbine. One engine powers the second stage of Electron. It is identical to the nine sea-level engines of stage 1 except for a larger expansion-ratio nozzle. Electrical power is literally its fuel pump: the stage carries three high-voltage batteries and throws two away when they run flat.

**Why tier 1:** about 1/38 of a Merlin Vacuum's thrust and similar Isp, but tiny, cheap and light; good for small payloads only, and it needs a battery budget that scales with burn time.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 35 ⚠ | kg | [3] | Rocket Lab: "Weighing in at just 35 kilograms, Rocket Lab's Rutherford engines…". Not split by version; the vacuum nozzle is larger, so the vacuum engine is probably a little heavier. Batteries not included. |
| `thrust_sl` | n/a | kN | | vacuum-only engine |
| `thrust_vac` | 25.8 | kN | [1] [2] | 5,800 lbf |
| `isp_sl` | n/a | s | | |
| `isp_vac` | 343 | s | [1] [2] | |
| `mass_flow` | 7.67 | kg/s | derived | `thrust_vac / (isp_vac · g0)` = 25,800 / (343 × 9.80665) |
| `mixture_ratio` | n/f | O/F by mass | | not published |
| `cycle` | electric pump-fed | — | [2] | brushless DC motors + Li-polymer batteries drive the LOX and kerosene pumps; a pressurant system gives pump inlet pressure |
| `chamber_pressure` | n/f | MPa | | not published |
| `expansion_ratio` | n/f | — | | Rocket Lab only says "larger expansion ratio nozzle for Stage 2" [2] |
| `throttle_min` | n/f | % | | |
| `gimbal_range` | n/f | ° | | thrust vectored by electromechanical actuators in two axes; roll by cold-gas RCS [2] |
| `restarts` | n/f | count | | the user's guide describes one ~5 min stage-2 burn; later orbit changes are done by the Kick Stage's Curie engine [2] |
| `burn_time_max` | ≈ 300 | s | [2] | "burn time of approximately five minutes". Derived check: 2,000 kg / 7.67 kg/s = 261 s at full thrust |
| `total_impulse` | 6.7 | MN·s | derived | `m_prop · isp_vac · g0` = 2,000 kg × 343 × 9.80665 (one stage-2 load) |
| `power_electric` | 74,000 ⚠ | W | [5] | 2 motors × 37 kW (50 hp) at 40,000 rpm, Aviation Week 2015 quoted by Wikipedia, for the original 4,600 lbf engine. Rocket Lab (2016, also via Wikipedia) said the stage-1 battery gives > 1 MW for nine engines, i.e. > 111 kW per engine (derived). Rocket Lab has not published the current value. Energy for one burn, est.: 74 kW × 300 s ≈ 22 MJ ≈ 6.2 kWh |
| `ignition` | n/f | — | | |
| `reusable` | no | — | [2] | stage 2 is expended; Rocket Lab's recovery work is on stage 1 only |
| `cost_unit` | n/f | USD (year) | | |
| `twr` | 75 | — | derived | `thrust_vac / (mass_dry · g0)` = 25,800 / (35 × 9.80665) |
| `height` | n/f (model: 1.45 est.) | m | est. | see section 3 |
| `diameter_max` | n/f (model: 0.70 est.) | m | est. | see section 3 |
| `first_flight` | 2017 | year | [2] | Electron first launch 25 May 2017 |
| `flights` | 100 | count | [4] | one engine per Electron launch; Rocket Lab's 100th Electron launch was on 2026-11-14 (includes the 4 failures) |

### Stage-2 battery (game resource)

| Item | Value | Source |
|---|---|---|
| Batteries on stage 2 | 3 high-voltage batteries (HVBs) | [2] |
| How they are used | two HVBs power the pumps until depleted, then the third takes over for the rest of the burn; the two spent HVBs are **jettisoned in flight** to save mass | [2] |
| Battery mass / energy | n/f | Rocket Lab has not published them; the 2020 payload upgrade (to 300 kg) was "primarily … advances in the battery technology" [3] |

## 2. Vehicle and stage data

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | Electron | — | [1] [2] | 2 stages + Kick Stage, carbon-composite |
| `stage` | stage 2 | — | [2] | |
| `parts_per_stage` | 1 | count | [2] | |
| `stage_mass_dry` | n/f | kg | | not published |
| `stage_propellant_mass` | ≈ 2,000 | kg | [2] | "approximately 2,000 kg of propellant" |
| `stage_burn_time` | ≈ 300 | s | [2] | |
| `stage_delta_v` | n/f | m/s | derived | cannot be computed without the stage dry mass |
| `vehicle_liftoff_mass` | 13,000 | kg | [1] [2] | |
| `vehicle_height` | 18 | m | [1] | |
| `vehicle_diameter` | 1.2 | m | [1] [2] | |
| `payload_leo` | 300 | kg | [1] | low LEO, expendable; 200 kg to 500 km SSO [2] |
| `payload_gto` | n/f | kg | | not offered |
| `payload_mars` | n/f | kg | | no Mars capability published; Electron + Lunar Photon sent CAPSTONE (~25 kg class) to the Moon in 2022 [6] |
| `cost_launch` | 9.95 M | USD (2020) | [6] | NASA firm-fixed-price contract for the CAPSTONE launch (Electron + Photon TLI). A list price of ~US$7.5 M (2020) is quoted by Bloomberg/Wikipedia ⚠ |
| `mars_heritage` | none | — | [7] | Rocket Lab built the twin ESCAPADE Mars orbiters, but they did not launch on Electron |

## 3. Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Stage 2 diameter | 1.2 | [2] | the nozzle exit must fit well inside this |
| Overall engine height | 1.45 (est.) | est. | no free photo or published value; game placeholder ≈ 1.2 × stage diameter, from Rocket Lab press photos (linked) where the vacuum bell is roughly as long as the stage is wide. Recheck. |
| Nozzle exit diameter | 0.70 (est.) | est. | ≈ 0.58 × stage diameter, same photos. Recheck. |
| Sea-level Rutherford diameter | 0.25 ⚠ | [5] | Wikipedia infobox, no primary source; used here as the chamber/powerhead width |

## 4. Low-poly model

Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A very small engine: on top, a compact block of two cylindrical **electric pump/motor cans** side by side next to a short **combustion chamber**; all 3D-printed, dull grey metal. Below the throat, a short regeneratively cooled bell flares into a long, thin, dark **vacuum nozzle extension** that makes up about two thirds of the height. No turbine exhaust pipe (there is no turbine): this is the feature that sets it apart from every other kerosene engine. Two thin TVC actuator rods run from the mount to the top of the bell. Batteries are on the stage, not on the engine.

### 4.2 Node hierarchy

```text
RutherfordVacuum              origin: mount interface (top of the engine)
├─ Attach_Top                 (0, 0, 0)
├─ Gimbal                     pivot at (0, -0.02, 0); all engine meshes go here
│  └─ Gimbal_Titanium, Gimbal_NozzleDark, Gimbal_Metal
└─ FX_Exhaust                 (0, -1.45, 0), rotation [180, 0, 0], preset exhaust_kerolox
```

### 4.3 Parts

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Gimbal | cylinder (mount plate) | r 0.12, h 0.04 | (0, -0.02, 0) | (0, 0, 0) | Metal | 8 |
| 2 | Gimbal | cylinder (LOX pump + motor) | r 0.055, h 0.20 | (0.075, -0.14, 0) | (0, 0, 0) | Titanium | 8 |
| 3 | Gimbal | cylinder (fuel pump + motor) | r 0.055, h 0.20 | (-0.075, -0.14, 0) | (0, 0, 0) | Titanium | 8 |
| 4 | Gimbal | lathe (injector + chamber + regen bell) | profile A | (0, 0, 0) | (0, 0, 0) | Titanium | 12 |
| 5 | Gimbal | lathe (vacuum extension) | profile B | (0, 0, 0) | (0, 0, 0) | NozzleDark | 12 |
| 6 | Gimbal | cylinder (pump discharge pipe) | r 0.015, h 0.20 | (0.07, -0.30, 0.06) | (25, 0, 0) | Metal | 6 |
| 7 | Gimbal | cylinder (pump discharge pipe) | r 0.015, h 0.20 | (-0.07, -0.30, 0.06) | (25, 0, 0) | Metal | 6 |
| 8 | Gimbal | cylinder (TVC actuator) | r 0.012, h 0.40 | (0, -0.24, 0.13) | (-10, 0, 0) | Metal | 5 |
| 9 | Gimbal | cylinder (TVC actuator) | r 0.012, h 0.40 | (0.13, -0.24, 0) | (0, 0, 10) | Metal | 5 |

### 4.4 Revolved profiles

```text
A chamber+regen: (0.06, -0.04) (0.08, -0.08) (0.08, -0.30) (0.05, -0.38) (0.035, -0.42) (0.07, -0.50) (0.13, -0.58)
B extension:     (0.13, -0.58) (0.19, -0.75) (0.25, -0.95) (0.30, -1.18) (0.33, -1.35) (0.35, -1.45)
```

### 4.5 Simplify

- Merge the motor controllers, valves and wiring into the two pump cans; no turbine, no exhaust duct.
- Keep the long dark extension and the two pump cans: they are the silhouette.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 500 (est. ~350) |
| Meshes | ≤ 4 (Metal, Titanium, NozzleDark under Gimbal) |
| Height / diameter | 1.45 / 0.70 (est., ±2% of the values in section 3) |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| — | — | No freely licensed photo of the vacuum Rutherford was found on Wikimedia Commons or the NASA library (NASA's Electron photos are credited to Rocket Lab). | | | |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://rocketlabcorp.com/launch/electron/ — Rocket Lab Electron page, engine and stage photos.
- https://rocketlabcorp.com/assets/Rocket-Lab-Electron-Payload-User-Guide-8.0.pdf — user's guide, p. 11–12: cutaway of Electron showing the Rutherford Vacuum under stage 2.
- https://images.nasa.gov/details/KSC-20240530-PH-RKL01_0001 — Electron on the pad (photo credit Rocket Lab, not NASA).
- https://commons.wikimedia.org/wiki/File:Electron_small_launch_vehicle_of_the_Rocket_Lab_Mission_to_Venus.webp — CC BY 4.0 diagram of Electron (French et al.), WebP only, so not saved here.

## 6. Gaps and cautions

- Engine mass, chamber pressure, expansion ratio, mixture ratio, stage-2 dry mass, battery mass and energy are not published by Rocket Lab.
- `power_electric` comes from a 2015 trade-press figure for the original engine (⚠); the battery-energy line is our estimate.
- Height and exit diameter are placeholders (est.) until someone measures a photo with a known scale.
- Do not model the Rocket Lab logo or flags.

## 7. Sources

1. Rocket Lab, *Electron* vehicle page, 2026. https://rocketlabcorp.com/launch/electron/ (accessed 2026-11-14)
2. Rocket Lab, *Electron Payload User's Guide*, version 8.0, September 2025, pp. 11–12. https://rocketlabcorp.com/assets/Rocket-Lab-Electron-Payload-User-Guide-8.0.pdf (accessed 2026-11-14)
3. Rocket Lab, *Rocket Lab Increases Electron Payload Capacity, Enabling Interplanetary Missions and Reusability*, 2020-08-04. https://rocketlabcorp.com/news/updates/rocket-lab-increases-electron-payload-capacity-enabling-interplanetary-missions-and-reusability/ (accessed 2026-11-14)
4. Rocket Lab, *Rocket Lab Hits 100 Electron Launches, Fastest Commercial Rocket to Reach the Milestone*, 2026-11-14. https://rocketlabcorp.com/updates/rocket-lab-hits-100-electron-launches-fastest-commercial-rocket-to-reach-the-milestone/ (accessed 2026-11-14)
5. Wikipedia, *Rutherford (rocket engine)* (secondary; cites Aviation Week 2015-04-14 and a 2016 Rocket Lab page). https://en.wikipedia.org/wiki/Rutherford_(rocket_engine) (accessed 2026-11-14)
6. NASA, *NASA Awards Contract to Launch CubeSat to Moon from Virginia*, 2020. https://www.nasa.gov/news-release/nasa-awards-contract-to-launch-cubesat-to-moon-from-virginia/ (accessed 2026-11-14)
7. Rocket Lab, *Beyond Low Earth Orbit: The Rocket Lab Technology Powering Missions to the Moon and Mars*, 2026. https://rocketlabcorp.com/updates/beyond-low-earth-orbit-the-rocket-lab-technology-powering-missions-to-the-moon-and-mars/ (accessed 2026-11-14)
