---
id: h-s1-ingenuity
experiment: H-S1
name: Helicopter flight
owner: helena
minigame: "Scout" (piloting)
real_basis: ["Ingenuity Mars Helicopter (Mars 2020 / Perseverance)"]
catalog_refs: [EN9]
models: [ingenuity, scout-waypoint]
status: retired (checked 2026-11)
---

# H-S1 · Helicopter flight

Ingenuity was a 1.8 kg solar-powered helicopter that rode to Mars under the Perseverance rover. It made the first powered, controlled flight on another planet (19 Apr 2021) and 72 flights in all, before a hard landing over smooth sand broke its blades in January 2024 [1][3][4]. In the minigame, Helena flies it through scouting waypoints before the battery runs out. Over smooth, featureless sand the navigation camera loses track and the helicopter crashes. The models are the helicopter at real size, with spinning coaxial rotors, and a game-art hoop marker. The catalog row is EN9; the same mission is E1 in `../../experiments.md`.

## 1. Real data

Numbers the minigame uses or shows to the player. One row per key.

- **Source** column: `[n]` points to section 9; `derived` = calculated from other rows (formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass` | 1.8 | kg | [1][3] | Whole helicopter as flown (4.0 lb). Weight on Mars 6.68 N (derived: 1.8 × 3.71). |
| `power_electric` | 350 | W | [1][3] | Average during an up-to-90 s flight. The battery was tested to 360 W continuous and 510 W peak [2]. |
| `size` | 0.195 × 0.163 × 0.136 | m | [1] est. | Fuselage (width × depth × height). The press kit gives "13.6 × 19.5 × 16.3 cm" without naming the axes; we take 0.136 as the height from `three-quarter-1.jpg` (est.). The whole vehicle is 1.21 m across the rotors and 0.49 m tall. |
| `operating_time` | 90 | s | [1][2] | Planned maximum per flight, sized for a worn battery at 0 °C [2]. The first flight lasted 39.1 s [5]. |
| `data_volume` | n/f | Mbit | | Not published per flight. The radio link runs at 900 MHz, up to 250 kbit/s ⚠ over ≤ 1,000 m, with about 200 kbit/s of in-flight return throughput [2]. ⚠ The press kit says "250 kilobytes per second" [1]. |
| `first_use_on_mars` | 2021 | year | [5] | First flight on 19 Apr 2021 at Jezero crater. |
| `uses_on_mars` | 72 | count | [3][4] | Flights from 19 Apr 2021 to 18 Jan 2024. The plan was up to 5 flights in 30 sols [1]. |
| `rotor_diameter` | 1.21 | m | [2][6] | R = 0.605 m [6]. The press kit rounds it to 1.2 m [1]. |
| `rotor_layout` | 2 coaxial counter-rotating rotors × 2 blades | — | [1][2] | Rigid (hingeless) carbon-fibre rotors. Each rotor has a swashplate below it for collective and cyclic pitch [2]. |
| `rotor_rpm` | 2,400 ⚠ | rpm | [1] | The press kit says "roughly 2,400 rpm". ⚠ The design rpm is 2,600 [6]. From late 2021 the team flew at 2,700 rpm to make up for thinner seasonal air [8], and never went above 2,700 [7]. The design maximum and ground spin test were 2,800 rpm [2][8]. |
| `rotor_tip_speed` | 152 | m/s | derived | π × 1.21 × 2,400 / 60. At 2,800 rpm the tips reach 177 m/s, Mach 0.76 in Mars air [6]. |
| `rotor_spacing` | 0.099 | m | [6] | Vertical gap between the two rotor planes. |
| `blade_chord` | 0.031 / 0.122 / 0.074 / 0.007 | m | [6] | At r = 0.055 (root) / 0.207 (widest) / 0.454 (75%) / 0.605 (tip). The twist runs from 16.3° at the root to 0° at the tip [6]. |
| `blade_pitch_range` | −4.5 to 17.5 collective, ±10 cyclic | ° | [2] | |
| `height` | 0.49 | m | [1] | Ground to top. ⚠ The source doesn't say whether this includes the small antenna; we read it as the top of the solar panel (§4.1). |
| `leg_length` | 0.384 | m | [1] | 4 legs made of tapered carbon-fibre tubes [2]. |
| `ground_clearance` | 0.13 | m | [1] | Fuselage bottom to level ground. |
| `solar_panel` | 0.425 × 0.165 | m | [9] | "Roughly 6.5 by 17 inches (425 mm by 165 mm)". 680 cm² of substrate and 544 cm² of active cells (SolAero IMM4J) [2]. |
| `battery` | 6 Li-ion cells, 2 Ah each, 273 g | — | [2] | Sony VTC4 18650 cells; the pack runs at 15–25.2 V. |
| `battery_energy_usable` | 35.75 | Wh | [2] | End-of-life rating. 10.73 Wh (30%) is kept as reserve, ~21 Wh keeps it warm at night, and ~10 Wh is left for flight. |
| `flight_energy` | 10 | Wh | [2] | Gives ~90 s of flight. Check: 350 W × 90 s = 8.75 Wh (derived). |
| `climb_rate` | 1 | m/s | [1] | Flight 1 plan: climb at 1 m/s to 3 m, hover, then descend at 1 m/s. On the day it hovered at 3 m for ~30 s [5]. |
| `speed_max` | 10 | m/s | [3][6] | Highest ground speed flown [3]. The design limits are 10 m/s horizontal and 3 m/s vertical [6]. |
| `altitude_max` | 24 | m | [3] | The original test plan was 3–5 m [1]. |
| `longest_flight` | 704 | m | [4] | Flight 25, April 2022. |
| `total_flight_time` | 128.8 | min | [3] | All 72 flights. |
| `total_distance` | 17.0 | km | [3] | |
| `nav_camera` | 640 × 480 grayscale, 10 frames/s, 133° × 100° | — | [2] | Points straight down. It tracks surface features from frame to frame to estimate velocity, which is why smooth sand is a hazard [2][4]. |
| `color_camera` | 4208 × 3120, 47° × 47°, 22° below horizon | — | [2] | Sits on a bottom edge of the fuselage. The press kit calls it 13 MP [1]. |
| `air_density` | 0.016–0.0175 | kg/m³ | [2] | At the planned 11:00 local flight time; about 1% of Earth's. |
| `downwash_speed` | ~13 | m/s | derived | Ideal hover induced velocity √(T / 2ρA) with T = 6.68 N, ρ = 0.016–0.0175 and disk area A = 1.150 m² [6] gives 12.9–13.5 m/s. Used only to tune the dust FX. |
| `night_temperature` | ≤ −100 | °C | [2] | Heaters keep the battery above −15 °C [2]. |
| `end_of_mission` | 2024-01-18 | date | [4][10] | Flight 72 climbed to 12 m, started descending at 19 s and was on the ground by 32 s. Over steep, featureless sand ripples the navigation system "couldn't find enough surface features to track". It hit hard with high sideways speed, pitched and rolled, and all 4 blades snapped about a third of the way from the tip. One blade was then torn from its root [4]. The end of the mission was announced on 25 Jan 2024 [10]. |
| `cost` | ~85 M | USD | [1] | Covers building it, fitting it on Perseverance and operating it. |

## 2. Minigame

- **Goal:** fly Ingenuity through every scouting waypoint and land on textured ground before the battery runs out.
- **Mechanic:** piloting
- **Loop:**
  1. The scene shows the airfield, 5 hoops and the ground. The ground has pebbly patches (safe) and smooth sand ripples (the hazard, see `in-context-2.jpg`). The HUD shows the battery (90 s), rotor rpm and a "NAV FEATURES" bar.
  2. Press take-off. The rotors spin up (1 s), then `takeoff` climbs to 3 m.
  3. Steer in X/Z with keys or a stick (`hover_loop` plays; the model tilts up to 10° toward its motion). The battery drains at 350 W.
  4. Each hoop you fly through turns green and reveals one map cell (hazards and science targets for the rover).
  5. **Over smooth sand**, the NAV FEATURES bar empties. After 1 s, tracking is lost: the helicopter drifts at random and the controls stop working well. If it is still over sand 3 s later, it lands hard (`crash`). Flying back over pebbles restores tracking.
  6. Land on pebbles or the airfield (`land`). If the battery reaches 0 in the air, the game forces a landing where it is: `land` over pebbles, `crash` over sand.
- **Success / failure:** success reveals obstacles and science targets on the rover's map, which helps Maya (with SkyFall it also reveals ice). Failure is a forced landing, and the helicopter can break. Cost: 1.8 kg and ~350 W in flight. It depends on the rover as a relay, so it uses Oscar's bandwidth (docs/minigames.md).
- **Fact card:** "Ingenuity was planned for up to 5 flights in 30 days and made 72, flying 17 km. It ended in January 2024: over smooth sand its navigation camera found too few features, and all four blades broke on landing." [1][3][4]

Numbers that drive the minigame:

| Parameter | Value | Unit | Real or `game-balance` | From (section 1 key or source) |
|---|---|---|---|---|
| Battery per flight | 90 | s | real | `operating_time` |
| Battery drain | 350 | W | real | `power_electric` |
| Battery shown | 8.75 | Wh | derived | 350 W × 90 s |
| Hover altitude | 3 | m | real (Flight 1) | `climb_rate` [1][5] |
| Climb / descent rate | 1 | m/s | real | `climb_rate` |
| Max horizontal speed | 5 | m/s | game-balance | real maximum 10 m/s (`speed_max`) |
| Acceleration | 2.5 | m/s² | game-balance | |
| Travel tilt | ≤ 10 | ° | game-balance | |
| Waypoints per flight | 5 | count | game-balance | |
| Course length | 150–250 | m | game-balance | real: up to 300 m planned per flight [3], 704 m record (`longest_flight`) |
| Hoop inner diameter | 3.0 | m | game-balance | ≈ 2.5 × `rotor_diameter` |
| Time over sand before tracking is lost | 1.0 | s | game-balance | |
| Time from tracking loss to crash | 3.0 | s | game-balance | real Flight 72: ~12 s between the start of descent (19 s) and touchdown (by 32 s) (derived from [4]) |
| Drift after tracking loss | 0.6 | m/s | game-balance | |
| Rotor spin-up / spin-down | 1.0 | s | game-balance | real value n/f |
| Rotor speed on screen | 240 | rpm | game-balance | 1/10 of `rotor_rpm`, so the blades stay readable |
| Rotor speed in the HUD | 2,400 | rpm | real | `rotor_rpm` |

## 3. Models

| Model id | What it is | Shown where | Budget (triangles / meshes) |
|---|---|---|---|
| `ingenuity` | Ingenuity helicopter, real size, with rotor pivots and breakable blade tips | Minigame scene (the player's vehicle); a prop next to the rover | ≤ 1,200 / ≤ 14 |
| `scout-waypoint` | Hoop to fly through, with a pole and a ground ring (**game art**, not real hardware) | Minigame scene, 5 per flight | ≤ 300 / ≤ 3 |

## 4. Low-poly models

Instructions for whoever (person or AI) generates the models. Same conventions as the avatars and rocket parts ([AGENTS.md](../../../../AGENTS.md) §5, [parts.md](../../../parts/parts.md#3d-model-conventions)):

- **Units and axes:** metres at real size (1:1); +Y up; the front faces +Z; the origin is stated per model (usually on the ground, between the feet or wheels, or at the mounting point).
- **Style:** non-indexed geometry with one normal per face (flat shading); no textures; cylinders with 5 to 10 sides.
- **Materials:** only from `tools/modeling/lib/palette.mjs` (`Suit`, `SuitGrey`, `Helmet`, `Visor`, `VisorGold`, `Pack`, `Metal`, `Glove`, `GloveTip`, `Boot`, `Sole`, `Strap`, `Bag`, `Lamp`, `LedGreen`, `LedRed`, `Hull`, `HullBlack`, `Foam`, `Steel`, `Aluminum`, `Titanium`, `Copper`, `NozzleDark`, `FoilGold`, `FoilSilver`, plus `Accent` and `Screen` for the owner's color). A new material goes in the "New materials" table with a hex color and a reason.
- **Moving parts:** children of an empty pivot node placed at the joint; meshes are named `<Node>_<Material>`. No negative scale (mirror by position).
- **Symbols:** no real logos, flags or insignia; no red cross.

### 4.1 ingenuity

#### Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Rotor diameter | 1.21 | [6] | R 0.605 |
| Height, ground to top of solar panel | 0.49 | [1] | The antenna sticks out ~0.065 above it (est.) |
| Fuselage W × D × H | 0.195 × 0.163 × 0.136 | [1] est. | Axis assignment est. (see `size`) |
| Fuselage bottom / top | 0.13 / 0.266 | [1] derived | ground clearance + height |
| Leg length | 0.384 | [1] | Built as 0.381 from hinge to foot pad |
| Feet, centre to centre | 0.57 × 0.57 | est. | Follows from the leg length and hinge position; matches `in-context-1.jpg` |
| Lower / upper rotor plane | y 0.353 / 0.452 | est. / [6] | Only the 0.099 gap is sourced. The upper plane is read from `three-quarter-1.jpg` (panel ≈ 0.036 above the upper hub) |
| Solar panel | 0.425 × 0.165 | [9] | Long side along X (est.) |
| Blade chord root / widest / tip | 0.031 / 0.122 / 0.007 | [6] | At r 0.055 / 0.207 / 0.605 |
| Blade break line | r 0.40 | derived [4] | "About a third of the way from the tip": 0.605 × 2/3 |

#### Shape in words

A shiny silver-foil box about the size of a tissue box hangs 13 cm above the ground on four thin, dark carbon legs. The legs start at hinges on the top corners of the box and splay out diagonally to small spoon-shaped feet. A thin mast rises from the box through two silver swashplate mechanisms (one under each rotor) and two black hubs. Each hub carries a pair of matte-black paddle blades: widest about a third of the way out, then tapering to a point. The two rotors are 10 cm apart. On top of the mast sits a flat rectangular solar panel, dark cells with a copper-coloured edge, and a thin wire antenna in its centre. Under the box there is a black octagonal window for the navigation camera and altimeter; a small colour-camera lens sits on the front bottom edge (`three-quarter-1.jpg`; see also PIA23969, linked in §7). The silhouette must-haves are the very long blades (more than 6× the box width), the splayed legs, and the panel on top.

#### Node hierarchy

```text
Ingenuity                     origin: on the ground, centre between the 4 feet; the game moves this node over the terrain
├─ Body                       pivot at (0, 0, 0); all meshes; takeoff / hover / land / crash move and tilt it
│  ├─ Body_FoilSilver         fuselage
│  ├─ Body_HullBlack          legs, feet, nav-camera frame
│  ├─ Body_Metal              mast, leg hinges, 2 swashplates, top fitting, antenna
│  ├─ Body_Copper             solar-panel substrate
│  ├─ Body_SolarCell          solar cells (new material)
│  ├─ Body_Visor              2 camera lenses
│  ├─ RotorTop                pivot at (0, 0.452, 0); spins about +Y (counter-clockwise seen from above)
│  │  ├─ RotorTop_HullBlack   hub, 2 grips, inner part of both blades
│  │  ├─ TipTop_1             pivot at (0.40, 0, 0); outer third of blade 1 (flies off in crash)
│  │  └─ TipTop_2             pivot at (-0.40, 0, 0)
│  └─ RotorBottom             pivot at (0, 0.353, 0); spins about -Y (clockwise seen from above)
│     ├─ RotorBottom_HullBlack
│     ├─ TipBottom_1          pivot at (0.40, 0, 0)
│     └─ TipBottom_2          pivot at (-0.40, 0, 0)
└─ FX_Downwash                (0, 0.02, 0), on the ground, child of the root (not Body); emits along local +Y; preset downwash
```

The front (+Z) is the side with the colour camera.

#### Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to its node; rotations in degrees (X, Y, Z).

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Body | box (fuselage) | 0.195 × 0.136 × 0.163 (X × Y × Z) | (0, 0.198, 0) | (0, 0, 0) | FoilSilver | — |
| 2 | Body | cylinder (nav-camera frame, underside) | r 0.035, h 0.006 | (0, 0.127, 0) | (0, 22.5, 0) | HullBlack | 8 |
| 3 | Body | cylinder (nav-camera lens) | r 0.010, h 0.004 | (0, 0.122, 0) | (0, 0, 0) | Visor | 6 |
| 4 | Body | cylinder (colour camera, looks 22° down) | r 0.011, h 0.008 | (0, 0.142, 0.083) | (112, 0, 0) | Visor | 6 |
| 5 | Body | cylinder (mast) | r 0.010, h 0.214 | (0, 0.373, 0) | (0, 0, 0) | Metal | 6 |
| 6 | Body | cylinder (lower swashplate + servos) | r 0.026, h 0.05 | (0, 0.31, 0) | (0, 0, 0) | Metal | 8 |
| 7 | Body | cylinder (upper swashplate + servos) | r 0.024, h 0.05 | (0, 0.40, 0) | (0, 0, 0) | Metal | 8 |
| 8 | Body | box (solar-panel substrate) | 0.425 × 0.008 × 0.165 | (0, 0.484, 0) | (0, 0, 0) | Copper | — |
| 9 | Body | box (solar cells) | 0.405 × 0.003 × 0.150 | (0, 0.4895, 0) | (0, 0, 0) | SolarCell | — |
| 10 | Body | box (top fitting) | 0.045 × 0.012 × 0.035 | (0, 0.497, 0) | (0, 0, 0) | Metal | — |
| 11 | Body | cylinder (UHF antenna) | r 0.0015, h 0.065 | (0, 0.5355, 0) | (0, 0, 0) | Metal | 5 |
| 12–15 | Body | cylinder (leg hinge) × 4 | r 0.009, h 0.03 | (±0.105, 0.28, ±0.09) | same as the leg on that corner | Metal | 6 |
| 16 | Body | tapered cylinder (leg +X +Z) | r top 0.006, r bottom 0.004, h 0.381 | (0.195, 0.143, 0.1875) | (−35.4, 0, 28.2) | HullBlack | 6 |
| 17 | Body | leg −X +Z | same | (−0.195, 0.143, 0.1875) | (−35.4, 0, −28.2) | HullBlack | 6 |
| 18 | Body | leg +X −Z | same | (0.195, 0.143, −0.1875) | (35.4, 0, 28.2) | HullBlack | 6 |
| 19 | Body | leg −X −Z | same | (−0.195, 0.143, −0.1875) | (35.4, 0, −28.2) | HullBlack | 6 |
| 20–23 | Body | cylinder (foot pad) × 4 | r 0.022, h 0.006 | (±0.285, 0.003, ±0.285) | (0, 0, 0) | HullBlack | 6 |
| 24 | RotorTop | cylinder (hub) | r 0.032, h 0.025 | (0, 0, 0) | (0, 0, 0) | HullBlack | 8 |
| 25 | RotorTop | box (grip, blade 1) | 0.03 × 0.012 × 0.02 | (0.045, 0, 0) | (8, 0, 0) | HullBlack | — |
| 26 | RotorTop | box (grip, blade 2) | same | (−0.045, 0, 0) | (−8, 180, 0) | HullBlack | — |
| 27 | RotorTop | extruded outline `B-in` (blade 1) | thickness 0.006 | (0, 0, 0) | (8, 0, 0) | HullBlack | — |
| 28 | RotorTop | `B-in` (blade 2) | thickness 0.006 | (0, 0, 0) | (−8, 180, 0) | HullBlack | — |
| 29 | TipTop_1 | extruded outline `B-tip` | thickness 0.006 | (0, 0, 0) | (8, 0, 0) | HullBlack | — |
| 30 | TipTop_2 | `B-tip` | thickness 0.006 | (0, 0, 0) | (−8, 180, 0) | HullBlack | — |
| 31–37 | RotorBottom, TipBottom_1/2 | same as 24–30 | same | same | pitch sign flipped: (−8, 0, 0) and (8, 180, 0) | HullBlack | — |

Leg rows 16–19 tilt a Y-axis cylinder so that it runs from the hinge (±0.105, 0.28, ±0.09) to the foot (±0.285, 0.006, ±0.285). The pitch (8°, est.) raises the leading edge for each rotor's spin direction. Blade 2 is blade 1 turned 180° about Y (no mirroring).

Blade outlines (x along the span, z across the chord, extruded ±0.003 in Y; from the chord table in [6], made symmetric):

```text
B-in  (r 0.055 → 0.40, in the rotor frame):
(0.055, 0.016) (0.120, 0.043) (0.207, 0.061) (0.319, 0.049) (0.400, 0.041)
(0.400, -0.041) (0.319, -0.049) (0.207, -0.061) (0.120, -0.043) (0.055, -0.016)
B-tip (r 0.40 → 0.605, x measured from the tip pivot):
(0.000, 0.041) (0.061, 0.037) (0.159, 0.026) (0.205, 0.000) (0.159, -0.026) (0.061, -0.037) (0.000, -0.041)
```

#### Simplify

- Drop the blade twist, the swashplate pitch links, the small black counterweights near the hubs, the cables and the laser altimeter.
- Keep the antenna, the nav-camera frame and the leg hinges: they are small, but they read in close-ups and the nav camera is what the minigame is about.
- The blade tips must be separate nodes: the `crash` clip needs them.
- No flag or logo (the real fuselage has none visible; keep it that way).

#### New materials

| Name | Hex | Why |
|---|---|---|
| `SolarCell` | `#27303F` (roughness 0.3, metalness 0.5) | Dark solar cells; no palette entry fits. Fallback: `Pack` (`#2A3550`). Share it with any other minigame that has solar panels (e.g. L-O1). |

#### Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 1,200 (estimate ~880) |
| Meshes | ≤ 14 (planned 12) |
| Main dimensions | rotor 1.21 m, height 0.49 m (panel top), fuselage 0.195 × 0.163 × 0.136 m, rotor gap 0.099 m (±2%) |

### 4.2 scout-waypoint

Game art (no real counterpart): a hoop that marks a scouting point. All values are `game-balance`.

#### Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Hoop inner diameter | 3.0 | game-balance | ≈ 2.5 × rotor diameter |
| Hoop centre height | 3.30 | game-balance | hover altitude 3.0 + the helicopter's mid-height 0.30 |
| Hoop tube radius | 0.06 | game-balance | |
| Pole | Ø 0.06 × 1.68 | game-balance | ground to the bottom of the hoop |
| Ground ring | Ø 1.20 outer, Ø 0.90 inner | game-balance | marks the spot from above |

#### Shape in words

A glowing ring in Helena's colour stands upright, facing ±Z, on a thin grey pole, with a flat ring on the ground below it. You fly through it along Z.

#### Node hierarchy

```text
ScoutWaypoint                origin: on the ground at the foot of the pole
├─ ScoutWaypoint_Metal       pole
├─ ScoutWaypoint_Accent      ground ring
└─ Hoop                      pivot at (0, 3.30, 0); the game swaps the hoop to LedGreen when it is passed
   └─ Hoop_Screen
```

#### Parts

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Hoop | torus (`ring`) | R 1.56, tube 0.06 | (0, 0, 0) | (90, 0, 0) | Screen | 12 × 4 |
| 2 | ScoutWaypoint | cylinder (pole) | r 0.03, h 1.68 | (0, 0.84, 0) | (0, 0, 0) | Metal | 6 |
| 3 | ScoutWaypoint | flat ring | outer 0.60, inner 0.45, h 0.02 | (0, 0.01, 0) | (0, 0, 0) | Accent | 12 |

#### Simplify

- No numbers or text on the hoop; the HUD shows the order.

#### New materials

| Name | Hex | Why |
|---|---|---|
| — | — | Uses `Screen` / `Accent` with Helena's colour `#D7263D` (`createPalette`), and `LedGreen` for "passed". |

#### Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 300 (estimate ~216) |
| Meshes | 3 |
| Main dimensions | hoop inner Ø 3.0 m, centre at y 3.30 m (±2%) |

## 5. Animations

Same format as the avatar animations (AGENTS.md §5.5): each clip is a function `pose(u)` with u ∈ [0, 1], rotations in degrees and positions in metres, relative to the rest pose. Clips that loop end in `_loop` and need pose(0) = pose(1).

| Clip | Model | Duration (s) | Loop | What it shows | Used when (minigame state) |
|---|---|---|---|---|---|
| `rotor_spin_loop` | ingenuity | 0.25 | yes | Both rotors turning, in opposite directions | Whenever the rotors run (separate layer, see below) |
| `takeoff` | ingenuity | 3.0 | no | Lift-off and climb to 3 m at ~1 m/s | Start of flight, after spin-up |
| `hover_loop` | ingenuity | 2.0 | yes | Small bob and wobble at 3 m | Flying (the game moves the root) |
| `land` | ingenuity | 3.0 | no | Descent to 0.3 m, short drop, settle | Landing on textured ground |
| `crash` | ingenuity | 2.5 | no | Navigation lost: erratic descent, hard sideways touchdown, roll to 48°, blade tips snap off, falls back upright | Tracking lost too long over sand, or battery empty over sand |
| — | scout-waypoint | — | — | No clip; the game swaps the material | — |

**Layers:** the body clips key only `Body` and the `Tip*` nodes; `rotor_spin_loop` keys only `RotorTop` and `RotorBottom`. Play the rotor clip on its own layer (a second AnimationPlayer, or an AnimationTree with track filters) and ramp its speed scale: 0 → 1 over 1.0 s before `takeoff`, 1 → 0 over 1.0 s after `land`, and 1 → 0 over 0.3 s at u = 0.65 of `crash`.

Keyframes for each clip (linear between keys unless the Note says ease):

```text
rotor_spin_loop (0.25 s)   1 turn per loop = 240 rpm on screen (game-balance; real 2,400 rpm)
u=0.00  RotorTop: r [0, 0, 0]      RotorBottom: r [0, 0, 0]
u=0.25  RotorTop: r [0, 90, 0]     RotorBottom: r [0, -90, 0]
u=0.50  RotorTop: r [0, 180, 0]    RotorBottom: r [0, -180, 0]
u=0.75  RotorTop: r [0, 270, 0]    RotorBottom: r [0, -270, 0]
u=1.00  RotorTop: r [0, 360, 0]    RotorBottom: r [0, -360, 0]   (= u=0.00, loop)

takeoff (3.0 s)   ease-out after u=0.70
u=0.00  Body: r [0, 0, 0]       p [0, 0, 0]
u=0.10  Body: r [0.5, 0, -0.5]  p [0, 0.02, 0]   feet unload, lift-off
u=0.40  Body: r [1.5, 0, -1]    p [0, 0.95, 0]
u=0.70  Body: r [-1, 0, 1]      p [0, 2.05, 0]
u=1.00  Body: r [0, 0, 0]       p [0, 3.00, 0]   (= hover_loop u=0)

hover_loop (2.0 s)   ease in/out (sine)
u=0.00  Body: r [0, 0, 0]       p [0, 3.00, 0]
u=0.25  Body: r [0.8, 0, -0.6]  p [0.01, 3.04, 0]
u=0.50  Body: r [0, 0, 0]       p [0, 3.00, 0.01]
u=0.75  Body: r [-0.8, 0, 0.6]  p [-0.01, 2.96, 0]
u=1.00  same as u=0.00 (loop)

land (3.0 s)   0.80→0.93 eases in (falling)
u=0.00  Body: r [0, 0, 0]       p [0, 3.00, 0]
u=0.80  Body: r [0, 0, 0]       p [0, 0.30, 0]   ~1.1 m/s descent
u=0.93  Body: r [0, 0, 0]       p [0, 0, 0]      drop from 0.3 m: 0.40 s in Mars gravity (derived), as in the 2018 design [2]
u=0.96  Body: r [0.6, 0, -0.4]  p [0, 0.01, 0]   legs flex
u=1.00  Body: r [0, 0, 0]       p [0, 0, 0]

crash (2.5 s)   follows diagram-1.jpg; Body rolls over its -X feet
u=0.00  Body: r [0, 0, 0]       p [0, 3.00, 0]   (= hover)
u=0.15  Body: r [-4, 0, -9]     p [0.15, 2.70, 0.05]   erratic attitude, navigation lost
u=0.30  Body: r [5, 0, 6]       p [0.35, 2.00, -0.05]
u=0.45  Body: r [-3, 0, 9]      p [0.30, 0.90, 0.05]   sliding toward -X
u=0.55  Body: r [0, 0, 6]       p [0, 0.03, 0]   hard touchdown on the -X feet (~3.5 m/s down, ~1.2 m/s sideways)
u=0.65  Body: r [0, 0, 48]      p [-0.09, 0.21, 0]   lower blade strikes the ground; all tips snap
u=0.80  Body: r [0, 0, 12]      p [-0.01, 0.06, 0]
u=0.90  Body: r [0, 0, 2]       p [0, 0.01, 0]
u=1.00  Body: r [0, 0, 0]       p [0, 0, 0]      upright, blades broken (like the real one, in-context-2.jpg)
Tips (in their rotor's frame; rest until u=0.65):
u=0.65  TipTop_1, TipTop_2, TipBottom_1, TipBottom_2: r [0, 0, 0]  p [0, 0, 0]
u=0.80  TipTop_1: r [30, 270, 0]  p [0.45, 0.10, 0.10]     TipTop_2: r [-30, -250, 0]  p [-0.40, 0.08, -0.15]
        TipBottom_1: r [20, -260, 0]  p [0.35, 0.05, -0.10]  TipBottom_2: r [-20, 280, 0]  p [-0.50, 0.06, 0.10]
u=1.00  TipTop_1: r [0, 540, 0]  p [1.00, -0.45, 0.20]     TipTop_2: r [0, -500, 0]  p [-0.90, -0.45, -0.30]
        TipBottom_1: r [0, -520, 0]  p [0.80, -0.35, -0.25]  TipBottom_2: r [0, 560, 0]  p [-1.10, -0.35, 0.15]
        (y = -rotor height, so the tips lie on the ground once the Body is upright)
```

The real rpm (2,400) is in section 1; 240 rpm on screen is `game-balance`.

## 6. Particles and effects

| Anchor | Model | Preset (`tools/modeling/lib/fx-presets.mjs`) or new | Clips | Note |
|---|---|---|---|---|
| `FX_Downwash` | ingenuity | `downwash` (new) | takeoff, hover_loop, land, crash | A child of the root, so it stays on the ground under the helicopter. The game scales its rate with the Body's height: 100% at ≤ 1 m, 30% at 3 m, 0 above 6 m (game-balance). In `crash`, ×3 rate for 0.5 s after touchdown ("brownout", diagram-1.jpg). If no new preset is wanted, use `dust`. |

New preset (SI units; the real air speed under the rotor is ~13 m/s (`downwash_speed`), and the dust moves slower, so the speeds are `game-balance`):

```js
downwash: {
  description: 'Poeira levantada pelo vento dos rotores (Ingenuity)',
  colors: ['#D08A55', '#8E5A3A'],
  blending: 'normal',
  rate: 120,
  life: [0.6, 1.4],
  speed: [1.5, 4.0],
  spread: 80,
  size: [0.08, 0.30],
  gravity: MARS_GRAVITY,
},
```

## 7. Images

All images in this folder, only with a free license (public domain, CC0, CC BY, CC BY-SA). File name: `<view>-<n>.jpg`; views: `side`, `three-quarter`, `front`, `top`, `detail`, `diagram`, `in-context`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| `three-quarter-1.jpg` | three-quarter | The flight model in the clean room (2020). **Main shape reference**: foil box, splayed legs with spoon feet, paddle blades, silver swashplates, copper-edged panel and antenna. Used for the rotor heights. | [NASA PIA23882](https://images.nasa.gov/details/PIA23882) | NASA/JPL-Caltech | Public domain (NASA/JPL) |
| `in-context-1.jpg` | in-context | On Jezero's surface before the first flight (Mastcam-Z, 5 Apr 2021), seen from above. Take: the foot span against the panel width, and the muted colours in Mars light. | [NASA PIA24547](https://images.nasa.gov/details/PIA24547) | NASA/JPL-Caltech/ASU | Public domain (NASA/JPL) |
| `in-context-2.jpg` | in-context | The final airfield (4 Feb 2024): the helicopter is the tiny dark dot on smooth sand ripples. Take: what the sand hazard looks like. Enhanced colour. | [NASA PIA26236](https://images.nasa.gov/details/PIA26236) | NASA/JPL-Caltech/ASU/MSSS | Public domain (NASA/JPL) |
| `diagram-1.jpg` | diagram | NASA graphic of the most likely Flight 72 hard landing: erratic attitude, roll on contact, blade tips failing, brownout. Take: the `crash` sequence. | [NASA PIA26482](https://images.nasa.gov/details/PIA26482) | NASA/JPL-Caltech | Public domain (NASA/JPL) |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://images.nasa.gov/details/PIA24545 — the solar panel from above, with the 425 × 165 mm caption, cell layout and centre antenna (freely licensed; not downloaded, to keep 4 images).
- https://images.nasa.gov/details/PIA23969 — the underside: the octagonal nav-camera/altimeter window and the colour camera (freely licensed; not downloaded).
- https://images.nasa.gov/details/PIA24666 — video of the dust kicked up on the 4th flight, as a reference for `downwash` (freely licensed; video).

## 8. Gaps and cautions

- **Rotor rpm ⚠:** 2,400 (press kit), 2,600 (design), 2,700 (flight limit from late 2021), 2,800 (design maximum and ground test). Show 2,400 unless the game models seasons.
- **Fuselage axes** are est.: the source gives three numbers without saying which is the height. **Height 0.49 m**: the source doesn't say if the antenna is included. The rotor-plane heights, the foot spread, the mast and antenna sizes, and the 8° blade pitch are est. from photos; only the 0.099 m rotor gap is sourced.
- **Spin direction** of each rotor: n/f. We chose the top rotor counter-clockwise seen from above.
- **Blades** are simplified: symmetric outline, no twist.
- **Radio rate ⚠:** "250 kilobytes per second" in the press kit [1], 250 kbps in the design paper [2]. Data volume per flight: n/f.
- **Longest flight time:** secondary sources give 169.5 s (Flight 12); not confirmed at NASA, so not used.
- **"Times farther than planned" ⚠:** NASA said "more than 14 times" [10] and later "more than 30 times" [4]. Keep it out of the fact card.
- **Crash:** the real helicopter stayed upright after Flight 72, with all 4 blades broken about a third from the tip and one blade torn off at its root [4]. The clip rolls to 48° and back and only drops the tips. For a full tip-over, change the u=0.65–1.00 keys.
- **Landing drop:** the passive drop from 0.3 m comes from the 2018 design paper [2]; whether the flown software did exactly this was not checked.
- **Status:** the flight mission is over, but in Dec 2024 NASA said Ingenuity "still beams weather and avionics test data to the Perseverance rover about once a week" [4]. Recheck before showing it as "retired".
- **Colours:** Helena's model accent `#D7263D` differs from her interface colour (`docs/visual-identity.md` ⚠ pending). `SolarCell` is a new material proposal.
- **Game hover altitude** is fixed at 3 m (Flight 1); later real flights went to 10–24 m.

## 9. Sources

1. NASA/JPL, *Ingenuity Mars Helicopter Landing Press Kit*, Feb 2021. https://www.jpl.nasa.gov/news/press_kits/mars_2020/download/ingenuity_landing_press_kit.pdf (accessed 2026-11-15)
2. Balaram, J., Canham, T., Duncan, C., Golombek, M., Grip, H. F., Johnson, W., Maki, J., Quon, A., Stern, R., Zhu, D., *Mars Helicopter Technology Demonstrator*, AIAA SciTech 2018 (AIAA 2018-0023). https://rotorcraft.arc.nasa.gov/Publications/files/Balaram_AIAA2018_0023.pdf (accessed 2026-11-15)
3. NASA Science, *Ingenuity Mars Helicopter* (mission page and tech specs). https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/ (accessed 2026-11-15)
4. NASA, *NASA Performs First Aircraft Accident Investigation on Another World*, 11 Dec 2024. https://www.nasa.gov/missions/mars-2020-perseverance/ingenuity-helicopter/nasa-performs-first-aircraft-accident-investigation-on-another-world/ (accessed 2026-11-15)
5. NASA, *NASA's Ingenuity Mars Helicopter Succeeds in Historic First Flight*, 19 Apr 2021. https://www.nasa.gov/news-release/nasas-ingenuity-mars-helicopter-succeeds-in-historic-first-flight/ (accessed 2026-11-15)
6. Koning, W. J. F., Dominguez, M., *Mars Helicopter Ingenuity Rotor Geometry*, NASA TM, 2024 (NTRS 20240001510). https://ntrs.nasa.gov/citations/20240001510 (accessed 2026-11-15)
7. NASA JPL, *NASA Pushes Next-Gen Mars Helicopter Rotor Blades Past Mach 1*, 7 May 2026. https://www.jpl.nasa.gov/news/nasa-pushes-next-gen-mars-helicopter-rotor-blades-past-mach-1/ (accessed 2026-11-15)
8. Karras, J. (NASA Science blog), *2,800 RPM Spin a Success, but Flight 14 Delayed to Post Conjunction*, 28 Sep 2021. https://science.nasa.gov/blog/2800-rpm-spin-a-success-but-flight-14-delayed-to-post-conjunction/ (accessed 2026-11-15)
9. NASA/JPL-Caltech/ASU/MSSS, *Mars Helicopter's Solar Array as Seen by Perseverance's Mastcam-Z* (PIA24545), 2021. https://images.nasa.gov/details/PIA24545 (accessed 2026-11-15)
10. NASA JPL, *After Three Years on Mars, NASA's Ingenuity Helicopter Mission Ends*, 25 Jan 2024. https://www.jpl.nasa.gov/news/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/ (accessed 2026-11-15)
11. NASA Image and Video Library, PIA23882, PIA24547, PIA26236, PIA26482 (images in §7). https://images.nasa.gov (accessed 2026-11-15)
