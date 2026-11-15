---
id: merlin-1d-vacuum
name: Merlin 1D Vacuum (MVac, Falcon 9 Block 5)
category: engine
role: upper-stage
tier: 2
propellants: [LOX, RP-1]
manufacturer: SpaceX
vehicles: ["Falcon 9 stage 2", "Falcon Heavy stage 2"]
status: operational (checked 2026-11)
---

# Merlin 1D Vacuum

The single engine of the Falcon 9 (and Falcon Heavy) second stage: a Merlin 1D gas-generator kerosene engine with a huge, fixed, radiatively cooled **niobium-alloy nozzle extension** (165:1). The turbine exhaust is fed into a ring manifold around the nozzle instead of a separate exhaust pipe. It restarts with TEA-TEB and is thrown away on every launch.

**Why tier 2:** about 38× the thrust of the Rutherford Vacuum with similar Isp, flown hundreds of times; much less efficient than hydrogen (RL10) or methane vacuum engines (Raptor Vacuum) but cheap and dense.

## 1. Game data

Values the game uses for mass, Δv, burn time, power and cost. One row per key, in this order.

- **Source** column: `[n]` points to section 7; `derived` = calculated here from other rows (show the formula in Note); `est.` = estimated by us (say how in Note).
- **Marks:** `⚠` sources diverge (give both values in Note); `n/f` not found.
- Keep the key names: they are the same in every part, so a script can read the tables.

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `mass_dry` | n/f | kg | | not published; the sea-level Merlin 1D is quoted at ~470 kg (1,030 lb, Tom Mueller on Quora, via Wikipedia) ⚠ — MVac adds the nozzle extension |
| `thrust_sl` | n/a | kN | | vacuum-only |
| `thrust_vac` | 981 | kN | [1] | 220,500 lbf (stage total, 1 engine). Short-nozzle variant: ~10% less (see note below) |
| `isp_sl` | n/a | s | | |
| `isp_vac` | 348 ⚠ | s | [3] | SpaceX Falcon 9 web page 2015–2018 (archived, via Wikipedia); the current user's guide gives no Isp |
| `mass_flow` | 287 | kg/s | derived | `thrust_vac / (isp_vac · g0)` = 981,000 / (348 × 9.80665) |
| `mixture_ratio` | n/f | O/F by mass | | not published |
| `cycle` | gas generator | — | [1] | turbopump-fed; turbine exhaust dumped into the nozzle manifold |
| `chamber_pressure` | 9.7 ⚠ | MPa | [3] | 1,410 psi for the 2011 Merlin 1D (Aviation Week via Wikipedia); later uprated versions not published |
| `expansion_ratio` | 165 | — | [1] | "fixed 165:1 expansion nozzle" |
| `throttle_min` | 64 | % | [1] derived | 140,679 / 220,500 lbf. The 2015 guide (via Wikipedia) gave 39% ⚠ |
| `gimbal_range` | n/f | ° | | engine gimbals for pitch/yaw; roll by nitrogen thrusters [1] |
| `restarts` | ≥ 2 | count | [1] | "Restart capability: Yes"; standard GTO and LEO profiles use two starts (SES-1, SES-2) |
| `burn_time_max` | 397 ⚠ | s | [3] | SpaceX Falcon 9 page (read through search index; the page needs JavaScript). User's guide timelines: SES-1 to SECO-1 = 326 s (GTO) and 358 s (LEO) [1] |
| `total_impulse` | n/f | MN·s | | stage propellant not published |
| `power_electric` | n/f | W | | turbine-driven; avionics power not published |
| `ignition` | TEA-TEB | — | [1] | dual redundant pyrophoric igniters |
| `reusable` | no | — | [1] | the second stage is expended on every launch |
| `cost_unit` | n/f | USD (year) | | |
| `twr` | n/f | — | derived | needs `mass_dry` |
| `height` | 5.5 (est.) | m | est. | see section 3 |
| `diameter_max` | 3.3 ⚠ | m | [3] | nozzle exit; Wikipedia infobox, unsourced. Cross-check (est.): M1D throat from 0.92 m exit / √16 ⚠ = 0.23 m → × √165 = 2.95 m |
| `first_flight` | 2013 | year | [1] | Falcon 9 v1.1 (first with Merlin 1D), flown from 2013 |
| `flights` | ≈ 700 ⚠ | count | [2] | SpaceX site counter: 700 Falcon 9 launches; one MVac per launch, minus 5 early v1.0 flights (Merlin 1C Vacuum), plus Falcon Heavy flights |

**Short-nozzle MVac (variant, flying):** first flown on Transporter-7 (2023-04-15). SpaceX said on the webcast the shorter, cheaper nozzle extension is used on lighter missions and the long one on high-performance missions [4]. Secondary sources: ~10% less vacuum thrust (~840 kN vs 934 kN), ~75% less niobium per nozzle ⚠ [3]. Exact thrust, Isp and length not published.

## 2. Vehicle and stage data

