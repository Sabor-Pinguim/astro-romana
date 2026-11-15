---
id: sls-core-stage-tanks
name: "SLS core stage propellant tanks (LH2 tank + LOX tank)"
category: tank
role: stage
tier: 3
propellants: [LOX, LH2]
manufacturer: Boeing (built at NASA Michoud Assembly Facility) for NASA
vehicles: ["SLS Block 1, core stage"]
status: operational (2 flights; Artemis III core stage at KSC) (checked 2026-11)
---

# SLS core stage tanks

The Space Launch System core stage is an 8.4 m wide, 64.6 m tall orange tower that holds about 990 t of liquid hydrogen and liquid oxygen for four RS-25 engines. From the bottom up it has five sections: engine section, liquid-hydrogen tank (39.7 m, the biggest part), intertank, liquid-oxygen tank and forward skirt. The tanks are friction-stir-welded aluminium 2219 under orange spray-on foam, the same diameter as the Space Shuttle external tank. It burns for about 8 minutes and is thrown away; it is not built to store propellant in orbit.

**Why tier 3:** about 47 times the propellant of the tier-2 Centaur and the fuel for NASA's crewed Moon rocket, but each stage is expendable and very expensive, and hydrogen needs huge, insulated tanks.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 85,300 | kg | [1][2] | whole core stage unfueled "without engines" (188,000 lb) [1]; includes engine section, intertank, forward skirt, avionics, foam. Tank-only masses n/f |
| `propellant_mass` | 987,500 | kg | derived ⚠ | `143,800 + 843,700` (tank capacities [1][2]). The same guide also says "total propellant weight 2.2 million lbs (998 t)" and "2.4 million lbs (1,088 t) fueled" (→ 1,002.7 t with the dry mass) |
| `fuel_mass` | 143,800 | kg | [1] | 317,000 lb LH2 |
| `oxidizer_mass` | 843,700 | kg | [1] | 1.86 million lb LOX |
| `mixture_ratio` | 5.87 | O/F by mass | derived | `843,700 / 143,800` (loaded); RS-25 nominal value: see the RS-25 README |
| `volume_total` | 2,774.7 | m³ | derived | 2,032.8 + 741.9 |
| `volume_fuel` | 2,032.8 | m³ | [1] | 537,000 US gal ("2 million L") |
| `volume_oxidizer` | 741.9 | m³ | [1] | 196,000 US gal (741,941 L) |
| `propellant_fraction` | 0.921 | — | derived | `987,500 / (987,500 + 85,300)` |
| `material` | aluminium 2219, friction-stir welded; isogrid barrels; bolted intertank | — | [1][2] | 10 barrel sections, 4 domes, 7 rings; each barrel = 8 panels [1] |
| `pressure_operating` | n/f | MPa | | |
| `pressurant` | autogenous GH2 (LH2 tank); LOX tank n/f | — | [5] | GH2 tapped from the RS-25s feeds the LH2 tank pressurisation line [5]; helium and nitrogen are used for valves and purges [1] |
| `storage_temperature` | 20 (LH2), 90 (LOX) | K | [1] | −253 °C and −183 °C |
| `boil_off` | n/f | %/day | | stage is topped off on the pad until launch; "gaseous oxygen is vented overboard" [1]. Not designed for orbital storage |
| `insulation` | orange spray-on foam (+ cork) | — | [1] | third-generation foam; applied light yellow, turns orange in sunlight |
| `power_electric` | n/f | W | | |
| `cost_unit` | n/f | USD (year) | | see `cost_launch` |
| `diameter` | 8.4 | m | [1] | 27.6 ft, excluding foam and flanges |
| `length` | 64.6 | m | [1] | "from forward skirt to engine exhaust exit plane", so it includes the RS-25 nozzles. Structure only (model): 59.9 m est. (section 3) |
| `first_flight` | 2022 | year | [3] | Artemis I, 16 Nov 2022 |
| `flights` | 2 | count | [3][4] | Artemis I (2022), Artemis II (1 Apr 2026) |

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | SLS Block 1 (crew, with Orion) | — | [1] | |
| `stage` | core stage (stage 1, with two solid boosters) | — | [1] | |
| `parts_per_stage` | 1 | count | | one LH2 + one LOX tank; 4 RS-25 engines |
| `stage_mass_dry` | 85,300 | kg | [1] | without engines; RS-25 ≈ 3,500 kg each [1] |
| `stage_propellant_mass` | 987,500 | kg | derived ⚠ | see `propellant_mass` |
| `stage_burn_time` | 480 | s | [1] | |
| `stage_delta_v` | n/f | m/s | | needs booster, ICPS and Orion masses along the burn; compute in game from the RS-25 and booster READMEs |
| `vehicle_liftoff_mass` | 2,603,000 | kg | [1] | 5.74 million lb fueled |
| `vehicle_height` | 98.3 | m | [1] | 322.4 ft |
| `vehicle_diameter` | 8.4 | m | [1] | core stage |
| `payload_leo` | 95,000 | kg | [1] | Block 1 crew, expendable |
| `payload_gto` | n/f | kg | | |
| `payload_mars` | n/f | kg | [1] | Block 1: > 27 t to trans-lunar injection; only the future Block 2 cargo is quoted ("more than 80,000 lbs to Mars") |
| `cost_launch` | 4,100,000,000 ⚠ | USD (2021) | [6] | NASA OIG estimate per Artemis launch (SLS + Orion + ground systems); SLS alone ≈ 2.2 billion. Not re-checked in this pass |
| `mars_heritage` | none | — | | lunar program only |

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Diameter (all sections) | 8.4 | [1] | |
| Engine section height | 6.9 | [1] | single isogrid barrel + boat-tail fairing |
| LH2 tank height | 39.7 | [1] | 5 barrels × 6.7 m + 2 domes |
| LH2 dome height | 3.1 | derived | `(39.7 − 5·6.7) / 2`; volume check 2,085 m³ vs 2,033 m³ |
| Intertank height | 6.7 | [1] | encloses the LH2 forward dome and the LOX aft dome |
| LOX tank height | 15.6 | [1] | 2 barrels × 4.8 m + 2 domes |
| LOX dome height | 3.0 | derived | `(15.6 − 2·4.8) / 2`; volume check 754 m³ vs 742 m³ |
| Forward skirt height | 3.2 | [1] | |
| Structure stack, bottom of engine section to top of skirt | 59.9 | derived | sections stacked with domes nested (section 4.3); the extra 4.7 m to 64.6 m is the RS-25 nozzles below the boat tail (est.) |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

