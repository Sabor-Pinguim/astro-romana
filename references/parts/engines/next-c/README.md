---
id: next-c
name: "NEXT-C (NASA Evolutionary Xenon Thruster – Commercial), flight unit SN001"
category: engine
role: electric
tier: 3
propellants: [xenon]
manufacturer: Aerojet Rocketdyne (thruster) and ZIN Technologies (PPU), for NASA Glenn; now L3Harris
vehicles: ["DART (1 thruster, technology demonstration)"]
status: operational (checked 2026-11)
---

# NEXT-C

NEXT-C is the 7 kW successor of NSTAR: a gridded xenon ion thruster with a larger 36 cm ion beam, throttleable about 10:1 from 25 to 235 mN, with Isp up to ~4,200 s and up to 70 % efficiency. Its ground life-test engine ran 50,000 h and processed 900 kg of xenon (35 MN·s), more than any other electric thruster. The only flight unit flew on NASA's DART asteroid-impact mission: it fired for just over two hours on 18 Dec 2021 at ~3.5 kW, performed within 1 % of ground data, and was then switched off after a spacecraft power-electronics anomaly; DART reached Dimorphos on chemical propulsion (impact 26 Sept 2022).

**Why tier 3:** highest Isp, thrust and life of the electric engines, but needs up to 7.3 kW and a ~35 kg PPU, and has flown only once.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 14 | kg | [1][2] ⚠ | "< 14 kg" with harness [2], "approximately 14 kg" [1]; requirement < 15.0 kg [4]; NEXT prototype PM1: 13.5 kg [5]. PPU, gimbal not included (see Notes) |
| `thrust_sl` | n/a | kN | | vacuum only |
| `thrust_vac` | 0.000235 | kN | [1] | 235 mN at full power (TL40); range 25–235 mN |
| `isp_sl` | n/a | s | | |
| `isp_vac` | 4155 | s | [1] | at full power; range 1,395–4,155 s in [1]; maximum 4,220 s [2] |
| `mass_flow` | 0.00000577 | kg/s | derived | `0.235 N / (4155 · g0)`; NEXT throttle table: 5.76 mg/s total at full power [5] |
| `mixture_ratio` | n/a | O/F by mass | | |
| `cycle` | gridded ion | — | [1] | two-grid, ring-cusp discharge; 36 cm beam |
| `chamber_pressure` | n/a | MPa | | |
| `expansion_ratio` | n/a | — | | |
| `throttle_min` | 11 | % | derived [1] | 25 / 235 mN |
| `gimbal_range` | 19 | ° | [5] ⚠ | NEXT project gimbal: ±19° / ±17° on its two axes; whether DART's thruster was gimballed was not found |
| `restarts` | n/f | count | | |
| `burn_time_max` | 7200 | s | [6] | in flight: "just over two hours" on DART. Ground: 50,000 h long-duration test [1] |
| `total_impulse` | 35 | MN·s | [1] ⚠ | demonstrated in the 50,000 h / 900 kg ground test; conservative flight rating ≥ 700 kg xenon at TL40 [1]; 22.5 MN·s / 600 kg "test-demonstrated mission life" in [4] |
| `power_electric` | 7330 | W | [1] | PPU input at full power; range 640–7,330 W PPU input (thruster input 0.5–6.9 kW) [1][4]. DART used ~3.5 kW (TL28) [1] |
| `ignition` | hollow cathode | — | [1] | discharge and neutraliser cathodes with heaters |
| `reusable` | n/a | — | | |
| `cost_unit` | n/f | USD (year) | | |
| `twr` | 0.00171 | — | derived | `0.235 N / (14 kg · g0)` |
| `height` | 0.435 | m | [5] ⚠ | NEXT PM1 envelope 43.5 cm; NEXT-C "roughly 17 in" (0.43 m) [1] |
| `diameter_max` | 0.58 | m | [5] ⚠ | NEXT PM1 envelope Ø58.0 cm (mask Ø52.5 cm); NEXT-C "roughly 25 in" (0.64 m) [1] |
| `first_flight` | 2021 | year | [6] | DART launched 24 Nov 2021; first firing 18 Dec 2021 |
| `flights` | 1 | count | [6] | DART only; no further flight announced (checked 2026-11) |

**Thruster efficiency η** (for `P_in = F · Isp · g0 / (2η)`): 0.70 at full power, 0.66 at DART's point, 0.32 at minimum [1]. Check at full power: 0.235 · 4155 · 9.80665 / (2 · 0.70) = 6,840 W ≈ 6.86 kW thruster input [5].

