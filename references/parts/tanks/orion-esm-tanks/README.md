---
id: orion-esm-tanks
name: "Orion European Service Module (ESM) propellant tanks"
category: tank
role: in-space
tier: 3
propellants: [MMH, MON-3]
manufacturer: Airbus Defence and Space for ESA (ESM prime); tanks per [3] ⚠
vehicles: ["Orion spacecraft, European Service Module"]
status: in-production (ESM-3 and ESM-4 delivered; 2 flights) (checked 2026-11)
---

# Orion ESM propellant tanks

The European Service Module is the cylindrical "engine room" under the Orion crew capsule, built by Airbus for ESA. Inside it, four tall propellant tanks of 2,000 litres each (two with MMH fuel, two with MON oxidiser) feed the main engine, eight auxiliary thrusters and 24 attitude thrusters; two high-pressure helium tanks push the propellant out. Orion is a Moon spacecraft, not a Mars vehicle, but its ESM is the closest crewed deep-space service module flying today, so it is the best real model for a crewed ship's in-space propulsion bay.

**Why tier 3:** storable propellant that never boils off and a crew-rated, multi-week propulsion system, at the cost of lower Isp than hydrogen and a very expensive spacecraft.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | n/f | kg | | four tanks + two helium tanks; not published |
| `propellant_mass` | 8,602 ⚠ | kg | [2] | usable propellant (18,964 lbm) per a NASA ESM propulsion paper (seen via search, not opened ⚠); ESA: "nine tonnes fuel total capacity" [1] |
| `fuel_mass` | 3,246 | kg | derived | `8,602 / (1 + 1.65)` |
| `oxidizer_mass` | 5,356 | kg | derived | `8,602 · 1.65 / 2.65` |
| `mixture_ratio` | 1.65 | O/F by mass | derived | equal fuel and oxidiser volumes (2 + 2 tanks): `ρ_MON3 / ρ_MMH ≈ 1,440 / 875` (room-temperature densities, est.) |
| `volume_total` | 8.0 | m³ | [1] | 4 × 2,000 L |
| `volume_fuel` | 4.0 | m³ | [1] | 2 MMH tanks |
| `volume_oxidizer` | 4.0 | m³ | [1] | 2 MON tanks |
| `propellant_fraction` | n/f | — | derived | needs `mass_dry` |
| `material` | titanium, thin-walled ⚠ | — | [3] | NASA heat-transfer paper (via search); ESA says "1-cm thick walls" [1] ⚠ |
| `pressure_operating` | 2.5 | MPa | [1] | "pressurised at 25 bar" |
| `pressurant` | helium, 2 high-pressure tanks, regulated | — | [1][3] | one pressure-control assembly per propellant [3] ⚠ |
| `storage_temperature` | n/a | K | | storable; kept warm by heaters and the thermal-control loop |
| `boil_off` | n/a | %/day | | storable propellants do not boil off |
| `insulation` | MLI | — | photo | silver blankets around the tank bay (`side-1.jpg`) |
| `power_electric` | n/f | W | | tank and line heaters exist (thermal model in [3]) but power n/f |
| `cost_unit` | n/f | USD (year) | | whole ESM ≈ 300 million per unit per NASA OIG ⚠ (see SLS README source 6; not re-checked) |
| `diameter` | 1.154 | m | [1] | one tank |
| `length` | 2.542 | m | [1] | one tank (height) |
| `first_flight` | 2022 | year | | Artemis I |
| `flights` | 2 | count | | Artemis I (2022), Artemis II (Apr 2026) |

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | Orion (Artemis II configuration) | — | | crew module + ESM; launched by SLS |
| `stage` | service module (in-space propulsion) | — | [1] | |
| `parts_per_stage` | 4 | count | [1] | 2 MMH + 2 MON tanks (plus 2 helium tanks) |
| `stage_mass_dry` | n/f | kg | | |
| `stage_propellant_mass` | 8,602 ⚠ | kg | [2] | see section 1 |
| `stage_burn_time` | n/f | s | | |
| `stage_delta_v` | n/f | m/s | | needs Orion masses; main engine 25.7 kN [1] (see AJ10-190 README) |
| `vehicle_liftoff_mass` | n/a | kg | | spacecraft, not a launcher |
| `vehicle_height` | n/f | m | | |
| `vehicle_diameter` | n/f | m | | |
| `payload_leo` | n/a | kg | | |
| `payload_gto` | n/a | kg | | |
| `payload_mars` | n/a | kg | | Orion is not designed for Mars |
| `cost_launch` | n/f | USD (year) | | |
| `mars_heritage` | none | — | | |

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Tank diameter | 1.154 | [1] | |
| Tank height | 2.542 | [1] | |
| Tank dome height | 0.577 | est. | hemispherical domes assumed; envelope volume 2.26 m³ vs 2.0 m³ stated (wall, ullage) |
| Tank barrel length | 1.388 | derived | `2.542 − 2 · 0.577` |
| Tank layout | 4 tanks on a square, centres at radius 1.2 | est. | around the central main engine; not published |
| Helium tank | sphere r 0.40 | est. | count from [1]; size n/f |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

