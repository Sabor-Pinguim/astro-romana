# Cabin Equipment: Real References for the Crew Cabin (`cabin-equipment.md`)

Real spacecraft cabin systems, avionics consoles, docking/refueling hardware, closed-loop life support, radiation storm protection, exercise countermeasures, and onboard biomedical labs designed to be installed inside the mandatory **Crew Cabin** ([`godot/assets/models/rocket/cabin_cutaway.glb`](../../godot/assets/models/rocket/cabin_cutaway.glb)).

While engines and tanks in [parts.md](parts.md) power the **Main Booster**, and payload bays in [stage-equipment.md](stage-equipment.md) fill the **1 to 7 Middle Stages**, these cabin modules govern **what the crew experiences inside the spacecraft** during first-person launch (Phase 5), mandatory Mars orbital refueling and 200+ day transit (Phase 6), and surface/return operations (Phase 7) — see [docs/resources/space-mission-game-transcricao-organizada.md](../../docs/resources/space-mission-game-transcricao-organizada.md) §6–§9.

- **Companion sources:** [mars-experiments.md](../experiments/mars-experiments.md) and [experiments.md](../experiments/experiments.md) (IDs such as `EN8`, `EN15`, `BI8`, `BI9`, `E3`, `P10`, `B11` point directly there).
- **PT-BR gameplay guide:** [docs/resources/equipamentos-cabine.md](../../docs/resources/equipamentos-cabine.md).

---

## 1. Data & Verification Conventions

Same markers as [parts.md](parts.md) and [stage-equipment.md](stage-equipment.md):

- **⚠** = sources diverge, or value comes from a secondary source / search summary (re-verify against primary NASA/ESA documentation before displaying as a fixed real fact in UI text).
- **n/f** = not found in public sources; use a balanced gameplay value marked `game-balance` in `.tres` data files.
- **derived** = arithmetic calculated here from sourced numbers (formula noted).
- **est.** = engineering estimate scaled from reference hardware (basis noted).
- **Status tags** (`OPERATING`, `FLOWN`, `READY`, `SPACE-PROVEN`, `EARTH-TESTED`, `IN DEVELOPMENT`) reflect real-world status as of **2026-11** in [mars-experiments.md](../experiments/mars-experiments.md).

---

## 2. Catalogue Overview (12 Cabin Modules · 3 per Crew Role)

Each crew member gets **3 cabin modules** spanning **Tier 1 (Baseline / Compact)**, **Tier 2 (Workhorse)**, and **Tier 3 (Heavy / Full Deep-Space)**.