**Selected throttle points** ([1] Table 1; beam V / PPU input kW / η / thrust mN / Isp s): 1800/7.33/0.70/235/4155 · 1396/5.84/0.69/208/3683 · **1021/3.48/0.66/137/3137 (DART)** · 679/2.55/0.60/111/2565 · 275/0.64/0.32/25/1395.

**PPU (not in `mass_dry`):** < 35 kg [1] (< 36 kg [2], requirement < 36.8 kg [4], NEXT EM PPU 33.9 kg [5]) ⚠; efficiency > 90 % at most levels, up to 95 % at full power [1]; input 80–160 V unregulated plus 28 V housekeeping (< 40 W) [4]; NEXT PPU envelope 42 × 53 × 14 cm [5]. NEXT gimbal 6 kg; propellant management HPA 1.9 kg + LPA 3.1 kg (2.9 W + 4.8 W) [5].

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | DART (Double Asteroid Redirection Test) | — | [7] | Johns Hopkins APL for NASA |
| `stage` | spacecraft ion propulsion (demonstration) | — | [7] | main propulsion was hydrazine (12 small thrusters) [8] |
| `parts_per_stage` | 1 | count | [1] | |
| `stage_mass_dry` | 500 | kg | derived [7] | 610 kg at launch − 50 kg hydrazine − 60 kg xenon |
| `stage_propellant_mass` | 60 | kg | [7] | xenon |
| `stage_burn_time` | 7200 | s | [6] | actually used in flight |
| `stage_delta_v` | 3490 | m/s | derived | potential, not flown: `3137 · g0 · ln(560/500)` at DART's throttle point, with 560 kg = 500 kg dry + 60 kg xenon |
| `vehicle_liftoff_mass` | n/f | kg | | Falcon 9 (launched from Vandenberg, 24 Nov 2021) [8] |
| `vehicle_height` | n/f | m | | |
| `vehicle_diameter` | n/f | m | | |
| `payload_leo` | n/a | kg | | |
| `payload_gto` | n/a | kg | | |
| `payload_mars` | n/a | kg | | |
| `cost_launch` | n/f | USD (year) | | |
| `mars_heritage` | none | — | | the NEXT-C status paper lists Mars sample return-type vehicles as a candidate use [1] |

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Overall height (envelope) | 0.435 | [5] | NEXT PM1 drawing; body without neutraliser 0.376 m |
| Outer envelope diameter | 0.58 | [5] | includes the three mounts |
| Front mask (plasma screen) diameter | 0.525 | [5] | dark ring in `front-1.jpg` |
| Ion beam / grid diameter | 0.36 / 0.415 | [1] / est. | visible grid disc in `front-1.jpg` is 368/465 of the 0.525 m mask |
| Body depth behind the mask | 0.30 | est. | `three-quarter-1.jpg`, against the 0.525 m mask |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A large, shallow black drum. `front-1.jpg` shows the exhaust face: a matte black ring (the plasma screen/mask) around a big flat light-grey grid disc; two small brackets sit on the ring left and right, and a small neutraliser cathode block sits at the top edge. `three-quarter-1.jpg` shows the drum from an angle: a short black cylinder with a rounded front edge, the neutraliser on its rim, and the body narrowing behind it toward three mounting feet. It is wider than tall, like a large cooking pot.

### 4.2 Node hierarchy

```text
NextC                         origin: mount interface (centre of the 3-point rear mounting plane)
├─ Attach_Top                 (0, 0, 0)
├─ Gimbal                     pivot at (0, 0, 0), 2-axis (optional, see gimbal_range); meshes go here
│  └─ Gimbal_HullBlack / _Titanium / _Steel
└─ FX_Exhaust                 child of Gimbal, (0, -0.376, 0), rotation [180, 0, 0], preset exhaust_ion
```

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Gimbal | lathe | profile `Body` (rear cone + black drum + mask) | (0, 0, 0) | (0,0,0) | HullBlack | 16 |
| 2 | Gimbal | cylinder | r 0.2075, h 0.006 (grid disc) | (0, -0.373, 0) | (0,0,0) | Titanium | 16 |
| 3 | Gimbal | box | 0.06, 0.06, 0.06 (neutraliser) | (0, -0.35, 0.28) | (0,0,0) | Steel | — |
| 4 | Gimbal | box | 0.05, 0.08, 0.05 ×3 (mounting feet at 120°) | (0.20, -0.04, 0) etc. | (0,0,0) | Aluminum | — |