| Key | Value | Unit | Source | Note |
|---|---|---|---|---|
| `vehicle` | Falcon 9 Block 5 | — | [1] | same second stage on Falcon Heavy |
| `stage` | stage 2 | — | [1] | |
| `parts_per_stage` | 1 | count | [1] | |
| `stage_mass_dry` | n/f | kg | | SpaceX does not publish it; ~4 t is quoted by secondary sources (not verified) |
| `stage_propellant_mass` | n/f | kg | | ~111.5 t is quoted by secondary sources (not verified) |
| `stage_burn_time` | 397 ⚠ | s | [3] | see `burn_time_max` |
| `stage_delta_v` | n/f | m/s | derived | needs stage masses |
| `vehicle_liftoff_mass` | 549,054 ⚠ | kg | [5] | SpaceX Falcon 9 page, via search index |
| `vehicle_height` | 70 | m | [1] | with standard fairing; 75.2 m with extended fairing |
| `vehicle_diameter` | 3.66 | m | [1] | |
| `payload_leo` | 22,800 ⚠ | kg | [5] | expendable; ~17,400 kg flown with booster recovery (Starlink) ⚠ |
| `payload_gto` | 8,300 ⚠ | kg | [5] | expendable |
| `payload_mars` | 4,020 ⚠ | kg | [5] | SpaceX figure, C3 not stated, expendable |
| `cost_launch` | ≈ 74 M ⚠ | USD (2026) | [6] | reported 2026 list price (secondary); SpaceX's price sheet was not reachable |
| `mars_heritage` | none | — | | no Mars mission has launched on Falcon 9; Falcon Heavy's 2018 demo sent a car into a Mars-crossing solar orbit |

## 3. Geometry

| Dimension | Value (m) | Source | Note |
|---|---|---|---|
| Stage diameter | 3.66 | [1] | nozzle exit must fit inside the interstage |
| Nozzle exit diameter | 3.3 ⚠ | [3] | see `diameter_max` |
| Overall height | 5.5 (est.) | est. | 0.9 m powerhead + regen section (detail-1.jpg, scaled to a ~1.25 m wide manifold torus) + extension from r 0.58 to r 1.65 at the ~15° half-angle seen in detail-2.jpg |
| Regen nozzle exit / manifold torus | ≈ 1.2 / 1.5 (est.) | est. | detail-1.jpg, relative to the 1.05 m wide shipping-skid base plate (est.) |
| Extension half-angle | ≈ 15° (est.) | est. | detail-2.jpg (2009 niobium extension, side view) |

## 4. Low-poly model

