# Rocket parts: real references for the game

Real rocket parts the players can install when they build the rocket (stage 1 "base", optional stages 2 and 3, and the cabin; see [docs/resources/space-mission-game-transcricao-organizada.md](../../docs/resources/space-mission-game-transcricao-organizada.md) §5). Each part has:

- real **game data** (mass, thrust, Isp, propellant, power, cost) with sources, for Δv, mass and energy calculations;
- the **vehicle and stage data** of the rocket it flies on;
- **photos** from several angles;
- **low-poly 3D instructions** detailed enough for another person or AI model to build it.

First batch: engines and propellant tanks.

## Folder layout

```text
references/parts/
  parts.md                 this index: tiers, catalogue, conventions, formulas
  _template.md             the standard every part README follows
  engines/<id>/README.md   one folder per engine, with its photos
  tanks/<id>/README.md     one folder per tank, with its photos
```

To add a part: copy `_template.md` to `<engines|tanks>/<id>/README.md`, fill every row (unknown = `n/f`), save the photos next to it, and add a row to the catalogue below.

## Tiers

Every part belongs to one of three tiers. The tier says how big, capable and expensive the real hardware is, so the build screen can show a progression with real trade-offs.

| Tier | Idea | Where the parts come from |
|---|---|---|
| **1. Small** | Cheap and light, but low thrust. Big rockets need many of them, or only small payloads fit. | Small launchers (Rocket Lab Electron) and small spacecraft (hydrazine thrusters). |
| **2. Workhorse** | The proven, mid-cost hardware that launches most science missions today. | Falcon 9, Atlas V with Centaur (launched Curiosity, Perseverance, InSight, MRO), Dawn's ion propulsion. |
| **3. Heavy** | Highest thrust, efficiency or capacity, at the highest cost and complexity. | Starship/Super Heavy, SLS, Orion, NEXT-C. |

Inside a tier the parts still trade against each other, for example high thrust with kerosene versus high efficiency (Isp) with hydrogen, which needs much bigger, colder tanks.

## Catalogue

Roles: **booster** = first stage, sea level; **upper-stage** = vacuum-optimised; **in-space** = spacecraft engine for orbit insertion, landing and corrections; **electric** = needs electrical power. Tanks: **stage** = launch-vehicle tanks; **in-space** = spacecraft tanks.

### Engines

Summary only: each README has the full table, the sources and the ⚠ notes. "SL / vac" = sea level / vacuum. Power is the electrical input, where it matters.

| Tier | Part | Role | Propellants | Thrust (kN) | Isp (s) | Mass (kg) | Power (kW) | Flies on |
|---|---|---|---|---|---|---|---|---|
| 1 | [Rutherford](engines/rutherford/README.md) | booster | LOX / RP-1 | 24.9 ⚠ SL | 311 ⚠ SL | 35 | ≈ 111 ⚠ (electric pumps) | Electron stage 1 (9) |
| 1 | [Rutherford Vacuum](engines/rutherford-vacuum/README.md) | upper-stage | LOX / RP-1 | 25.8 | 343 | 35 ⚠ | ≈ 74 ⚠ (electric pumps) | Electron stage 2 (1) |
| 1 | [MR-107N](engines/mr-107/README.md) | in-space | hydrazine | 0.30 ⚠ | 230 est. | 1.01 est. | 0.052 | Phoenix, InSight landers (12 each) |
| 2 | [Merlin 1D](engines/merlin-1d/README.md) | booster | LOX / RP-1 | 845 / 914 | 282 / 311 ⚠ | 470 ⚠ | n/f | Falcon 9 stage 1 (9) |
| 2 | [Merlin 1D Vacuum](engines/merlin-1d-vacuum/README.md) | upper-stage | LOX / RP-1 | 981 | 348 ⚠ | n/f | n/f | Falcon 9 stage 2 (1) |
| 2 | [RL10C-1-1](engines/rl10/README.md) | upper-stage | LOX / LH2 | 106 | 453.8 ⚠ | 188 ⚠ | n/f | Centaur III on Atlas V (1), Centaur V on Vulcan (2) |
| 2 | [R-4D-11](engines/r-4d/README.md) | in-space | MMH / NTO | 0.49 | 311 | 3.76 | n/f | Orion ESM auxiliary thrusters (8) |
| 2 | [NSTAR](engines/nstar/README.md) | electric | xenon | 0.021–0.093 | 1,979–3,127 | 8.9 ⚠ | 0.58–2.57 | Deep Space 1, Dawn (3) |
| 3 | [Raptor 2](engines/raptor/README.md) | booster | LOX / CH4 | 2,256 / 2,391 | 327 / 347 ⚠ | 1,630 ⚠ | n/f | Super Heavy (33), Starship (3) |
| 3 | [RS-25D](engines/rs-25/README.md) | booster | LOX / LH2 | 1,859 ⚠ / 2,279 | 369 ⚠ / 452.3 | 3,526 ⚠ | n/f | SLS core stage (4) |
| 3 | [Raptor Vacuum](engines/raptor-vacuum/README.md) | upper-stage | LOX / CH4 | 2,697 ⚠ | 380 ⚠ | n/f | n/f | Starship (3) |
| 3 | [AJ10-190 (OMS-E)](engines/aj10-190/README.md) | in-space | MMH / NTO | 26.7 | 316 | 118 | 0.125 | Orion ESM main engine (1) |
| 3 | [NEXT-C](engines/next-c/README.md) | electric | xenon | 0.025–0.235 | 1,395–4,155 | 14 | 0.64–7.33 | DART (1) |