| ID | Module Name | Role | Tier | Real Reference Hardware | Mass (kg) | Power (W) | Data / Crew Impact | Phase / Gameplay Hook | Ref |
|---|---|---|---|---|---|---|---|---|---|
| `cabin-launch-seats` | Quad Shock-Attenuating Crew Couches | Helena | 1 | Orion / Crew Dragon 4-Crew Reclined Couches | n/f (~140 est. `game-balance`) | 0 (mechanical) | Protects crew from high-g launch/EDL shock | Phase 5 ascent & Phase 6/7 landing structural tolerance | Apollo / Orion (`⚠`) |
| `cabin-orion-cockpit` | Glass Cockpit Command Console (3 DUs) | Helena | 2 | Orion Block Cockpit (3 Display Units + RHC/THC) | n/f (~57 switches vs thousands legacy ⚠) | ~120 VDC avionics bus ⚠ | First-person launch telemetry & Caution/Warning UI | Phase 5 first-person cockpit (`§7.1`) + boosts `H-O1` / `H-S2` precision | Orion Cockpit (`⚠`) |
| `cabin-idss-docking` | IDSS / NDS Docking & Cryo Refueling Ring | Helena | 3 | NASA Docking System (`NDS`) / `IDSS` + PDTU | ~319–340 ⚠ (NDS-301..304) | 28 / 120 VDC transfer ⚠ | Mandatory orbital refueling interface for Mars | Phase 6 orbital refueling minigame & transfer efficiency | NASA JSC 65795 (`⚠`) |
| `cabin-pcdu-thermal` | 120 VDC Power Bus & Condensing Heat Exchanger | Lucas | 1 | Orion/ISS 120 VDC PCDU + Thermal HX | n/f (~45 est. `game-balance`) | Manages 120 VDC distribution | Prevents cable fires & overheats in transit | Prevents *"Cooling pump failure"* (`P8`) & overload trips; EVA/cabin repair `FX_Sparks` | Orion ESM (`E3`, `P8`) |
| `cabin-eva-airlock` | Twin Suitport / Airlock Hatch & Regolith Filter | Lucas | 2 | Quest Airlock / Suitport + AxEMU/xEMU (`EN15`) | n/f (~180 est. `game-balance`) | Pump-down power during EVA/egress | Clean egress on Mars + safe EVA repair access | Phase 6 risky EVA repairs (`P8`) + Phase 7 fast dust-mitigated egress | `P8`, `EN15` |
| `cabin-eclss-wrs` | 98% Closed-Loop Water Recovery & UWMS Rack | Lucas | 3 | ISS ECLSS Water Recovery (`98%`, WPA/UPA/BPA) + `UWMS` | n/f (`40%` lighter / `65%` smaller `UWMS` ⚠; 2 ISPRs on ISS) | High continuous thermal/distillation draw | Cuts Earth launch water mass (`~68 t` baseline for 4 crew / 500 days, `EN2`) | Prevents *"Life-support failure, use reserves"* (*ISS toilet 2026* `E3` ⚠) | `E3`, `EN15`, `EN2` |
| `cabin-hera-dosimetry` | HERA Active Radiation Warning & Klaxon Matrix | Oscar | 1 | Orion **HERA** (`Timepix` HSU sensor array) | < few kg total (chips tens of grams ⚠) | ~2 W ⚠ | Real-time cruise (`1.8 mSv/day`) & SPE alert (`PH1`) | Early alarm gives extra reaction time before Maya's **`M-S5` ("Abrigo!")** | Orion HERA (`⚠`), `PH1`, `P10` |
| `cabin-scan-console` | Deep-Space DTN Comms & Delay Workstation | Oscar | 2 | Delay-Tolerant Networking (`DTN`) + Cabin Ka/X Terminal | n/f (~28 est. `game-balance`) | ~65 est. `game-balance` | Manages **3–22 min** (4–24 min ⚠) one-way light time | Mitigates light-time command lag during transit & boosts `O-O1`/`O-S1` queue UI | `mars-experiments.md` §1 (`DTN`) |
| `cabin-autonav-conjunction` | AutoNav & Solar Conjunction AI Co-Processor | Oscar | 3 | Perseverance **AutoNav** (`347.7–412 m/sol ⚠`, >90% self-driven) | Compute (`EN8`) | ~85 est. `game-balance` | Bridges **2–3 week solar conjunction** blackout (`§1`) | Allows Mars transit/rover autonomy during blackouts & prevents *"No-command"* stall | `EN8`, `mars-experiments.md` §1 |
| `cabin-ared-exercise` | Resistive Exercise Countermeasure Frame (`ARED`) | Maya | 2 | ISS **ARED** (twin 20 cm vacuum cylinders + VIS) | ~610–680 ⚠ (`1,350–1,500 lb` Earth weight) | 0 (mechanical/vacuum + VIS) | Counters **1–1.5%/month bone loss** & fluid shifts (`BI8`) | Phase 6 daily crew countermeasure task; prevents severe deconditioning on 3.71 m/s² Mars landing | `BI8`, ISS ARED (`⚠`) |
| `cabin-storm-shelter` | Water-Wall Storm Shelter & ISO 7010 Medical Bay | Maya | 2 | Portable Water-Wall Habitat Shield + `SANS` Eye/Ultrasound Bay | Water mass reused (`BI11` / `BI8`) | ~25 diagnostic | Cuts SPE dose & treats **64% optic-disc swelling** (`BI8`) | Primary safe haven for **`M-S5` ("Abrigo!")** + tracks crew health meter (`BI8`) | `BI8`, `BI11`, `P10` |
| `cabin-msg-minion` | Microgravity Science Glovebox & `MinION` DNA Bench | Maya | 3 | ISS **MSG** + Oxford Nanopore **MinION** (`BI9`, `B11`) | ~0.12 MinION ⚠ + glovebox rack (`n/f`) | ~95 est. `game-balance` | **4–20 Gb/run ⚠** sequencing + bio-containment | Unlocks transit microbial/biomedical science (`BI9`, `BI10`) without planetary contamination | `BI9`, `BI10`, `B11` |

