---
id: hydrazine-tank
name: Northrop Grumman (formerly ATK/PSI) P/N 80397-1 hydrazine diaphragm tank
category: tank
role: in-space
tier: 1
propellants: [hydrazine]
manufacturer: Northrop Grumman (formerly Pressure Systems Inc. / ATK)
vehicles: ["Phoenix Mars lander", "InSight Mars lander", "Mars Surveyor '98 lander ⚠"]
status: retired (checked 2026-11)
---

# Hydrazine tank (NG P/N 80397-1)

A 0.42 m titanium sphere that holds about 30 kg of hydrazine behind a rubber diaphragm, so the liquid can be pushed out by gas in zero-g without sloshing bubbles into the thrusters. Northrop Grumman's catalogue lists this exact part for the "Mars Surveyor, Phoenix, InSight" landers [1], so it has really been to the surface of Mars: each of those landers carried two of these tanks (est., see section 2) to feed the descent thrusters.

**Why this tank:** it is the only tank in the manufacturer's public catalogue whose heritage row names Mars landers, and the catalogue gives its volume, mass, size and pressure [1]. MRO, MAVEN and Odyssey tanks are much larger and have no public data sheet.

**Why tier 1:** it is tiny and cheap compared with the tier-2 Dawn xenon tank (268 L) or the tier-3 Orion service-module tanks: one sphere stores only ~30 kg, enough for the last minute of a small Mars landing.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 4.5 | kg | [1] | 10.00 lbm, tank only (no MLI, heaters, mounting brackets) |
| `propellant_mass` | 30.3 | kg | derived | Qualified propellant volume 30.2 L [1] × 1.004 kg/L (hydrazine at 25 °C ⚠ handbook value [5]) |
| `fuel_mass` | 30.3 | kg | derived | Monopropellant: all of it is hydrazine |
| `oxidizer_mass` | n/a | kg | | Monopropellant |
| `mixture_ratio` | n/a | O/F by mass | | Monopropellant (decomposed on a catalyst bed in the thruster) |
| `volume_total` | 0.0377 | m³ | [1] | 2,300 in³ = 37.7 L (propellant + gas sides) |
| `volume_fuel` | 0.0302 | m³ | [1] | Qualified propellant volume 1,840 in³ = 30.2 L. The catalogue warns this "might not be the maximum propellant compartment volume" |
| `volume_oxidizer` | n/a | m³ | | |
| `propellant_fraction` | 0.87 | — | derived | `30.3 / (30.3 + 4.5)` |
| `material` | titanium shell with elastomeric diaphragm ⚠ | — | [1] | Catalogue family "diaphragm tanks"; derivative of P/N 80276. Titanium shell is standard for this product line but not stated on the 80397 row ⚠ |
| `pressure_operating` | 2.21 | MPa | [1] | 320 psig = 22.1 bar |
| `pressurant` | gas on the other side of the diaphragm (blowdown) | — | [1] | Gas type for Phoenix/InSight: n/f (nitrogen or helium are usual) |
| `storage_temperature` | > 275 | K | [5] ⚠ | Not cryogenic, but hydrazine freezes at about +1.4 °C (274.6 K), so it must stay warm |
| `boil_off` | n/a | %/day | | Storable propellant |
| `insulation` | MLI | — | est. | Flown wrapped in silver multilayer insulation (see `in-context-1.jpg`); heaters keep it above freezing |
| `power_electric` | n/f | W | | Heater power not published. Game note: tank heaters run all cruise long |
| `cost_unit` | n/f | USD | | |
| `diameter` | 0.419 (ID) | m | [1] | 16.5 in inner diameter; outer ≈ 0.43 m est. (wall + girth weld) |
| `length` | 0.50 | m | est. | Sphere OD 0.43 m + ~0.035 m port stub at each pole |
| `first_flight` | 1999 ⚠ | year | [1] | "Mars Surveyor" heritage = Mars Polar Lander, launched 3 Jan 1999 (lost at landing). Our reading of the catalogue row ⚠. Phoenix: 2007 |
| `flights` | 3 ⚠ | count | [1] | Missions: Mars Surveyor '98 (⚠ see above), Phoenix (2007), InSight (2018); 2 tanks each (est.) |

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Phoenix | InSight | Unit | Source | Note |
|---|---|---|---|---|---|
| `vehicle` | Phoenix Mars Lander | InSight Mars lander | — | [2], [3] | Both built by Lockheed Martin on the same lander design |
| `stage` | lander propulsion | lander propulsion | — | [2], [3] | All thrusters are on the lander; it also fed cruise trajectory-correction burns |
| `parts_per_stage` | 2 (est.) | 2 (est.) | count | derived | 67 kg of propellant [2][3] needs more than one 30 kg tank; two MLI-wrapped spheres are visible under the InSight deck (`in-context-1.jpg`) |
| `stage_mass_dry` | 343 ⚠ | 291 ⚠ | kg | [2], [3], derived | Phoenix: lander 410 kg including 67 kg fuel [2] → 343 kg (the launch kit gives a 350 kg lander ⚠). InSight: lander ~358 kg [3]; if that already includes the 67 kg of propellant and pressurant, dry ≈ 291 kg (our reading ⚠) |
| `stage_propellant_mass` | 67 | 67 | kg | [2], [3] | Phoenix: "67 kilograms of fuel"; InSight: "67 kilograms of loaded propellant and pressurant" |
| `stage_burn_time` | n/f | n/f | s | [2] | Total not published. Example: Phoenix's largest trajectory-correction burn lasted 3 min 17 s [2] |
| `stage_delta_v` | ~400 | ~470 | m/s | derived, est. | `Isp · g0 · ln(m0/mf)` with Isp ≈ 230 s (est., MR-107-class thruster ⚠, see the MR-107 README): Phoenix 410 → 343 kg; InSight 358 → 291 kg |
| `vehicle_liftoff_mass` | 664 ⚠ | 694 | kg | [2], [3] | Spacecraft at launch (cruise stage + aeroshell + lander + propellant). Phoenix launch press kit says 670 kg ⚠ |
| `vehicle_height` | n/f | n/f | m | | |
| `vehicle_diameter` | n/f | n/f | m | | |
| `payload_leo` | n/a | n/a | kg | | Spacecraft, not a launcher |
| `payload_gto` | n/a | n/a | kg | | |
| `payload_mars` | n/a | n/a | kg | | Science payload landed: Phoenix 59 kg [2] |
| `cost_launch` | n/f | n/f | USD | | Launched on Delta II 7925 (Phoenix, 4 Aug 2007) and Atlas V 401 (InSight, 5 May 2018) [2], [3] |
| `mars_heritage` | landed 25 May 2008 | landed 26 Nov 2018 | — | [2], [3] | Both soft-landed on Mars with these tanks feeding 12 pulsed descent thrusters |

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Sphere inner diameter | 0.419 | [1] | 16.5 in |
| Sphere outer diameter | 0.43 | est. | ID + thin titanium wall + girth weld land |
| Girth ring (equator) | 0.444 OD × 0.02 tall | est. | Weld land / mounting ring typical of diaphragm tanks (the diaphragm is clamped at the equator) |
| Mounting tabs | 4 × (0.05 × 0.012 × 0.04) | est. | Equatorial tabs; actual mounting of the 80397-1 is n/f |
| Port stubs (gas top, liquid bottom) | r 0.0125, 0.035 long | est. | Diaphragm tanks have a gas port at one pole and the propellant outlet at the other |
| Overall height | 0.50 | est. | 0.035 + 0.43 + 0.035 |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A bare titanium-grey ball about the size of a beach ball (43 cm). A thin raised ring runs around its equator, with four small flat mounting tabs sticking out at 90° spacing. A short pipe stub points straight down from the bottom pole (hydrazine outlet, `Attach_Bottom`) and another straight up from the top pole (gas/pressurant port, `Attach_Top`). In flight it is wrapped in crinkled silver MLI blanket (`in-context-1.jpg`): offer `FoilSilver` as an alternative material for the sphere.