Four identical upright capsules (cylinders with round ends), each about as tall as a person and a half and twice as tall as it is wide, standing in a square around an empty centre where the main engine sits. Two smaller round helium tanks sit between them. Everything stands on a flat ring-shaped deck. In the real ESM the tanks are hidden behind silver insulation and struts (`side-1.jpg`, `three-quarter-1.jpg`); `in-context-1.jpg` shows the closed ESM under the crew module adapter.

### 4.2 Node hierarchy

```text
OrionEsmTanks                 origin: bottom interface = deck under the tanks
├─ Attach_Top                 (0, 2.542, 0)   top of tanks (crew module adapter side)
└─ Attach_Bottom              (0, 0, 0)       main engine mounts below the centre
```

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | OrionEsmTanks | lathe `PropTank` (MMH) | see 4.4 | (0.85, 0, 0.85) | (0, 0, 0) | Titanium | 8 |
| 2 | OrionEsmTanks | lathe `PropTank` (MMH) | see 4.4 | (−0.85, 0, −0.85) | (0, 0, 0) | Titanium | 8 |
| 3 | OrionEsmTanks | lathe `PropTank` (MON) | see 4.4 | (−0.85, 0, 0.85) | (0, 0, 0) | Titanium | 8 |
| 4 | OrionEsmTanks | lathe `PropTank` (MON) | see 4.4 | (0.85, 0, −0.85) | (0, 0, 0) | Titanium | 8 |
| 5 | OrionEsmTanks | sphere ×2 (helium) | r 0.40 | (±1.25, 1.6, 0) | (0, 0, 0) | HullBlack | 6 × 4 |
| 6 | OrionEsmTanks | flat ring (deck) | r_out 1.9, r_in 0.6, thickness 0.05 | (0, −0.025, 0) | (0, 0, 0) | Metal | 16 |

Positions of rows 1–6 are est.

### 4.4 Revolved profiles

For each `lathe` row: points `(radius, y)` from top to bottom, in metres. 5–10 points per profile.

```text
PropTank: (0, 2.542) (0.408, 2.373) (0.577, 1.965) (0.577, 0.577) (0.408, 0.169) (0, 0)
```

### 4.5 Simplify

- Drop struts, propellant lines, valves, pressure-control panels and MLI.
- Optional: a silver open cylinder (FoilSilver, r 2.0, h 2.6) to stand for the closed ESM bay.
- No ESA/NASA logos or flags.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 400 (estimate ~370) |
| Meshes | ≤ 3 (Titanium, HullBlack, Metal) |
| Height / diameter | tank 2.542 / 1.154, ±2% |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| side-1.jpg | side | Artemis II ESM in a work stand at KSC (2021): silver MLI over the tank bay, struts, overall proportions | [NASA](https://images.nasa.gov/details/KSC-20211020-PH-GEB01_0005) | NASA/Glenn Benson | Public domain (NASA) |
| three-quarter-1.jpg | three-quarter | Same ESM from a lower three-quarter angle; tank-bay height vs diameter | [NASA](https://images.nasa.gov/details/KSC-20211015-PH-KLS02_0001) | NASA/Kim Shiflett | Public domain (NASA) |
| in-context-1.jpg | in-context | Artemis III ESM with adapters and a folded solar wing, acoustic test (May 2026) | [NASA](https://images.nasa.gov/details/KSC-20260507-PH-JNR01_0002) | NASA/Jess Ruffa | Public domain (NASA) |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Orion/European_Service_Module_Propulsion — ESA propulsion infographic showing the four tanks inside the ESM (© ESA)

## 6. Gaps and cautions

- No free photo shows the bare tanks; layout and helium tank size are estimates.
- Tank material (titanium) and usable propellant (8,602 kg) come from NASA papers seen only through search snippets ⚠; ESA's "1-cm thick walls" conflicts with "thin-walled" ⚠.
- Mixture ratio is derived from equal tank volumes, not from an engine document.
- Dry masses and heater power n/f.

## 7. Sources

1. ESA, *European Service Module: Propulsion*. https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Orion/European_Service_Module_Propulsion (accessed 2026-11-14)
2. NASA, IAC-17 paper on the Orion ESM propulsion system, NTRS 20180004488 (8,602 kg usable; via search ⚠). https://ntrs.nasa.gov/api/citations/20180004488/downloads/20180004488.pdf (accessed 2026-11-14)
3. NASA, *A Heat and Mass Transfer Model of the Orion European Service Module Propulsion System*, NTRS 20205004021 (via search ⚠). https://ntrs.nasa.gov/api/citations/20205004021/downloads/ESM_HMT_Paper_Final.pdf (accessed 2026-11-14)
