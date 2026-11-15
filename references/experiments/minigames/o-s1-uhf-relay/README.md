---
id: o-s1-uhf-relay
experiment: O-S1
name: Orbiter pass
owner: oscar
minigame: '"Contact window" (choice under a limit)'
real_basis: ["Electra / Electra-Lite UHF relay radios (Mars Relay Network)", "Mars Reconnaissance Orbiter (MRO) as the relay orbiter", "Curiosity / Perseverance rover UHF antenna (quadrifilar helix)"]
catalog_refs: [EN11]
models: [relay-orbiter, uhf-antenna, data-packet]
status: operating (checked 2026-11)
---

# O-S1 · Orbiter pass

Rovers do not send most of their data straight to Earth. They hand it to an orbiter flying overhead (MRO, Mars Odyssey or ESA's Trace Gas Orbiter) over a short UHF radio link, and the orbiter forwards it to Earth later. In the minigame an orbiter crosses the sky, data packets from the experiments wait in a queue with a size and a priority, and Oscar picks which ones go up before the window closes. The models show the relay orbiter (MRO) crossing the sky, the rover's "paint-can" UHF antenna that does the talking, and a small packet crystal that rises when a packet is sent.

## 1. Real data

Numbers the minigame uses or shows to the player. One row per key.

- **Source** column: `[n]` points to section 9; `derived` = calculated from other rows (formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass` | 3.0 | kg | [6] | one Electra-Lite radio (rover side, full duplex, with diplexer); Curiosity carries two for redundancy [7]. Orbiter side: MRO UHF subsystem 11.5 kg = two Electra transceivers 10.1 kg + antenna and radome 1.4 kg [3]; generic orbiter Electra payload 6.5 kg max (5.2 kg radio + 1.0 kg antenna + 0.3 kg cables) [4] |
| `power_electric` | 68 | W | [6] ⚠ | Electra-Lite transmit/receive, worst case end of life (2014 sheet); receive only 20.6 W. The 2009 sheet gives 60.2 / 18.5 W [5]. Orbiter Electra: 65.0 W full duplex, 23.6 W receive [4] (its Table 2 says 77.8 / 25.5 W ⚠) |
| `size` | 0.203 × 0.131 × 0.108 | m | [6] | Electra-Lite box (l × w × h). Orbiter Electra radio 0.217 × 0.201 × 0.122 m [4] |
| `operating_time` | 480 | s | [8] ⚠ | "about eight minutes" per pass. MRO press kit: about 5 min or less above 20° elevation [1]; MSL telecom: ~13 min per sol above 10° at the equator, split in two passes [7]; geometric maximum ~568 s (see `pass_duration_max`) |
| `data_volume` | 100–250 | Mbit | [8] ⚠ | per pass, Curiosity era. Perseverance "routinely" gets ~10× the 80 Mb of an old Odyssey pass, i.e. ~800 Mb per pass (derived from [9]) |
| `first_use_on_mars` | 2006 | year | [11] | first Electra relay session: MRO hailed Spirit in Nov 2006 (8 kbps forward, 128 kbps return, 30 Mb sent). UHF relay itself is older: Spirit and Opportunity sent ~90% of their data through Odyssey [1] |
| `uses_on_mars` | n/f | count | | total passes not published. NASA: orbiters return rover data "about a dozen times a week" [2] |
| `data_rate_max` | 2 | Mbit/s | [2] | rover → MRO/TGO; MRO Electra range 1 kbit/s to 2 Mbit/s [1]; the rate adapts to signal strength [9] |
| `data_rate_odyssey` | 128 or 256 | kbit/s | [8] | Odyssey has fixed, selectable rates |
| `frequency_return` | 401.585625 | MHz | [3] | rover → orbiter (CCSDS Proximity-1 channel 0) |
| `frequency_forward` | 437.1 | MHz | [3] | orbiter → rover |
| `rf_power_rover` | 8.5 | W | [6] | Electra-Lite RF output, full duplex |
| `rf_power_orbiter` | 5.0 | W | [4] | Electra RF output, full duplex (7.0 W half duplex); MRO table: 5 W [3] |
| `passes_per_sol` | 4–5 | count | [9] | Perseverance, all orbiters together. Per orbiter 2–4 per day; used for the relay network: MRO 1–3, TGO 2–4, Odyssey 0–1 [2] |
| `min_elevation` | 10 | ° | [3] [7] ⚠ | elevation mask used in the coverage analyses; the 2005 press kit uses 20° [1] |
| `pass_duration_max` | 568 | s | derived | overhead pass above 10° at h = 300 km: `2·(acos(R·cos 10°/(R+h)) − 10°)/360° · 6720 s`, R = 3389.5 km [12], period 6720 s [3]. 510 s at 255 km, 592 s at 320 km; 385 s above 20° |
| `slant_range` | 300–983 | km | derived | zenith to 10° elevation at h = 300 km (law of cosines) |
| `orbiter_altitude` | 255–320 | km | [1] [2] | MRO; Odyssey 385–450 km, TGO ~400 km [2] |
| `orbit_period` | 112 | min | [1] [3] | MRO (1 h 52 min); near-polar, Sun-synchronous, 92.6° inclination [3] |
| `orbit_local_time` | 15:00 | LST | [3] ⚠ | MRO crosses the equator northbound at 3 p.m. (design); a shift to later in the afternoon was planned after 2021 to spare the batteries [20], not confirmed |
| `array_rate` | 3.2 | °/min | derived | one solar-array turn per orbit to face the Sun: `360° / 112 min` |
| `fleet_relay_volume` | ~3.2 | Gbit/day | [2] | TGO 2,228.1 + MRO 850.6 + Odyssey 107.3 Mb/day (Feb–May 2026); MAVEN lost in Dec 2025 [19] |
| `mro_mass_launch` | 2,180 | kg | [1] | 139 kg payload + 892 kg other dry + 1,149 kg propellant and pressurant |
| `mro_width` | 13.6 | m | [1] | with the two solar arrays |
| `mro_height` | 6.5 | m | [1] ⚠ | "with 3-meter-diameter dish antenna"; the configuration (launch or flight) is not stated |
| `mro_power` | 2,000 | W | [1] | solar arrays at Mars (6,000 W at Earth) |
| `mro_to_earth_rate` | 6 | Mbit/s | [1] | X-band via the 3 m dish; ~3.5 Mbit/s expected in practice |
| `mro_relay_roll` | ≤ 30 | ° | [3] | MRO may roll during a pass to aim the better part of its UHF antenna pattern at the rover |

## 2. Minigame

- **Goal:** Send the most valuable science packets to the orbiter before it drops below the horizon.
- **Mechanic:** choice under a limit
- **Loop:**
  1. The orbiter rises in the south and crosses the sky (`pass`); a bar shows link strength (strongest at the highest point) and the window timer.
  2. Packets from the other players' experiments wait in a queue, each with size (Mb) and priority.
  3. Oscar taps packets to send them; a packet only finishes if its bits fit in what is left of the window. Each sent packet flies up (`packet_send`).
  4. Window closes: unsent packets stay in rover memory.
- **Success / failure:** success = science reaches Earth and scores points; failure = memory fills up and experiments stop (docs/minigames.md).
- **Fact card:** "An orbiter can talk to the rover for only about eight minutes per pass; in that time 100 to 250 megabits go up. The same 250 megabits would take up to 20 hours to send straight to Earth." [8]

Numbers that drive the minigame:

| Parameter | Value | Unit | Real or `game-balance` | From (section 1 key or source) |
|---|---|---|---|---|
| Window duration (game) | 20 | s | game-balance | real pass ~480 s (`operating_time`); compression ×24 |
| Pass shape | elevation/azimuth table in section 5 | — | real (derived) | `pass_duration_max`, `slant_range` |
| Capacity, low pass (max elevation < 30°) | 100 | Mb | real anchor | `data_volume` low end [8] |
| Capacity, mid pass (30–60°) | 250 | Mb | real anchor | `data_volume` high end [8] |
| Capacity, high pass (> 60°) | 800 | Mb | real anchor (derived ⚠) | Perseverance ~800 Mb/pass [9] |
| Link-rate curve | ∝ (300 km / slant range)², normalized to the capacity | — | game-balance | shape from free-space loss; real adaptive rates [9] |
| Passes per sol | 2–4 | count | real | `passes_per_sol` per orbiter [2] |
| Packet: Mastcam-Z images | ~148 | Mb | real | catalog GE1 (per sol average) [19] |
| Packet: SHERLOC map | 79.7 ⚠ | Mb | real | catalog BI1 (raw) [19] |
| Packet: RIMFAX (100 m drive) | 40–80 | Mb | real (calc.) | catalog PH4: 5–10 MB [19] |
| Packet: seismometer day | 38 | Mb | real | catalog PH2 [19] |
| Packet: PIXL scan | ~16 | Mb | real | catalog GE3 [19] |
| Packet: SuperCam shot | 15.5 | Mb | real | catalog GE2 [19] |
| Packet: rover health | 5 | Mb | game-balance | must-send packet; real size n/f |
| Orbiter on sky dome, distance | 120 × (range / 300 km) | m | game-balance | keeps the 13.6 m orbiter readable; shrinks toward the horizon |

## 3. Models

| Model id | What it is | Shown where | Budget (triangles / meshes) |
|---|---|---|---|
| `relay-orbiter` | Mars Reconnaissance Orbiter, real size, flight configuration | crossing the sky during the window; far away | ≤ 600 / ≤ 16 |
| `uhf-antenna` | rover UHF antenna (Curiosity/Perseverance "paint can" quadrifilar helix) on its bracket | foreground, next to the packet queue | ≤ 300 / ≤ 6 |
| `data-packet` | faceted crystal, one per packet (game art, not real hardware) | queue and flying up from the antenna | ≤ 32 / ≤ 2 |

## 4. Low-poly models

Instructions for whoever (person or AI) generates the models. Same conventions as the avatars and rocket parts ([AGENTS.md](../../../../AGENTS.md) §5, [parts.md](../../../parts/parts.md#3d-model-conventions)):

- **Units and axes:** metres at real size (1:1); +Y up; the front faces +Z; the origin is stated per model (usually on the ground, between the feet or wheels, or at the mounting point).
- **Style:** non-indexed geometry with one normal per face (flat shading); no textures; cylinders with 5 to 10 sides.
- **Materials:** only from `tools/modeling/lib/palette.mjs` (`Suit`, `SuitGrey`, `Helmet`, `Visor`, `VisorGold`, `Pack`, `Metal`, `Glove`, `GloveTip`, `Boot`, `Sole`, `Strap`, `Bag`, `Lamp`, `LedGreen`, `LedRed`, `Hull`, `HullBlack`, `Foam`, `Steel`, `Aluminum`, `Titanium`, `Copper`, `NozzleDark`, `FoilGold`, `FoilSilver`, plus `Accent` and `Screen` for the owner's color). A new material goes in the "New materials" table with a hex color and a reason.
- **Moving parts:** children of an empty pivot node placed at the joint; meshes are named `<Node>_<Material>`. No negative scale (mirror by position).
- **Symbols:** no real logos, flags or insignia; no red cross.

`Screen` uses Oscar's color `#1FA2FF` (`tools/modeling/characters/oscar.mjs`). Cylinders, rings and lathes are built around their local Y axis (three.js default); a rotation of (90, 0, 0) turns that axis to +Z.

### 4.1 relay-orbiter

Axes for this model: **−Y = nadir** (toward Mars: instruments and UHF antenna), **+Y = anti-nadir** (high-gain antenna side), **±X = solar-array wings** (+X = model left), **+Z = direction of flight**. Mapping to the spacecraft's own axes: model −Y = spacecraft +Z (nadir, instrument boresight, UHF antenna) [3]; which spacecraft axis points along the velocity is n/f, so +Z = flight direction is our choice.

#### Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Span, array tip to tip | 13.6 | [1] | |
| Solar array (each) | 5.35 × 2.53 | [1] | two hinged halves of 2.675 m (derived; hinge visible in KSC-05pd-1437) |
| High-gain dish diameter | 3.0 | [1] | |
| Dish depth | 0.45 | est. | shallow paraboloid, focal length 1.25 m (`D²/16d`); no drawing found |
| Overall height | 6.5 | [1] ⚠ | configuration not stated; this model is 6.5 m from HiRISE bottom to dish rim in the rest pose |
| Bus (box) | 2.2 × 2.0 × 2.2 | est. | scaled from `front-1.jpg` with the 3 m dish and from KSC-05pd-0864 (people for scale); real n/f |
| HiRISE barrel | Ø 0.80 × 1.0 below the bus | est. | primary mirror 0.50 m [1]; barrel size from `front-1.jpg` |
| SHARAD dipole | 10.0 | [1] | "5 meters to each side" |
| UHF antenna (radome) | Ø 0.26 × 0.30 | [4] ⚠ | envelope of the generic orbiter Electra quadrifilar-helix antenna (Ø 0.261 × 0.305 m incl. coax); MRO-specific size n/f |
| HGA mast | 1.9 long | est. | sets the 6.5 m height |

#### Shape in words

From the front (`front-1.jpg`): a gold-foil box (the bus) with a big round dish standing above it on a mast, a black telescope barrel (HiRISE) hanging under it toward Mars, and two long dark-blue solar wings sticking out left and right from the lower half of the bus. A thin white line (the SHARAD radar antenna, 10 m) runs left-right across the top of the bus. From the side (`three-quarter-1.jpg`) the dish is on a boom at the top and has a gold back. Under the bus, next to HiRISE, sit a few small instrument boxes and the white UHF antenna can, pointing straight down. The silhouette that must survive at a distance: the long thin wings, the round dish, the box between them. In the KSC photos (KSC-05pd-1433, -1437) the dish face is covered by a dark film; the artist concepts show it silver ⚠.

#### Node hierarchy

```text
RelayOrbiter                 origin: centre of the bus box
├─ HighGainAntenna           pivot at (0, 2.90, −0.50); 2-axis gimbal [3]; rest boresight +Z
├─ SolarArray_L              pivot at (1.15, −0.30, 0); 2-axis gimbal [3]; turns about local X
├─ SolarArray_R              pivot at (−1.15, −0.30, 0); mirror of _L by position
└─ FX_Antenna                (0.70, −1.36, 0.55), rotation [180, 0, 0]; emits along local +Y (down); preset signal
```

#### Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to its node; rotations in degrees (X, Y, Z).

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | RelayOrbiter | box | 2.20, 2.00, 2.20 (bus) | (0, 0, 0) | (0, 0, 0) | FoilGold | — |
| 2 | RelayOrbiter | box | 2.24, 0.06, 2.24 (nadir deck) | (0, −1.03, 0) | (0, 0, 0) | FoilSilver | — |
| 3 | RelayOrbiter | cylinder | r 0.40, h 1.00 (HiRISE barrel) | (0, −1.56, 0.30) | (0, 0, 0) | HullBlack | 8 |
| 4 | RelayOrbiter | box | 0.50, 0.40, 0.40 (CRISM) | (−0.70, −1.26, 0.55) | (0, 0, 0) | Aluminum | — |
| 5 | RelayOrbiter | box | 0.40, 0.35, 0.40 (MCS) | (0.65, −1.24, −0.60) | (0, 0, 0) | FoilSilver | — |
| 6 | RelayOrbiter | cylinder | r 0.13, h 0.30 (UHF antenna radome) | (0.70, −1.21, 0.55) | (0, 0, 0) | Hull | 8 |
| 7 | RelayOrbiter | box | 10.00, 0.03, 0.03 (SHARAD dipole) | (0, 1.02, 0.90) | (0, 0, 0) | Hull | — |
| 8 | RelayOrbiter | cylinder | r 0.08, h 1.90 (HGA mast) | (0, 1.95, −0.50) | (0, 0, 0) | Aluminum | 6 |
| 9 | HighGainAntenna | box | 0.30, 0.30, 0.30 (gimbal) | (0, 0, 0) | (0, 0, 0) | Aluminum | — |
| 10 | HighGainAntenna | lathe | profile `DishFront` (concave face) | (0, 0, 0.20) | (90, 0, 0) | HullBlack | 10 |
| 11 | HighGainAntenna | lathe | profile `DishBack` (convex back) | (0, 0, 0.18) | (90, 0, 0) | FoilGold | 10 |
| 12 | HighGainAntenna | cylinder | r 0.12, h 0.30 (feed at focus) | (0, 0, 1.45) | (90, 0, 0) | Aluminum | 6 |
| 13 | HighGainAntenna | box ×3 | 0.03, 0.03, 1.54 (feed struts) | from rim point (1.2·cos φ, 1.2·sin φ, 0.49) to (0, 0, 1.45), φ = 90°, 210°, 330° | along the segment | Aluminum | — |
| 14 | SolarArray_L | box | 0.30, 0.10, 0.10 (yoke + gimbal) | (0.15, 0, 0) | (0, 0, 0) | Aluminum | — |
| 15 | SolarArray_L | box | 5.35, 0.04, 2.53 (panel) | (2.975, 0, 0) | (0, 0, 0) | FoilSilver | — |
| 16 | SolarArray_L | box | 5.31, 0.006, 2.49 (cells, +Y face) | (2.975, 0.023, 0) | (0, 0, 0) | Visor | — |
| 17 | SolarArray_L | box | 0.04, 0.05, 2.53 (hinge bar) | (2.975, 0.025, 0) | (0, 0, 0) | Aluminum | — |
| 18–21 | SolarArray_R | same as 14–17 with x → −x | | | | | |

Revolved profiles (r, y), y = depth along the boresight from the vertex:

```text
DishFront: (0.00, 0.00) (0.75, 0.11) (1.10, 0.24) (1.35, 0.36) (1.50, 0.45)
DishBack:  (0.00, -0.02) (0.75, 0.09) (1.10, 0.22) (1.35, 0.34) (1.50, 0.43)
```

Wind the faces so `DishFront` is visible from +Z and `DishBack` from −Z.

#### Simplify

- Keep: wings, dish with feed, bus box, HiRISE barrel, UHF can (it is the radio this minigame is about).
- Drop: thrusters, thrust cone, low-gain antennas, star trackers, cabling, the Ka-band hardware. CRISM and MCS are one box each.
- The SHARAD dipole (row 7) may be dropped at long range; it is real but only 3 cm thick on screen.

#### New materials

| Name | Hex | Why |
|---|---|---|
| — | | none needed (`Visor` is used for solar cells, as in `comm-electra-marco`) |

#### Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 600 (planned ~480) |
| Meshes | ≤ 16 (planned 14) |
| Main dimensions | span 13.6 m, array 5.35 × 2.53 m, dish Ø 3.0 m, height 6.5 m (±2%) |

### 4.2 uhf-antenna

Real basis: the rover UHF antenna (RUHF), a quadrifilar helix designed for MSL, mounted on the rover deck and used for all surface relay [7]. NASA calls it the "can-like cylinder to the left of the MMRTG" [13]; Perseverance's is a "cylindrical, paint-can-shaped UHF low-gain antenna at the back of the rover" [10]. The real antenna does not move: its pattern covers most of the sky [7]. Origin: centre of the bracket foot on the rover deck (y = 0).

#### Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Radome can | Ø 0.25 × 0.30 | est. ⚠ | scaled from `in-context-1.jpg` against the MMRTG (0.64 m across the fins [14]); matches the Electra helix envelope Ø 0.261 × 0.305 m [4]. Real size n/f |
| Bracket height | 0.10 | est. | from `detail-1.jpg` |
| Top of antenna above deck | 0.445 | est. | |

#### Shape in words

A plain upright cylinder with a flat top, wrapped in light fabric with faint vertical seams (`detail-1.jpg`), sitting on a dark clamp ring over a short open bracket, with a cable running down to the deck. No visible helix: it is inside the radome. From any side it reads as a can; keep the flat top and the dark ring at its base.

#### Node hierarchy

```text
UhfAntenna                   origin: bracket foot on the deck (y = 0)
├─ Indicator                 pivot at (0, 0.30, 0); game art: glowing ring that pulses while linked
└─ FX_Antenna                (0, 0.45, 0), rotation [0, 0, 0]; emits along +Y (up); preset signal
```

#### Parts

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | UhfAntenna | cylinder | r top 0.07, r bottom 0.10, h 0.10 (bracket) | (0, 0.05, 0) | (0, 0, 0) | Titanium | 6 |
| 2 | UhfAntenna | cylinder | r 0.13, h 0.03 (clamp ring) | (0, 0.115, 0) | (0, 0, 0) | Strap | 10 |
| 3 | UhfAntenna | cylinder | r 0.125, h 0.30 (radome can) | (0, 0.28, 0) | (0, 0, 0) | Hull | 10 |
| 4 | UhfAntenna | cylinder | r 0.12, h 0.015 (top cap) | (0, 0.4375, 0) | (0, 0, 0) | FoilSilver | 10 |
| 5 | UhfAntenna | cylinder | r 0.012, h 0.20 (coax cable) | (0.09, 0.07, 0.04) | (0, 0, 30) | Strap | 5 |
| 6 | Indicator | ring | radius 0.16, tube 0.012 (game art) | (0, 0, 0) | (0, 0, 0) | Screen | 10 × 3 |

#### Simplify

- No helix, bolts or seams. The `Indicator` ring is game art; hide it when no orbiter is in view.

#### New materials

| Name | Hex | Why |
|---|---|---|
| — | | none |

#### Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 300 (planned ~225) |
| Meshes | ≤ 6 (planned 5) |
| Main dimensions | can Ø 0.25 × 0.30 m, top at 0.445 m (est.) |

### 4.3 data-packet (game art)

Not real hardware: a symbol for one block of science data. Origin at the crystal centre.

#### Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Crystal radius | 0.10 × (size_Mb / 40)^(1/3), clamped 0.06–0.20 | game-balance | bigger packet, bigger crystal |

#### Shape in words

An octahedron stretched upward (a gem), glowing in Oscar's blue, with a small bright core.

#### Node hierarchy

```text
DataPacket                   origin: crystal centre
└─ Crystal                   pivot at (0, 0, 0); spins and scales in packet_send
```

#### Parts

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Crystal | ball (octahedron), scaled (1, 1.4, 1) | r 0.10 | (0, 0, 0) | (0, 0, 0) | Screen | 4 × 2 |
| 2 | Crystal | ball (octahedron) | r 0.04 (core) | (0, 0, 0) | (0, 45, 0) | Lamp | 4 × 2 |

#### Simplify

- Priority is shown in the HUD, not on the crystal.

#### New materials

| Name | Hex | Why |
|---|---|---|
| — | | none |

#### Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 32 (planned 16) |
| Meshes | ≤ 2 |
| Main dimensions | r 0.10 at 40 Mb |

## 5. Animations

Same format as the avatar animations (AGENTS.md §5.5): each clip is a function `pose(u)` with u ∈ [0, 1], rotations in degrees and positions in metres, relative to the rest pose. Clips that loop end in `_loop` and need pose(0) = pose(1).

| Clip | Model | Duration (s) | Loop | What it shows | Used when (minigame state) |
|---|---|---|---|---|---|
| `pass` | relay-orbiter | 20 (game-balance; real ~480, max 568) | no | orbiter rises in the south, crosses the sky, sets in the north, staying nadir-pointed | the whole contact window |
| `array_track_loop` | relay-orbiter | 236 (game-balance; real 6720) | yes | wings turn once per orbit to face the Sun | always while visible |
| `hga_point` | relay-orbiter | 3 (game-balance) | no | dish slews toward Earth to forward the data | after the window closes |
| `link_loop` | uhf-antenna | 1.0 (game-balance) | yes | indicator ring pulses while bits flow | while a packet is uploading |
| `packet_send` | data-packet | 1.2 (game-balance) | no | packet rises from the antenna and fades into the sky | each time a packet finishes |

Keyframes for each clip (linear between keys unless the Note says ease):

```text
pass (20 s) — path is applied by game code, not baked into the GLB (the dome radius belongs to the scene).
Reference pass: h = 300 km, max elevation 60°, track to the west, northbound (afternoon, ascending) [3].
Scene frame: x = east, y = up, z = north; az from north toward east.
RelayOrbiter: p = d(u) · (cos el · sin az, sin el, cos el · cos az), d(u) = 120 m · range / 300 km
              r = [α(u), 0, 0] with α = −15.0 + 30.0·u  (keeps −Y on the planet centre; linear in time)
u=0.00  el 10.0  az 189.8  range 983 km
u=0.10  el 15.4  az 192.3  range 813 km
u=0.20  el 22.7  az 196.3  range 651 km
u=0.30  el 33.2  az 203.8  range 503 km
u=0.40  el 48.5  az 221.5  range 389 km
u=0.50  el 60.0  az 270.0  range 342 km
u=0.60  el 48.5  az 318.5  range 389 km
u=0.70  el 33.2  az 336.2  range 503 km
u=0.80  el 22.7  az 343.7  range 651 km
u=0.90  el 15.4  az 347.7  range 813 km
u=1.00  el 10.0  az 350.2  range 983 km
Overhead pass (max 90°): az 180 for u < 0.5, 0 after; el 10.0 15.6 23.4 35.5 56.4 90 (mirror). Low pass (max 30°): el 10.0 14.0 18.7 23.7 28.1 30.0 (mirror), az 208.1 → 270 → 331.9.
Optional relay roll [3]: add r.z = up to 30° from u=0.05 to u=0.95 (ease in/out over 0.05).

array_track_loop (236 s)
u=0.00  SolarArray_L: r [0, 0, 0]     SolarArray_R: r [0, 0, 0]
u=0.50  SolarArray_L: r [180, 0, 0]   SolarArray_R: r [180, 0, 0]
u=1.00  same as u=0.00 (loop; 360° = 0°)

hga_point (3 s, ease in/out)
u=0.00  HighGainAntenna: r [0, 0, 0]
u=1.00  HighGainAntenna: r [-30, 45, 0]   (example; the game sets the Earth direction)

link_loop (1.0 s)
u=0.00  Indicator: r [0, 0, 0]    s [1.00, 1.00, 1.00]
u=0.50  Indicator: r [0, 36, 0]   s [1.25, 1.25, 1.25]
u=1.00  Indicator: r [0, 72, 0]   s [1.00, 1.00, 1.00]  (ring is 10-fold symmetric, so 72° = 0°: loop)

packet_send (1.2 s, ease in)
u=0.00  Crystal: p [0, 0, 0]    r [0, 0, 0]     s [1.00, 1.00, 1.00]
u=0.20  Crystal: p [0, 0.6, 0]  r [0, 72, 0]    s [1.15, 1.15, 1.15]
u=1.00  Crystal: p [0, 8.0, 0]  r [0, 360, 0]   s [0.20, 0.20, 0.20]
Start the DataPacket at the world position of UhfAntenna/FX_Antenna; hide it at u = 1.
```

Real rates (pass length, orbit period, array turn rate) are in section 1. The pass is compressed ×24 (480 s → 20 s) and the array turn by the same order (6720 s → 236 s, ×28.4, so the wings turn ~30° during one window, as in reality).

## 6. Particles and effects

| Anchor | Model | Preset (`tools/modeling/lib/fx-presets.mjs`) or new | Clips | Note |
|---|---|---|---|---|
| `FX_Antenna` | uhf-antenna | `signal` | `link_loop` | emits up; same anchor name as Oscar's avatar and `comm-electra-marco` |
| `FX_Antenna` | relay-orbiter | `signal` | `pass` (only while linked) | emits down toward the surface; at sky distance scale the emitter with the model, or the 0.05 m particles vanish |

No new preset.

## 7. Images

All images in this folder, only with a free license (public domain, CC0, CC BY, CC BY-SA). File name: `<view>-<n>.jpg`; views: `side`, `three-quarter`, `front`, `top`, `detail`, `diagram`, `in-context`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| `front-1.jpg` | front | MRO artist concept, bus facing Mars: dish above, gold bus, HiRISE below, wings left/right, SHARAD line. Main silhouette and proportions | [NASA PIA07245](https://images.nasa.gov/details/PIA07245) | NASA/JPL | Public domain (NASA) |
| `three-quarter-1.jpg` | three-quarter | MRO from above and the side: dish on its boom with gold back, two-panel wings, instruments under the bus | [NASA PIA07243](https://images.nasa.gov/details/PIA07243) | NASA/JPL | Public domain (NASA) |
| `detail-1.jpg` | detail | Curiosity's cylindrical UHF antenna up close (Navcam, sol 1607): can shape, flat top, clamp ring, bracket and cable | [NASA PIA21482](https://images.nasa.gov/details/PIA21482) | NASA/JPL-Caltech/TAMU | Public domain (NASA) |
| `in-context-1.jpg` | in-context | Curiosity's deck while it was sending data to TGO (sol 4611, 2025): UHF can left of the MMRTG. Size of the can vs. the MMRTG | [NASA PIA26632](https://images.nasa.gov/details/PIA26632) | NASA/JPL-Caltech | Public domain (NASA) |

**Linked only** (useful but not freely licensed, so not downloaded): none. Also useful and public domain (not downloaded, to keep the folder small): MRO launch configuration [KSC-05pd-0864](https://images.nasa.gov/details/05pd0864), deployed solar array [KSC-05pd-1437](https://images.nasa.gov/details/05pd1437), dish on its gimbal [KSC-05pd-1433](https://images.nasa.gov/details/05pd1433).

## 8. Gaps and cautions

- **Pass length differs by source ⚠:** ~8 min [8], ≤ ~5 min above 20° [1], ~6.5 min average at the equator [7], 9.5 min geometric maximum (derived). The game uses 8 min as "real". The derived geometry ignores Mars's rotation (~2.3° during a pass) and orbit eccentricity.
- **Per-pass volume ⚠:** 100–250 Mb is Curiosity-era [8]; ~800 Mb for Perseverance is our reading of "10 times more than [80 Mb] in one pass" [9].
- **Power ⚠:** Electra-Lite 68 W (2014) vs 60.2 W (2009); orbiter Electra 65.0 vs 77.8 W in two tables of the same document [4].
- **Sizes not found (n/f → est.):** MRO bus box, HiRISE barrel, dish depth, mast length, MRO UHF antenna size, rover UHF antenna size. The rover can is scaled from a photo (±20%).
- **MRO height 6.5 m ⚠:** the press kit does not say which configuration; the model is fitted to it in the rest pose.
- **Dish colour ⚠:** dark film in the 2005 KSC photos, silver in the artist concepts.
- **Orbit local time ⚠:** 3 p.m. is the design value [3]; a later-afternoon shift was planned after 2021 [20], not confirmed. It only sets the pass direction (south → north in the afternoon).
- **Fleet in Nov 2026:** MRO operating (NASA page updated Sep 2026 [15]); MAVEN lost (Dec 2025) [19]; TGO carries two NASA Electra radios [16]; Mars Express is backup only and Odyssey uses fixed 128/256 kbps rates [2] [8]. The Mars 2020 press kit still lists MAVEN as a relay [10] (written in 2020).
- **Perseverance antenna:** described only as "cylindrical, paint-can-shaped" [10]; that it copies Curiosity's quadrifilar helix is our assumption (same shape and heritage).
- **Discrepancies with existing files:**
  - `tools/modeling/parts/specs.mjs` (`comm-electra-marco`) and `references/parts/stage-equipment.md` give Electra "~6.5 kg" and "~20–50 W ⚠" citing `mars-experiments.md` EN11, but EN11 lists mass and power as n/f. 6.5 kg is the orbiter Electra payload limit [4], not the rover's Electra-Lite (3.0 kg [6]); no source read gives 20–50 W (orbiter 23.6 W receive / 65.0 W full duplex [4]; Electra-Lite 20.6 / 68 W [6]).
  - The `CommElectraMarco` model's "4-slice" radio matches the orbiter Electra (four slices [4]); Electra-Lite has three [6].
  - `docs/minigames.md` lists "Mastcam-Z ~148 Mb" as one packet; the catalog value is a per-sol average (GE1). "Sismômetro 38 Mb/dia" is InSight, which ended in 2022.
  - `mars-experiments.md` EN11 "4–5 passes/sol" is Perseverance across all orbiters [9]; per orbiter it is 2–4 per day [2].

## 9. Sources

1. NASA/JPL, *Mars Reconnaissance Orbiter Launch Press Kit*, Aug 2005. https://www.jpl.nasa.gov/news/press_kits/mro-launch-Aug05.pdf (accessed 2026-11-15)
2. NASA Science, *Mars Relay Network*, updated 5 Jun 2026. https://science.nasa.gov/mars/mars-relay-network/ (accessed 2026-11-15)
3. J. Taylor, D. K. Lee, S. Shambayati, *Mars Reconnaissance Orbiter Telecommunications*, DESCANSO Design and Performance Summary Series, Article 12, JPL, Sep 2006. https://descanso.jpl.nasa.gov/DPSummary/MRO_092106.pdf (accessed 2026-11-15)
4. NASA/JPL Mars Exploration Program, *Electra Mars Proximity-Link Communications and Navigation Payload Description*, 17 Dec 2009. https://discovery.larc.nasa.gov/PDF_FILES/29Electra_Description.pdf (accessed 2026-11-15)
5. NASA/JPL Mars Exploration Program, *Electra-Lite Mars Proximity Link Communications and Navigation Payload Description*, 17 Dec 2009. https://discovery.larc.nasa.gov/PDF_FILES/30Electra-Lite_Description.pdf (accessed 2026-11-15)
6. NASA/JPL Mars Exploration Program, *Electra-Lite Mars Proximity-Link Communications and Navigation Payload Description*, 25 Aug 2014. https://discovery.larc.nasa.gov/pdf_files/39_ELT_Discovery_AO_Rev_140825.pdf (accessed 2026-11-15)
7. A. Makovsky, P. Ilott, J. Taylor, *Mars Science Laboratory Telecommunications System Design*, DESCANSO Article 14, JPL, Nov 2009. https://descanso.jpl.nasa.gov/DPSummary/Descanso14_MSL_Telecom.pdf (accessed 2026-11-15)
8. NASA Mars Exploration Program, *Curiosity: Communications with Earth* (archived 23 Jan 2021). https://web.archive.org/web/20210123041143/https://mars.nasa.gov/msl/mission/communications/ (accessed 2026-11-15)
9. M. Koziol, *How NASA Is Adapting Radios to a Noisier Mars* (interview with P. Ilott, JPL), IEEE Spectrum, 15 Apr 2021. https://spectrum.ieee.org/how-nasa-is-adapting-radios-to-a-noisier-mars (accessed 2026-11-15)
10. NASA/JPL, *Mars 2020 Landing Press Kit: Telecommunications*, 2021. https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission/spacecraft/telecommunications/ (accessed 2026-11-15)
11. NASA/JPL (via ScienceDaily), *NASA's Newest Mars Orbiter Passes Communications Relay Test*, 22 Nov 2006. https://www.sciencedaily.com/releases/2006/11/061120175019.htm (accessed 2026-11-15)
12. NASA NSSDCA, *Mars Fact Sheet* (volumetric mean radius 3389.5 km). https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html (accessed 2026-11-15)
13. NASA/JPL-Caltech, PIA26632 *Curiosity Captures Mars Landscape While Talking to an Orbiter*, 4 Aug 2025. https://images.nasa.gov/details/PIA26632 (accessed 2026-11-15)
14. NASA, *Multi-Mission Radioisotope Thermoelectric Generator* fact sheet, 2020. https://science.nasa.gov/wp-content/uploads/2024/02/mmrtg-factsheet-updated-5-18-20-1.pdf (accessed 2026-11-15)
15. NASA Science, *Mars Reconnaissance Orbiter* mission page, updated 3 Sep 2026. https://science.nasa.gov/mission/mars-reconnaissance-orbiter/ (accessed 2026-11-15)
16. NASA/JPL, PIA18397 *Europe 2016 Mars Orbiter Gets NASA Electra Radio*, 2014. https://images.nasa.gov/details/PIA18397 (accessed 2026-11-15)
17. NASA/JPL, PIA07245 *MRO, Front View Artist Concept* and PIA07243 *MRO Radar at Work, Top View Artist Concept*, 2005. https://images.nasa.gov/details/PIA07245 (accessed 2026-11-15)
18. NASA/JPL-Caltech/TAMU, PIA21482 *Curiosity Observes Whirlwinds Carrying Martian Dust*, 2017. https://images.nasa.gov/details/PIA21482 (accessed 2026-11-15)
19. Astro Romana catalog, [`references/experiments/mars-experiments.md`](../../mars-experiments.md): EN11, §2.1 fleet status (MAVEN lost), §8 data cost (GE1, GE2, GE3, BI1, PH2, PH4), compiled 2026-11-14.
20. NASA/JPL, *Mars Reconnaissance Orbiter Preparing for Years Ahead*, 9 Feb 2018. https://www.jpl.nasa.gov/news/mars-reconnaissance-orbiter-preparing-for-years-ahead/ (accessed 2026-11-15)
