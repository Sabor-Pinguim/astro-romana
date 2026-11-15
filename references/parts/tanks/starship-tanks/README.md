---
id: starship-tanks
name: "Starship (ship / upper stage) propellant tanks, Version 3"
category: tank
role: stage
tier: 3
propellants: [LOX, CH4]
manufacturer: SpaceX
vehicles: ["Starship, stage 2 (ship)", "Super Heavy, stage 1 (booster)"]
status: in-development (flight tests; V3 since May 2026) (checked 2026-11)
---

# Starship tanks

Starship's upper stage (the "ship") is a 9 m wide stainless-steel cylinder that is mostly propellant tank: liquid oxygen in the lower tank and liquid methane above it, separated by a common dome, with the six Raptor engines underneath. The steel is not painted or foam-covered; one side is covered in black hexagonal heat-shield tiles for re-entry. Unlike the other tanks here, it is meant to be reused and to be **refuelled in orbit**: NASA's lunar lander version needs many tanker flights that transfer propellant ship-to-ship before leaving Earth orbit, which is exactly the orbital-refuelling step the game makes mandatory before Mars.

**Why tier 3:** the largest tanks in the catalogue (over 5,000 t with the booster), reusable and designed for orbital refuelling, but still in flight testing and most numbers come from SpaceX statements, not documents.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

Values are for the ship (upper stage). Super Heavy figures are in section 2.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | n/f | kg | | SpaceX publishes no dry mass; Musk has quoted ~100 t targets ⚠ (not used) |
| `propellant_mass` | 1,600,000 ⚠ | kg | [1][2] | V3 ship, "1,600 tonnes" as listed by SpaceX per [1]; V2 ship ~1,500 t [1]. SpaceX page not machine-readable (JS); secondary only ⚠ |
| `fuel_mass` | 347,800 | kg | derived | `1,600,000 / (1 + 3.6)` |
| `oxidizer_mass` | 1,252,200 | kg | derived | `1,600,000 · 3.6 / 4.6` |
| `mixture_ratio` | 3.6 ⚠ | O/F by mass | [2] | Raptor O/F commonly quoted 3.6–3.8 from SpaceX/Musk presentations ⚠; check the Raptor README |
| `volume_total` | 1,920 | m³ | derived | sum below; real tanks are smaller because propellants are subcooled (denser) |
| `volume_fuel` | 823 | m³ | derived | `347,800 / 422.6` (CH4 density at normal boiling point) |
| `volume_oxidizer` | 1,097 | m³ | derived | `1,252,200 / 1,141` (LOX density at normal boiling point) |
| `propellant_fraction` | n/f | — | derived | needs `mass_dry` |
| `material` | stainless steel (SpaceX "30X"/304L family), welded rings, common dome | — | [2] ⚠ | alloy names from SpaceX statements via [2]; no SpaceX document |
| `pressure_operating` | n/f | MPa | | |
| `pressurant` | autogenous (gaseous O2 and CH4 from the Raptors) ⚠ | — | [2] | secondary only |
| `storage_temperature` | ~90 (LOX), ~112 (CH4) | K | derived | normal boiling points; SpaceX subcools both ⚠ (exact values n/f) |
| `boil_off` | n/f | %/day | | methane and LOX boil off far less than LH2 (warmer, denser), which is why methane suits refuelling depots; no published rate |
| `insulation` | none on tank walls; hexagonal ceramic heat-shield tiles on the windward side | — | [2] | |
| `power_electric` | n/f | W | | |
| `cost_unit` | n/f | USD (year) | | |
| `diameter` | 9 | m | [2] | |
| `length` | 34.2 | m | est. | tank section incl. aft skirt (section 3); whole V3 ship ~52 m ⚠ [2] |
| `first_flight` | 2023 | year | [2] | first integrated flight, 20 Apr 2023 |
| `flights` | ≥ 12 ⚠ | count | [1][2] | integrated flight tests; Flight 12 (May 2026) was the V3 debut; sources disagree on later flights |

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Ship (stage 2) | Super Heavy (stage 1) | Unit | Source | Note |
|---|---|---|---|---|---|
| `vehicle` | Starship V3 | Starship V3 | — | [1] | |
| `stage` | stage 2 | stage 1 | — | | |
| `parts_per_stage` | 1 | 1 | count | | one tank set each |
| `stage_mass_dry` | n/f | n/f | kg | | |
| `stage_propellant_mass` | 1,600,000 ⚠ | 3,650,000 ⚠ | kg | [1] | V2: ~1,500 t and ~3,400 t ⚠. Booster split at O/F 3.6: CH4 793.5 t, LOX 2,856.5 t (derived) |
| `stage_burn_time` | n/f | n/f | s | | |
| `stage_delta_v` | n/f | n/f | m/s | | needs dry masses |
| `vehicle_liftoff_mass` | n/f | — | kg | | > 5,000 t of propellant loaded on V3 in a rehearsal [1] ⚠ |
| `vehicle_height` | ~124 ⚠ | ~72 ⚠ | m | [2] | ship ~52 m |
| `vehicle_diameter` | 9 | 9 | m | [2] | |
| `payload_leo` | > 100,000 ⚠ | — | kg | [1] | SpaceX design goal, fully reusable; not yet demonstrated |
| `payload_gto` | n/f | — | kg | | |
| `payload_mars` | n/f | — | kg | | only after orbital refuelling; no official figure |
| `cost_launch` | n/f | — | USD (year) | | |
| `mars_heritage` | none | none | — | | SpaceX Mars plans are announcements only |

