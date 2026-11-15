---
id: dawn-xenon-tank
name: Dawn xenon tank (Carleton Technologies titanium-lined graphite COPV, 268 L)
category: tank
role: in-space
tier: 2
propellants: [xenon]
manufacturer: Carleton Technologies (for NASA/JPL and Orbital Sciences)
vehicles: ["Dawn spacecraft (ion propulsion system)"]
status: retired (checked 2026-11)
---

# Dawn xenon tank

A squat, 0.91 m wide pressure vessel that stored 425 kg of xenon gas at about 85 times atmospheric pressure for Dawn's three NSTAR ion engines. It is a composite-overwrapped pressure vessel (COPV): a thin titanium liner wound with T1000 graphite fibre, carried on a skirt, wrapped in heaters and multilayer insulation [1]. The tank weighs only ~21 kg yet holds 20× its own mass of propellant, and that xenon gave Dawn a record ~11.5 km/s of velocity change [1], [4].

**Why tier 2:** it is the proven, mid-cost electric-propulsion tank that took a NASA science mission to two asteroids. The tier-1 hydrazine tank holds ~30 kg; tier-3 xenon systems (NEXT-C, Psyche, Gateway) need larger or multiple tanks.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 21.3 | kg | [1] | Midpoint of "Tank Dry Mass: 20.3 – 22.2 kg"; tank only, without MLI and heaters |
| `propellant_mass` | 425 | kg | [1], [3] | De-rated load flown at launch (410 kg loaded + 15 kg already in the tank [1]). Maximum load: 450 kg [1] |
| `fuel_mass` | 425 | kg | [1] | All xenon |
| `oxidizer_mass` | n/a | kg | | Electric propulsion |
| `mixture_ratio` | n/a | O/F by mass | | Electric propulsion |
| `volume_total` | 0.2679 | m³ | [1] | 9.46 ft³ = 267.9 L. Dawn's chief engineer gives "270 liters" [4] |
| `volume_fuel` | 0.2679 | m³ | [1] | Whole volume holds xenon |
| `volume_oxidizer` | n/a | m³ | | |
| `propellant_fraction` | 0.95 | — | derived | `425 / (425 + 21.3)` |
| `material` | COPV: Ti-6Al-4V liner, T1000 graphite-fibre overwrap, skirt-mounted | — | [1] | NASA image caption: "composite overwrapped pressure vessel with titanium liner" [2] |
| `pressure_operating` | 8.62 | MPa | [1] | Launch pressure 1,250 psia. Design MEOP 1,750 psi (12.07 MPa), de-rated to 1,310 psig (9.03 MPa); design burst 2,625 psig (18.1 MPa) [1] |
| `pressurant` | none (self-pressurised xenon) | — | [1], [2] | Xenon is stored as a dense supercritical gas, so it pushes itself out; the feed system lowers the pressure through small plenum tanks (`in-context-1.jpg`) |
| `storage_temperature` | ≤ 303 | K | [1] | Design 50 °C, de-rated to 30 °C maximum |
| `boil_off` | n/a | %/day | | Gas, not cryogenic |
| `insulation` | MLI + external heaters | — | [1] | "DAWN Tank prior to installation of MLI and external heaters" [1] |
| `power_electric` | n/f | W | | Heater power not published. Loading needed forced-air cooling because compression heats the gas [1] |
| `cost_unit` | n/f | USD | | Whole mission ≈ US$446 million [3] |
| `diameter` | 0.91 | m | [1] | 35.5 in (0.90 m) quoted; inside/outside 0.9017 / 0.91 m in the model inputs |
| `length` | 0.673 | m | [1] | Height 26.5 in. Note it is wider than it is tall (oblate) |
| `first_flight` | 2007 | year | [3] | Launched 27 Sep 2007 |
| `flights` | 1 | count | [3] | Dawn only; mission ended 31 Oct/1 Nov 2018 (out of hydrazine) |

