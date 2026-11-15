---
id: centaur-iii-tank
name: "Centaur III (Common Centaur) propellant tank, single-engine (SEC)"
category: tank
role: stage
tier: 2
propellants: [LOX, LH2]
manufacturer: United Launch Alliance (tank built in San Diego; heritage Convair / Lockheed Martin)
vehicles: ["Atlas V 400/500 series, stage 2 (Centaur)"]
status: operational (retiring; 6 Atlas V left, all for Starliner) (checked 2026-11)
---

# Centaur III propellant tank

The Centaur III ("Common Centaur") is the 3.05 m upper stage of Atlas V. Its tank is a thin stainless-steel "balloon": it has no internal frames and holds its shape only because it is always pressurised, like a soda can. On the ground an unpressurised Centaur tank would crumple under its own weight, so it is kept pressurised (or stretched) from the factory to orbit. A double-walled, vacuum-insulated common bulkhead splits it into a short liquid-oxygen tank at the bottom and a long liquid-hydrogen tank on top. Atlas V/Centaur launched MRO, Curiosity, InSight and Perseverance.

**Why tier 2:** much lighter for its size than the tier-1 kerosene tanks and the proven workhorse of NASA's Mars launches, but far smaller than the tier-3 SLS/Starship tanks, and its hydrogen boils away in days, not months.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 2,075 | kg | derived | stage inert mass 2,243 kg (Atlas V 4X1 SEC [1]) − RL10A-4-2 engine 168 kg (370 lb [7] ⚠, sheet not opened). Includes forward adapter, avionics, RCS, pneumatics, insulation. Tank-only mass n/f. 5X1 stage: 2,247 kg [1]; a newer figure of 2,316 kg (RL10C-1 era) is Wikipedia-only ⚠ |
| `propellant_mass` | 20,830 | kg | [1] | LH2 + LO2 |
| `fuel_mass` | 3,205 | kg | derived | `20,830 / (1 + 5.5)`. Loaded LH2 is "~7,500 lbm" (≈3,400 kg) [2] |
| `oxidizer_mass` | 17,625 | kg | derived | `20,830 · 5.5 / 6.5`. Loaded LO2 is "~38,800 lbm" (≈17,600 kg) [2] |
| `mixture_ratio` | 5.5 | O/F by mass | [7] ⚠ | RL10C-1 nominal 5.5:1 per L3Harris sheet (quoted in search; PDF blocked); some mirrors give 5.88. Loaded masses in [2] give 5.2 |
| `volume_total` | 64.45 | m³ | derived | 48.31 + 16.14 |
| `volume_fuel` | 48.31 | m³ | [2] | 1,706 ft³ loaded LH2 tank volume (Centaur for Atlas V); tanks stretch "several cubic feet" when pressurised |
| `volume_oxidizer` | 16.14 | m³ | [2] | 570 ft³ |
| `propellant_fraction` | 0.909 | — | derived | `20,830 / (20,830 + 2,075)` |
| `material` | stainless steel, pressure-stabilised monocoque ("balloon") with common bulkhead | — | [1][3] | "thin-wall fully monocoque corrosion-resistant steel. Tank stabilization is maintained by internal pressurization" [1]. Common (intermediate) bulkhead is double-walled and vacuum-insulated [1]. Skin ~0.51 mm ⚠ (Wikipedia only) |
| `pressure_operating` | n/f | MPa | | rule: LO2 tank pressure must always be above LH2 tank pressure so the common bulkhead does not reverse [3]; too low = buckling, too high = burst [8] |
| `pressurant` | helium + autogenous GH2 | — | [1][3] | 2 composite He bottles (135.4 × 58.4 cm) at 27.58 MPa; regulated to 3.45 MPa for engine/RCS controls [1]. During burns GH2 bled from the engine pressurises the LH2 tank [3] |
| `storage_temperature` | 20 (LH2), 90 (LO2) | K | [9] | −253 °C and −183 °C (generic cryogenic values from the SLS guide) |
| `boil_off` | ~2 | %/day | [2] | whole system with current insulation: "slightly less than 2% of loaded propellants per day". Per tank, from flight data: LO2 2.2–2.6 %/day on Atlas V (AV-003, AV-005); LH2 4.1–5.1 %/day on Titan/Centaur with 3-layer MLI (not reconstructable on Atlas: LH2 vented continuously). 1 %/day projected with more MLI [2]. Atlas V 4-m version (bare sides) is limited to < 3 h missions [1] |
| `insulation` | foam + optional radiation shields | — | [1][4] | foam bonded to tank walls, white paint or decal; helium-purged blankets on the aft bulkhead; radiation shield (GSO kit) for long coasts |
| `power_electric` | n/f | W | | stage runs on batteries (~6 h standard); GSO kit adds two 150 A·h batteries [1][8] |
| `cost_unit` | n/f | USD (year) | | |
| `diameter` | 3.05 | m | [1] | |
| `length` | 9.45 | m | est. | aft-dome apex to forward-adapter top (sections 3–4). Whole stage with RL10 nozzle: 12.68 m [1] |
| `first_flight` | 2002 | year | [3] | Atlas IIIB, Feb 2002; Atlas V first flight Aug 2002 |
| `flights` | 110 | count | [10] ⚠ | Atlas V launches through 2 Jul 2026 (Wikipedia count); plus 4 Atlas IIIB flights (n/f in a primary source) |

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | Atlas V 541 | — | [4] | Perseverance (2020) and Curiosity (2011). MRO and InSight used the 401 |
| `stage` | stage 2 (Centaur, single engine) | — | [1] | |
| `parts_per_stage` | 1 | count | | one tank set |
| `stage_mass_dry` | 2,247 | kg | [1] | 5X1 inert mass (RL10A-4-2 era) |
| `stage_propellant_mass` | 20,830 | kg | [1] | |
| `stage_burn_time` | 880 | s | derived | Mars 2020: 1st burn 409.8 s + 2nd burn 470.6 s (from event times in [4]) |
| `stage_delta_v` | 6,677 | m/s | derived | `450.5 · g0 · ln((2,247 + 20,830 + 3,649) / (2,247 + 3,649))`; payload = Mars 2020 spacecraft 3,649 kg ⚠ (Wikipedia only); adapters and residuals ignored |
| `vehicle_liftoff_mass` | 531,000 | kg | [5] | Atlas V 541 with Mars 2020 |
| `vehicle_height` | 60 | m | [4][5] | 541 with 5-m short fairing |
| `vehicle_diameter` | 3.81 | m | [1] | booster; fairing 5.4 m |
| `payload_leo` | 17,443 | kg | [1] | 200 km circular, 28.5°, expendable (401: 9,797 kg) |
| `payload_gto` | 8,290 | kg | [1] | GTO 1,804 m/s to GSO |
| `payload_mars` | 3,649 ⚠ | kg | [4] | Mars 2020 at C3 = 14.49 km²/s² [4]; spacecraft mass from Wikipedia only ⚠. InSight (401): C3 = 8.19 km²/s² [6] |
| `cost_launch` | 243,000,000 | USD (2016) | [11] | NASA's total cost to launch Mars 2020, incl. processing and tracking |
| `mars_heritage` | MRO (2005, 401), Curiosity (2011, 541), InSight (2018, 401), Perseverance (2020, 541) | — | [1][4][6] | |

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Tank and adapter diameter | 3.05 | [1] | |
| Stage length with RL10 nozzle | 12.68 | [1] | ULA brochures say 12.6–12.7 m |
| Barrel (cylinder) length | 7.5 | est. | from volumes: `(64.45 − 2·(2/3)π·1.525²·0.95) / (π·1.525²)` = 7.55; the 1/140 ULA cutaway [12] scales to 7.56 m |
| Aft and forward dome height | 0.95 | est. | scaled from Fig. 2 of [2] (to-scale tank outline, 3.05 m width): 0.92–0.99 m |
| Common bulkhead | equator 0.97 above the aft-dome equator, bulging up 0.9 | est. | Fig. 2 of [2]; internal, not visible |
| Forward adapter (CFA) height | 1.0 | est. | cutaway [12]: 0.91 m; set to 1.0 so it hides the forward dome |
| He bottles | 1.354 × Ø0.584 | [1] | two bottles on the aft bulkhead |
| SEC engine offset | 0.452 below the dual-engine mounts | [1] | engine hangs on a beam on the aft bulkhead |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A plain white cylinder about three diameters tall. At the top, the forward adapter is a short ring with an open top (the payload adapter bolts onto it); inside it, the forward dome rises almost to the rim. Down one side (+X, the right edge in `side-1.jpg`) runs a thin raised strip, the cableway fairing, ending low on the barrel in a bulge (the LH2 feedline sump). At the bottom there is no skirt: the barrel ends and the aft dome bulges out, covered by a cream insulation blanket, with two dark helium bottles, small round hydrazine tanks, a cross beam and pipes on it (`bottom-1.jpg`). The single engine hangs from the beam at the centre. `detail-1.jpg` shows the bare steel tank of a museum stage: no stringers or frames, just smooth steel.