### Tanks

| Tier | Part | Role | Propellants | Propellant (kg) | Dry mass (kg) | Diameter (m) | Flies on |
|---|---|---|---|---|---|---|---|
| 1 | [Electron stage 1 tank](tanks/electron-stage-1-tank/README.md) | stage | LOX / RP-1 | 9,250 ⚠ | 950 ⚠ (whole stage) | 1.2 | Electron |
| 1 | [Hydrazine tank (NG 80397-1)](tanks/hydrazine-tank/README.md) | in-space | hydrazine | 30 (derived) | 4.5 | 0.42 | Phoenix, InSight |
| 2 | [Falcon 9 stage 1 tank](tanks/falcon-9-stage-1-tank/README.md) | stage | LOX / RP-1 | 410,900 ⚠ | 22,200 ⚠ | 3.66 | Falcon 9 |
| 2 | [Centaur III tank](tanks/centaur-iii-tank/README.md) | stage | LOX / LH2 | 20,830 | 2,075 (derived ⚠) | 3.05 | Atlas V |
| 2 | [Dawn xenon tank](tanks/dawn-xenon-tank/README.md) | in-space | xenon | 425 | 21.3 | 0.91 | Dawn |
| 3 | [SLS core stage tanks](tanks/sls-core-stage-tanks/README.md) | stage | LOX / LH2 | 987,500 ⚠ | 85,300 | 8.4 | SLS |
| 3 | [Starship tanks](tanks/starship-tanks/README.md) | stage | LOX / CH4 | ≈ 1,600,000 ⚠ (ship) | n/f | 9 | Starship |
| 3 | [Orion ESM tanks](tanks/orion-esm-tanks/README.md) | in-space | MMH / MON-3 | 8,602 ⚠ (4 tanks) | n/f | 1.15 (each) | Orion |

### Status notes (checked 2026-11)

- **Raptor:** Raptor 2 is retired; Raptor 3 has flown since May 2026 and is the engine of Starship V3. The README keeps Raptor 2 numbers (the best documented) and adds Raptor 3 where SpaceX published them.
- **RL10:** the current Atlas V Centaur flies the RL10C-1-1. The engine maker is now Rocketdyne (sold by L3Harris in Aug 2026), and the old data sheets are offline, so several values are ⚠.
- **No free photos** for Rutherford Vacuum and Starship tanks: their READMEs list linked photos only. Rocket Lab photos in NASA's library are credited to Rocket Lab, so only the ones Wikimedia Commons lists as public domain were copied.

## Data rules

Same marks as [references/experiments/](../experiments/):