**DART for comparison.** DART (launched 2021) carried about 60 kg of xenon for its NEXT-C ion engine, 1/7 of Dawn's load [5]. The size and maker of DART's xenon tank were not found (n/f). At Dawn's loading density (425 kg / 267.9 L = 1.59 kg/L, derived), 60 kg would need a ~38 L tank (est.).

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | Dawn (NASA Discovery mission) | — | [3] | Launched on a Delta II 7925H from Cape Canaveral |
| `stage` | spacecraft ion propulsion system | — | [3] | 3 NSTAR-derived 30 cm ion thrusters, one at a time |
| `parts_per_stage` | 1 | count | [3] | Plus one titanium hydrazine tank (45.6 kg) for attitude control |
| `stage_mass_dry` | 747.1 | kg | [3] | Spacecraft dry mass |
| `stage_propellant_mass` | 470.6 | kg | [3], derived | 425 kg xenon + 45.6 kg hydrazine; wet launch mass 1,217.7 kg |
| `stage_burn_time` | 1.85 × 10⁸ | s | [4] | 2,141 days of ion thrusting (5.9 years, 53% of the time) to Oct 2018 |
| `stage_delta_v` | ~11,500 | m/s | [4] | Measured: "accelerating the probe by 25,700 mph (41,400 kph)". Tsiolkovsky check: `3,100 · 9.80665 · ln(1,217.7 / 806.7)` ≈ 12,500 m/s with 411 kg xenon used at the top Isp (upper bound) |
| `vehicle_liftoff_mass` | 1,217.7 | kg | [3] | Spacecraft fuelled at launch |
| `vehicle_height` | 1.77 | m | [3] | Bus 1.64 × 1.27 × 1.77 m; solar arrays 19.7 m tip to tip |
| `vehicle_diameter` | n/a | m | | Box-shaped bus |
| `payload_leo` | n/a | kg | | Spacecraft |
| `payload_gto` | n/a | kg | | |
| `payload_mars` | n/a | kg | | |
| `cost_launch` | n/f | USD | | Mission total ≈ US$446 million [3] |
| `mars_heritage` | Mars gravity-assist flyby, 18 Feb 2009, 542 km | — | [3] | On the way to Vesta and Ceres |

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Outer diameter (equator) | 0.91 | [1] | |
| Overall height | 0.673 | [1] | Taken as body + polar bosses; skirt assumed within this height (est.) |
| Internal volume | 0.2679 m³ | [1] | An oblate spheroid of semi-axes 0.451 × 0.315 m has this volume (derived), so the body half-height is ~0.32 m |
| Equator height above origin | 0.335 | est. | Lower pole sits just above the skirt base |
| Skirt | r 0.458, 0.335 tall | est. | Black composite skirt from the equator to the mounting plane, scalloped lower edge with round mounting feet (`three-quarter-1.jpg`) |
| Top polar boss | r 0.06, 0.02 tall | est. | Scaled from `three-quarter-1.jpg` (boss ≈ 1/7 of the 0.91 m diameter) |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A flattened ball (wider than tall, like a squashed pumpkin) sitting in a short black skirt. Seen in `three-quarter-1.jpg`: the upper half is a smooth oblate dome covered in shiny orange-gold heater film, divided by ~12 narrow black radial bands that run from a dark metal boss at the top pole down to the equator. A thin pale line marks the equator. Below it, a black composite skirt hides the lower half; its bottom edge is scalloped, with small round mounting feet between the scallops. In flight the whole tank is wrapped in MLI blanket inside Dawn's central cylinder, so from outside the spacecraft it is never seen. Leave off the white identification label on the skirt.

### 4.2 Node hierarchy

```text
DawnXenonTank                 origin: bottom interface (skirt mounting plane)
├─ Attach_Top                 (0, 0.675, 0)   top boss (xenon fill/outlet port)
└─ Attach_Bottom              (0, 0, 0)      skirt base, bolted to the spacecraft structure
```

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | DawnXenonTank | lathe (upper dome) | see 4.4 | (0, 0, 0) | (0, 0, 0) | FoilGold | 16 |
| 2 | DawnXenonTank | lathe (lower dome, inside skirt) | see 4.4 | (0, 0, 0) | (0, 0, 0) | HullBlack | 16 |
| 3 | DawnXenonTank | cylinder, open (skirt) | r 0.458, h 0.335 | (0, 0.1675, 0) | (0, 0, 0) | HullBlack | 16 |
| 4 | DawnXenonTank | cylinder, top capped (polar boss) | r 0.06, h 0.02 | (0, 0.665, 0) | (0, 0, 0) | Titanium | 16 |
| 5 | DawnXenonTank | box (mounting foot ×8, every 45°) | w 0.07, h 0.03, d 0.05 | (0.45, 0.015, 0) rotated about Y | (0, 0/45/…/315, 0) | Titanium | — |