### 4.2 Node hierarchy

```text
CentaurIIITank                origin: bottom interface = aft-dome apex (engine mount)
├─ Attach_Top                 (0, 9.45, 0)   top of forward adapter (payload adapter)
└─ Attach_Bottom              (0, 0, 0)      RL10 gimbal block hangs below this point
```

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | CentaurIIITank | lathe `TankShell` | see 4.4 | (0, 0, 0) | (0, 0, 0) | Hull | 12 |
| 2 | CentaurIIITank | cylinder, open (both sides) | r 1.535, h 1.0 | (0, 8.95, 0) | (0, 0, 0) | Hull | 12 |
| 3 | CentaurIIITank | flat ring | r_out 1.535, r_in 1.30 | (0, 9.45, 0) | (0, 0, 0) | Aluminum | 12 |
| 4 | CentaurIIITank | box (cableway) | 0.20, 7.2, 0.12 | (1.58, 5.0, 0) | (0, 0, 0) | Hull | — |
| 5 | CentaurIIITank | box (LH2 sump fairing) | 0.32, 1.4, 0.30 | (1.62, 1.6, 0) | (0, 0, 0) | Hull | — |
| 6 | CentaurIIITank | cylinder (He bottle) | r 0.292, h 1.354 | (0.85, 0.45, −0.55) | (0, 0, 60) | HullBlack | 8 |
| 7 | CentaurIIITank | cylinder (He bottle) | r 0.292, h 1.354 | (−0.85, 0.45, −0.55) | (0, 0, −60) | HullBlack | 8 |
| 8 | CentaurIIITank | sphere ×2 (N2H4, est.) | r 0.25 | (±0.65, 0.35, 0.75) | (0, 0, 0) | Titanium | 6 × 4 |
| 9 | CentaurIIITank | box (SEC engine beam) | 1.9, 0.25, 0.35 | (0, 0.12, 0) | (0, 0, 0) | Metal | — |
| 10 | CentaurIIITank | cylinder (feedline) | r 0.08, h 1.3 | (0.9, 0.55, 0) | (0, 0, 50) | Metal | 5 |