Follow the conventions in [../../parts.md](../../parts.md#3d-model-conventions).

### 4.1 Shape in words

Top third: a dense, silver **powerhead** (detail-1.jpg) — the thrust frame and gimbal block on top, the chamber in the middle, a big turbopump on one side with braided lines. Just below, the short silver regen bell ends in a fat **torus manifold** (turbine exhaust) that wraps the nozzle. Bottom two thirds: a very large, smooth, dark-grey **niobium extension** shaped like a slightly curved cone, open at the bottom (three-quarter-1.jpg, detail-2.jpg). In flight it glows orange. The silhouette is "small machine on top of a giant lampshade".

### 4.2 Node hierarchy

```text
Merlin1DVacuum                origin: mount interface (top of thrust frame)
├─ Attach_Top                 (0, 0, 0)
├─ Gimbal                     pivot at (0, -0.10, 0); all engine meshes go here
│  └─ Gimbal_Steel, Gimbal_Metal, Gimbal_NozzleDark
└─ FX_Exhaust                 (0, -5.5, 0), rotation [180, 0, 0], preset exhaust_kerolox
```

### 4.3 Parts

| # | Node | Primitive | Size (m) | Position (m) | Rotation (°) | Material | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Gimbal | cylinder (gimbal block) | r 0.22, h 0.20 | (0, -0.10, 0) | (0, 0, 0) | Metal | 8 |
| 2 | Gimbal | lathe (injector dome + chamber + regen bell) | profile A | (0, 0, 0) | (0, 0, 0) | Steel | 16 |
| 3 | Gimbal | cylinder (turbopump) | r 0.17, h 0.55 | (0.45, -0.60, 0) | (0, 0, 0) | Steel | 8 |
| 4 | Gimbal | cylinder (gas generator) | r 0.08, h 0.30 | (0.30, -0.55, 0.30) | (0, 0, 0) | Steel | 8 |
| 5 | Gimbal | torus (exhaust manifold) | R 0.65, tube r 0.12 | (0, -1.50, 0) | (90, 0, 0) | Steel | 16 × 6 |
| 6 | Gimbal | lathe (niobium extension) | profile B | (0, 0, 0) | (0, 0, 0) | NozzleDark | 16 |
| 7 | Gimbal | cylinder (turbine exhaust duct) | r 0.09, h 0.75 | (0.50, -1.10, 0) | (0, 0, 15) | Steel | 6 |
| 8 | Gimbal | cylinder (LOX feed pipe) | r 0.07, h 0.45 | (0.25, -0.30, -0.15) | (0, 0, 60) | Metal | 6 |
| 9 | Gimbal | cylinder (TVC actuator) | r 0.04, h 0.90 | (0, -0.55, 0.40) | (-15, 0, 0) | Metal | 6 |
| 10 | Gimbal | cylinder (TVC actuator) | r 0.04, h 0.90 | (-0.40, -0.55, 0) | (0, 0, -15) | Metal | 6 |

### 4.4 Revolved profiles

```text
A powerhead+regen: (0.15, -0.20) (0.30, -0.30) (0.30, -0.80) (0.18, -0.95) (0.12, -1.02) (0.30, -1.20) (0.50, -1.42) (0.58, -1.55)
B extension:       (0.58, -1.55) (0.80, -2.20) (1.05, -3.00) (1.28, -3.80) (1.48, -4.70) (1.65, -5.50)
```

### 4.5 Simplify

- Merge the braided lines, sensors and wiring into the turbopump and gimbal block.
- Keep the torus manifold: it is the visual cue that this is a Merlin Vacuum.
- Short-nozzle variant: same model with profile B cut at about y = -3.8 (est.).

### 4.6 Budget and checks

| Check | Target |
|---|---|
| Triangles | ≤ 1,500 (est. ~800) |
| Meshes | ≤ 4 |
| Height / diameter | 5.5 (est.) / 3.3 (±2%) |

## 5. Images

All images in this folder. Views: `side`, `three-quarter`, `front`, `top`, `bottom` (aft/nozzle exit), `detail`, `diagram`, `in-context` (installed on the vehicle). File name: `<view>-<n>.jpg`.

| File | View | What it shows (and what to take from it) | Source | Author | License |
|---|---|---|---|---|---|
| detail-1.jpg | detail | Merlin Vacuum powerhead and regen section in a shipping container, without the niobium extension: gimbal block on top, turbopump, braided lines, the fat torus manifold at the bottom. Proportions of the top third. | https://commons.wikimedia.org/wiki/File:A_Merlin_vacuum_engine_prepares_to_be_shipped_for_testing.jpg | SpaceX | CC0 |
| three-quarter-1.jpg | three-quarter | Complete Merlin Vacuum hanging at SpaceX HQ, seen from below: dark extension, silver powerhead, open exit. Older Merlin 1C Vacuum, but the same layout. | https://commons.wikimedia.org/wiki/File:Dragon_%26_Mvac_Hawthorne.jpg | SpaceX | CC0 |
| detail-2.jpg | detail | 2009 niobium nozzle extension on a stand, side view: near-conical bell made of welded sheet panels; gives the half-angle. Ignore the paper sign. | https://commons.wikimedia.org/wiki/File:Merlin_nozzle_4105129088_9659a4df4e_o.jpg | Steve Jurvetson | CC BY 2.0 |

**Linked only** (useful but not freely licensed, so not downloaded):

- https://www.spacex.com/vehicles/falcon-9/ — SpaceX vehicle page with second-stage renders.
- https://www.spacex.com/assets/media/falcon-users-guide-2025-05-09.pdf — Falcon User's Guide, Figure 2-1 vehicle overview.

## 6. Gaps and cautions

- SpaceX publishes thrust, expansion ratio and throttle range but not mass, Isp (current), chamber pressure or dimensions; Isp, burn time, payloads and liftoff mass come from SpaceX's website through archives/search (⚠).
- Height is our estimate; exit diameter is an unsourced Wikipedia value with an independent cross-check (~3.0 m).
- Short-nozzle variant data are secondary only.
- No SpaceX logo or text on the model.

## 7. Sources

1. SpaceX, *Falcon User's Guide*, 2025-05-09, §1–2 (Table 2-1) and §10 (Tables 10-3, 10-4). https://www.spacex.com/assets/media/falcon-users-guide-2025-05-09.pdf (accessed 2026-11-14)
2. SpaceX website statistics feed used by spacex.com/vehicles/falcon-9 (totalLaunches 700). https://content.spacex.com/api/spacex-website/falcon-nine-stats (accessed 2026-11-14)
3. Wikipedia, *SpaceX Merlin* and *Falcon 9* (secondary; cite the archived SpaceX Falcon 9 page 2015–2018, the 2015 Falcon 9 user's guide and Aviation Week 2011). https://en.wikipedia.org/wiki/SpaceX_Merlin (accessed 2026-11-14)
4. Foust, J., *SpaceX launches seventh Transporter rideshare mission*, SpaceNews, 2023-04-15 (paywalled; nozzle statement read from search excerpt). https://spacenews.com/spacex-launches-seventh-transporter-rideshare-mission/ (accessed 2026-11-14)
5. SpaceX, *Falcon 9* vehicle page (JavaScript page; values read through search-engine excerpts). https://www.spacex.com/vehicles/falcon-9/ (accessed 2026-11-14)
6. Secondary price reports, e.g. *SpaceX's Starlink dominates Falcon 9 launches, with prices at $74 million*, NewsBytes, 2026. https://www.newsbytesapp.com/news/science/spacexs-starlink-dominates-falcon-9-launches-with-prices-at-74-million/tldr (accessed 2026-11-14)