### 4.2 Node hierarchy

```text
HydrazineTank                 origin: bottom interface (end of the liquid outlet stub)
├─ Attach_Top                 (0, 0.50, 0)   gas/pressurant port
└─ Attach_Bottom              (0, 0, 0)      hydrazine outlet to the thruster manifold
```

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | HydrazineTank | lathe (sphere) | see 4.4 | (0, 0, 0) | (0, 0, 0) | Titanium (or FoilSilver as flown) | 8 |
| 2 | HydrazineTank | cylinder, open (girth ring) | r 0.222, h 0.02 | (0, 0.250, 0) | (0, 0, 0) | Titanium | 8 |
| 3 | HydrazineTank | box (tab ×4, at 0°, 90°, 180°, 270°) | w 0.05, h 0.012, d 0.04 | (0.24, 0.250, 0) rotated about Y | (0, 0/90/180/270, 0) | Titanium | — |
| 4 | HydrazineTank | cylinder (outlet stub) | r 0.0125, h 0.035 | (0, 0.0175, 0) | (0, 0, 0) | Metal | 6 |
| 5 | HydrazineTank | cylinder (gas port stub) | r 0.0125, h 0.035 | (0, 0.4825, 0) | (0, 0, 0) | Metal | 6 |

### 4.4 Revolved profiles

