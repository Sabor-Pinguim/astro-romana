---
id: falcon-9-stage-1-tank
name: Falcon 9 Block 5 first-stage tanks (Al-Li LOX/RP-1, common dome)
category: tank
role: stage
tier: 2
propellants: [LOX, RP-1]
manufacturer: SpaceX
vehicles: ["Falcon 9 Block 5 stage 1", "Falcon Heavy side boosters and core (derived)"]
status: operational (checked 2026-11)
---

# Falcon 9 Block 5 first-stage tanks

The Falcon 9 booster is a 3.66 m wide, ~47 m tall aluminium-lithium tube: a liquid-oxygen tank on top and a kerosene (RP-1) tank below, separated by a common dome, with a double-wall pipe that carries LOX down through the middle of the RP-1 tank to the nine Merlin 1D engines [1]. A black composite interstage sits on top, four grid fins near the top and four landing legs at the base let it fly back and land, and boosters are routinely reflown [1].

**Why tier 2:** it is the reusable workhorse that launches most science missions today: ~44× the propellant of the tier-1 Electron stage, but far smaller and cheaper per flight than the tier-3 SLS or Starship tanks.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

SpaceX publishes almost no stage-level masses. The numbers below come from secondary sources; the spread is in the Note.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 22,200 ⚠ | kg | [3] | Whole stage empty (engines, legs, grid fins, interstage included). Older/other figure: 25,600 kg [4]. Tank-only structure: n/f |
| `propellant_mass` | 410,900 ⚠ | kg | [3], derived | 287,400 LOX + 123,500 RP-1 [3]. Older/other figure: 395,700 kg [4] (spread ~4%) |
| `fuel_mass` | 123,500 ⚠ | kg | [3] | RP-1 |
| `oxidizer_mass` | 287,400 ⚠ | kg | [3] | LOX (subcooled) |
| `mixture_ratio` | 2.33 | O/F by mass | derived | `287,400 / 123,500` |
| `volume_total` | 404 | m³ | derived | `volume_fuel + volume_oxidizer`, no ullage. Real tanks are a few % smaller because SpaceX loads densified (chilled) propellants ⚠ |
| `volume_fuel` | 152.5 | m³ | derived | 123,500 kg / 810 kg/m³ (RP-1 at ~20 °C) |
| `volume_oxidizer` | 251.9 | m³ | derived | 287,400 kg / 1,141 kg/m³ (LOX at its 90 K boiling point) |
| `propellant_fraction` | 0.95 | — | derived | `410,900 / (410,900 + 22,200)` (stage dry mass, so a lower bound for the tank alone) |
| `material` | Al-Li skin, aluminium domes, friction-stir welded; common dome | — | [1] | LOX tank monocoque; fuel tank skin-and-stringer; common dome between the tanks; double-wall LOX transfer tube through the centre of the RP-1 tank [1] |
| `pressure_operating` | n/f | MPa | | |
| `pressurant` | heated helium | — | [1] | |
| `storage_temperature` | < 90 (LOX, subcooled) | K | [3] ⚠ | LOX is "subcooled" [3]; the exact temperature is not in the user's guide (n/f). RP-1 is also chilled ⚠ |
| `boil_off` | n/f | %/day | | LOX is loaded shortly before launch and not stored; rate n/f |
| `insulation` | none on the outside | — | [1] | White-painted bare metal; the common dome and the transfer tube are the thermal barriers between LOX and RP-1 (older guide editions call the dome "insulated" ⚠) |
| `power_electric` | n/f | W | | Sensors only |
| `cost_unit` | n/f | USD | | Booster price not published; whole launch see section 2 |
| `diameter` | 3.66 | m | [1] | 12 ft |
| `length` | 47.1 | m | est. ⚠ | 42.6 m stage [3] + 4.5 m interstage (est., community wiki [5]). Wikipedia/SpaceX 2015 give 41.2 m for the stage ⚠ |
| `first_flight` | 2018 | year | [4] | Block 5 first flight 11 May 2018 (Bangabandhu-1) ⚠ Wikipedia. Falcon 9 first flew 2010 |
| `flights` | n/f (> 430 Falcon launches by end 2024) | count | [1] | User's guide: > 430 Falcon launches by end 2024, > 384 booster reflights by Feb 2025. Current count: recheck |

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | Falcon 9 Block 5 | — | [1] | Two stages; fairing or Dragon on top |
| `stage` | stage 1 (booster) | — | [1] | Falcon Heavy uses three of these cores (centre core with thicker walls) [1] |
| `parts_per_stage` | 1 tank set (LOX + RP-1) | count | [1] | Feeds 9 Merlin 1D engines (8 around 1) |
| `stage_mass_dry` | 22,200 ⚠ | kg | [3] | 25,600 kg in [4] |
| `stage_propellant_mass` | 410,900 ⚠ | kg | [3] | 395,700 kg in [4] |
| `stage_burn_time` | 162 ⚠ | s | [4] | SpaceX 2015 figure via Wikipedia. Recovery missions cut off earlier to keep landing propellant |
| `stage_delta_v` | 3,820–4,210 | m/s | derived | `Isp · 9.80665 · ln(549,000 / 138,100)` with Isp 282 s (sea level) to 311 s (vacuum) (see Merlin 1D README); m0 = liftoff mass, mf = m0 − 410,900 kg; expendable, no landing reserve |
| `vehicle_liftoff_mass` | 549,000 ⚠ | kg | [4] | SpaceX website value quoted on Wikipedia (549,054 kg) |
| `vehicle_height` | 70 | m | [1] | With standard fairing; 75.2 m with extended fairing |
| `vehicle_diameter` | 3.66 | m | [1] | Fairing 5.2 m |
| `payload_leo` | 22,800 | kg | [6] | Expended booster; ~17,500 kg with drone-ship landing ⚠ [4] |
| `payload_gto` | 8,300 | kg | [6] | Expended; 5,500 kg with recovery [4] ⚠ |
| `payload_mars` | 4,020 | kg | [6] | SpaceX "Payload to Mars" |
| `cost_launch` | 74 million ⚠ | USD (2026) | [4] | Wikipedia citing SpaceX *Capabilities & Services*; the SpaceX PDF could not be downloaded to confirm |
| `mars_heritage` | none to Mars orbit or surface | — | | ESA's Hera (launched on Falcon 9, Oct 2024) used a Mars flyby in Mar 2025 ⚠ recheck |

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Diameter | 3.66 | [1] | |
| Stage length without interstage | 42.6 ⚠ | [3], [5] | 41.2 in [4] |
| Interstage length | 4.5 | est. ⚠ | Community wiki estimate [5]; Spaceflight101 gave 6.5 m for the older v1.1 |
| Engine section (octaweb skirt) height | 1.5 | est. | Game value, not measured. Leaves 41.1 m for the tanks, enough for the 404 m³ above (barrel area 10.4 m² → 38.8 m + domes) |
| Common dome height above origin | 17.0 | derived, est. | Tanks split by volume: RP-1 share 152.5 / 404 = 38% of 41.1 m, starting at y = 1.5 |
| LOX forward dome height | 1.3 | est. | √2 ellipsoidal dome (r / √2); domes are aluminium [1] |
| Landing legs | 4 × ~9.0 long, ~0.9 wide | est. | Judged by eye from `in-context-1.jpg` against the 42.6 m stage |
| Grid fins | 4 × ~1.5 × 1.2 | est. | Scaled from `three-quarter-1.jpg` using the 3.66 m diameter; Block 5 fins are titanium and larger than the aluminium fins in that photo ⚠ |
| External raceway | ~0.4 wide × 0.15 proud | est. | Runs the full tank length (`three-quarter-1.jpg`) |

