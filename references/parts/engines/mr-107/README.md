---
id: mr-107
name: "MR-107N (Mars lander descent thruster, MR-107 family)"
category: engine
role: in-space
tier: 1
propellants: [hydrazine]
manufacturer: Aerojet (Primex/Olin heritage), now L3Harris Aerojet Rocketdyne
vehicles: ["Phoenix Mars Lander, terminal descent (12 engines)", "InSight Mars lander, terminal descent (12 engines)"]
status: retired (checked 2026-11)
---

# MR-107N

The MR-107 is a family of ~250–300 N hydrazine monopropellant thrusters: the hydrazine flows over a heated catalyst bed, decomposes into hot gas and leaves through a small nozzle. The **MR-107N** variant is the one with Mars heritage: twelve of them, fired in rapid pulses (10 Hz), slowed the Phoenix (2008) and InSight (2018) landers for the last ~40 s before touchdown. No MR-107N data sheet is public, so the engine numbers below come from the NASA landing documents plus the sibling **MR-107S** data sheet (same family, same 52.8 mm body, ~21:1 nozzle).

**Why tier 1:** it is the smallest, cheapest engine in the catalogue (≈1 kg, 0.3 kN, Isp ≈ 230 s); a lander needs a dozen of them, while tier-2 R-4D gives more thrust and Isp (~311 s) at ~4× the mass.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | 1.01 | kg | est. [1] | MR-107N mass n/f; value is the MR-107S/T/V engine+valve(+heaters) mass from the same family. Secondary source gives 0.885 kg for the original MR-107 ⚠ [9] |
| `thrust_sl` | n/a | kN | | vacuum/Mars-atmosphere engine. At Mars ambient (~690 Pa) a Phoenix descent engine gave 321 N at 100 % in the plume study [5] |
| `thrust_vac` | 0.302 | kN | [4] ⚠ | InSight: 302 N (68 lbf) each [4]; Phoenix press kit: ~293 N (65.9 lbf) [3]; Aerojet: "300-Newton" [6] |
| `isp_sl` | n/a | s | | at Mars ambient: 321 N / (0.16 kg/s · g0) = 205 s, derived from [5] (pulsed flight conditions) |
| `isp_vac` | 230 | s | est. [1] | MR-107N n/f; MR-107S data sheet: 225–236 s (steady state); midpoint used |
| `mass_flow` | 0.134 | kg/s | derived | `0.302 kN / (230 · g0)`; the Phoenix plume study used 0.16 kg/s at 321 N ⚠ [5] |
| `mixture_ratio` | n/a | O/F by mass | | monopropellant |
| `cycle` | pressure-fed | — | [3] | catalytic hydrazine decomposition; pulse-width modulated (10 Hz, ~55 ms pulses) for throttling and attitude [5] |
| `chamber_pressure` | 1.24 | MPa | [5] | maximum chamber pressure during Phoenix descent pulses; MR-107S sheet: 0.4–1.4 MPa [1] |
| `expansion_ratio` | 20.7 | — | [5] ⚠ | Phoenix descent engine nozzle (exit 0.00318 m², throat 1.53×10⁻⁴ m²); MR-107S sheet: 21.5:1 [1] |
| `throttle_min` | n/a | % | | not throttled by valve: thrust is set by pulse duty cycle; steady-state thrust follows feed pressure (85–360 N on MR-107S) [1] |
| `gimbal_range` | none | ° | [3] | fixed; Phoenix steers by pulsing engines on opposite sides |
| `restarts` | 30300 | count | [1] | qualified total pulses, MR-107S data sheet (2008) |
| `burn_time_max` | 100 | s | [1] | MR-107S steady-state firing at 236 N; 41 s at 360 N. Real Mars use: ~40 s of pulsing [3] |
| `total_impulse` | 0.338 | MN·s | [1] ⚠ | MR-107S qualified 337,620 N·s (2008/2020 sheets); the 2025 L3Harris sheet lists 731,585 N·s for MR-107S [2] |
| `power_electric` | 52.0 | W | derived [1] | valve 34.8 W max (only while firing) + catalyst-bed heater 13.2 W + valve heater 4.0 W (pre-heat before use), all at 28 V, MR-107S/T/V sheet |
| `ignition` | catalyst bed | — | [1] | S-405 / LCH-202 catalyst, pre-heated by the bed heater |
| `reusable` | no | — | | single mission (lander stays on Mars) |
| `cost_unit` | n/f | USD (year) | | not published |
| `twr` | 30.5 | — | derived | `302 N / (1.01 kg · g0)` |
| `height` | 0.220 | m | est. [1] | MR-107S straight engine: 158.75 mm from mount to nozzle exit + 61.18 mm valve end above the mount; secondary source: 21.8 cm [9] |
| `diameter_max` | 0.064 | m | derived [5] | nozzle exit `√(4 · 0.00318 / π)` = 63.6 mm; MR-107S sheet: 64.5 mm [1] |
| `first_flight` | 2008 | year | [3] | first successful Mars use (Phoenix landing 25 May 2008). Mars Polar Lander (lost 1999) is reported to have used MR-107N ⚠ (secondary only); MR-107 family first flew 1990 ⚠ [9] |
| `flights` | 2 | count | [3][4] | successful Mars landings (Phoenix, InSight), 12 engines each |