```text
Sphere (r 0.215, centre y 0.250):
(0.000, 0.465) (0.082, 0.449) (0.152, 0.402) (0.199, 0.332) (0.215, 0.250)
(0.199, 0.168) (0.152, 0.098) (0.082, 0.051) (0.000, 0.035)
```

### 4.5 Simplify

- Drop fill/drain valves, pressure transducers, heater patches and thermistors.
- Keep the girth ring and the two polar stubs: they show which way the tank is plumbed.
- On a lander, place two tanks on opposite sides under the deck.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 800 (estimate ~200) |
| Meshes | ≤ 8 (Titanium, Metal: 2) |
| Height / diameter | 0.50 m / 0.43 m (±2%) |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| `in-context-1.jpg` | in-context | InSight lander lifted by crane (Lockheed Martin clean room, 20 Jun 2017). Under the deck, left and right, are two large silver MLI-wrapped spheres: by size and position these are the propellant tanks (our reading; the caption does not label them) | [NASA PIA21844](https://images.nasa.gov/details/PIA21844) | NASA/JPL-Caltech/Lockheed Martin | Public domain (NASA) |

No free photo of the bare tank was found. Build it from the catalogue dimensions in section 3 and the description in 4.1.

**Linked only** (useful but not freely licensed, so not downloaded):

- https://www.northropgrumman.com/what-we-do/space/mission-enabling-products/diaphragm-tanks-data-sheets-sorted-by-part-number — catalogue row for P/N 80397-1 (no photo).
- https://science.nasa.gov/resource/insight-landing-press-kit/ — InSight press kit, with lander diagrams.

## 6. Gaps and cautions

- Tank count per lander (2) is derived from the propellant mass and the photo, not stated in a source.
- `first_flight` assumes "Mars Surveyor" in the catalogue means the Mars Surveyor '98 lander (Mars Polar Lander) ⚠.
- Heater power, pressurant gas, diaphragm material and mounting style: n/f.
- InSight's "358 kg lander" may or may not include the 67 kg of propellant ⚠.
- Status: both missions have ended (InSight retired Dec 2022); Northrop Grumman still lists the part in its catalogue, so it could be bought again.

## 7. Sources

1. Northrop Grumman, *Diaphragm Tanks Data Sheets – Sorted by Part Number* (row 80397-1; same values in the "sorted by volume" page). https://www.northropgrumman.com/what-we-do/space/mission-enabling-products/diaphragm-tanks-data-sheets-sorted-by-part-number (accessed 2026-11-14)
2. NASA/JPL, *Phoenix Mars Lander landing press kit*, May 2008 (mass breakdown, 67 kg fuel, Delta II 7925). https://www.jpl.nasa.gov/news/press_kits/phoenix-landing.pdf (accessed 2026-11-14); and *Phoenix launch press kit*, Aug 2007 (670 kg, 350 kg lander). https://www.nasa.gov/pdf/181835main_phoenix-launch-presskit.pdf
3. NASA/JPL, *InSight landing press kit* and facts page (694 kg at launch, 358 kg lander, 67 kg propellant and pressurant, Atlas V 401, 20 hydrazine thrusters). https://www.jpl.nasa.gov/news/press_kits/insight/landing/download/mars_insight_landing_presskit.pdf (accessed 2026-11-14)
4. NASA Image and Video Library, PIA21844 *Hoisting NASA's InSight Lander*. https://images.nasa.gov/details/PIA21844 (accessed 2026-11-14)
5. Hydrazine physical properties (density ≈ 1.004 g/cm³ at 25 °C, freezing point ≈ 1.4 °C): standard handbook values, e.g. PubChem *Hydrazine*. https://pubchem.ncbi.nlm.nih.gov/compound/Hydrazine (not re-checked in this pass ⚠)