One very tall orange cylinder, 8.4 m wide and 7 times as tall, with almost no shape change from top to bottom (`in-context-1.jpg`). Read it by its bands: a lighter (white/grey) engine section at the bottom, the long smooth LH2 tank, the intertank (slightly ribbed, with white rings above and below), the shorter LOX tank and the forward skirt with a white ring on top. Two thin LOX "downcomer" pipes leave the intertank on opposite sides and run down the LH2 tank into the engine section; a thin systems tunnel runs along the front. Under the foam, the tanks are bare aluminium with welded gore domes (`three-quarter-1.jpg`, `detail-1.jpg`). Looking down into the forward skirt you see the LOX forward dome.

### 4.2 Node hierarchy

```text
SlsCoreStageTanks             origin: bottom interface = bottom of engine section / boat tail
├─ Attach_Top                 (0, 59.9, 0)    top of forward skirt (launch vehicle stage adapter)
├─ Attach_Bottom              (0, 0, 0)
└─ Attach_Engine_1..4         (±1.6, 1.5, ±1.6)  est. RS-25 gimbal points, square pattern (extra nodes, not yet in parts.md)
```

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | SlsCoreStageTanks | cylinder (engine section, open) | r 4.2, h 6.9 | (0, 3.45, 0) | (0, 0, 0) | Hull | 16 |
| 2 | SlsCoreStageTanks | cylinder (LH2 barrel) | r 4.2, h 33.5 | (0, 23.65, 0) | (0, 0, 0) | Foam | 16 |
| 3 | SlsCoreStageTanks | cylinder (intertank) | r 4.25, h 6.7 | (0, 43.75, 0) | (0, 0, 0) | Foam | 16 |
| 4 | SlsCoreStageTanks | cylinder (LOX barrel) | r 4.2, h 9.6 | (0, 51.9, 0) | (0, 0, 0) | Foam | 16 |
| 5 | SlsCoreStageTanks | cylinder (forward skirt, open, double-sided) | r 4.2, h 3.2 | (0, 58.3, 0) | (0, 0, 0) | Foam | 16 |
| 6 | SlsCoreStageTanks | cylinder ×2 (white rings) | r 4.27, h 0.4 | (0, 40.6, 0), (0, 56.9, 0) | (0, 0, 0) | Hull | 16 |
| 7 | SlsCoreStageTanks | lathe `LoxForwardDome` | see 4.4 | (0, 0, 0) | (0, 0, 0) | Foam | 16 |
| 8 | SlsCoreStageTanks | disc (aft heat shield) | r 4.2 | (0, 0.02, 0) | (180, 0, 0) | HullBlack | 16 |
| 9 | SlsCoreStageTanks | cylinder ×2 (LOX downcomers) | r 0.30, h 36.0 | (±4.5, 24.9, 0) | (0, 0, 0) | Foam | 6 |
| 10 | SlsCoreStageTanks | box (systems tunnel) | 0.5, 33.5, 0.3 | (0, 23.65, 4.35) | (0, 0, 0) | Foam | — |