- **⚠** = sources diverge: both values are in the Note column.
- **n/f** = not found. The game may use its own value, marked `game-balance` in the `.tres`.
- **derived** = calculated from other rows (the formula is in the Note column).
- **est.** = estimated by us, for example a length scaled from a photo using a known diameter.
- Costs are in US dollars **of the year stated**.
- Status (operational, retired) was checked on the date in each README's front matter.

## 3D model conventions

Rocket parts follow the same pipeline rules as the avatars ([AGENTS.md](../../AGENTS.md) §5): the model is generated by code, geometry is non-indexed with flat normals, there are no textures, and every material comes from a shared palette.

### Axes, scale and origin

- **Units:** metres, real size (1:1).
- **Up:** +Y is the direction the vehicle flies. Engines push toward +Y; the exhaust leaves toward −Y.
- **Front:** the side facing +Z is the one in the `side-1` photo, unless the README says otherwise.
- **Origin:**

  | Part | Origin | So that |
  |---|---|---|
  | Engine | centre of the mounting interface (top of the thrust mount / gimbal block) | the engine hangs below y = 0 |
  | Tank | centre of the bottom interface (aft skirt or lowest point) | the tank stands on y = 0 |

  Stacking is then "put the engine origin on the tank's `Attach_Bottom`".

### Nodes

| Node | Parts | What it is |
|---|---|---|
| `Attach_Top` | all | empty node on the upper interface |
| `Attach_Bottom` | tanks | empty node on the lower interface (at the origin) |
| `Gimbal` | engines that gimbal | empty pivot at the gimbal point; the moving meshes are its children |
| `FX_Exhaust` | engines | empty node at the nozzle exit centre, rotation `[180, 0, 0]` so its local +Y points down (FX anchors emit along local +Y, as in the avatars); `userData.fx` = exhaust preset below |

Meshes are merged per material per node and named `<Node>_<Material>`, as in the avatars.

### Budget

| Rule | Engine | Tank |
|---|---|---|
| Triangles | ≤ 1,500 | ≤ 800 |
| Meshes | ≤ 10 | ≤ 8 |
| Segments, main revolved bodies (nozzle, barrel, domes) | 12–16 | 12–16 |
| Segments, chambers, pumps, small tanks | 8 | 8 |
| Segments, pipes | 5–6 | 5–6 |

Parts that touch use the same segment count so their edges line up. A Super Heavy carries 33 engines, so the engine budget matters.

### Simplify

- Keep what reads at 10–20 m from the camera: nozzle bell, chamber, turbopumps, the main ducts, skirts, domes, stringers if they shape the silhouette.
- Merge plumbing into 2–4 pipes. Drop bolts, wiring, sensors and small lines.
- No text, logos, flags or agency insignia on the model, even if the photo shows them.

### Parts palette (proposal)

To be added to `tools/modeling/lib/palette.mjs` when the parts generator is built. The base palette keys `Metal` (pipes, generic metal) and `Strap` (cables, dark rubber) can also be used.

| Key | Colour | Metallic | Roughness | Use |
|---|---|---|---|---|
| `Hull` | `#E9E9E4` | 0 | 0.6 | white painted skin |
| `HullBlack` | `#1E2024` | 0 | 0.55 | black paint, carbon composite |
| `Foam` | `#C8742F` | 0 | 0.95 | orange spray-on foam insulation |
| `Steel` | `#B9BEC4` | 0.9 | 0.3 | stainless steel |
| `Aluminum` | `#C4C8CC` | 0.8 | 0.45 | bare aluminium / Al-Li |
| `Titanium` | `#8F9196` | 0.85 | 0.4 | spacecraft tanks, small engines |
| `Copper` | `#A8683A` | 0.9 | 0.35 | copper-alloy chambers |
| `NozzleDark` | `#3A3633` | 0.6 | 0.6 | regeneratively cooled tube nozzles, niobium or carbon extensions |
| `FoilGold` | `#D4A72C` | 1 | 0.3 | gold multilayer insulation (MLI) |
| `FoilSilver` | `#C9CDD1` | 1 | 0.3 | silver MLI / aluminised blankets |

### Exhaust presets (proposal)

