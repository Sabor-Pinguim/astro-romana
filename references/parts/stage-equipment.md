# Middle-Stage Equipment: Real References for Payload Bays (`stage-equipment.md`)

Real spacecraft equipment, scientific instruments, power units, communications hardware, and EDL (Entry, Descent, and Landing) systems designed to be installed inside the rocket's **1 to 7 optional middle stages** (`internal_stage_cutaway.glb`).

Whereas the engines and propellant tanks in [parts.md](parts.md) configure the **Main Booster** (Stage 1), these middle-stage equipment modules define **what the spacecraft actually carries and can do** in orbit, during transit, during landing, and on the Martian surface (see [docs/resources/space-mission-game-transcricao-organizada.md](../../docs/resources/space-mission-game-transcricao-organizada.md) §5 and [docs/minigames.md](../../docs/minigames.md)).

- **Companion sources:** [mars-experiments.md](../experiments/mars-experiments.md) and [experiments.md](../experiments/experiments.md) (IDs such as `EN9`, `GE7`, `PH2`, `E1`, `P10` point directly there).
- **PT-BR gameplay guide:** [docs/resources/equipamentos-estagios.md](../../docs/resources/equipamentos-estagios.md).

---

## 1. Data & Verification Conventions

Same markers as [parts.md](parts.md) and [mars-experiments.md](../experiments/mars-experiments.md):

- **⚠** = sources diverge, or value comes from a secondary source / search summary (must be re-verified against primary NASA/ESA sheets before appearing as a fixed "real fact" in UI copy).
- **n/f** = not found in public sources; use a balanced gameplay value marked `game-balance` in `.tres` data files.
- **derived** = arithmetic calculated here from sourced numbers (formula noted).
- **est.** = engineering estimate scaled or inferred from reference hardware (basis noted).
- **Status tags** (`OPERATING`, `FLOWN`, `READY`, `SPACE-PROVEN`, `EARTH-TESTED`, `IN DEVELOPMENT`) reflect real-world status as of **2026-11** in [mars-experiments.md](../experiments/mars-experiments.md).

---

## 2. Catalogue Overview (16 Modules · 4 per Crew Role)

Every module belongs to one of the four playable crew roles (**Helena**, **Lucas**, **Oscar**, **Maya**) and a capability tier (**Tier 1 = Small / Baseline**, **Tier 2 = Workhorse**, **Tier 3 = Heavy / Advanced**).

| ID | Module Name | Role | Tier | Real Reference Hardware | Mass (kg) | Power (W) | Data Impact | Unlocks Minigame(s) | Counter-Play / Event Hook | Ref |
|---|---|---|---|---|---|---|---|---|---|---|
| `truss-ingenuity` | Mars Helicopter Scout Bay | Helena | 2 | Ingenuity / SkyFall / Mars Chopper | 1.8 (`EN9`) / ~36 ⚠ (`EN9c`) | ~350 flight | via rover relay | `H-S1` *(MVP)* | Reveals ice/targets; *Featureless terrain* crash (`E1`) | `EN9`, `EN9b`, `E1` |
| `edl-trn-medli2` | TRN Vision & Heatshield Sensor Suite | Helena | 2 | Mars 2020 LVS (TRN) + MEDLI2 + DSAC | ~0.88 camera ⚠ + 28 sensors ⚠ | < 10 camera ⚠ | low | `H-S2`, `H-O1` | Prevents *Schiaparelli* sensor crash (`E16`) & *MCO* unit mismatch (`E15`) | `EN4`, `EN6`, `E16`, `E20` |
| `edl-aspire-loftid` | Supersonic Parachute & Inflatable Shield | Helena | 3 | ASPIRE 21.5 m Chute + LOFTID HIAD | ~82 chute (`EN5`); ~1,100 HIAD test ⚠ | 0 (pyro/gas) | — | Landing mass limit ↑ | Enables heavy/crewed payloads to survive Mars EDL | `EN5`, `EN7` |
| `attitude-reaction-wheels` | 4-Wheel Reaction Control & Star Trackers | Helena | 1 | Kepler / MRO 4-Wheel Bus | ~2–5 per wheel ⚠ | ~10–30 per wheel ⚠ | — | `H-O2` (120° roll) | Redundancy vs *Reaction wheel failure* (`E18`, `E8`, `G4`) | `E18`, `E8`, `G4`, `PH7` |
| `power-rosa-solar` | Roll-Out Solar Array Canister Pair | Lucas | 2 | ISS ROSA / iROSA + DART Array | ~36–43 light config ⚠ | generates ~2,800 on Mars (`derived` from DART 6.6 kW) | — | `L-O1` *(MVP)* | Clean vs dusty (`600–700 W` → `200–300 W` on InSight); *Stuck retraction* (`E5` ⚠) | `EN3a`, `E5`, `E10`, `G6`, `G9` |
| `power-mmrtg-kilopower` | Nuclear Power & Li-ion Peak Buffer | Lucas | 3 | MMRTG + Li-ion Battery Pack / Kilopower | 45 MMRTG + 26.5 batt; ~150–400 KRUSTY ⚠ | +110 continuous / 900 peak; 1–10 kW Kilopower | — | Sustains heavy loads | Immune to dust storms & Martian night; prevents brownout during `L-S1` | `EN3b`, `EN3c`, `EN3d`, `E6` |
| `isru-moxie-rodwell` | Oxygen ISRU & Ice-Water Extractor | Lucas | 2 | MOXIE (Perseverance) + Rodwell | 17.1 MOXIE (+ ~210 Rodwell `EN2`) | −300 (MOXIE) | low | `L-S1` *(MVP)* | Produces O₂ (`122 g` proven, `12 g/h` peak); water extraction needs `PH6`/`PH7` map | `EN1`, `EN2`, `E2` |
| `drill-corer-cryo` | Subsurface Corer & Active Cryocooler | Lucas | 2 | Curiosity/ExoMars 2 m Drill + CRISM/AMS Thermal | 33–45 turret (`GE6`) + thermal loop | −44 to −47 (`CRISM`) | — | `L-S2`, `L-O2` | Spare bits vs *HP3 treacherous soil* (`G9`); EVA fix vs *Cooling pump failure* (`P8`) | `GE6`, `GE8`, `G9`, `P8` |
| `comm-dsoc-laser` | Deep Space Optical Laser Transceiver | Oscar | 3 | DSOC (Psyche) | < 29 ⚠ | ~76 (< 100) ⚠ | 8–267 Mbps | `O-O1` *(MVP)* | Clears massive `HiRISE`/`SHARAD` buffers; Earth clouds interrupt beam | `EN13`, `E11` |
| `comm-electra-marco` | UHF Proximity Relay & Twin MarCO CubeSats | Oscar | 2 | Electra UHF + MarCO-A/B 6U CubeSats | ~6.5 Electra ⚠ + twin 6U | ~20–50 Electra ⚠ | up to 2 Mbps / 8 kbps live EDL | `O-S1` *(MVP)* | Mitigates *Lost orbiter* (`MAVEN` −0.9 Gb/day, `AT4`) & *Antenna stuck* (`CD1`) | `EN11`, `EN14`, `E12`, `AT4` |
| `comm-rise-xband` | X-Band Precision Doppler Transponder | Oscar | 1 | RISE (InSight) | 7.3 | −78 (≤1 h/day) | DSN tracking | `O-S2` | Measures Mars liquid core (`1,835 ± 55 km`) over ~900 sols | `PH3` |
| `data-rad750-ssr` | Flight Computer & Solid-State Recorder | Oscar | 2 | RAD750 SBC + Kepler/Galileo Compression | n/f (CPU ~10 W ⚠) | ~10 CPU ⚠ | expands SSR & compresses data | `O-O2` | Recovers ~10× science return on low bandwidth (`CD1`); avoids memory overflow (`CD2`) | `A2`, `CD1`, `CD2`, `O-O2` |
| `sci-hirise-sharad` | Orbital Telescope, Radar & Trace-Gas Suite | Maya | 3 | HiRISE + SHARAD + NOMAD/ACS | 65 + 15 + ~29–35 ⚠ | −60 / −10 / −30 to −60 ⚠ | 28 Gb/img + 40–90 Gb/day | `M-O1` *(MVP)*, `M-O2`, `M-O3` | Picks safe landing sites (`H-S2`); locates ice (`EN2`); *Methane conflict* (`BI3`) | `GE7`, `PH7`, `BI3` |
| `sci-pixl-sherloc-supercam` | Astrobiology Turret & Laser Micro-Suite | Maya | 3 | PIXL + SHERLOC + SuperCam | 6.9 + 4.72 + 10.6 (= 22.22 `derived`) | −25 / −48.8 / −17.9 | ~16 + 79.7 + 15.5 Mb/exp | `M-S1` *(MVP)*, `M-S2` | Finds *Cheyava Falls* biosignatures; prevents *Viking* false-positive trap (`B13`) | `GE3`, `BI1`, `GE2`, `B14` |
| `sci-seis-caching` | Seismometer Dome & 43-Tube Sample Carousel | Maya | 2 | SEIS (InSight) + Sample Caching System (ACA) | 29.5 ⚠ SEIS + ~2.45 tubes empty est. ⚠ | ≤ −8.5 (SEIS) | 38 Mb/day (SEIS) | `M-S3`, `M-S4` | Stationary wind-shielded seismic data (`PH2`); stores `M-S1` cores (*MSR risk* `G8`) | `PH2`, `GE6`, `G8`, `G9` |
| `hab-veggie-rad-astrorad` | Hydroponic Chamber & Radiation Shelter Kit | Maya | 2 | Veggie/APH + RAD + AstroRad Vest | ~7.2 Veggie ⚠ + 1.56 RAD + 26/crew vest | −70 to −115 ⚠ + 4.2 RAD | low | `M-S5`, `M-S6` *(crewed)* | Mitigates *Solar storm* (40–60% dose reduction ⚠, `BI11`) & *Water stress* (`B4`) | `BI7`, `PH1`, `BI11`, `P10`, `B4` |