Hidden internal domes (not modelled): LH2 aft dome apex y 3.8, LH2 forward dome apex y 43.5, LOX aft dome apex y 44.1.

### 4.4 Revolved profiles

For each `lathe` row: points `(radius, y)` from top to bottom, in metres. 5–10 points per profile.

```text
LoxForwardDome (half-ellipse r 4.2, h 3.0, equator y 56.7): (0, 59.7) (1.8, 59.4) (3.0, 58.8) (3.8, 57.9) (4.2, 56.7)
```

### 4.5 Simplify

- Drop umbilical plates, cable trays other than the systems tunnel, cameras, booster attach fittings, photogrammetry markings.
- Keep the two downcomers and the bands: they are what makes it read as SLS and not the Shuttle tank.
- No NASA "worm"/"meatball", flag or "USA" text, even though the real stage has them.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 600 (estimate ~430) |
| Meshes | ≤ 3 (Foam, Hull, HullBlack) |
| Height / diameter | 59.9 (structure) / 8.4, ±2% |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| three-quarter-1.jpg | three-quarter | Bare aluminium LH2 tank for Artemis III lying on a transporter at Michoud (2022): barrel welds and the domed end | [NASA](https://images.nasa.gov/details/MAF_20220118_CS3_LH2_303to451_301) | NASA/Eric Bordelon | Public domain (NASA) |
| detail-1.jpg | detail | LOX tank aft dome lifted at Michoud (2023): welded gore panels and dome height vs diameter | [NASA](https://images.nasa.gov/details/MAF_20231205_CS3_LoxAftDomeLift05) | NASA/Michael DeMocker | Public domain (NASA) |
| in-context-1.jpg | in-context | Artemis III core stage vertical in the VAB (Oct 2026): full orange stage, bands, systems tunnel, light engine section | [NASA](https://images.nasa.gov/details/KSC-20261022-PH-SNC01_0006) | NASA/Sean Cannon | Public domain (NASA) |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://www.nasa.gov/wp-content/uploads/2022/03/sls-reference-guide-2022-v2-508-0.pdf — p. 36 diagram of the 10 barrels, 4 domes and 7 rings (public domain, but inside a PDF)

## 6. Gaps and cautions

- Tank pressures, boil-off, tank-only masses and unit cost: n/f.
- Propellant total diverges: 987.5 t (sum of tank capacities) vs 998 t and ~1,003 t elsewhere in the same guide ⚠.
- Section stack gives 59.9 m of structure; the official 64.6 m includes the engine nozzles. Engine positions are est.
- Status (2026-11): Artemis II flew 1–10 Apr 2026; the Artemis III core stage is at KSC with 4 RS-25s installed [7]; Artemis III was re-planned as a crewed Earth-orbit test, and NASA is studying a Centaur V upper stage for later SLS flights [7].
- Not a Mars stage: no Mars launches, and no in-space storage design.

## 7. Sources

1. NASA, *Space Launch System Reference Guide*, v2, 2022 (core stage pp. 8, 35–41; TPS p. 25). https://www.nasa.gov/wp-content/uploads/2022/03/sls-reference-guide-2022-v2-508-0.pdf (accessed 2026-11-14)
2. NASA MSFC, *SLS Core Stage fact sheet*, FS-2021-04-27-MSFC. https://www.nasa.gov/wp-content/uploads/2020/02/sls_core_stage_fact_sheet_04262021_508.pdf (accessed 2026-11-14)
3. NASA, *Space Launch System Core Stage* reference page. https://www.nasa.gov/reference/sls-space-launch-system-core-stage/ (accessed 2026-11-14)
4. NASA, *Artemis II Flight Day 10: Crew Sets for Final Burn, Splashdown*, 10 Apr 2026. https://www.nasa.gov/blogs/missions/2026/04/10/artemis-ii-flight-day-10-crew-sets-for-final-burn-splashdown/ (accessed 2026-11-14)
5. B. Stuart, J. Mcenulty (NASA MSFC), *Overview of the SLS Core Stage Thrust Vector Control System Design*, 2023, NTRS 20230001523. https://ntrs.nasa.gov/citations/20230001523 (accessed 2026-11-14)
6. NASA Office of Inspector General, *NASA's Management of the Artemis Missions*, IG-22-003, Nov 2021 (not re-opened in this pass ⚠). https://oig.nasa.gov/docs/IG-22-003.pdf (accessed 2026-11-14)
7. NASA, *Artemis Acceleration Readiness*, Oct 2026. https://www.nasa.gov/wp-content/uploads/2026/10/artemis-acceleration-readiness-oct-2026.pdf (accessed 2026-11-14)