**Orbital refuelling (checked 2026-11):** NASA's Starship lunar lander plan launches a depot ship and several tanker ships that transfer propellant ship-to-ship in Earth orbit. As of 2026-11 a **ship-to-ship transfer has not been flown**: SpaceX said in Sept 2026 it targeted 2026 depending on V3 test progress, and a NASA schedule from Oct 2026 placed the demonstration in early 2027 [1] ⚠. V3 ships carry the docking ports for it [1]. An internal transfer between the ship's own tanks was reported on Flight 3 (Mar 2024) [3] ⚠.

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Diameter | 9.0 | [2] | |
| Aft skirt (engine bay) height | 4.0 | est. | rough, from linked SpaceX photos; check before use |
| LOX tank, equivalent barrel length | 17.3 | derived | `1,097 / (π·4.5²)` |
| CH4 tank, equivalent barrel length | 12.9 | derived | `823 / (π·4.5²)` |
| Tank section top (forward dome ring) | 34.2 | derived | 4.0 + 17.3 + 12.9 |
| Whole ship height | ~52 ⚠ | [2] | the nose/payload section fills the rest (~18 m) |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A plain, shiny steel cylinder 9 m wide. Half of its circumference (the belly) is black, covered in small hexagon tiles; seen from the side, the cylinder is split vertically into a steel half and a black half. Near the bottom two wide, flat aft flaps stick out on the left and right, hinged at the tile/steel boundary. Faint horizontal weld lines every ~2 m. The top of this part is the forward tank dome; the nose cone with forward flaps sits above it (separate part or optional context). No photos were downloaded (see section 5).

### 4.2 Node hierarchy

```text
StarshipTanks                 origin: bottom interface = bottom of aft skirt
├─ Attach_Top                 (0, 34.2, 0)   nose / payload section
└─ Attach_Bottom              (0, 0, 0)      Raptor mounts are inside the aft skirt
```

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | StarshipTanks | cylinder (open bottom) | r 4.5, h 34.2 | (0, 17.1, 0) | (0, 0, 0) | Steel | 16 |
| 2 | StarshipTanks | half-cylinder shell (tiles, z > 0 side) | r 4.55, h 34.2, 180° | (0, 17.1, 0) | (0, 0, 0) | HullBlack | 8 |
| 3 | StarshipTanks | lathe `ForwardDome` | see 4.4 | (0, 0, 0) | (0, 0, 0) | Steel | 16 |
| 4 | StarshipTanks | box (aft flap) | 3.0, 9.0, 0.4 | (6.0, 6.0, 0.5) | (0, 0, 0) | HullBlack | — |
| 5 | StarshipTanks | box (aft flap) | 3.0, 9.0, 0.4 | (−6.0, 6.0, 0.5) | (0, 0, 0) | HullBlack | — |
| 6 | StarshipTanks | disc (aft bulkhead / engine plate) | r 4.5 | (0, 0.3, 0) | (180, 0, 0) | Steel | 16 |

Flap size is est. (rough, from linked photos).

### 4.4 Revolved profiles

For each `lathe` row: points `(radius, y)` from top to bottom, in metres. 5–10 points per profile.

```text
ForwardDome (est. half-ellipse r 4.5, h 2.5, equator y 34.2): (0, 36.7) (2.0, 36.4) (3.4, 35.8) (4.2, 35.0) (4.5, 34.2)
```

### 4.5 Simplify

- One cylinder for both tanks; the common dome and header tanks are internal.
- Drop chines, raceways and individual tiles; keep the black/steel split and the two aft flaps.
- No SpaceX logo or flag.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 400 (estimate ~250) |
| Meshes | ≤ 2 (Steel, HullBlack) |
| Height / diameter | 34.2 (36.7 with dome) / 9.0, ±2% |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| n/f | | none downloaded: Wikimedia Commons rate-limited the search and most SpaceX photos are CC BY-NC (refused) | | | |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://www.spacex.com/vehicles/starship/ — official specs and photos (© SpaceX)
- https://www.flickr.com/photos/spacex/ — SpaceX flight-test photos, side views of ships with tiles and flaps (CC BY-NC 2.0)

## 6. Gaps and cautions

- Almost every number is ⚠: SpaceX's page could not be read by our tools, so V3 capacities (ship 1,600 t, booster 3,650 t) come from secondary reports of it.
- Dry masses, pressures, boil-off, cost: n/f. Geometry is derived from volumes plus rough estimates; no photo was measured.
- Tank order (LOX below CH4 in the ship) and alloy names are from secondary sources ⚠.
- Refuelling status changes fast: recheck before using it in a "Fato real" card.
- Free images still needed (3–5 views).

## 7. Sources

1. Collected reports on Starship V3 and propellant transfer (newspaceeconomy.ca *Detailed Review of Starship V3*, 16 Apr 2026; Spaceflight Now, 12 May 2026; Wikipedia *Starship Propellant Transfer Demonstration*), quoting SpaceX's vehicle page and NASA schedules ⚠. https://newspaceeconomy.ca/2026/04/16/detailed-review-of-starship-v3/ ; https://spaceflightnow.com/2026/05/12/spacex-targets-may-19-for-debut-of-starship-super-heavy-version-3-launch-pad-2/ ; https://en.wikipedia.org/wiki/Starship_Propellant_Transfer_Demonstration (accessed 2026-11-14)
2. Wikipedia, *SpaceX Starship* and *SpaceX Super Heavy* (pointers to SpaceX statements; ⚠). https://en.wikipedia.org/wiki/SpaceX_Starship (accessed 2026-11-14)
3. NASA, Starship HLS and propellant-transfer tipping-point updates (via [1]; not re-opened ⚠). https://en.wikipedia.org/wiki/Starship_HLS (accessed 2026-11-14)