---

## 3. Cutaway Stage Integration & 3D Model Conventions

### 3.1 Target Bay Geometry (`internal_stage_cutaway.glb`)
> The rocket builder now uses the generated [`stage-module`](structures/stage-module/README.md) (`parts/structures/stage-module.glb`): same Ø 1.00 × 1.00 m bay and Ø 0.91 × 0.84 m cavity, with the mounting point `Attach_Bay` at y = 0.1 m. The dimensions below still apply.

Unlike the external 1:1 propulsion parts in [parts.md](parts.md), middle-stage equipment must visibly sit **inside** the modular cutaway bay [`godot/assets/models/rocket/internal_stage_cutaway.glb`](../../godot/assets/models/rocket/internal_stage_cutaway.glb) during drag-and-drop construction:

- **Bay outer dimensions (inspected from GLB):** `1.00 m` diameter (`r = 0.50 m`), `1.00 m` total stage height (`y ∈ [0.00, 1.00] m`).
- **Cutaway opening:** half-shell open toward **`+Z`** so the viewer looks directly into the interior bay along `−Z`.
- **Interior clear cavity:** inner wall radius `r_inner = 0.455 m` (`Ø 0.91 m`); clear vertical height between lower deck flange and upper ring bulkhead is `y ∈ [0.08, 0.92] m` (`0.84 m` total interior height).
- **Safe Equipment Placement Envelope:** every middle-stage equipment GLB should fit cleanly inside a normalized display envelope of **`Ø 0.72 m × 0.76 m`** (`x ∈ [−0.36, +0.36]`, `z ∈ [−0.32, +0.32]`, `y ∈ [0.00, 0.76]`), with its origin at `(0, 0, 0)` on the **bottom mounting plate** (when mounted in a stage whose deck sits at `y_local = 0.08`, the top reaches `y = 0.84 < 0.92` with safe clearance all around).