For `lib/fx-presets.mjs` and the Godot `GPUParticles3D`. Visual guidance only, not data shown to the player.

| Preset | Propellants | Look |
|---|---|---|
| `exhaust_kerolox` | LOX / RP-1 | bright yellow-orange, opaque, some dark soot at sea level |
| `exhaust_methalox` | LOX / CH4 | blue-violet core, translucent, shock diamonds |
| `exhaust_hydrolox` | LOX / LH2 | almost transparent with faint shock diamonds |
| `exhaust_hypergolic` | MMH / NTO | faint, translucent orange; almost invisible in vacuum |
| `exhaust_mono` | hydrazine | almost invisible, short |
| `exhaust_ion` | xenon | steady blue glow, narrow beam |

## Formulas for the game

`g0 = 9.80665 m/s²` (standard gravity, used in every Isp formula). Mars surface gravity: 3.71 m/s².

| Quantity | Formula | Notes |
|---|---|---|
| Mass flow of one engine | `ṁ = F / (Isp · g0)` | F in N, Isp in s, ṁ in kg/s |
| Burn time of a stage | `t = m_prop / (n · ṁ)` | n engines at full thrust |
| Stage Δv (Tsiolkovsky) | `Δv = Isp · g0 · ln(m0 / mf)` | m0 = stage + everything above it, fuelled; mf = same, with the stage's propellant spent |
| Mixed engines on one stage | `Isp_eff = ΣF / Σ(F / Isp)` | |
| Thrust-to-weight ratio | `TWR = n · F / (m · g)` | needs > 1 to lift off; g = 9.80665 (Earth) or 3.71 (Mars) |
| Electric thruster input power | `P_in = F · Isp · g0 / (2 · η)` | η = thruster efficiency (in each electric engine's README) |
| Oxidiser / fuel split | `m_ox = m_prop · MR / (1 + MR)`, `m_fuel = m_prop / (1 + MR)` | MR = mixture ratio O/F by mass |
| Tank volume | `V = π r² L_cyl + 2 · (2/3) π r² h_dome` | ellipsoidal domes of height h; sphere: `4/3 π r³` |
| Propellant in a tank | `m = ρ · V · (1 − ullage)` | ρ from the density table; ullage of 2–5% is a game value unless a README gives it |
| Propellant fraction | `m_prop / (m_prop + m_dry)` | higher is better |
| Δv to leave a circular orbit | `Δv = √(C3 + 2μ/r) − √(μ/r)` | C3 = v∞² (km²/s²) of the escape trajectory; r = orbit radius |
| Δv to capture into a circular orbit | `Δv = √(v∞² + 2μ/r) − √(μ/r)` | v∞ = arrival speed relative to the planet |

### Propellant densities

| Propellant | Density (kg/m³) | Condition | Source |
|---|---|---|---|
| Liquid oxygen (LOX) | 1,141.6 | saturated liquid, 90.1 K, 1 atm | [D1] |
| Liquid hydrogen (LH2) | 70.87 | saturated liquid, 20.35 K, 1 atm | [D1] |
| Liquid methane (CH4) | 422.4 | saturated liquid, 111.7 K, 1 atm | [D1] |
| RP-1 (kerosene) | 798–814 | specific gravity 0.799–0.815 at 60 °F (15.6 °C) | [D2] |
| Hydrazine (N2H4) | 1,004 | 300 K | [D3] |
| MMH | 874 | 25 °C | [D4] |
| NTO (N2O4) | 1,447 / 1,435 | 20 °C / 25 °C, saturated liquid, no NO | [D5] derived |
| MON-3 (NTO + 3% NO) | 1,426 | 25 °C | [D5] derived |
| Xenon (stored supercritical) | 1,237 / 1,780 / 1,991 | 298 K at 7 / 10 / 15 MPa | [D1] |

- Cryogenic densities change with temperature: real stages often load **densified** (subcooled) LOX and RP-1, which is denser than these values. Each tank README says what its vehicle loads.
- NTO and MON-3 come from the Rocketdyne correlation (Eq. 2a of [D5]): ρ (g/cm³) = 1.4901 − 1.80169×10⁻³ T − 2.71835×10⁻⁵ T² + 5.093×10⁻⁷ T³ − 3.614×10⁻⁹ T⁴ − 2.9839×10⁻³ NO%, with T in °C.

### Orbital constants

| Constant | Value | Source |
|---|---|---|
| μ Earth (GM) | 398,600.4355 km³/s² | [D6] |
| μ Mars system (GM) | 42,828.3758 km³/s² | [D6] |
| μ Sun (GM) | 1.32712440041×10¹¹ km³/s² | [D6] |
| Earth equatorial radius | 6,378.137 km | [D7] |
| Mars mean radius | 3,389.5 km | [D7] |
| Mars surface gravity | 3.71 m/s² | [D7] |
| Mars escape velocity | 5.03 km/s | [D7] |
| Semi-major axis, Earth / Mars | 1.00000261 / 1.52371034 au (1 au = 149,597,870.7 km) | [D8] |

### Δv budget for a Mars trip

Idealised values, **derived** with the formulas above for circular, coplanar orbits (Hohmann transfer). Real launch windows need more or less; the game can use these as a baseline.

| Leg | Δv (km/s) | How |
|---|---|---|
| Earth surface → low Earth orbit | 9–10 ⚠ | 7.78 km/s orbital speed at 200 km plus 1.5–2 km/s of gravity, drag and steering losses; secondary sources only, so treat the loss part as a game value |
| Low Earth orbit (200 km) → Mars transfer (TMI) | 3.6 | Hohmann: v∞ = 2.95 km/s, C3 = 8.7 km²/s²; a C3 of 15 km²/s² needs 3.9 km/s |
| Earth → Mars cruise | 0 (plus small corrections) | Hohmann transfer takes about 259 days |
| Capture into 400 km circular Mars orbit | 2.1 | arrival v∞ = 2.65 km/s; capturing into a loose ellipse first costs less, and aerobraking or aerocapture can replace most of it |
| Mars surface → 400 km Mars orbit | ≥ 3.7 | ideal Hohmann from the surface, before gravity losses and without Mars's rotation |

### Density and constant sources

- [D1] NIST Chemistry WebBook, *Thermophysical Properties of Fluid Systems* (oxygen, hydrogen, methane, xenon). https://webbook.nist.gov/chemistry/fluid/ (accessed 2026-11-14)
- [D2] US Air Force, *MIL-DTL-25576E, Propellant, Rocket Grade Kerosene*, Table I. https://everyspec.com/MIL-SPECS/MIL-SPECS-MIL-P/MIL-P-25576C_16074/ (accessed 2026-11-14) — a later revision F (2023) exists; its limits were not checked.
- [D3] Marshall, W. M.; Deans, M. C., *Recommended Figures of Merit for Green Monopropellants*, NASA Glenn, 2013, Table 1. https://ntrs.nasa.gov/citations/20140009573 (accessed 2026-11-14)
- [D4] National Research Council, *Acute Exposure Guideline Levels for Selected Airborne Chemicals*, Vol. 1, chapter on methylhydrazine (physical properties table). https://www.nap.edu/read/9786/chapter/12 (accessed 2026-11-14)
- [D5] Mitchell, R. C.; Melvold, R. W.; Quaglino, J., *Engineering Properties of Rocket Propellants*, Rocketdyne, AFRPL-TR-73-105, 1973, Eq. 2a and Fig. 3. https://rocketprops.readthedocs.io/en/latest/_static/Rocketdyne_N2O4.pdf (accessed 2026-11-14)
- [D6] JPL Solar System Dynamics, *Astrodynamic Parameters* (DE440 values). https://ssd.jpl.nasa.gov/astro_par.html (accessed 2026-11-14)
- [D7] JPL Solar System Dynamics, *Planetary Physical Parameters*. https://ssd.jpl.nasa.gov/planets/phys_par.html (accessed 2026-11-14)
- [D8] JPL Solar System Dynamics, *Approximate Positions of the Planets*, Table 1. https://ssd.jpl.nasa.gov/planets/approx_pos.html (accessed 2026-11-14)