### 4.4 Revolved profiles

```text
Body: (0.15, 0.0) (0.15, -0.04) (0.24, -0.08) (0.262, -0.12) (0.262, -0.34) (0.25, -0.37) (0.21, -0.376)
```

### 4.5 Simplify

- No grid holes and no magnet rings; flat grey disc for the optics.
- Drop harnesses, the three 1/8" propellant tubes, the gold/silver MLI seen around the test shroud (the shroud is test equipment, not the thruster).
- Keep the neutraliser block on the rim.

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 600 |
| Meshes | ≤ 4 |
| Height / diameter | 0.435 / 0.58 m (envelope), ±2% |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| front-1.jpg | front | NEXT-C flight thruster in the GRC vacuum facility, seen face-on inside the (test) thermal shroud: black mask, grey grid, neutraliser at top | https://images.nasa.gov/details/GRC-2020-C-00802 | NASA/GRC/Bridget Caswell | Public domain (NASA) |
| three-quarter-1.jpg | three-quarter | NEXT-C in its test stand from an oblique angle: drum depth, rounded front edge, neutraliser | https://images.nasa.gov/details/GRC-2019-C-09797 | NASA/GRC/Bridget Caswell | Public domain (NASA) |

**Linked only** (useful but not freely licensed, so not downloaded):

- none (Commons "NASA NEXT Ion thruster ... NEXT LDT" image is public domain; not downloaded because Commons rate-limited the session).

## 6. Gaps and cautions

- Envelope dimensions are for the NEXT prototype (PM1); NEXT-C "roughly 25 × 17 in" differs ⚠. Mass and PPU mass vary slightly between sources (all "<" limits).
- DART flight: only ~2 h of operation, then suspended after an EMI-related anomaly in the spacecraft power electronics (not a thruster failure) [6][9].
- No second NEXT-C flight found as of 2026-11; a higher-thrust "Advanced NEXT" derivative is in ground testing [9].
- Status "operational" means flight-qualified hardware exists; there is no thruster in operation.

## 7. Sources

1. Fisher, J. et al., *NEXT-C Flight Ion System Status*, AIAA 2020-3604 (Table 1, thruster and PPU sections). https://ntrs.nasa.gov/citations/20205005689 (accessed 2026-11-14)
2. NASA Glenn, *NASA's Evolutionary Xenon Thruster–Commercial (NEXT-C)* fact sheet, Nov 2021. https://ntrs.nasa.gov/citations/20210024276 (accessed 2026-11-14)
3. Monheiser, J. et al., *A Summary of the NEXT-C Flight Thruster Proto-flight Testing*, AIAA 2021. https://ntrs.nasa.gov/citations/20210018563 (accessed 2026-11-14)
4. NASA GRC, *NEXT-C New Frontiers Guidebook*, rev. 5, Dec 2016. https://newfrontiers.larc.nasa.gov/NF4/PDF_FILES/NEXT-C_New_Frontiers_Guidebook_20161230_REV5.pdf (accessed 2026-11-14)
5. NASA, *NEXT Ion Propulsion System Information Summary* (New Frontiers library), Apr 2009, App. A data sheets. https://newfrontiers.larc.nasa.gov/NF3/PDF_FILES/43NEXT_NF3refdocument_May09.pdf (accessed 2026-11-14)
6. John, J. W.; Atchison, J.; O'Shaughnessy, D.; Adams, E. (JHU/APL), *Solar Electric Propulsion Options for Future Planetary Defense Missions based on DART Flight Experience*, 8th IAA Planetary Defense Conference, 2023. https://airdrive.eventsair.com/eventsairwesteuprod/production-atpi-public/c0ed740401b24cdaa4122a37bc03f4e3 (accessed 2026-11-14)
7. JHU/APL, *DART Impactor Spacecraft*. https://dart.jhuapl.edu/Mission/Impactor-Spacecraft.php (accessed 2026-11-14)
8. NASA/APL, *DART Press Kit*, 2022. https://dart.jhuapl.edu/News-and-Resources/files/DART-press-kit-web-FINAL.pdf (accessed 2026-11-14)
9. Thomas, R. E.; Raju, R. S.; Bontempo, J. J., *Characterizing Electrical Arc Behavior in Ion Engines*, AIAA SciTech 2025 (DART anomaly summary). https://ntrs.nasa.gov/citations/20240014086 (accessed 2026-11-14)