### 3.2 Structural & Pipeline Rules
Follow [AGENTS.md](../../AGENTS.md) §5 and [parts.md](parts.md#3d-model-conventions):
- **Axes:** `+Y` up, `+Z` front (the primary visual face seen through the cutaway opening).
- **Origin:** center of the bottom mounting deck `(0, 0, 0)`, resting on `y = 0`.
- **Nodes:**
  - `Attach_Top`: empty node at top center of the equipment rack (optional upper bracket).
  - `Attach_Bottom`: empty node at `(0, 0, 0)`.
  - `FX_*` anchors: where applicable (`FX_Antenna` with `signal`, `FX_Sparks` with `sparks`), emitting along local `+Y`.
- **Materials:** ONLY keys present in `BASE` / `createPartsPalette()` in [`tools/modeling/lib/palette.mjs`](../../tools/modeling/lib/palette.mjs): `Hull`, `HullBlack`, `Foam`, `Steel`, `Aluminum`, `Titanium`, `Copper`, `NozzleDark`, `FoilGold`, `FoilSilver`, `Metal`, `Strap`, `Pack`, `Visor`, `VisorGold`, `Lamp`, `LedGreen`, `LedRed`. (Note: if a role-colored indicator band is desired later, expose an optional `roleColor` material rather than assuming avatar-only `Accent`/`Screen` keys inside `createPartsPalette()`.)
- **Budget per equipment module:** **≤ 700 triangles**, **≤ 12 meshes**, non-indexed flat-shaded geometry, no textures. Segments: `8–12` for cylinders/toruses, `6–8` for secondary pods, `5–6` for conduits.

---

## 4. Detailed Module Specifications (Hardware Data & Low-Poly 3D Guides)

---

### A. Helena — Pilot, Navigation, EDL & Aerial Scouts

#### A1. `truss-ingenuity` — Mars Helicopter Scout Bay *(Tier 2)*
- **Real basis:** **Ingenuity** Mars Helicopter (`EN9`, `E1`), **SkyFall** 3-helicopter entry deployment concept (`EN9b`, targets Nov 2028 launch window), and **Mars Chopper** (`EN9c`, 6-rotor heavy concept).
- **Gameplay metrics & sources:**
  - `mass_dry`: **1.8 kg** (Ingenuity, `EN9`/`E1`) | **~36 kg ⚠** (Mars Chopper concept, `EN9c`)
  - `power_electric`: **~350 W** in flight (solar-recharged Li-ion battery, ~90 s flight/sol, `EN9`)
  - `cost_unit`: **$80M** build + **$5M** ops (`E1`, USD 2021-era)
  - `data_rate`: relays via surface rover/lander (`EN9`); SkyFall carries ground-penetrating radar, cameras, and radiation sensor (`EN9b`)
  - `status`: Ingenuity `FLOWN` (72 flights, 17.0 km, ended Jan 2024); SkyFall `IN DEVELOPMENT`
- **Minigames & Events:**
  - Unlocks **`H-S1` ("Batedor" — MVP)** to scout craters, dunes, ice (`SkyFall`), and science targets ahead of Maya's rover.
  - Triggers/suffers *"Navigation lost over featureless terrain"* (`E1`, Flight 6 & final Flight 72 crash on smooth sand) if flown aggressively over low-texture terrain. Requires Oscar's relay (`O-S1`).
- **Low-Poly 3D Instructions (`TrussIngenuity`):**
  - **Silhouette:** Square white/aluminum stowage cradle at the bottom (`w = 0.44, d = 0.44, h = 0.06 m`, `Aluminum`) holding the iconic little coaxial helicopter inside diagonal `Metal` truss struts (`x = ±0.20, z = ±0.20`). Center fuselage cube (`0.16 × 0.14 × 0.16 m`, `FoilGold`), top thin solar wing panel (`0.42 × 0.02 × 0.14 m`, `Pack` with `Visor` frame), vertical mast (`Steel`, `h = 0.28 m`) with two stacked coaxial 2-blade/4-blade rotor bars (`0.68 × 0.01 × 0.04 m`, `HullBlack`), and 4 splayed landing legs (`Titanium`, tilted 35° outward). No NASA decals.

#### A2. `edl-trn-medli2` — TRN Vision & Heatshield Sensor Suite *(Tier 2)*
- **Real basis:** Mars 2020 **Terrain Relative Navigation / Lander Vision System (`LCAM`)** (`EN4`), **MEDLI2** heatshield sensor suite (`EN6`), and **Deep Space Atomic Clock (`DSAC`)** (`E20`).
- **Gameplay metrics & sources:**
  - `mass_dry`: `LCAM` camera **~0.88 kg ⚠** (`880 g` w/ optics & sunshade, `< 425 g` bare CBE ⚠, MSSS/Mars 2020) + `MEDLI2` 28 sensors (`n/f`, `EN6`) + `DSAC` atomic clock cube (`n/f`, `E20` ~25 cm cube); module total `~18 kg est.` including avionics chassis
  - `power_electric`: `LCAM` **< 10 W ⚠** (`MSSS`), full Vision Compute + clock rack `~35 W est.`
  - `performance`: Perseverance TRN landed **~5 m** from target (`≤ 8.53 m` post-flight vs `60 m` req., `600 m` max hazard divert, `EN4`); `DSAC` drift **< 4 ns over 20+ days** (`10×` better than GPS clocks, `E20`)
  - `status`: `FLOWN` (`EN4`, `EN6`) / `SPACE-PROVEN` (`E20`)
- **Minigames & Events:**
  - Unlocks **`H-S2` ("Ache o lugar seguro")** autonomous hazard-avoidance landing and strengthens **`H-O1` ("Aerofrenagem")** using real-time heatshield pressure/thermal feedback (`MEDLI2`).
  - Prevents catastrophic *"Sensor overload / software trusts bad data"* (*Schiaparelli* crash, `E16`) and *"Unit mismatch / trajectory error"* (*Mars Climate Orbiter*, `E15`).
- **Low-Poly 3D Instructions (`EdlTrnMedli2`):**
  - **Silhouette:** Horizontal avionics shelf (`0.56 × 0.08 × 0.44 m`, `Aluminum`) mounted on short corner dampeners (`Strap`). On the front-right (`+X, +Z`), a gold-foil rectangular atomic clock cube (`0.25 × 0.25 × 0.25 m`, `FoilGold`) with glowing green lock LED (`LedGreen`). On the front-left (`−X, +Z`), a tilted downward-looking wide-FOV `LCAM` optical housing (`HullBlack` chamfered box `0.12 × 0.10 × 0.16 m` with `Visor` lens glass cone pointing down 30°). Across the rear, a curved `Copper` thermal-sensor manifold pipe with 6 cylindrical thermocouple nodules (`Titanium`).

#### A3. `edl-aspire-loftid` — Supersonic Parachute & Inflatable Shield Pack *(Tier 3)*
- **Real basis:** Mars 2020 **21.5 m Supersonic Parachute & Mortar (`ASPIRE`-tested)** (`EN5`) + NASA **LOFTID (`HIAD` Inflatable Heat Shield)** (`EN7`).
- **Gameplay metrics & sources:**
  - `mass_dry`: **~82 kg** (`180 lb`) canopy (`EN5`); full LOFTID test entry vehicle **~1,100 kg ⚠** (Earth flight test scaled 6 m, `EN7` notes Mars crew/heavy needs `≥ 20 m ⚠`)
  - `performance`: Chute opens at **~11 km altitude, 1,512 km/h** (Mach ~1.5), survived **~70,000 lbf** (~31,750 kgf / 85% above Mars load, `EN5`); LOFTID slowed 6 m test article from **>18,000 mph to <80 mph**, peak heat shield temp **~1,300 °C** on Mars entry (`EN7`)
  - `power_electric`: `0 W` continuous (pyrotechnic mortar + nitrogen inflation bottles)
  - `status`: Parachute `FLOWN` (`EN5`); LOFTID `EARTH-TESTED` (`EN7`, Nov 2022)
- **Minigames & Events:**
  - Directly raises the **maximum landing mass threshold** during Phase 4/6 EDL customization (`docs/resources/space-mission-game-transcricao-organizada.md` §6.2 & §12). Without it, rockets loaded with 4–7 heavy middle stages suffer landing structural failure or overshoot.
- **Low-Poly 3D Instructions (`EdlAspireLoftid`):**
  - **Silhouette:** Unmistakable parachute mortar & stowed orange aeroshell stack. Central vertical cylindrical aluminum mortar cannon (`r = 0.16 m, h = 0.64 m`, `Aluminum`) topped with an octagonal ejection lid (`Steel`) and bridle lines (`Strap`). Wrapped concentrically around the base of the mortar (`y = 0.08–0.32 m`) is a folded segmented inflatable torus (`major r = 0.25 m, tube r = 0.08 m`, `Foam` — orange TPS blanket look) strapped down by 4 radial restraint bands (`HullBlack`) and flanked by two small vertical compressed-N₂ inflation COPV bottles (`r = 0.05 m, h = 0.36 m`, `Titanium`).

#### A4. `attitude-reaction-wheels` — 4-Wheel Reaction Control & Star Trackers *(Tier 1)*
- **Real basis:** **Kepler** / **Dawn** / **MRO** 4-wheel momentum control assembly (3 active + 1 skewed backup Goodrich/Ball Torquewheel class, `E18`, `E8`, `G4`) + optical star trackers.
- **Gameplay metrics & sources:**
  - `mass_dry`: **~2–5 kg per wheel ⚠** (typical aerospace reaction wheel class, up to 4,000 RPM; `~16 kg total ⚠` with chassis & dual star trackers)
  - `power_electric`: **~10–30 W per wheel ⚠** (torque maneuvers)
  - `status`: `OPERATING` / `FLOWN`
- **Minigames & Events:**
  - Unlocks **`H-O2` ("Virar a nave" — 120° precision roll for SHARAD orbital radar)** without wasting scarce hydrazine attitude fuel.
  - Mitigates the *"Reaction wheel failure"* random event (*Kepler* lost 2 wheels → `K2` solar-pressure recovery `E18`; *Dawn* `E8`; *Hayabusa* `G4`), preventing early mission termination when 1 wheel fails.
- **Low-Poly 3D Instructions (`AttitudeReactionWheels`):**
  - **Silhouette:** Diagonal tetrahedral titanium pyramid mount (`r = 0.28 m, h = 0.16 m`, `Titanium`) centered at `(0, 0.20, 0)`. Mounted on its 4 canted faces are four compact pancake flywheel housings (`r = 0.11 m, h = 0.07 m`, `HullBlack` outer band + `Steel` spinner cap). Rising from the front corners are two small flared conical optical star-tracker baffles pointing forward-up at 35° (`Aluminum` tubes with `FoilGold` heat-shield collars and dark `Visor` apertures).

---

### B. Lucas — Systems Engineer (Power, Cryogenics, ISRU & Drilling)

#### B1. `power-rosa-solar` — Roll-Out Solar Array Canister Pair *(Tier 2)*
- **Real basis:** **ROSA / iROSA** flexible Roll-Out Solar Array (`E5`, tested on ISS 2017 & 2021–23; flown on **DART** `E10` + InSight/Phoenix solar reference `EN3a`).
- **Gameplay metrics & sources:**
  - `mass_dry`: **~36–43 kg ⚠** for small standalone ROSA wings (Diamond/Opal class, up to **521 kg ⚠** high-power arrays; `>20%` lighter and `4×` smaller stowed volume than rigid panels, `E5`)
  - `power_generated`: DART generated **6.6 kW** at 1 AU (`E10`); on Mars, sunlight is **586 W/m² (43% of Earth)** (`mars-experiments.md` §1), yielding **~2.84 kW clean `derived`** (`6.6 kW × 0.43`), degraded by dust like InSight (`600–700 W` clear → `200–300 W` dusty, `EN3a`)
  - `status`: `SPACE-PROVEN` (ISS, DART) / Mars solar `FLOWN`
- **Minigames & Events:**
  - Unlocks **`L-O1` ("Desenrolar" — MVP)** array deployment timing minigame in Earth/Mars orbit.
  - Triggers/interacts with *"Solar array won't retract"* (*ROSA* 2017 ISS jettison `E5` ⚠) and *"Global dust storm / dusty panels"* (*Opportunity* `G6`, *InSight* `G9`, *Zhurong*).
- **Low-Poly 3D Instructions (`PowerRosaSolar`):**
  - **Silhouette:** Compact stowed roll-out solar canister assembly sized for a cutaway bay. Central spine truss (`0.12 × 0.68 × 0.14 m`, `Aluminum`) with a cylindrical central deployment actuator (`Copper` rings, `Steel` hubs). Hinged horizontally on the left and right (`x = ±0.18 m`) are two large dark flexible solar blanket cylinders (`r = 0.10 m, h = 0.56 m`, `Pack` body with fine longitudinal `FoilGold` busbar end-caps) and twin thin `HullBlack` carbon-composite strain booms ready to spring outward.

#### B2. `power-mmrtg-kilopower` — Nuclear Power & Li-ion Buffer *(Tier 3)*
- **Real basis:** Perseverance/Curiosity **MMRTG** (`EN3b`, `E6`) paired with **Perseverance dual Li-ion batteries** (`EN3d`) and/or **Kilopower (`KRUSTY`)** compact fission reactor (`EN3c`).
- **Gameplay metrics & sources:**
  - `mass_dry`: MMRTG **45 kg** (`4.8 kg PuO₂`, `EN3b`) + Batteries **26.5 kg** (`2 × 43 Ah`, `EN3d`) = **71.5 kg `derived`**; Kilopower 1 kW_e flight system **~150–400 kg ⚠** (fuel core 32.2 kg U-Mo, `11 × 25 cm` core ⚠, `EN3c`)
  - `power_generated`: MMRTG **~110 W** continuous electric + **~2,000 W** thermal ⚠ (decays a few %/year) buffered to **~900 W peaks** via Li-ion batteries (`EN3b`, `EN3d`); Kilopower **1–10 kW electric** continuous for 10+ years (`EN3c`)
  - `cost_unit`: Kilopower prototype program `< $20M ⚠` (`EN3c`)
  - `status`: MMRTG + Li-ion `OPERATING`; Kilopower `EARTH-TESTED` (`IN DEVELOPMENT`)
- **Minigames & Events:**
  - Completely **immune to Martian dust storms and night** (`EN3`), preventing the mission-ending power drop that killed InSight and Opportunity.
  - Essential to run Lucas's **300 W `MOXIE` (`L-S1`)** and Maya's **`SHERLOC` (48.8 W `M-S1`)** simultaneously without starving crew heaters or comms.
- **Low-Poly 3D Instructions (`PowerMmrtgKilopower`):**
  - **Silhouette:** Unmistakable white finned RTG cylinder (`r = 0.12 m, h = 0.58 m`, `Hull` with 8 thin vertical cooling fins `Titanium` radiating outward like a star cross-section and top golden terminal end-cap `FoilGold`) mounted vertically on the right (`x = +0.13 m`). Beside it on the left (`x = −0.16 m`), a compact thermal-gold Li-ion battery vault (`0.22 × 0.34 × 0.24 m`, `FoilGold` with `Strap` mounting brackets and `LedGreen` charge bar) plus thick `Copper` power bus conduits linking both.

#### B3. `isru-moxie-rodwell` — Oxygen ISRU & Ice-Water Extractor *(Tier 2)*
- **Real basis:** Perseverance **MOXIE** Solid-Oxide Electrolysis reactor (`EN1`, `E2`) + **Rodwell** subsurface ice-melting probe concept (`EN2`, MIT / NASA RASC-AL).
- **Gameplay metrics & sources:**
  - `mass_dry`: MOXIE **17.1 kg** (`EN1`, `E2`); Rodwell full subsurface extraction kit **~210 kg system mass** (`EN2`)
  - `power_electric`: MOXIE **300 W** (~1 kWh/run ⚠, operates at **800 °C**, highest power draw of all rover instruments, `EN1`)
  - `output`: MOXIE produced **122 g of O₂** over 16 runs (`≥98%` purity, peak **12 g/h**, `E2`/`EN1`); Rodwell prototype yielded **24.3 L of water in 12 h** (peak `4.3 L/h`, `EN2`, requires ice located first by `PH6`, `PH7`, or `SkyFall`)
  - `status`: MOXIE `FLOWN`; Rodwell `EARTH-TESTED`
- **Minigames & Events:**
  - Unlocks **`L-S1` ("Fazer oxigênio" — MVP)** thermal-band maintenance minigame (`800 °C` zone).
  - Feeds life-support O₂ and return-ascent oxidizer goals; sparks **energy negotiation** with Maya because 300 W drains batteries fast.
- **Low-Poly 3D Instructions (`IsruMoxieRodwell`):**
  - **Silhouette:** Gold thermal-blanketed cube reactor (`0.32 × 0.30 × 0.28 m`, `FoilGold`) sitting at `y = 0.04–0.34 m`, featuring a flared cylindrical HEPA CO₂ dust-intake scroll compressor on top (`r = 0.09 m, h = 0.14 m`, `Aluminum`), glowing warm exhaust vent grille (`Copper`/`Lamp`), and two spherical silver pressure accumulator tanks (`r = 0.10 m`, `Titanium`) connected by steel manifolds (`Steel`) on the side rack.

#### B4. `drill-corer-cryo` — Subsurface Corer & Active Cryocooler *(Tier 2)*
- **Real basis:** **Curiosity / ExoMars `Rosalind Franklin` 2 m Drill** (`GE6`) + **InSight `HP3` "mole"** failure lessons (`G9`) + **CRISM** Stirling Cryocooler (`GE8`) / **AMS-02** cooling pump EVA repair (`P8`).
- **Gameplay metrics & sources:**
  - `mass_dry`: Rover arm drill turret **33–45 kg** (`GE6`); `CRISM` cooled spectrometer package **32.9 kg** (`GE8`)
  - `power_electric`: `CRISM` cryocooler draw **44–47 W** (`GE8`); drill peak draw `n/f` (`~100 W est.`)
  - `limits`: Curiosity drill reaches `5 cm` (`1.6 cm` wide, **2 spare bits**, `GE6`); Rosalind Franklin reaches **2 m deep** at `~50 cm/sol` (`GE6`). `CRISM` cryocoolers wore out after ~11 years (`2017`), retiring the instrument (`2023`, `GE8`).
  - `status`: Curiosity `OPERATING`; ExoMars 2 m Drill `READY`; CRISM `FLOWN`
- **Minigames & Events:**
  - Unlocks **`L-S2` ("Furar sem quebrar")** percussion rhythm minigame (producing rock powder/cores for Maya's `M-S4` and `CheMin`/`MOMA`) and **`L-O2` ("Criogenia")** orbital detector cooling minigame.
  - Counters *"Unknown soil — tool fails"* (*InSight HP3 mole* stalled at ~37 cm, `G9`) and *"Cooling pump failure"* (*AMS-02* orbital EVA fix, `P8`).
- **Low-Poly 3D Instructions (`DrillCorerCryo`):**
  - **Silhouette:** Tall vertical structural guide rail tower (`0.22 × 0.72 × 0.20 m`, `Steel`) carrying a sliding rotary-percussive drill carriage (`Aluminum`), spiral fluted auger bit pointing down into a dust shroud (`NozzleDark`), and a clip rack holding 2 visible spare drill bits (`Steel`). Mounted alongside on the left half of the bay is the active cryocooler loop: copper radiator coil tubing (`Copper`), dual Stirling compressor pistons (`Titanium`), and an `FX_Sparks` anchor (`preset: "sparks"`) on the maintenance service panel (`Strap`).

---

### C. Oscar — Communications & Data Engineer

#### C1. `comm-dsoc-laser` — Deep Space Optical Laser Transceiver *(Tier 3)*
- **Real basis:** **DSOC** Flight Laser Transceiver aboard NASA's *Psyche* spacecraft (`EN13`, `E11`).
- **Gameplay metrics & sources:**
  - `mass_dry`: **< 29 kg ⚠** (`~25–28 kg` configuration, secondary sources)
  - `power_electric`: **~76 W (< 100 W) ⚠** (`4 W` average 1550 nm transmitter laser, `EN13`/`E11`)
  - `data_rate`: **267 Mbps** at 31 M km, **25 Mbps** at 226 M km, **~8 Mbps** at ~400 M km (`E11`); **13.6 Tbit** returned in 65 passes (`E11`, `10–100×` faster than RF radio)
  - `status`: `SPACE-PROVEN` (2023–25)
- **Minigames & Events:**
  - Unlocks **`O-O1` ("Feixe estável" — MVP)** precision aiming minigame to flush Maya's massive orbital buffers (`HiRISE` 28 Gb/image, `SHARAD` 40–90 Gb/day).
  - Subject to Earth weather (*clouds over Palomar/Table Mountain ground station block the laser*, `EN13`) and distance attenuation (`54.6 to 401.4 M km`).
- **Low-Poly 3D Instructions (`CommDsocLaser`):**
  - **Silhouette:** Compact 2-axis optical telescope gimbal (`y = 0.08–0.64 m`). Stiff U-shaped yoke (`Titanium`) pivoting a `22 cm` aperture (`r = 0.13 m, h = 0.34 m`) gold-wrapped silicon-carbide telescope barrel (`HullBlack` sunshade cone + `FoilGold` thermal body + glowing cyan/amber optical aperture disk `Lamp`). Mounted at the base on vibration-isolation struts (`Strap`) is the photon-counting laser electronics chassis (`0.28 × 0.14 × 0.22 m`, `Aluminum`).

#### C2. `comm-electra-marco` — UHF Proximity Relay & Twin MarCO CubeSats *(Tier 2)*
- **Real basis:** JPL **Electra** UHF proximity transceiver (`EN11`, `MRO`/`MAVEN`/Perseverance `Electra-Lite`) + **MarCO-A/B** 6U interplanetary CubeSats (`EN14`, `E12`).
- **Gameplay metrics & sources:**
  - `mass_dry`: Orbiter Electra transceiver **~5.2 kg** (**~6.5 kg** single-string w/ antenna & coax ⚠); twin **6U CubeSats** (`37 × 24 × 12 cm` each stowed, `13.5 kg` each `E12` → `~33.5 kg total ⚠`)
  - `power_electric`: **~20–50 W ⚠** (Electra RX/TX modes)
  - `data_rate`: Electra **up to 2 Mbps** rover↔orbiter (`>1 Gbit/sol` over 4–5 passes/sol, `128–256 kbps` older Odyssey, `EN11`); MarCO **8 kbps** real-time bent-pipe relay during EDL (`E12`)
  - `cost_unit`: **$18.5M** for the MarCO pair (`E12`)
  - `status`: Electra `OPERATING`; MarCO `FLOWN` (2018 InSight EDL)
- **Minigames & Events:**
  - Unlocks **`O-S1` ("Janela de contato" — MVP)** packet-scheduling minigame during brief orbiter overflight windows.
  - Direct counter-play for the real **"Lost orbiter"** event (**MAVEN lost Dec 2025**, which cut fleet relay capacity by **897.5 Mb/day**, leaving ~3.2 Gb/day total across TGO/MRO/Odyssey, `mars-experiments.md` §2.2), and secures real-time EDL telemetry (`E12`).
- **Low-Poly 3D Instructions (`CommElectraMarco`):**
  - **Silhouette:** Center stacked 4-slice Electra SDR aluminum radio brick (`0.24 × 0.20 × 0.18 m`, `Aluminum` with `Copper` RF connectors) topped by a canted quadrifilar helical UHF monopole antenna (`Steel` spire reaching `y = 0.68 m`) carrying an `FX_Antenna` node (`preset: "signal"`). Flanking left and right (`x = ±0.22 m`) are two upright spring-loaded 6U CubeSat canisters (`0.14 × 0.37 × 0.24 m`, `HullBlack`) with folded gold reflectarray antenna panels (`FoilGold`) latched to their outer doors.

#### C3. `comm-rise-xband` — X-Band Precision Doppler Transponder *(Tier 1)*
- **Real basis:** **RISE** Rotation and Interior Structure Experiment (`InSight`, `PH3`).
- **Gameplay metrics & sources:**
  - `mass_dry`: **7.3 kg** (`PH3`)
  - `power_electric`: **78 W** for `≤ 1 h/day` (`PH3`)
  - `cost_unit`: `n/f` (Tier 1 lightweight shared comms/science instrument)
  - `science_output`: detects nutation/spin changes to **< 10 cm** via Earth DSN Doppler tracking; proved Mars has a **1,835 ± 55 km liquid core** and spin acceleration of **~4 milliarcseconds/year** after ~900 sols (`PH3`)
  - `status`: `FLOWN` (2018–22)
- **Minigames & Events:**
  - Unlocks **`O-S2` ("Sintonizar o Doppler")** frequency-lock minigame during surface operations — requires direct Earth line-of-sight and long mission endurance (~900 sols for full payoff).
- **Low-Poly 3D Instructions (`CommRiseXband`):**
  - **Silhouette:** Low-profile gold-foiled X-band transponder block (`0.24 × 0.14 × 0.20 m`, `FoilGold`) bolted to a dark baseplate (`HullBlack`). Extending upward on curved rectangular waveguide pipes (`Copper`) are **two conical medium-gain horn antennas** canted outward East and West (`±30°`, flare radius `0.09 m`, `Hull` white rim with `Aluminum` inner cone) so the lander maintains DSN lock as Mars rotates.

#### C4. `data-rad750-ssr` — Flight Computer & Solid-State Recorder Array *(Tier 2)*
- **Real basis:** BAE Systems **RAD750** radiation-hardened flight computer + Solid-State Recorder (`SSR`, Perseverance/MRO class) + **Kepler** pixel-masking / **Galileo** onboard compression architecture (`A2`, `CD1`, `CD2`, `O-O2`).
- **Gameplay metrics & sources:**
  - `mass_dry`: `n/f` (`~12 kg game-balance` for shielded avionics vault + flash memory blades)
  - `power_electric`: RAD750 CPU **~5 W (chip) / ~10 W (single-board system) ⚠** (`~30 W est.` with multi-board SSR recorder active)
  - `performance`: `110–200 MHz` PowerPC core, `260–400 DMIPS ⚠`; Kepler returned only selected star pixels (`A2`) and Galileo onboard compression boosted effective science return **~10×** after its high-gain antenna jammed (`CD1`)
  - `status`: `OPERATING` / `SPACE-PROVEN`
- **Minigames & Events:**
  - Unlocks **`O-O2` ("Recorte inteligente")** pixel/ROI selection minigame and expands onboard solid-state storage capacity so high-rate Maya instruments (`HiRISE`, `SHARAD`, `MinION`) don't stall waiting for DSN passes (`CD2`).
  - Critical fallback during *"Antenna stuck"* (`CD1`) or *"Solar conjunction 2–3 week blackout"* (`mars-experiments.md` §1).
- **Low-Poly 3D Instructions (`DataRad750Ssr`):**
  - **Silhouette:** Clean, recognizable spacecraft avionics card cage (`0.38 × 0.34 × 0.26 m`, `HullBlack` outer radiation vault with machined `Aluminum` cooling fins on the top plate). Front face displays 6 vertical removable memory/CPU blades (`Aluminum` faceplates with `Copper` card extractors, a row of telemetry LEDs `LedGreen` / `Lamp`, and a braided orange-black SpaceWire data harness `Strap`/`Foam` looping down to the bay deck).

---

### D. Maya — Chief Scientist & Medical Officer

#### D1. `sci-hirise-sharad` — Orbital Reconnaissance Telescope, Radar & Trace-Gas Suite *(Tier 3)*
- **Real basis:** MRO **HiRISE** high-res camera (`GE7`) + **SHARAD** sounding radar (`PH7`) + ExoMars TGO **NOMAD + ACS** trace-gas spectrometer (`BI3`).
- **Gameplay metrics & sources:**
  - `mass_dry`: HiRISE **65 kg** (`GE7`) + SHARAD **15 kg** (`PH7`) = **80 kg**, plus NOMAD `~29–30 kg ⚠` or ACS `~34.5 kg ⚠` (`BI3` → **~110 kg ⚠** combined tier-3 suite)
  - `power_electric`: HiRISE **60 W** (`GE7`) + SHARAD **10 W transmit** (`PH7`) + NOMAD **~30–40 W ⚠** (`BI3`)
  - `data_rate`: HiRISE **up to 28 Gb/image** (`30 cm/px`, ~78 min at 6 Mbit/s `calc.`, `GE7`); SHARAD **40–90 Gb/day** (`~1 km` ice penetration, `PH7`)
  - `status`: `OPERATING` (MRO & TGO)
- **Minigames & Events:**
  - Unlocks **`M-O1` ("Clique perfeito" — MVP)**, **`M-O2` ("Ler o radargrama")** (synergizes with Helena's 120° roll `H-O2`), and **`M-O3` ("Impressão digital do gás")** at orbital sunrise/sunset (`BI3`).
  - Prerequisite to unlock safe science-rich landing zones (`EN4`/`H-S2`), locate `~14,300 km³` Utopia-class water ice (`PH7`) for Lucas's `Rodwell` (`EN2`), and trigger the real **"Conflicting data"** event (TGO `< 0.05 ppbv` methane vs Curiosity `0.2–0.7 ppb` ground reading, `BI3`).
- **Low-Poly 3D Instructions (`SciHiriseSharad`):**
  - **Silhouette:** The signature giant black carbon-composite `0.5 m`-class optical telescope barrel (`r = 0.21 m, h = 0.68 m`, `HullBlack`) angled slightly forward-down inside a structural gimbal ring (`Aluminum`) with gleaming `FoilSilver` MLI collar and gold spider-vane mirror ring (`FoilGold`) inside a dark optical aperture (`Visor`). Bolted to the right side is the rectangular `NOMAD` solar-occultation spectrometer box (`0.14 × 0.26 × 0.18 m`, `FoilGold` with narrow `VisorGold` slit window); mounted along the left side are two stowed `SHARAD` dipole antenna deployment tubes (`r = 0.035 m, h = 0.54 m`, `Hull` white fiberglass).

#### D2. `sci-pixl-sherloc-supercam` — Astrobiology Turret & Laser Micro-Suite *(Tier 3)*
- **Real basis:** Perseverance **PIXL** (`GE3`) + **SHERLOC** (`BI1`, `B14`) + **SuperCam** (`GE2`, `PH11`), the exact trio that investigated *Cheyava Falls* ("leopard spots" potential biosignature).
- **Gameplay metrics & sources:**
  - `mass_dry`: PIXL **6.9 kg** (`GE3`) + SHERLOC **4.72 kg** (`BI1`) + SuperCam **10.6 kg** (`GE2`) = **22.22 kg `derived`**
  - `power_electric`: PIXL **25 W** + SHERLOC **48.8 W** (highest arm-instrument draw, `BI1`) + SuperCam **17.9 W** (`GE2`)
  - `data_rate`: PIXL **~16 Mb/exp** (`~2 MB/day`) + SHERLOC **79.7 Mbit raw ⚠** + SuperCam **15.5 Mb/exp** (`~4.2 Mb/day`)
  - `status`: `OPERATING` (Perseverance)
- **Minigames & Events:**
  - Unlocks **`M-S1` ("Manchas de leopardo" — MVP)** and **`M-S2` ("Tiro certeiro" — `>7 m` LIBS laser)** plus cheap acoustic outreach bonus (`PH11`: dual speeds of sound on Mars `~240 / ~250 m/s ⚠`).
  - Cross-checking laser, X-ray, and UV Raman avoids the *"False positive life signal"* trap (*Viking* Labeled Release vs GC-MS / perchlorates, `B13`, `BI4`). Shares arm time with Lucas's drill (`L-S2`).
- **Low-Poly 3D Instructions (`SciPixlSherlocSupercam`):**
  - **Silhouette:** Articulated rover mast + arm-turret payload mounted on a compact white calibration pedestal (`Aluminum` neck at `y = 0.05–0.35 m`). Upper mast head (`0.22 × 0.14 × 0.20 m`, `Hull` white housing) holds SuperCam's large recessed circular telescope Cyclops eye (`Visor` glass ringed by `FoilGold` baffle) + laser emitter (`FX_Sparks` pointing `+Z`). Suspended beside it on a folded 3-segment titanium turret arm (`Titanium`) is the multi-sensor cluster of `PIXL` (hexagonal X-ray head, `Steel`) and `SHERLOC` (matte `HullBlack` housing with `Lamp` deep-UV illuminator ring and tiny checkerboard calibration target plate `Hull`/`Copper`).

#### D3. `sci-seis-caching` — Seismometer Dome & 43-Tube Sample Carousel *(Tier 2)*
- **Real basis:** InSight **SEIS** broadband seismometer + Wind & Thermal Shield (`PH2`, `G9`) + Perseverance **Sample Caching System / Adaptive Caching Assembly** (`43` titanium tubes, `GE6`, `BI6`, `G8`).
- **Gameplay metrics & sources:**
  - `mass_dry`: SEIS package **29.5 kg ⚠** (`11.5 kg` seismometer alone ⚠, `PH2`) + 43 empty titanium tubes **~2.45 kg est. ⚠** (`< 57 g` each `⚠`, `18 cm × 20–23 mm`, holding `10–15 g` core each `GE6`)
  - `power_electric`: SEIS **≤ 8.5 W** (`PH2`)
  - `data_rate`: SEIS **38 Mb/day** (`PH2`); `1,319 marsquakes` recorded (`Mw 4.7` max `⚠`)
  - `status`: SEIS `FLOWN`; Perseverance Sample Caching `OPERATING` (27 rock cores + 10-tube *Three Forks* depot; MSR return cancelled in FY2026 budget `⚠`)
- **Minigames & Events:**
  - Unlocks **`M-S3` ("Sismograma")** (stationary lander only; wind noise hurts daytime readings) and **`M-S4` ("Quais rochas guardar?")** — **mandatory to seal and score the biosignature from `M-S1`!**
  - Connects to the **"Sample return cancelled"** event (`G8`, forcing decisions between orbital/surface curation vs return mass).
- **Low-Poly 3D Instructions (`SciSeisCaching`):**
  - **Silhouette:** Side-by-side duo on a dark `Titanium` equipment pallet (`0.60 × 0.04 × 0.42 m`). On the left (`x = −0.16 m`), the unmistakable white hexagonal InSight `SEIS` Wind & Thermal Shield dome (`r = 0.15 m, h = 0.24 m`, `Hull`, 6 segments) with flared gold thermal chainmail apron (`FoilGold`) and curled orange tether ribbon (`Foam`). On the right (`x = +0.16 m`), a vertical cylindrical Perseverance `Adaptive Caching Carousel` (`r = 0.14 m, h = 0.34 m`, `Aluminum` frame with central `Steel` rotary shaft) exposing 8–10 visible vertical white-coated titanium sample tubes (`Hull` barrels with `FoilGold` hermetic seal caps).

#### D4. `hab-veggie-rad-astrorad` — Hydroponic Chamber & Radiation Shelter Kit *(Tier 2 · Crewed Missions)*
- **Real basis:** ISS **Veggie / Advanced Plant Habitat (`APH`)** (`BI7`, `B4`) + Curiosity **RAD** radiation detector (`PH1`, `P10`) + Artemis **AstroRad** protective vests (`BI11`).
- **Gameplay metrics & sources:**
  - `mass_dry`: Veggie **~7.2 kg ⚠** (`29.2 × 36.8 × 47 cm`, `0.16 m²` growth area `⚠`, `BI7`) + RAD **1.56 kg** (`1.7 kg ⚠`, `PH1`/`P10`) + AstroRad **~26 kg per crew member** (`104 kg` for 4 crew `derived`, `BI11`)
  - `power_electric`: Veggie **~70–115 W peak ⚠** (`BI7`) + RAD **4.2 W** (`PH1`) + AstroRad **0 W**
  - `science_health`: RAD measured **~1.8 mSv/day** cruise and **~0.67 mSv/day** surface (`~1 Sv` total for 500-day stay + transits, `PH1`); AstroRad models **40–60% dose reduction ⚠** during worst solar storms (`BI11`); **no plant has ever grown in real Martian soil** (`BI7`)
  - `status`: `SPACE-PROVEN` (Veggie/ISS, AstroRad Artemis I) / `OPERATING` (RAD)
- **Minigames & Events:**
  - Unlocks **`M-S5` ("Abrigo!" — Solar Storm Radiation Alert)** and **`M-S6` ("Fazer brotar" — Martian Greenhouse)** for crewed scenarios (`docs/minigames.md`).
  - Directly prevents/mitigates *"Solar storm"* crew dose spikes (`P10`, `AT4`) and *"Seeds don't germinate / water stress"* (`B4`), saving consumables mass and preserving crew health.
- **Low-Poly 3D Instructions (`HabVeggieRadAstroRad`):**
  - **Silhouette:** Modern laboratory greenhouse rack (`0.36 × 0.44 × 0.32 m`, `Hull` white cabinet) with a large recessed transparent/illuminated plant growth bay (`Visor` glass door over glowing magenta-green grow LED strip `Lamp` + tiny faceted green sprout trays `LedGreen`, flanked by thin water tubes `Copper`). Mounted on the right side is a compact vertical shelf holding folded grey/dark polymer `AstroRad` torso shielding blocks (`Pack` / `Strap`), and sitting on top of the cabinet (`y = 0.44–0.58 m`) is the cylindrical `RAD` particle-telescope sensor canister (`r = 0.07 m, h = 0.14 m`, `Aluminum` with `FoilGold` collimator ring).

---

## 5. Cross-Reference Summary: Gameplay Dependencies in the Middle Stages

Adding or removing stages in the rocket builder changes **budget, dry mass, Δv, TWR, power balance, data bandwidth**, and **available minigames/safeguards**:

1. **Power–Science Conflict:** Installing `isru-moxie-rodwell` (`300 W`) and `sci-pixl-sherloc-supercam` (`25–48.8 W`) without `power-mmrtg-kilopower` or `power-rosa-solar` stalls surface operations or drains crew life support.
2. **Data–Downlink Conflict:** Installing `sci-hirise-sharad` (`28 Gb/image`, `40–90 Gb/day`) without `comm-dsoc-laser` or `data-rad750-ssr` overflows memory buffers and leaves Maya's images untransmitted.
3. **Heavy-Stack EDL Trap:** Filling 5–7 middle stages with science/hab gear raises payload mass enough that landing without `edl-aspire-loftid` and `edl-trn-medli2` risks an EDL failure or landing far off-target (`> 12 sols` extra driving).
4. **Biosignature Scoring Chain:** `sci-pixl-sherloc-supercam` (`M-S1`) + `drill-corer-cryo` (`L-S2`) + `sci-seis-caching` (`M-S4`) + `comm-electra-marco` (`O-S1`) form a complete cross-character pipeline where every member's middle-stage module is essential.