---

## 3. Cutaway Cabin Integration & 3D Model Conventions

### 3.1 Target Cabin Geometry (`cabin_cutaway.glb`)
Inspected directly from [`godot/assets/models/rocket/cabin_cutaway.glb`](../../godot/assets/models/rocket/cabin_cutaway.glb):

- **Outer shell radius:** `0.50 m` (`Ø 1.00 m`), overall height `2.05 m` (crew cabin + launch escape tower spire).
- **Main lower pressurized bay (`InnerBayDark`):** `r_inner = 0.46 m` (`Ø 0.92 m`) from `y = 0.00 m` up to `y = 0.95 m`, tapering smoothly above `y = 0.95 m` (`r_inner = 0.28 m` up to `y = 1.45 m`).
- **Cutaway opening:** half-cylinder cutaway facing **`+Z`** so the camera looks into the cabin toward `−Z`.
- **Safe Cabin Module Placement Envelope:** every cabin module GLB must stay within **`width ≤ 0.68 m`**, **`height ≤ 0.72 m`**, **`depth ≤ 0.56 m`**, with its origin `(0, 0, 0)` on the **cabin deck floor (`minY = 0`)**. This guarantees clean visual seating inside the main lower `r = 0.46 m × 0.95 m` pressurized cabin bay without intersecting the tapered upper bulkhead (`ThermalGold` at `y = 0.95..1.45 m`) or the rear cutaway wall.