**Tank layout (from the user's guide [1]).** LOX tank on top (forward), RP-1 tank below (aft). Falcon Heavy side boosters are bolted "at the forward end of the LOX tank" [1], which confirms LOX on top. A common dome separates the two tanks. A double-wall transfer tube carries LOX through the centre of the RP-1 tank to the engine section. The interstage is fixed to the forward end of the first-stage tank, and the stage separation system sits at the forward end of the interstage [1].

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A tall white cylinder (aspect ratio ~13:1). From top to bottom:

1. **Interstage** (top 4.5 m): black composite on Block 5, open at the top; the aluminium dome of the LOX tank is visible inside. Four grid fins sit near the top rim, folded flat against the body (pointing up) during ascent. A thin metal separation ring caps the rim (`Attach_Top`).
2. **Tank section** (41.1 m): plain white paint over Al-Li. LOX is the upper ~24 m, RP-1 the lower ~16 m (common dome inside at y ≈ 17). A narrow raised raceway runs the full length on one side. Flown boosters are streaked with grey-black soot, especially near the top and bottom.
3. **Landing legs**: four long black panels lying flat against the lower ~9 m of the tank, hinged at the bottom (`in-context-1.jpg` shows them deployed as an X).
4. **Engine section** (bottom 1.5 m): metallic skirt (the "octaweb") ending in a flat black heat shield where nine engines mount (8 in a ring around 1 centre engine).

No text: leave off "FALCON 9", "SpaceX", flags and NASA logos seen in the photos.

### 4.2 Node hierarchy

```text
Falcon9Stage1Tank             origin: bottom interface (engine mounting plane / heat shield)
├─ Attach_Top                 (0, 47.1, 0)   top of interstage (stage 2 separation plane)
└─ Attach_Bottom              (0, 0, 0)      engine plane; Merlin 1D engines hang below
```

Engine positions (est.): one at (0, 0, 0) and eight on a circle of radius 1.20 m, every 45°.

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Falcon9Stage1Tank | cylinder, capped (heat shield) | r 1.83, h 0.05 | (0, 0.025, 0) | (0, 0, 0) | HullBlack | 16 |
| 2 | Falcon9Stage1Tank | cylinder, open (engine section) | r 1.83, h 1.45 | (0, 0.775, 0) | (0, 0, 0) | Aluminum | 16 |
| 3 | Falcon9Stage1Tank | cylinder, open (RP-1 + LOX tank) | r 1.83, h 41.1 | (0, 22.05, 0) | (0, 0, 0) | Hull | 16 |
| 4 | Falcon9Stage1Tank | cylinder, open (interstage) | r 1.83, h 4.5 | (0, 44.85, 0) | (0, 0, 0) | HullBlack | 16 |
| 5 | Falcon9Stage1Tank | lathe (LOX forward dome, inside interstage) | see 4.4 | (0, 0, 0) | (0, 0, 0) | Aluminum | 16 |
| 6 | Falcon9Stage1Tank | box (leg ×4, at 45°, 135°, 225°, 315° about Y) | w 0.9, h 9.0, d 0.35 | (2.005, 4.8, 0) rotated about Y | (0, 45/135/225/315, 0) | HullBlack | — |
| 7 | Falcon9Stage1Tank | box (grid fin ×4, stowed, at 0°, 90°, 180°, 270°) | w 1.2, h 1.5, d 0.15 | (1.905, 45.9, 0) rotated about Y | (0, 0/90/180/270, 0) | Titanium | — |
| 8 | Falcon9Stage1Tank | box (raceway) | w 0.4, h 40.0, d 0.15 | (0, 22.0, 1.905) | (0, 0, 0) | Hull | — |
| 9 | Falcon9Stage1Tank | cylinder, open (separation ring) | r 1.84, h 0.08 | (0, 47.06, 0) | (0, 0, 0) | Aluminum | 16 |

Leg and fin azimuths are est. (we could not confirm from free photos whether fins and legs share the same planes).

### 4.4 Revolved profiles

```text
LoxForwardDome: (0.00, 43.90) (0.90, 43.75) (1.40, 43.40) (1.70, 42.95) (1.83, 42.60)
```

### 4.5 Simplify

- Drop the octaweb details, cold-gas thruster pods, umbilical plates, leg pushers and the hold-down fittings.
- Keep the four grid fins and four legs even if small: they make it read as a reusable booster.
- Optional variants: legs deployed (rotate each leg ~110° outward about its bottom hinge) and grid fins deployed (rotate 90° outward).

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 800 (estimate ~410) |
| Meshes | ≤ 8 (Hull, HullBlack, Aluminum, Titanium: 4) |
| Height / diameter | 47.1 m / 3.66 m (±2%) |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| `three-quarter-1.jpg` | three-quarter | Booster B1035 lying on display at Space Center Houston, seen from the top end: open interstage with its cover plate, three of the four grid fins, the white tank receding. B1035 is Block 4 (white interstage, aluminium fins); Block 5 has a black interstage and titanium fins | [Commons](https://commons.wikimedia.org/wiki/File:Falcon_9_booster_B1035_in_Space_Center_Houston_01.jpg) | Shujianyang | CC BY 4.0 |
| `detail-1.jpg` | detail | Bare Al-Li tank barrel in the Hawthorne factory: welded ring sections and the end ring; shows the metal before painting | [Commons](https://commons.wikimedia.org/wiki/File:SpaceX_factory_Falcon_9_booster_tank.jpg) | Steve Jurvetson | CC BY 2.0 |
| `in-context-1.jpg` | in-context | Block 5 booster B1063 standing on the drone ship in port (aerial, 10 Jul 2023): sooty body, four legs deployed in an X, grid fins at the top | [Commons](https://commons.wikimedia.org/wiki/File:Falcon_9_B1063_booster_2023-07-10_on_OCISLY_01.jpg) | Tedder | CC BY-SA 4.0 |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://www.spacex.com/vehicles/falcon-9/ — SpaceX vehicle page and photos (copyrighted SpaceX images).
- https://www.spacex.com/assets/media/falcon-users-guide-2025-05-09.pdf — Falcon User's Guide, Figure 2-1 (vehicle overview drawing).

## 6. Gaps and cautions

- Stage dry and propellant masses are secondary (magazine table, Wikipedia, spec aggregator): 22,200 vs 25,600 kg dry and 410,900 vs 395,700 kg propellant.
- Stage length 42.6 vs 41.2 m; interstage 4.5 m is an estimate. Leg, fin, raceway and engine-section sizes are estimates.
- LOX temperature (densified) and tank pressure: n/f.
- The user's guide is internally inconsistent on liftoff thrust (7,605 kN in the text, 7,686 kN in Table 2-1); this affects the engine README, not the tank.
- Flight count and the Mars-flyby note (Hera) must be rechecked.
- Leave off the model: "FALCON 9" lettering, SpaceX logo, US flag and NASA insignia.

## 7. Sources

1. SpaceX, *Falcon User's Guide*, 9 May 2025 (sections 1–2: structure, tanks, interstage, Table 2-1). https://www.spacex.com/assets/media/falcon-users-guide-2025-05-09.pdf (accessed 2026-11-14)
2. Wikimedia Commons, photos listed in section 5 (accessed 2026-11-14).
3. *Fiche technique: Falcon-9*, Espace & Exploration no. 39, May 2017, pp. 36–37 (stage heights, empty mass, LOX and RP-1 loads; read through the table in Wikipedia *Falcon 9 Block 5*, secondary). https://en.wikipedia.org/wiki/Falcon_9_Block_5 (accessed 2026-11-14)
4. Wikipedia, *Falcon 9* (infobox: 41.2 m stage, 162 s burn, 549,000 kg liftoff, payload with recovery, US$74 million) and Wevolver *Falcon 9 v1.2 or Full Thrust – Block 5* (25,600 kg empty, 395,700 kg propellant). https://en.wikipedia.org/wiki/Falcon_9 ; https://www.wevolver.com/specs/falcon-9-v12-or-full-thrust-block-5 (accessed 2026-11-14)
5. r/SpaceX community wiki, quick stats (stage 42.6 m, 47 m with interstage, interstage 4.5 m est.; secondary, via search snippet). https://www.reddit.com/r/SpaceX/wiki/quickstats (accessed 2026-11-14)
6. SpaceX, *Falcon 9* vehicle page (payload to LEO 22,800 kg, GTO 8,300 kg, Mars 4,020 kg; via search result, page is script-rendered). https://www.spacex.com/vehicles/falcon-9/ (accessed 2026-11-14)