### 4.4 Revolved profiles

Oblate spheroid, a = 0.455, c = 0.32, centre y = 0.335.

```text
UpperDome: (0.000, 0.655) (0.150, 0.637) (0.260, 0.598) (0.345, 0.544) (0.405, 0.481) (0.440, 0.417) (0.455, 0.335)
LowerDome: (0.455, 0.335) (0.440, 0.253) (0.405, 0.189) (0.345, 0.126) (0.260, 0.072) (0.150, 0.033) (0.000, 0.015)
```

### 4.5 Simplify

- The ~12 black radial bands and the heater wiring can be skipped (or added later as 12 thin boxes if budget allows).
- Drop the label, wiring harness and thermistors.
- Alternative "as flown" material: `FoilGold` or `FoilSilver` MLI over the whole tank.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 800 (estimate ~530) |
| Meshes | ≤ 8 (FoilGold, HullBlack, Titanium: 3) |
| Height / diameter | 0.675 m / 0.91 m (±2%) |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| `three-quarter-1.jpg` | three-quarter | The flight xenon tank before MLI: oblate dome with orange heater film and black radial bands, top boss, black scalloped skirt with feet. Main reference for the shape | [NASA PIA12025](https://images.nasa.gov/details/PIA12025) | NASA/JPL | Public domain (NASA) |
| `in-context-1.jpg` | in-context | Exposed interior of the Dawn spacecraft: the xenon feed system panel with its two small cylindrical plenum tanks (the main tank sits inside the central cylinder, not visible) | [NASA PIA12023](https://images.nasa.gov/details/PIA12023) | NASA/JPL | Public domain (NASA) |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://ntrs.nasa.gov/api/citations/20170003928/downloads/20170003928.pdf — slide 32 shows the Dawn tank photo next to its specification list.

## 6. Gaps and cautions

- Heater power and the tank's exact heater/MLI mass: n/f.
- How the 0.673 m height splits between dome, bosses and skirt is our estimate; the skirt height is est.
- The specs come from a NASA GRC presentation [1] that cites the Dawn propulsion papers (Brophy et al. 2006, 2007); the original papers were not read.
- DART xenon tank size: n/f (only the 60 kg load is known).

## 7. Sources

1. R. Gilligan and T. Tomsik (NASA GRC), *Modeling ARRM Xenon Tank Pressurization using 1D Thermodynamic and Heat Transfer Equations*, TFAWS 2016 (slides 13–14 and 32–33: "Carleton COPV Xenon Flight Tank – DAWN IPS"). https://ntrs.nasa.gov/api/citations/20170003928/downloads/20170003928.pdf (accessed 2026-11-14)
2. NASA/JPL, PIA12025 *Dawn Spacecraft Xenon Tank* and PIA12023 *Exposed Interior of Dawn Spacecraft*, 2009. https://images.nasa.gov/details/PIA12025 (accessed 2026-11-14)
3. NASA NSSDCA, *Dawn* spacecraft page (dry 747.1 kg, launch 1,217.7 kg, 425 kg xenon, 45.6 kg hydrazine, Delta II 7925H, Mars flyby, US$446 million). https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-043A (accessed 2026-11-14)
4. M. Rayman (Dawn chief engineer), *Dawn Journal: 11 Years in Space*, The Planetary Society, 19 Oct 2018 (25,700 mph, 411 of 425 kg xenon used, 270 L, 2,141 days of thrust). https://www.planetary.org/articles/20181019-dawn-journal-11-years-in-space (accessed 2026-11-14)
5. Johns Hopkins APL, *DART Impactor Spacecraft* (about 60 kg xenon, 50 kg hydrazine). https://dart.jhuapl.edu/Mission/Impactor-Spacecraft.php (accessed 2026-11-14; via search snippet)
