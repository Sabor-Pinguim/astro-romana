---
id: electron-stage-1-tank
name: Electron stage 1 propellant tanks (linerless carbon-composite LOX/RP-1, common bulkhead)
category: tank
role: stage
tier: 1
propellants: [LOX, RP-1]
manufacturer: Rocket Lab
vehicles: ["Electron stage 1"]
status: operational (checked 2026-11)
---

# Electron stage 1 propellant tanks

The first stage of Rocket Lab's Electron is a 1.2 m wide black carbon-fibre tube holding a liquid-oxygen tank and a kerosene (RP-1) tank separated by a common bulkhead, with no metal liner inside. Nine battery-pumped Rutherford engines hang from the "power pack" at its base, and the interstage sits on top. Electron is the only all-carbon-composite orbital rocket, and the tank wall is "only slightly larger than the thickness of a credit card" [2].

**Why tier 1:** it is the smallest and cheapest launch-vehicle tank in the catalogue (about 9 t of propellant against about 411 t for the tier-2 Falcon 9 stage 1), so it only lifts small payloads (200–300 kg to LEO).

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 950 ⚠ | kg | [6] | Whole stage dry mass from a community wiki (secondary, unverified). Includes 9 engines, batteries, interstage. Tank-only structure: n/f. For the game, subtract 9 × Rutherford mass (engine README) |
| `propellant_mass` | 9,250 ⚠ | kg | [6], derived | Stage wet 10,200 − dry 950 (community wiki). Cross-check (derived): liftoff 13,000 kg [1] − stage 2 (~2,000 kg propellant [1] + ~250 kg dry ⚠) − fairing 44 kg ⚠ − kick stage + payload (~300–500 kg) − stage 1 dry ≈ 9,300 kg. Rocket Lab publishes no stage-1 figure |
| `fuel_mass` | 2,720 | kg | derived, est. | `m_prop / (1 + MR)` with MR = 2.4 (est.) |
| `oxidizer_mass` | 6,530 | kg | derived, est. | `m_prop · MR / (1 + MR)` with MR = 2.4 (est.) |
| `mixture_ratio` | n/f (2.4 est.) | O/F by mass | est. | Rutherford O/F is not published. 2.4 is a game value inside the usual LOX/RP-1 optimum of 2.3–2.6 |
| `volume_total` | 9.1 | m³ | derived | `volume_fuel + volume_oxidizer`, no ullage |
| `volume_fuel` | 3.36 | m³ | derived | 2,720 kg / 810 kg/m³ (RP-1 at ~20 °C) |
| `volume_oxidizer` | 5.72 | m³ | derived | 6,530 kg / 1,141 kg/m³ (LOX at its 90 K boiling point) |
| `propellant_fraction` | 0.91 | — | derived | `9,250 / (9,250 + 950)` (stage dry mass, so a lower bound for the tank alone) |
| `material` | carbon-fibre composite, linerless, common bulkhead | — | [1], [2] | "linerless common bulkhead tanks for LOx and RP-1" [1]; monocoque carbon-fibre structure [1]; wall about credit-card thickness [2] |
| `pressure_operating` | n/f | MPa | | |
| `pressurant` | n/f | — | [1] | The guide says only that "a pressurant system is used to provide enough pump inlet pressure" (stated for stage 2). The gas is not named |
| `storage_temperature` | ~90 (LOX) | K | est. | LOX boiling point at 1 atm. Whether Electron subcools its LOX: n/f. RP-1 at ambient |
| `boil_off` | n/f | %/day | | LOX is topped up on the pad until launch |
| `insulation` | none visible | — | [2] | No foam: frost forms directly on the black skin over the LOX tank ("big white stripes form on the black Electron rocket for every launch" [2]); see `in-context-1.jpg` |
| `power_electric` | n/f | W | | Sensors only. (The 9 engines' pumps draw battery power, but that belongs to the engines) |
| `cost_unit` | n/f | USD | | Whole launch ≈ US$7.5 million (2020) ⚠, see section 2 |
| `diameter` | 1.2 | m | [1] | |
| `length` | 11.9 | m | est. | Model length without engines: power pack + tank section + interstage. Wikipedia gives 12.1 m for stage 1 (unsourced ⚠); we subtract ~0.2 m of nozzle below the power pack, see section 3 |
| `first_flight` | 2017 | year | [1] | First launch 25 May 2017 ("It's a Test") |
| `flights` | 100 ⚠ | count | [5] | Electron launches up to 14 Nov 2026, including HASTE suborbital flights (Wikipedia, secondary). Recheck before use |

**Stage 2 tanks (note).** The second stage uses the same linerless common-bulkhead carbon-composite tanks for LOX and kerosene, 1.2 m in diameter, with "approximately 2,000 kg of propellant on board" and a burn of about five minutes [1]. Its length is 2.4 m (Wikipedia, unsourced ⚠). That gives about 2,000 / 9,250 = 22% of the stage 1 load.

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | Electron | — | [1] | 2 stages + optional Kick Stage (Curie engine) |
| `stage` | stage 1 | — | [1] | |
| `parts_per_stage` | 1 tank set (LOX + RP-1) | count | [1] | Fed to 9 Rutherford sea-level engines |
| `stage_mass_dry` | 950 ⚠ | kg | [6] | Secondary, see `mass_dry` |
| `stage_propellant_mass` | 9,250 ⚠ | kg | [6] | See `propellant_mass` |
| `stage_burn_time` | ~155 | s | [1] | Example flight profile: stage 1 engine cutoff and separation at L + 155 s, ~78 km |
| `stage_delta_v` | ~3,790 | m/s | derived | `311 · 9.80665 · ln(13,000 / 3,750)`: whole vehicle at liftoff (13,000 kg) down to stage-1 burnout (13,000 − 9,250 kg), Isp 311 s sea level [1]. Real value is higher because Isp rises with altitude |
| `vehicle_liftoff_mass` | 13,000 | kg | [1] | Other secondary sources say 12,550 kg ⚠ |
| `vehicle_height` | 18 | m | [1] | |
| `vehicle_diameter` | 1.2 | m | [1] | Fairing also 1.2 m wide and 2.5 m tall |
| `payload_leo` | 300 | kg | [1] | "up to 300 kg"; nominal 200 kg to 500 km sun-synchronous orbit (SSO) [1]; expendable (stage recovery was tested but is not standard) |
| `payload_gto` | n/a | kg | | Electron is not offered to GTO; the Kick Stage/Photon can raise orbits for small payloads |
| `payload_mars` | n/f | kg | | No Mars launch. Rocket Lab proposed a Photon-based probe to Venus on Electron [3] |
| `cost_launch` | ~7.5 million ⚠ | USD (2020) | [5] | Bloomberg figure quoted on Wikipedia; Rocket Lab does not publish a list price |
| `mars_heritage` | none | — | | Electron never launched to Mars. (Rocket Lab built the ESCAPADE Mars orbiters, which launched on another rocket) |

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Outer diameter (all sections) | 1.20 | [1] | |
| Stage 1 length incl. engines | 12.1 ⚠ | [5] | Wikipedia infobox, unsourced |
| Power pack (engine section) height | 1.5 | est. | Scaled from `in-context-1.jpg` (whole vehicle = 18 m ≈ 557 px, so ~31 px/m): the black band below the white aft ring is ~50 px |
| White aft ring height | 0.4 | est. | Same photo; also visible in `diagram-1.webp` and the linked Pad B photo (KSC-20230518) |
| RP-1 tank zone (no frost) | 3.2 | est. | Same photo: black, unfrosted zone below the frost, ~100 px |
| LOX tank zone (frosted) | 5.7 | est. | Same photo: white frost zone, ~180 px. LOX : RP-1 length ratio 1.8 matches the volume ratio 5.72 / 3.36 = 1.7 (derived), which supports LOX on top |
| Common bulkhead height above origin | 5.1 | est. | Top of RP-1 zone (internal, not visible) |
| Interstage height | 1.1 | est. | Scaled from `in-context-1.jpg` and the upper-stage photo linked below (diameter 1.2 m = 88 px): ~1.1–1.4 m from the stage 2 white band down to the first seam |
| External cable raceway | 0.08 wide × 0.05 proud | est. | Thin raised strip running the full tank length, visible in the linked Pad B photo (KSC-20230518) |
| Total model height (no engines) | 11.9 | est. | Sum of the rows above; 12.1 m stage minus ~0.2 m of nozzle protrusion |

**Tank layout.** Rocket Lab states only "linerless common bulkhead tanks for LOx and RP-1" [1]. The order (LOX above RP-1) is our reading of launch photos: frost covers the upper ~60% of stage 1 and the lower part stays black (`in-context-1.jpg`), and the frosted:black length ratio matches the LOX:RP-1 volume ratio. The feed-line routing is not published (n/f); with LOX on top, the LOX line must pass through or around the RP-1 tank.

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A plain, matte-black cylinder 1.2 m wide and 11.9 m tall: a long, slender rod (aspect ratio ~10:1). From top to bottom:

1. **Interstage** (top 1.1 m): black, open at the top; inside you can see the dark top dome of the LOX tank. A thin metal separation ring caps the rim (`Attach_Top`).
2. **Tank section** (8.9 m): uninterrupted black composite skin. One narrow raised cable raceway runs straight down the front-left side from the interstage to the aft ring (the linked Pad B photo (KSC-20230518)). The LOX tank is the upper 5.7 m, the RP-1 tank the lower 3.2 m. The bulkhead is internal and invisible.
3. **White aft ring** (0.4 m): the only light-coloured band on the stage; it marks the bottom of the tank section (`diagram-1.webp`, the linked Pad B photo (KSC-20230518)).
4. **Power pack** (bottom 1.5 m): black engine and battery bay. Its lower edge has a small inward chamfer, and its flat bottom plate is where the nine engines mount (8 around 1).

Silhouette features that must stay: the very slim proportions, the white aft ring, the raceway, and the open interstage. No logos, the "ELECTRON" lettering, flags or the NASA mission decals seen in the photos.

### 4.2 Node hierarchy

```text
ElectronStage1Tank            origin: bottom interface (engine mounting plate of the power pack)
├─ Attach_Top                 (0, 11.9, 0)   top of the interstage (stage 2 separation plane)
└─ Attach_Bottom              (0, 0, 0)      engine mounting plane; Rutherford engines hang below
```

Engine positions on the bottom plate (est., for placing 9 Rutherford engines): one at (0, 0, 0) and eight on a circle of radius 0.40 m, every 45°.

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | ElectronStage1Tank | cone (frustum), bottom capped | r_top 0.60, r_bottom 0.55, h 0.10 | (0, 0.05, 0) | (0, 0, 0) | HullBlack | 16 |
| 2 | ElectronStage1Tank | cylinder, open | r 0.60, h 1.40 | (0, 0.80, 0) | (0, 0, 0) | HullBlack | 16 |
| 3 | ElectronStage1Tank | cylinder, open | r 0.602, h 0.40 | (0, 1.70, 0) | (0, 0, 0) | Hull | 16 |
| 4 | ElectronStage1Tank | cylinder, open (tank section, RP-1 + LOX) | r 0.60, h 8.90 | (0, 6.35, 0) | (0, 0, 0) | HullBlack | 16 |
| 5 | ElectronStage1Tank | cylinder, open (interstage) | r 0.60, h 1.10 | (0, 11.35, 0) | (0, 0, 0) | HullBlack | 16 |
| 6 | ElectronStage1Tank | lathe (LOX forward dome, seen inside interstage) | see 4.4 | (0, 0, 0) | (0, 0, 0) | HullBlack | 16 |
| 7 | ElectronStage1Tank | box (cable raceway) | w 0.08, h 8.80, d 0.05 | (−0.16, 6.35, 0.60) | (0, −15, 0) | HullBlack | — |
| 8 | ElectronStage1Tank | cylinder, open (separation ring) | r 0.605, h 0.04 | (0, 11.88, 0) | (0, 0, 0) | Aluminum | 16 |

### 4.4 Revolved profiles

```text
LoxForwardDome: (0.000, 11.05) (0.300, 11.00) (0.480, 10.93) (0.570, 10.86) (0.600, 10.80)
```

The bottom cap of row 1 is a flat disc of radius 0.55 at y = 0 (the engine plate).

### 4.5 Simplify

- Drop the umbilical plates, small access panels, the separation-pusher fittings and the fine seam lines.
- Keep the raceway even though it is narrow: it is the only feature that breaks the black cylinder.
- Optional in-game effect: a white "frost" overlay on the LOX zone (y 5.1–10.8) while fuelled on the pad.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 800 (estimate ~360) |
| Meshes | ≤ 8 (HullBlack, Hull, Aluminum: 3) |
| Height / diameter | 11.9 m / 1.2 m (±2%) |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| `diagram-1.webp` | diagram | Exploded view of Electron (Rocket Lab CAD render): first stage tube with interstage on top and white aft ring, power pack with 9 engines below, stage 2, kick stage, fairing. Use for which section is which. WebP file (Commons original format) | [Commons](https://commons.wikimedia.org/wiki/File:Electron_small_launch_vehicle_of_the_Rocket_Lab_Mission_to_Venus.webp) | R. French, C. Mandy, R. Hunter, E. Mosleh, D. Sinclair, P. Beck, S. Seager et al. | CC BY 4.0 |
| `in-context-1.jpg` | in-context | "PREFIRE and Ice" liftoff, 5 Jun 2024. Frost covers the upper part of stage 1 (LOX tank), the lower part is black (RP-1 tank). Nearly side-on and far away, so used for the proportions in section 3 | [Commons](https://commons.wikimedia.org/wiki/File:Rocket_Lab_PREFIRE_and_Ice_Launch_(KSC-20240605-PH-RKL01_0005).jpg) | NASA Kennedy Space Center / Rocket Lab | Public domain |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://images.nasa.gov/details/KSC-20230518-PH-RKL01_0002 — Whole Electron vertical on Pad B, LC-1 (TROPICS wet dress rehearsal, 18 May 2023). Stage 1 occupies the lower ~2/3: plain black body, raceway line, white aft ring at the launch mount. Taken from below, so the top is foreshortened: do not measure lengths from it (photo credited to Rocket Lab; NASA's library gives no licence, so it is linked, not copied)
- https://images.nasa.gov/details/KSC-20230507-PH-RLS01_0006 — upper half on the pad: stage 2 white band, interstage, first seam and the start of the raceway (used for the interstage estimate). Not downloaded only to keep 3 images.
- https://rocketlabcorp.com/launch/electron/ — Rocket Lab's Electron page and press photos (stage recovery, factory), copyrighted.

## 6. Gaps and cautions

- Rocket Lab publishes no stage-1 propellant, dry mass, tank volume, pressure or mixture ratio. All of them here are secondary (⚠) or derived from estimates.
- LOX-on-top is inferred from frost in launch photos, not stated by Rocket Lab. Feed-line routing: n/f.
- `flights` (100) is from Wikipedia and counts HASTE suborbital launches; recheck.
- Photos credited "Rocket Lab" on NASA's library are marked public domain there, but the copyright status of contractor photos should be rechecked before commercial use.
- Leave off the model: the "ELECTRON" lettering, the Rocket Lab atom logo, flags and NASA mission decals.

## 7. Sources

1. Rocket Lab, *Electron Payload User's Guide*, version 7.0, 1 Nov 2022 (pp. 11–14, 34). https://rocketlabusa.com/assets/Electron-Payload-User-Guide-7.0-v6.pdf (accessed 2026-11-14)
2. Rocket Lab, *Meet Rocket Lab's Electron rocket* (education graphic). https://www.rocketlabusa.com/assets/Uploads/RL-EducationGraphics-About-Rocket-Lab-and-Electron.pdf (accessed 2026-11-14)
3. R. French et al., *Rocket Lab Mission to Venus*, Aerospace 9(8), 445, 2022 (source of `diagram-1.webp`, CC BY 4.0). https://commons.wikimedia.org/wiki/File:Electron_small_launch_vehicle_of_the_Rocket_Lab_Mission_to_Venus.webp (accessed 2026-11-14)
4. NASA Image and Video Library, TROPICS and PREFIRE launch photos (see section 5). https://images.nasa.gov (accessed 2026-11-14)
5. Wikipedia, *Rocket Lab Electron* (used only for stage lengths, launch count and price; values marked ⚠). https://en.wikipedia.org/wiki/Rocket_Lab_Electron (accessed 2026-11-14)
6. r/RocketLab community wiki, *Vehicles* (stage 1 dry 950 kg, wet 10,200 kg; secondary, unverified; seen via search snippet). https://www.reddit.com/r/RocketLab/wiki/vehicles (accessed 2026-11-14)