## 2. Vehicle and stage data

Data for orbital and mass calculations of the vehicle(s) where this part flies. One column per vehicle/stage if more than one.

| Key | Phoenix | InSight | Unit | Source | Note |
|---|---|---|---|---|---|
| `vehicle` | Phoenix Mars Lander | InSight Mars lander | — | [3][4] | both Lockheed Martin landers on the same design |
| `stage` | lander descent propulsion | lander descent propulsion | — | [3][4] | same hydrazine tanks also feed the cruise TCM and RCS thrusters |
| `parts_per_stage` | 12 | 12 | count | [3][4] | plus 4 TCM + 4 RCS thrusters (20 thrusters in all) |
| `stage_mass_dry` | 343 | 358 | kg | derived [3] / [4] ⚠ | Phoenix: 410 kg lander − 67 kg fuel. InSight: "lander about 358 kg" listed next to 67 kg of propellant and pressurant; unclear if the lander figure includes propellant ⚠ |
| `stage_propellant_mass` | 67 | 67 | kg | [3][4] | InSight figure includes pressurant |
| `stage_burn_time` | ~40 | ~45 | s | [3][4] | from lander separation to touchdown |
| `stage_delta_v` | 402 | 387 | m/s | derived | `230 · g0 · ln(m0/mf)`, Phoenix 410→343 kg, InSight 425→358 kg; upper bound, since some hydrazine is spent in cruise |
| `vehicle_liftoff_mass` | 231126 | n/f | kg | [3] | Delta II 7925 fully fuelled (Phoenix); Atlas V 401 for InSight |
| `vehicle_height` | n/f | n/f | m | | |
| `vehicle_diameter` | n/f | n/f | m | | |
| `payload_leo` | n/a | n/a | kg | | |
| `payload_gto` | n/a | n/a | kg | | |
| `payload_mars` | 664 | 694 | kg | [3][4] | whole spacecraft at launch (cruise stage + aeroshell + lander) |
| `cost_launch` | n/f | n/f | USD (year) | | |
| `mars_heritage` | landed 2008 | landed 2018 | — | [3][4] | all US Mars landers used Aerojet propulsion [6] |

## 3. Geometry

Real dimensions the 3D model is built from. All in metres. Measured values carry a source; values scaled from a photo say which photo and which known dimension they were scaled from (`est.`).

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Mount flange to nozzle exit | 0.159 | [1] | MR-107S drawing, 158.75 mm |
| Valve end above mount | 0.061 | [1] | MR-107S drawing, 61.18 mm |
| Catalyst-bed / chamber body diameter | 0.053 | [1] | 52.83 mm |
| Valve end diameter | 0.035 | [1] | 1.395 in (drawing label misprinted as "3.54 mm") |
| Nozzle exit diameter | 0.064 | [5][1] | 63.6 mm derived from exit area; 64.5 mm on MR-107S drawing |
| Throat diameter | 0.014 | derived [5] | `√(4 · 1.53×10⁻⁴ / π)` |
| Nozzle length (throat to exit) | 0.070 | est. | scaled from the MR-107S drawing with the 158.75 mm length; secondary source says 4.72 cm ⚠ [9] |

## 4. Low-poly model

Instructions for whoever (person or AI) generates the model. Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

A small straight "pencil" thruster, about the size of a drinks can plus a cone. From the top: a narrow valve/feed stub (Ø35 mm) that sits above the mount inside the lander; a thin mounting plate; a polished stainless cylinder (Ø53 mm, ~70 mm long) that holds the catalyst bed; a short taper to a tiny throat; then a plain conical-to-slightly-belled nozzle that opens to Ø64 mm. No visible plumbing except the single feed tube on top and a heater wire bundle. On the landers (`in-context-1.jpg`) the engines sit in clusters of two under the deck, nozzles pointing down and slightly outward; the 12 engines form six pairs around the lander rim.

### 4.2 Node hierarchy

```text
Mr107                         origin: mount interface (top of the mounting plate)
├─ Attach_Top                 (0, 0, 0)
├─ Mr107_Steel / _Metal       fixed engine, no Gimbal node
└─ FX_Exhaust                 (0, -0.159, 0), rotation [180, 0, 0], preset exhaust_mono
```

### 4.3 Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to the part origin. Rotations in degrees (X, Y, Z). Materials from the parts palette.

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Mr107 | cylinder | r 0.0175, h 0.061 (valve stub) | (0, 0.0305, 0) | (0,0,0) | Metal | 8 |
| 2 | Mr107 | box | 0.075, 0.004, 0.075 (mount plate) | (0, -0.002, 0) | (0,0,0) | Metal | — |
| 3 | Mr107 | lathe | profile `Body` (chamber + nozzle) | (0, 0, 0) | (0,0,0) | Steel | 8 |
| 4 | Mr107 | cylinder | r 0.004, h 0.05 (feed tube, bent up) | (0.02, 0.035, 0) | (0,0,20) | Metal | 5 |