### 3.2 Structural & Pipeline Rules
Follow [AGENTS.md](../../AGENTS.md) §5 and [parts.md](parts.md#3d-model-conventions):
- **Axes:** `+Y` up, `+Z` front (facing the viewer in the cutaway opening).
- **Origin:** center of the cabin floor mounting deck `(0, 0, 0)`, resting on `y = 0`.
- **Nodes:** `Attach_Bottom` at `(0, 0, 0)`, `Attach_Top` at top center of the rack/module, plus `FX_*` anchors where applicable (`FX_Sparks` on `cabin-pcdu-thermal`, `FX_Antenna` on `cabin-scan-console`).
- **Materials:** ONLY keys from `BASE` / `createPartsPalette()` in [`tools/modeling/lib/palette.mjs`](../../tools/modeling/lib/palette.mjs).
  - **Medical symbol rule (`AGENTS.md` §5.3):** `cabin-storm-shelter` MUST use a **white cross (`Hull`) on a green backing (`LedGreen`)** per ISO 7010 — never a red cross (`LedRed` is reserved strictly for status/alarm LEDs).
- **Budget per cabin module:** **≤ 700 triangles**, **≤ 12 meshes**, non-indexed flat-shaded geometry, no textures, segments `6–12`.

---

## 4. Detailed Cabin Module Specifications (Hardware Data & Low-Poly 3D Guides)

---

### A. Helena — Command, Docking & Launch Safety

#### A1. `cabin-launch-seats` — Quad Shock-Attenuating Crew Couches *(Tier 1)*
- **Real basis:** Orion / Crew Dragon / Apollo **shock-absorbing inclined crew couches** arranged to carry 4 astronauts through high-g Earth launch and Mars aerodynamic entry.
- **Gameplay metrics & sources:**
  - `mass_dry`: `n/f` (`~140 kg` est. 4-seat structural truss + dampers `game-balance`)
  - `power_electric`: `0 W` (passive/mechanical honeycomb & hydraulic shock struts)
  - `status`: `FLOWN` / `SPACE-PROVEN`
- **Phase & Event Hook:** Protects the 4 crew during Phase 5 orbital ascent and Phase 6/7 landing g-loads (if the Main Booster over-accelerates or EDL bounces/tips like *SLIM* `E14`, injury severity drops).
- **Low-Poly 3D Instructions (`CabinLaunchSeats`):**
  - **Silhouette:** Stepped dark `Titanium` floor rail deck (`0.58 × 0.04 × 0.46 m`) carrying two terraced rows (front-lower & rear-elevated) of **four reclined ergonomic space couches** (`Hull` shell backs at `−35°` tilt with contoured `Pack` navy seat cushions and orange `Foam` safety harness straps + head restraints `Strap`). Clearly reads as a 4-person spacecraft crew seating tier through the cutaway.

#### A2. `cabin-orion-cockpit` — Glass Cockpit Command Console (`3 DUs`) *(Tier 2)*
- **Real basis:** NASA **Orion** Block Glass Cockpit (`3` multifunction high-resolution Display Units `DUs`, Rotational Hand Controller `RHC`, Translational Hand Controller `THC`, and ~`57` physical backup switches ⚠, running `120 VDC` avionics).
- **Gameplay metrics & sources:**
  - `mass_dry`: `n/f` (`~75 kg` est. avionics pedestal + 3 hardened DUs `game-balance`)
  - `power_electric`: `120 VDC` avionics bus (`⚠`, `~150 W` console estimate `game-balance`)
  - `status`: `FLOWN` (Artemis I) / `READY`
- **Phase & Event Hook:** Drives Helena's **first-person launch HUD** (Phase 5 `space-mission-game-transcricao-organizada.md` §7.1) and reduces human reaction delay during manual orbital braking (**H-O1**) and hazardous descent diversions (**H-S2**).
- **Low-Poly 3D Instructions (`CabinOrionCockpit`):**
  - **Silhouette:** Concave forward cockpit desk (`0.58 × 0.24 × 0.36 m`, `HullBlack` housing on twin `Aluminum` pedestal legs) angled toward the crew, mounting **three side-by-side backlit glass Display Units** (`Pack` bezels framing crisp `Visor` screens with subtle `LedGreen` / `Lamp` flight attitude indicators), a central row of tactile guard switches (`Steel`), plus dual cantilevered pilot sticks: left **Translational Hand Controller (T-bar)** and right **Rotational Joystick (`Titanium`/`Strap`)**.

#### A3. `cabin-idss-docking` — IDSS / NDS Docking & Cryo Refueling Ring *(Tier 3)*
- **Real basis:** **International Docking System Standard (`IDSS`) / NASA Docking System (`NDS`)** (JSC 65795, Block `-301..-304`, with **Power/Data Transfer Umbilicals (`PDTU`)**).
- **Gameplay metrics & sources:**
  - `mass_dry`: **~319–340 kg ⚠** (`704–750 lb` NTE control weight across NDS-301..304; remote avionics add `~29 kg / 65 lb ⚠`, JSC 65795)
  - `power_electric`: passes **28 VDC or 120 VDC ⚠** across mated vehicles during docking/latching and propellant transfer
  - `status`: `OPERATING` / `SPACE-PROVEN`
- **Phase & Event Hook:** Powers the **mandatory Phase 6 Mars-bound Orbital Refueling** (`space-mission-game-transcricao-organizada.md` §6.1, §8.1), raising fuel transfer speed and preventing umbilical leak penalties during propellant top-off.
- **Low-Poly 3D Instructions (`CabinIdssDocking`):**
  - **Silhouette:** Iconic circular pressurized docking tunnel (`y = 0.04..0.62 m`) rising inside a square `Aluminum` bulkhead adapter (`0.58 × 0.04 × 0.50 m`). Features the main `Hull` cylindrical hatch tunnel (`r = 0.20 m, h = 0.42 m`) with central recessed view window (`Visor`), surrounded by an octagonal `Steel` **Soft Capture System (SCS)** petal ring (angled `Copper` alignment petals and 4 `Titanium` latch hooks) plus twin bright `Foam` orange/silver `FoilSilver` cryogenic refueling umbilical quick-disconnect manifolds bolted on the left and right collars.

---

### B. Lucas — Cabin Life Support, EVA Airlock & Power/Thermal Distribution

#### B1. `cabin-pcdu-thermal` — 120 VDC Power Bus & Condensing Heat Exchanger *(Tier 1)*
- **Real basis:** **Orion/ISS `120 VDC` Power Distribution & Control Unit (`PCDU`)** (`⚠`) paired with a cabin condensing heat exchanger / thermal coolant pump loop (informed by the *AMS-02* pump repair `P8`).
- **Gameplay metrics & sources:**
  - `mass_dry`: `n/f` (`~45 kg` `game-balance`)
  - `power_electric`: **120 VDC** architecture (`11 kW` generated on Orion ESM `⚠`); reduces copper harness mass across the cabin
  - `status`: `SPACE-PROVEN`
- **Phase & Event Hook:** Prevents electrical bus trips when Lucas runs heavy loads (`300 W` `MOXIE` or docking motors) and unlocks clean in-cabin coolant pump diagnostics during the *"Cooling pump failure"* event (`P8`), complete with repair spark anchor `FX_Sparks`.
- **Low-Poly 3D Instructions (`CabinPcduThermal`):**
  - **Silhouette:** Modular vertical utility bay (`0.50 × 0.60 × 0.34 m`, `Titanium` frame on `Aluminum` base). Left half holds the `HullBlack` high-voltage `120 VDC` switchgear cabinet with 3 breaker levers (`Foam`/`LedGreen`/`Lamp`) and thick `Copper` busbars; right half exposes the ribbed `Aluminum` cabin condensing heat exchanger core, circulating coolant pump cylinder (`Steel`), spherical accumulator (`FoilGold`), and `FX_Sparks` anchor (`preset: 'sparks'`) on the service manifold.

#### B2. `cabin-eva-airlock` — Twin Suitport / Airlock Hatch & Regolith Filter *(Tier 2)*
- **Real basis:** ISS **Quest Airlock** / Exploration **Suitport** architecture paired with **AxEMU / xEMU** surface pressure suits and Martian dust mitigation seals (`EN15`).
- **Gameplay metrics & sources:**
  - `mass_dry`: `n/f` (`~180 kg` est. pressure hatch + suitport frame + dual pump recovery `game-balance`)
  - `power_electric`: airlock pump-down cycle (`~180 W` transient `game-balance`)
  - `status`: `SPACE-PROVEN` / `IN DEVELOPMENT`
- **Phase & Event Hook:** Unlocks low-risk **Phase 6 orbital EVA repairs** (such as fixing a jammed `ROSA` solar wing `E5` or `AMS-02` cooling pump `P8`) and cuts turnaround delay + abrasive dust ingestion when the crew steps onto Mars in **Phase 7** (`space-mission-game-transcricao-organizada.md` §9.1).
- **Low-Poly 3D Instructions (`CabinEvaAirlock`):**
  - **Silhouette:** Pressurized cylindrical rear bulkhead portal (`Hull` bulkhead frame `0.60 × 0.64 × 0.30 m` with heavy oval-octagonal `Steel` airlock hatch door, central rotary locking handwheel `Copper`, and small round `Visor` porthole). Flanking the hatch on the left and right are **twin docked suitport torso racks** displaying iconic white xEMU/AxEMU backpack PLSS shells (`Hull` + `Pack` navy chest unit + `VisorGold` helmet domes tucked neatly on latches).

#### B3. `cabin-eclss-wrs` — 98% Closed-Loop Water Recovery & UWMS Rack *(Tier 3)*
- **Real basis:** ISS **Environmental Control & Life Support System (`ECLSS`)** demonstrating **98% water recovery** in June 2023 via the **Water Recovery System (`WRS` = `WPA` + `UPA` + Brine Processor `BPA`)** across 2 ISPRs, integrated with the next-gen compact **Universal Waste Management System (`UWMS`)** (`40%` lighter, `65%` smaller at ~`5 ft³` ⚠).
- **Gameplay metrics & sources:**
  - `mass_dry`: `n/f` (ISS `WRS` occupies 2 ISPRs `~2 × 1.05 × 0.85 m` ⚠; Orion/Mars scaled rack `~195 kg` `game-balance`)
  - `power_electric`: continuous distillation & fan separation (`~220 W` `game-balance`)
  - `consumable_savings`: closes **98%** of the `~68 t` water demand for 4 crew over 500 days (`EN2`, `EN15`, `E3`)
  - `status`: `SPACE-PROVEN` (ISS 2023–26)
- **Phase & Event Hook:** Massively reduces mission launch water mass for long Mars stays and directly counters the *"Life-support failure, use reserves"* event (*ISS toilet failure 2026* `E3` ⚠).
- **Low-Poly 3D Instructions (`CabinEclssWrs`):**
  - **Silhouette:** Tall double-bay white `Hull` ISPR life-support rack (`0.58 × 0.68 × 0.36 m`). Left bay houses the gleaming `Steel` / `FoilSilver` rotating **Urine Processor vacuum distillation drum** and coiled **Brine Processor** condenser (`Copper` pipes + dual cylindrical filter cartridges in `Titanium` + `LedGreen` `98%` status bar). Right bay houses the compact `UWMS` compartment (`Aluminum` cylindrical bowl housing with contoured `Pack` thigh restraints, flexible `Strap` suction hose, and dual-fan separator blower).

---

### C. Oscar — Cabin Telemetry, Radiation Warning & Autonomy

#### C1. `cabin-hera-dosimetry` — HERA Active Radiation Warning & Klaxon *(Tier 1)*
- **Real basis:** Orion **HERA** (*Hybrid Electronic Radiation Assessor*, Timepix silicon pixel detectors derived from CERN technology, 2 HSU boxes × 3 sensors across the capsule, Artemis I/II).
- **Gameplay metrics & sources:**
  - `mass_dry`: **individual modules tens of grams ⚠**; multi-sensor cabin kit **< few kg ⚠** (`~3.5 kg` est. with cabin alarm panel)
  - `power_electric`: **~2 W ⚠** (`~5 W` with cabin alarm beacons)
  - `status`: `SPACE-PROVEN` (Artemis I) / `OPERATING`
- **Phase & Event Hook:** Monitors real-time cruise radiation (`~1.8 mSv/day`) and Solar Particle Events (`PH1`, `P10`), granting Oscar an early warning lead time that widens Maya's success window in **`M-S5` ("Abrigo!")** and cuts crew radiation penalties.
- **Low-Poly 3D Instructions (`CabinHeraDosimetry`):**
  - **Silhouette:** Compact corner sensor & alarm bridge (`0.46 × 0.44 × 0.32 m`, `Aluminum` structural mount). Features two `FoilGold` armored **HERA Sensor Units (HSUs)** with recessed dark `Visor` silicon pixel-tracking collimator apertures pointing in orthogonal axes, linked by crisp `Copper` telemetry cables to a central **Cabin Caution & Solar Warning panel** (`HullBlack` plate crowned by twin glowing amber/red strobe beacons `Lamp` / `LedRed` and a `LedGreen` baseline telemetry bar).

#### C2. `cabin-scan-console` — Deep-Space DTN Comms & Delay Workstation *(Tier 2)*
- **Real basis:** NASA **Delay/Disruption Tolerant Networking (`DTN`)** protocol workstation managing the real **3–22 min** (4–24 min ⚠) one-way Earth–Mars light time and Deep Space Network store-and-forward queues (`mars-experiments.md` §1, `CD2`).
- **Gameplay metrics & sources:**
  - `mass_dry`: `n/f` (`~28 kg` est. dual ruggedized displays + Ka-band transceiver front-end `game-balance`)
  - `power_electric`: `n/f` (`~65 W` `game-balance`)
  - `status`: `SPACE-PROVEN` (ISS / deep-space relays)
- **Phase & Event Hook:** Lets Oscar manage packet queues, light-time latency indicators, and orbital relay handoffs directly from inside the cabin, improving throughput for **`O-O1` ("Feixe estável")** and **`O-S1` ("Janela de contato")**.
- **Low-Poly 3D Instructions (`CabinScanConsole`):**
  - **Silhouette:** L-shaped cabin communications desk (`0.56 × 0.56 × 0.38 m`, `Pack`/`Titanium` operator desk with ergonomic floor rail). Mounts twin angled wide telemetry monitors (`HullBlack` frames, bright `Visor` waveform displays with `LedGreen` link bars), a compact vertical audio/push-to-talk handset & equalizer deck (`Aluminum`), and an interior X/S-band cabin feed stub mast (`Steel` with `FoilGold` base collar and `FX_Antenna` node emitting `signal` pulses).

#### C3. `cabin-autonav-conjunction` — AutoNav & Solar Conjunction AI Co-Processor *(Tier 3)*
- **Real basis:** Perseverance **AutoNav** autonomous hazard-avoidance navigation stack (`EN8`: `347.7 m/sol` record, `45.22 km` odometer by Oct 2026, `>90%` self-driven) combined with **Solar Conjunction autonomous ops** software (handles the recurring **2–3 week blackout** every ~26 months, `mars-experiments.md` §1).
- **Gameplay metrics & sources:**
  - `mass_dry`: compute co-processor & solid-state neural/map blade (`~16 kg` `game-balance`)
  - `power_electric`: `~85 W` active compute (`EN8` note: compute power)
  - `performance`: crosses boulder fields `~3×` faster (**6 sols** vs ~18 sols for Curiosity, `EN8`)
  - `status`: `OPERATING` (Perseverance surface software)
- **Phase & Event Hook:** Prevents operational standstill during the mandatory **2–3 week Solar Conjunction blackout** event (`§1`) and gives the crew autonomous pathfinding in **Phase 7 surface exploration**, recovering lost mission sols!
- **Low-Poly 3D Instructions (`CabinAutonavConjunction`):**
  - **Silhouette:** Dense precision supercomputer monolith (`0.42 × 0.54 × 0.34 m`, chamfered `HullBlack` outer radiation enclosure on `Aluminum` cold-plate base). Front bay exposes vertical dual-redundant compute cartridges (`Titanium` frames with `FoilGold` EMI shielding doors, liquid-cooling `Copper` manifolds looping up to a top finned radiator crown, and twin holographic pathfinding display strips `LedGreen` + `Lamp`).

---

### D. Maya — Physiological Countermeasures, Bio-Lab & Storm Shelter

#### D1. `cabin-ared-exercise` — Resistive Exercise Countermeasure Frame (`ARED`) *(Tier 2)*
- **Real basis:** ISS **Advanced Resistive Exercise Device (`ARED`)** using twin **20 cm (`8 in`) vacuum cylinders** and inertial flywheels (up to `2,700 N / 600+ lb` load) on a Vibration Isolation System (`VIS`) (`⚠`), fulfilling the mandatory **2.5 h/day crew exercise** rule (`BI8`).
- **Gameplay metrics & sources:**
  - `mass_dry`: **~610–680 kg ⚠** (`1,350–1,500 lb` Earth-equivalent ISS mass; compact Mars transit variant `game-balance` if scaled down)
  - `power_electric`: `0 W` main actuation (vacuum cylinders + mechanical flywheels; tiny instrumentation sensor draw)
  - `health_effect`: directly counters **1–1.5%/month bone density loss** during the ~203–259 day Mars transit (`BI8`)
  - `status`: `SPACE-PROVEN` (ISS)
- **Phase & Event Hook:** Enables Maya's crew fitness countermeasure routine during Phase 6 cruise (`space-mission-game-transcricao-organizada.md` §8.2), ensuring astronauts don't arrive on Mars too weak to walk or complete Phase 7 surface tasks before the return deadline.
- **Low-Poly 3D Instructions (`CabinAredExercise`):**
  - **Silhouette:** Immediately recognizable gym rig on a floating dark `Strap`/`Titanium` **Vibration Isolation Platform** (`0.58 × 0.05 × 0.44 m`). Rising on the rear corners are twin vertical `Aluminum` **8-inch vacuum cylinders** topped with `FoilGold` end seals; pivoting forward over the deck is a diagonal main lifting beam (`Steel` boom with `Foam` orange padded shoulder/squat yoke), handgrip cable crossbar (`HullBlack`), and dual circular inertial flywheel discs (`Titanium`) at the base pivot.

#### D2. `cabin-storm-shelter` — Water-Wall Storm Shelter & ISO 7010 Medical Bay *(Tier 2)*
- **Real basis:** Orion/Mars crewed **Water-Wall Solar Particle Event (`SPE`) Shelter** (reusing portable water & consumables bags as hydrogen-rich radiation shielding alongside `AstroRad` `BI11`) + ISS/Mars **SANS** (*Spaceflight-Associated Neuro-ocular Syndrome*) **ultrasound & medical workstation** (treats **64% optic-disc swelling** in long-duration crew `BI8`).
- **Gameplay metrics & sources:**
  - `mass_dry`: dual-use water-bag rack (`~55 kg` structure + ultrasound console `game-balance`, reusing water stowage mass from `EN2`/`BI11`)
  - `power_electric`: `~25 W` medical ultrasound/vitals bay (`game-balance`)
  - `protection`: models **40–60% dose reduction ⚠** when combined with `AstroRad` (`BI11`) against solar storms (`1.8 mSv/day` cruise baseline `PH1`, `P10`)
  - `status`: `SPACE-PROVEN` (ISS Ultrasound & Orion Artemis shelter protocol)
- **Phase & Event Hook:** Primary crew refuge when **`M-S5` ("Abrigo!")** triggers during a Solar Storm (`P10`, `AT4`), and lets Maya run medical checkups during long cruises to protect the **Crew Health / Safety** meter (`BI8`).
- **Low-Poly 3D Instructions (`CabinStormShelter`):**
  - **Silhouette:** Enclosed protective alcove (`0.58 × 0.62 × 0.44 m`) built from interlocking translucent blue-grey water-wall bladder blocks (`Pack` / `Visor` pouches strapped into an `Aluminum` protective rib cage) forming a C-shaped radiation bunker around an internal padded medical exam seat (`Strap`). Mounted visibly on the front-facing white medical cabinet bulkhead (`Hull`) is the required **ISO 7010 first-aid emblem: a green square (`LedGreen`) with a crisp white cross (`Hull`)** — strictly no red cross per `AGENTS.md` §5.3 — beside a compact `HullBlack`/`Visor` portable ultrasound monitor.

#### D3. `cabin-msg-minion` — Microgravity Science Glovebox (`MSG`) & `MinION` DNA Bench *(Tier 3)*
- **Real basis:** ISS **Microgravity Science Glovebox (`MSG`)** paired with the **Oxford Nanopore `MinION` DNA Sequencer** (`BI9`, `B11`: `9` successful ISS runs matching ground accuracy) and **BioRock** biomining assay support (`BI10`: extracting rare-earth elements `1.1–4.3×` from basalt).
- **Gameplay metrics & sources:**
  - `mass_dry`: MinION **~0.12 kg ⚠** (`BI9`/`B11`), housed inside a sealed glovebox enclosure (`~85 kg` compact rack `game-balance`; full ISS MSG is ISPR-sized)
  - `power_electric`: `~95 W` air-curtain filtration, illumination & sequencing laptop (`game-balance`)
  - `data_rate`: **4–20 Gb/run ⚠** (raw nanopore reads, consumes flow-cell consumables `BI9`)
  - `status`: `SPACE-PROVEN` (ISS 2016–present)
- **Phase & Event Hook:** Lets Maya run active **Phase 6 orbital biology & crew microbiome/biomining tasks** (`space-mission-game-transcricao-organizada.md` §8.2) — generating high scientific value while putting **heavy data pressure (`4–20 Gb/run`)** on Oscar's telecom buffers (`data-rad750-ssr` / `comm-dsoc-laser`).
- **Low-Poly 3D Instructions (`CabinMsgMinion`):**
  - **Silhouette:** Iconic white **sealed bio-containment glovebox cabinet** (`0.54 × 0.62 × 0.38 m`, `Hull` enclosure on `Aluminum` base) featuring a large angled transparent front viewing window (`Visor`), upper fluorescent/UV lab chamber illumination (`Lamp`), and **two circular stainless glove ports (`Steel` rings with tucked navy `Pack` glove sleeves)** protruding slightly forward. Clearly visible inside on the work tray sit a pocket-sized golden-dark `MinION` sequencer brick (`FoilGold`/`HullBlack`), centrifuge drum (`Titanium`), and `LedGreen` status bar.

---

## 5. Cabin–to–Stage Synergy Summary

1. **EDL & Mass Survival Link (`cabin-launch-seats` + `edl-aspire-loftid`):** Heavy multi-stage Mars landers rely on `edl-aspire-loftid` in a middle stage and `cabin-launch-seats` inside the cabin to protect both airframe and crew from peak deceleration.
2. **Orbital Refueling Chain (`cabin-idss-docking` + `isru-moxie-rodwell`):** Every Mars mission requires orbital refueling in Phase 6 (`space-mission-game-transcricao-organizada.md` §6.1); `cabin-idss-docking` governs the Earth-orbit dock/fueling leg while `isru-moxie-rodwell` produces Mars return oxidizer.
3. **Solar Storm Protection Loop (`cabin-hera-dosimetry` → `cabin-storm-shelter` + `hab-veggie-rad-astrorad`):** Oscar detects particle arrival early (`HERA`), Maya times **`M-S5` ("Abrigo!")** using the cabin Water-Wall Shelter (`cabin-storm-shelter`) and `AstroRad` vests (`hab-veggie-rad-astrorad`).
4. **Telemetry vs Bio-Data Loop (`cabin-msg-minion` → `cabin-scan-console` + `comm-dsoc-laser`):** Sequencing `4–20 Gb/run` (`MinION`) inside the cabin fills buffers alongside `HiRISE`/`SHARAD`, turning Oscar's `DTN` console and laser transceiver into critical bottlenecks.
