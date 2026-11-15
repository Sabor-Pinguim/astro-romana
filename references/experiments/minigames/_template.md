---
# Copy this file to references/experiments/minigames/<id>/README.md and fill every field.
# Keep the section order and the key names. Unknown values: n/f. Do not delete rows.
id: <kebab-case, same as the folder, e.g. h-s1-ingenuity>
experiment: <code in docs/minigames.md, e.g. H-S1>
name: <experiment name in the game, e.g. Helicopter flight>
owner: <helena | lucas | oscar | maya>
minigame: <minigame name and mechanic, e.g. "Scout" (piloting)>
real_basis: [<real hardware and mission, e.g. "Ingenuity Mars Helicopter (Mars 2020)">]
catalog_refs: [<codes in ../../mars-experiments.md, e.g. EN9>]
models: [<ids of the models this minigame needs, kebab-case>]
status: <operating | retired | lost | in-development> (checked <YYYY-MM>)
---

# <Code> · <Name>

<2–4 sentences: the real experiment, what the minigame asks the player to do, and what the models show.>

## 1. Real data

Numbers the minigame uses or shows to the player. One row per key.

- **Source** column: `[n]` points to section 9; `derived` = calculated from other rows (formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass` | | kg | | instrument or vehicle, as flown |
| `power_electric` | | W | | while operating |
| `size` | | m | | width × depth × height of the main body |
| `operating_time` | | s | | one run, flight or pass |
| `data_volume` | | Mbit | | per run; `n/a` if none |
| `first_use_on_mars` | | year | | |
| `uses_on_mars` | | count | | runs, flights or passes, as of the check date |
| <experiment-specific keys, e.g. `rotor_rpm`, `operating_temperature`, `laser_wavelength`, `data_rate`> | | | | |

## 2. Minigame

- **Goal:** <one sentence: what the player does>
- **Mechanic:** <keep in range | timing | aim | pattern search | choice under a limit | piloting>
- **Loop:** <step by step: what appears on screen, the input, what success and failure look like>
- **Success / failure:** <the consequences in docs/minigames.md>
- **Fact card:** <one true sentence shown at the end, with its source `[n]`. Never invent facts.>

Numbers that drive the minigame:

| Parameter | Value | Unit | Real or `game-balance` | From (section 1 key or source) |
|---|---|---|---|---|

## 3. Models

One row per model the minigame needs; each gets a subsection in section 4.

| Model id | What it is | Shown where | Budget (triangles / meshes) |
|---|---|---|---|

## 4. Low-poly models

Instructions for whoever (person or AI) generates the models. Same conventions as the avatars and rocket parts ([AGENTS.md](../../../../AGENTS.md) §5, [parts.md](../../../parts/parts.md#3d-model-conventions)):

- **Units and axes:** metres at real size (1:1); +Y up; the front faces +Z; the origin is stated per model (usually on the ground, between the feet or wheels, or at the mounting point).
- **Style:** non-indexed geometry with one normal per face (flat shading); no textures; cylinders with 5 to 10 sides.
- **Materials:** only from `tools/modeling/lib/palette.mjs` (`Suit`, `SuitGrey`, `Helmet`, `Visor`, `VisorGold`, `Pack`, `Metal`, `Glove`, `GloveTip`, `Boot`, `Sole`, `Strap`, `Bag`, `Lamp`, `LedGreen`, `LedRed`, `Hull`, `HullBlack`, `Foam`, `Steel`, `Aluminum`, `Titanium`, `Copper`, `NozzleDark`, `FoilGold`, `FoilSilver`, plus `Accent` and `Screen` for the owner's color). A new material goes in the "New materials" table with a hex color and a reason.
- **Moving parts:** children of an empty pivot node placed at the joint; meshes are named `<Node>_<Material>`. No negative scale (mirror by position).
- **Symbols:** no real logos, flags or insignia; no red cross.

### 4.1 <Model id>

#### Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|

#### Shape in words

<What you see from each side, top to bottom; which features define the silhouette and must stay. Refer to the images by file name.>

#### Node hierarchy

```text
<ModelName>                  origin: <where>
├─ <Pivot>                   pivot at (x, y, z); what moves
│  └─ ...
└─ FX_<Name>                 emits along local +Y; preset <name>
```

#### Parts

One row per primitive. Positions are the centre of the primitive in metres, relative to its node; rotations in degrees (X, Y, Z).

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|

#### Simplify

- <What to merge or drop; what to keep even if small.>

#### New materials

| Name | Hex | Why |
|---|---|---|

#### Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ <n> |
| Meshes | ≤ <n> |
| Main dimensions | <values from Geometry, ±2%> |

## 5. Animations

Same format as the avatar animations (AGENTS.md §5.5): each clip is a function `pose(u)` with u ∈ [0, 1], rotations in degrees and positions in metres, relative to the rest pose. Clips that loop end in `_loop` and need pose(0) = pose(1).

| Clip | Model | Duration (s) | Loop | What it shows | Used when (minigame state) |
|---|---|---|---|---|---|

Keyframes for each clip (linear between keys unless the Note says ease):

```text
<clip> (<duration> s)
u=0.00  <Node>: r [x, y, z]  p [x, y, z]
u=0.50  <Node>: ...
u=1.00  same as u=0.00 (loop)
```

Real rates (rpm, scan speed, pass length) go in section 1 with their source. If the real rate is too fast or too slow to read on screen, give the game value here and mark it `game-balance`.

## 6. Particles and effects

| Anchor | Model | Preset (`tools/modeling/lib/fx-presets.mjs`) or new | Clips | Note |
|---|---|---|---|---|

A new preset lists its numbers in SI units (rate, lifetime, speed, size, colors), like the existing ones.

## 7. Images

All images in this folder, only with a free license (public domain, CC0, CC BY, CC BY-SA). File name: `<view>-<n>.jpg`; views: `side`, `three-quarter`, `front`, `top`, `detail`, `diagram`, `in-context`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|

**Linked only** (useful but not freely licensed, so not downloaded):

- <url> — <what it shows>

## 8. Gaps and cautions

- <Values not found, sources that disagree, status to recheck, details to leave off the model.>

## 9. Sources

1. <Author or organization, *title*, year. URL (accessed YYYY-MM-DD)>