### 4.4 Revolved profiles

```text
Body: (0.0264, -0.004) (0.0264, -0.075) (0.012, -0.085) (0.007, -0.090) (0.012, -0.105) (0.022, -0.130) (0.032, -0.159)
```

### 4.5 Simplify

- Drop heater wires, thermal standoffs, bolts and the pressure-transducer port.
- Keep the step from the Ø53 mm body to the narrow throat: it is the only feature that reads at distance.
- For a 12-engine lander, build one engine and instance it (pairs 0.08 m apart).

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 200 |
| Meshes | ≤ 2 |
| Height / diameter | 0.220 m overall (0.159 below the mount) / 0.064 m, ±2% |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| in-context-1.jpg | in-context | InSight lander on its legs at Lockheed Martin; the descent-engine pairs are the small nozzles under the deck edge, between the legs. Take placement and scale vs. the 1.5 m deck | https://images.nasa.gov/details/PIA22572 | Lockheed Martin (NASA) | Public domain (NASA) |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://www.researchgate.net/figure/A-Pair-of-MR-107N-Thrusters-Photo-Courtesy-of-Primex-Aerospace-Company_fig5_232617757 — a pair of MR-107N thrusters (Primex photo): best close-up of the real variant.
- Aerojet MR-107S/T/V data-sheet drawings (2008, in [1] archive copy) — dimensioned side views used in section 3.

## 6. Gaps and cautions

- No MR-107N data sheet found: mass, Isp, total impulse, power and dimensions are taken from the MR-107S sibling (`est.`). Phoenix press kit says 293 N, InSight 302 N, Aerojet "300 N" ⚠.
- MR-107N is not in the 2020 or 2025 Aerojet/L3Harris catalogues (MR-107S/T/U/V are): status "retired" is inferred from that absence.
- MRO's six 170 N and MAVEN's main thrusters were not checked against the MR-107 family; do not list them as MR-107N heritage without a source.
- Only one free image of the installed engines; no free close-up of an MR-107N.

## 7. Sources

1. Aerojet, *MR-107S 275 N / MR-107T 110 N / MR-107V 220 N Rocket Engine Assembly data sheets* (rev. 2008), in *Monopropellant Data Sheets*, and *In-Space Propulsion Data Sheets* (4/8/2020). Archive copies: https://web.archive.org/web/20131001235849/http://www.rocket.com/files/aerojet/documents/Capabilities/PDFs/Monopropellant%20Data%20Sheets.pdf and https://web.archive.org/web/20221105032748/https://www.rocket.com/sites/default/files/documents/In-Space%20Data%20Sheets%204.8.20.pdf (accessed 2026-11-14)
2. L3Harris, *Monopropellant Rocket Engines* spec sheet L30612, 10/2025. https://web.archive.org/web/20260328072706/https://www.l3harris.com/sites/default/files/2025-10/l3harris-ar-monopropellant-rocket-engines.pdf (accessed 2026-11-14)
3. NASA/JPL, *Phoenix Mars Lander Landing Press Kit*, May 2008 (Quick Facts; "Propulsion"). https://www.jpl.nasa.gov/news/press_kits/phoenix-landing.pdf (accessed 2026-11-14)
4. NASA/JPL, *Mars InSight Landing Press Kit*, Nov 2018 (Quick Facts; spacecraft propulsion). https://www.jpl.nasa.gov/news/press_kits/insight/landing/download/mars_insight_landing_presskit.pdf (accessed 2026-11-14)
5. Mehta, M. et al., *Underexpanded Supersonic Plume Surface Interactions: Applications for Spacecraft Landings on Planetary Bodies*, NASA MSFC, 2011, Tables 1–2 (Phoenix REM full-scale). https://ntrs.nasa.gov/citations/20110014613 (accessed 2026-11-14)
6. Wilson, A.; Brewster, G.; Dawson, M.; Christofferson, S. (Aerojet), *History and Status of Aerojet Mars Lander Propulsion Activities*, IAC-10.C4.1.7 abstract, 2010. http://iafastro.directory/iac/paper/id/8273/abstract-pdf/IAC-10.C4.1.7.brief.pdf (accessed 2026-11-14)
7. NASA Image and Video Library, PIA22572. https://images.nasa.gov/details/PIA22572 (accessed 2026-11-14)
8. Prince, J. L.; Desai, P. N.; Queen, E. M., *Mars Phoenix Entry, Descent, and Landing Simulation Design and Modeling Analysis*, AIAA, 2008 (TCM/RCS thruster values). https://ntrs.nasa.gov/citations/20080033126 (accessed 2026-11-14)
9. Wade, M., *Encyclopedia Astronautica: MR-107* (secondary, used only for ⚠ cross-checks). http://www.astronautix.com/m/mr-107.html (accessed 2026-11-14)