### 4.4 Revolved profiles

For each `lathe` row: points `(radius, y)` from top to bottom, in metres. 5–10 points per profile.

```text
TankShell, forward part: (0, 9.40) (0.47, 9.35) (0.90, 9.27) (1.24, 9.05) (1.45, 8.79) (1.525, 8.45) (1.525, 0.95)
TankShell, aft dome:     (1.525, 0.95) (1.45, 0.66) (1.24, 0.40) (0.90, 0.18) (0.47, 0.05) (0, 0)
```

Both are half-ellipses of radius 1.525 and height 0.95; merge them into one mesh.

### 4.5 Simplify

- Drop RCS thruster pods, cable harnesses, umbilical plates and antennas.
- Keep the cableway strip and sump bulge: they make the side read as Centaur, not a generic can.
- The common bulkhead is internal: do not model it (optional: a thin ring line at y = 1.92).
- No flags, ULA/Atlas logos or text.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 550 (estimate ~500) |
| Meshes | ≤ 5 (Hull, Aluminum, HullBlack, Titanium, Metal) |
| Height / diameter | 9.45 / 3.05, ±2% |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| side-1.jpg | side | MRO's single-engine Centaur (AV-007) hoisted at Pad 41, 2005: full stage, white barrel, forward adapter with yellow lift fixture, aft blanket, He bottles, RL10. Taken from below, so the barrel looks shorter than it is | [Commons](https://commons.wikimedia.org/wiki/File:Centaur_upper_stage_of_Atlas_V_rocket.jpg) | NASA | Public domain |
| bottom-1.jpg | bottom | Landsat 9 Centaur from below (2021): aft dome blanket, He bottles, beam, RL10C-1 with red nozzle cover, cableway strip | [Commons](https://commons.wikimedia.org/wiki/File:Landsat-9_Centaur_1.jpg) | Randy Beaudoin (NASA) | Public domain |
| detail-1.jpg | detail | Bare stainless Centaur III tank of a museum exhibit (LA AFB, 2024): smooth steel balloon skin and one dome with its fittings | [Commons](https://commons.wikimedia.org/wiki/File:Centaur_Upper_Stage_Installation_Recognizes_Trailblazing_Space_Program_(8706292).jpg) | U.S. Space Force photo by Van Ha | Public domain |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://www.ulalaunch.com/docs/default-source/rockets/atlasv-cutaway.pdf — 1/140 Atlas V cutaway with LH2/LO2 tanks and common bulkhead (© ULA)
- https://images.nasa.gov/details/KSC-20200610-PH-KLS02_0078 — Perseverance's Centaur lifted into the VIF (public domain; not kept, image cap)

## 6. Gaps and cautions

- Tank operating pressures n/f; tank-only dry mass n/f (only stage inert mass).
- RL10 mixture ratio and mass come from an L3Harris sheet we could not open (⚠); check against the RL10 engine README.
- Inert mass 2,243/2,247 kg is from the 2010 guide (RL10A-4-2); current stages fly RL10C-1 (101.9 kN [4]).
- Flight count 110 is a Wikipedia tally ⚠; the 6 remaining Atlas V are reserved for Starliner, whose next flight had no firm date (checked 2026-11).
- Game hook: the balloon tank must stay pressurised to hold its shape; losing pressure = structural failure. Hydrogen boil-off (~2 %/day system, 4–5 %/day LH2) makes Centaur a poor choice for a months-long cruise without extra insulation.

## 7. Sources

1. United Launch Alliance, *Atlas V Launch Services User's Guide*, Rev. 11, March 2010. https://www.ulalaunch.com/docs/default-source/rockets/atlasvusersguide2010.pdf (accessed 2026-11-14)
2. J. S. De Kruif, B. F. Kutter (ULA), *Centaur Upperstage Applicability for Several-Day Mission Durations with Minor Insulation Modifications*, AIAA 2007-5845. https://www.ulalaunch.com/docs/default-source/upper-stages/centaur-upperstage-applicability-for-several-day-mission-durations-with-minor-insulation-modifications-2007-5845.pdf (accessed 2026-11-14)
3. T. J. Rudman, K. L. Austad (Lockheed Martin), *The Centaur Upper Stage Vehicle*, 2002. https://www.ulalaunch.com/docs/default-source/upper-stages/the-centaur-upper-stage-vehicle.pdf (accessed 2026-11-14)
4. ULA, *Atlas V Mars 2020 mission overview brochure*, 2020. https://www.ulalaunch.com/docs/default-source/launch-booklets/mars2020_mobrochure_200717.pdf (accessed 2026-11-14)
5. NASA/JPL, *Mars 2020 launch press kit: quick facts and mission*, 2020. https://www.jpl.nasa.gov/news/press_kits/mars_2020/launch/quick_facts/ (accessed 2026-11-14)
6. ULA, *Atlas V InSight mission overview brochure*, 2018. https://www.ulalaunch.com/docs/default-source/launch-booklets/mob_insightfinal.pdf (accessed 2026-11-14)
7. L3Harris (Aerojet Rocketdyne), *RL10 spec sheet*, 2024 (values seen via search snippets only; PDF blocked). https://l3harris.com/sites/default/files/2024-07/l3harris-ar-rl10-spec-sheet.pdf (accessed 2026-11-14)
8. B. Kutter et al. (ULA), *An Integrated Vehicle Propulsion and Power System for Long Duration Cryogenic Spaceflight*, 2011; and *History of the Titan Centaur Launch Vehicle*. https://www.ulalaunch.com/docs/default-source/extended-duration/integrated-vehicle-propulsion-and-power-system-2011.pdf (accessed 2026-11-14)
9. NASA, *Space Launch System Reference Guide*, v2, 2022 (cryogen temperatures). https://www.nasa.gov/wp-content/uploads/2022/03/sls-reference-guide-2022-v2-508-0.pdf (accessed 2026-11-14)
10. Wikipedia, *Atlas V* (launch tally; used only as a pointer, ⚠). https://en.wikipedia.org/wiki/Atlas_V (accessed 2026-11-14)
11. NASA, *NASA Awards Launch Services Contract for Mars 2020 Rover Mission*, 25 Aug 2016. https://www.nasa.gov/news-release/nasa-awards-launch-services-contract-for-mars-2020-rover-mission (accessed 2026-11-14)
12. ULA, *Atlas V cutaway* (1/140 scale), 2022. https://www.ulalaunch.com/docs/default-source/rockets/atlasv-cutaway.pdf (accessed 2026-11-14)
