# Mars Mission Experiment Catalog

A game-ready catalog of experiments, instruments and technologies that a Mars mission can use **today**, with real mass, power, data and status figures. It also covers the real constraints any Mars mission has to live with.

- **Compiled:** 2026-11-14 from NASA, JPL, ESA, JAXA, CNSA, MBRSC, NSSDCA and peer-reviewed papers.
- **Companion file:** [experiments.md](experiments.md). IDs such as `P10` or `E2` refer to entries there, which have more history and context.

## How to read this file

**Status tags:** what can be picked for a mission launching in the next window (late 2028).

| Tag | Meaning | Usable in game now? |
|---|---|---|
| `OPERATING` | Working at Mars right now | Yes |
| `FLOWN` | Proven at Mars; that mission has ended | Yes (hardware design is proven) |
| `READY` | Built, or on its way to Mars, but not yet working there | Yes |
| `SPACE-PROVEN` | Proven on the ISS or in deep space, never used at Mars | Yes for crewed missions / with some risk |
| `EARTH-TESTED` | Tested on the ground or in Earth orbit only | "Future tech" unlock |
| `IN DEVELOPMENT` | Funded or proposed, not yet built | "Future tech" unlock |

**Platform tags:**
- `ORBITER`
- `LANDER`
- `ROVER-MAST`, `ROVER-ARM`, `ROVER-BODY`: where the instrument sits on a rover.
- `AIR`: helicopter.
- `CREW`: only makes sense on a crewed mission or habitat.

**Markers:**
- **⚠**: sources conflict, or the number comes only from a secondary source or search snippet.
- **n/f**: not found in public sources. Use a balanced fictional value.
- **(calc.)**: our own arithmetic from sourced numbers.

## Contents

1. [Mars mission constraints](#1-mars-mission-constraints)
2. [The Mars fleet today](#2-the-mars-fleet-today)
3. [Physicist](#3-physicist)
4. [Geologist](#4-geologist)
5. [Biologist](#5-biologist)
6. [Engineer](#6-engineer)
7. [Dependencies between experiments (tech tree)](#7-dependencies-between-experiments-tech-tree)
8. [Data cost of experiments](#8-data-cost-of-experiments)
9. [Mapping to optional specializations](#9-mapping-to-optional-specializations)
10. [Not usable today: lessons and events](#10-not-usable-today-lessons-and-events)
11. [Known gaps](#11-known-gaps)

---

## 1. Mars mission constraints

| Constraint | Real value | What it means for the game | Source |
|---|---|---|---|
| Launch windows | Every **~26 months**. The late-2026 window was used by ESCAPADE (departure burns 7–9 Nov 2026). The next window is **late 2028**, targeted by SkyFall, Rosalind Franklin and the MTN orbiter. | Missing a window means a 26-month delay | [NASA ESCAPADE](https://science.nasa.gov/blogs/escapade/2026/11/02/nasas-twin-escapade-spacecraft-to-slingshot-past-earth-on-way-to-mars/) |
| Transit time | Ideal transfer ~259 days. Perseverance took ~203 days; ESCAPADE ~10 months. | Cruise eats lifetime and (for crews) radiation dose | [JPL edu](https://www.jpl.nasa.gov/edu/resources/lesson-plan/lets-go-to-mars-calculating-launch-windows/) |
| Earth–Mars distance | 54.6 to 401.4 million km | Data rate changes a lot over the mission | [NSSDCA Mars fact sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html) |
| One-way light time | ~3 to ~22 min (calc. from distances); a NASA white paper says 4–24 min ⚠ | No "joystick" driving: autonomy matters | NSSDCA; [NTRS ASCEND](https://ntrs.nasa.gov/api/citations/20220013418/downloads/ASCEND-Communication%20Delays,%20Disruptions,%20and%20Blackouts%20for%20Crewed%20Mars%20Missions.pdf) ⚠ |
| Solar conjunction | Every ~26 months the Sun blocks contact for **~2–3 weeks**. The last one ran 29 Dec 2025 – 16 Jan 2026; the next is ~Mar 2028 ⚠ | Recurring "blackout" event: no commands | [JPL](https://www.jpl.nasa.gov/news/whats-mars-solar-conjunction-and-why-does-it-matter/) · [NASA MAVEN blog](https://science.nasa.gov/blogs/maven/2025/12/23/nasa-works-maven-spacecraft-issue-ahead-of-solar-conjunction/) |
| Gravity | 3.73 m/s² (0.38 g) | Crew health is unknown for long stays; launching from the surface is easier than from Earth | NSSDCA |
| Surface pressure | 6.36 mbar on average (4.0–8.7 by season), ~0.6% of Earth's | Parachutes help only partly; helicopters need huge, fast rotors | NSSDCA |
| Atmosphere | CO₂ 95.1%, N₂ 2.59%, Ar 1.94%, O₂ 0.16% | Feedstock for MOXIE oxygen | NSSDCA |
| Temperature | Average −59 °C. Viking 1 site: −89 to −31 °C in a day. Extremes +20 to −153 °C | Heaters cost power; some instruments prefer cold | NSSDCA · [NASA facts](https://science.nasa.gov/mars/facts/) |
| Day and year | Sol = 24 h 39 min; year = 687 Earth days (~669 sols) | Use sols as the game's turn unit | NSSDCA |
| Sunlight | 586 W/m², **43% of Earth's** | Solar arrays must be ~2.3× larger than at Earth for the same power (calc.) | NSSDCA |
| Dust | Global storms ~every 3 Mars years (~5.5 Earth years) ⚠. The 2018 storm ended Opportunity. Dust on panels ended InSight and Zhurong | Solar power decays; storm event | [NASA Astrobiology](https://astrobiology.nasa.gov/news/forecasting-martian-dust-storms/) |
| Wind | 2–7 m/s normally; 17–30 m/s in dust storms (Viking sites) | Seismometer noise; helicopter flight limits | NSSDCA |
| Radiation | Cruise ~1.8 mSv/day; surface ~0.67 mSv/day; ~1 Sv for a 500-day stay plus transits | Crew dose budget (see `P10`) | [JPL](https://www.jpl.nasa.gov/news/data-from-nasa-rovers-voyage-to-mars-aids-planning/) |
| Entry, descent, landing (EDL) | Entry at ~19,500 km/h. EDL lasts **~7 min**, shorter than the light time, so it must be fully autonomous. Heat shield peak ~1,300 °C ⚠. Parachute opens at ~11 km and 1,512 km/h | No human can intervene during landing | [JPL Mars 2020 landing press kit](https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission/) |
| Landing-site limits | Curiosity could land only between 45°N and 45°S, at elevations up to about +1 km ⚠ | Higher ground means thinner air and less braking | [MSL Engineering User Guide](https://marsoweb.nas.nasa.gov/landingsites/msl/memoranda/MSL_Eng_User_Guide_v2.pdf) ⚠ |
| Departure / arrival energy | Mars 2020 launch energy (C3) 14.49 km²/s² ⚠. MRO's orbit insertion: a 27-min burn of ~1 km/s ⚠ | Launch vehicle and propellant check | [ULA brochure](https://www.ulalaunch.com/docs/default-source/launch-booklets/mars2020_mobrochure_200717.pdf) ⚠ |
| Data relay | Rovers have no line of sight to Earth ~12 h/day. They send data through orbiters at up to 2 Mbps, 4–5 passes/sol. Perseverance often returns >1 Gbit/sol; Curiosity's plan was 250 Mb/sol | Data budget per sol | [NASA Mars Relay Network](https://science.nasa.gov/mars/mars-relay-network/) · [IEEE Spectrum](https://spectrum.ieee.org/how-nasa-is-adapting-radios-to-a-noisier-mars) |

---

## 2. The Mars fleet today

### 2.1 Status (Nov 2026)

| Mission | Agency | Type | Status | Notes |
|---|---|---|---|---|
| Perseverance | NASA | Rover | `OPERATING` | Off-world driving record of 45.22 km on 11 Oct 2026 |
| Curiosity | NASA | Rover | `OPERATING` ⚠ | 42+ drill holes; 2026 status not re-verified |
| Mars Reconnaissance Orbiter (MRO) | NASA | Orbiter | `OPERATING` | Its CRISM spectrometer was retired in Apr 2023 |
| Mars Odyssey | NASA | Orbiter | `OPERATING` | 25 years in 2026; remaining fuel unknown ⚠ |
| Mars Express | ESA | Orbiter | `OPERATING` | Extension endorsed in Jun 2026; backup relay |
| ExoMars Trace Gas Orbiter (TGO) | ESA | Orbiter | `OPERATING` | Busiest relay; new volcanic-gas result on 5 Nov 2026 |
| Hope (Emirates Mars Mission) | UAE | Orbiter | `OPERATING` | Extended to 2028 |
| Tianwen-1 orbiter | CNSA | Orbiter | Probably `OPERATING` ⚠ | Signal gap Dec 2025 – Mar 2026, unexplained |
| MAVEN | NASA | Orbiter | **Lost** | Contact lost 6 Dec 2025, declared unrecoverable 3 Jun 2026. It was spinning, the batteries drained, cause unknown |
| Zhurong | CNSA | Rover | Dormant since 2022 | Did not wake from hibernation; dust is the likely cause |
| InSight | NASA | Lander | Ended Dec 2022 | Dust on solar panels |
| Ingenuity | NASA | Helicopter | Ended Jan 2024 | Rotor damage after a hard landing |
| ESCAPADE (2 smallsats) | NASA / UC Berkeley | Orbiters | `READY` (en route) | Arrives Sep 2027 |
| MMX | JAXA | Phobos sample return | `READY` (en route) | Launched 20 Oct 2026; samples back in 2031 |
| Rosalind Franklin | ESA (+NASA) | Rover | `READY` | Launch late 2028 on Falcon Heavy; lands 2030 |
| SkyFall | NASA / AeroVironment | 3 helicopters | `IN DEVELOPMENT` | Targets the Nov 2028 window |
| Mars Telecommunications Network orbiter | NASA / Blue Origin | Relay orbiter | `IN DEVELOPMENT` | $700M; due end of 2028. Rocket Lab protest ⚠ |
| Mars Sample Return | NASA / ESA | — | Cancelled ⚠ | $0 in the FY2026 budget |
| Starship to Mars | SpaceX | — | Not in 2026 | Postponed to focus on the Moon; not before 2028 ⚠ |

Sources:
- [NASA Mars Relay Network](https://science.nasa.gov/mars/mars-relay-network/)
- [collectSPACE (MAVEN end)](https://www.collectspace.com/news/news-060326a-maven-mars-atmosphere-probe-end-mission.html)
- [JAXA MMX](https://www.mmx.jaxa.jp/en/)
- [EPSC2026 (Rosalind Franklin)](https://meetingorganizer.copernicus.org/EPSC2026/EPSC2026-411.html)
- [JPL SkyFall](https://www.jpl.nasa.gov/missions/skyfall/)
- [Nextgov (Perseverance record)](https://nextgov.com/emerging-tech/2026/10/nasas-self-driving-mars-rover-sets-world-mileage-record/416718)
- [Al Jazeera (Zhurong)](https://www.aljazeera.com/amp/news/2023/4/25/china-breaks-silence-over-status-of-mars-rover-zhurong)
- [AA (Starship)](https://www.aa.com.tr/en/science-technology/elon-musks-spacex-postpones-mars-mission-to-prioritize-lunar-voyage-report/3823636) ⚠

### 2.2 Relay capacity: how surface data gets home

| Relay orbiter | Average relayed, 2025 | Average relayed, Feb–May 2026 |
|---|---|---|
| TGO (ESA) | 1,562.7 Mb/day | 2,228.1 Mb/day |
| MRO (NASA) | 447.5 Mb/day | 850.6 Mb/day |
| Odyssey (NASA) | 170.4 Mb/day | 107.3 Mb/day |
| MAVEN (NASA) | 897.5 Mb/day | — (lost) |
| Mars Express (ESA) | backup only | backup only |
| **Total** | | **~3.2 Gb/day** (calc.) |

Source: [NASA Mars Relay Network](https://science.nasa.gov/mars/mars-relay-network/), updated Jun 2026.

Rover-to-orbiter radio links reach up to 2 Mbps, but only 128–256 kbps with the older Odyssey.

**Game hook:** losing MAVEN in 2025 is a real "relay orbiter lost" event. It removed ~0.9 Gb/day of relay capacity for every surface mission at once.

---

## 3. Physicist

Radiation, geophysics (quakes, interior, spin), subsurface sounding, water detection by neutrons, atmosphere and space plasma.

| ID | Game experiment | Real hardware (mission) | Platform | Mass | Power | Data | Limits / consumables | Status |
|---|---|---|---|---|---|---|---|---|
| PH1 | Radiation dosimeter | RAD (Curiosity) | `ROVER-BODY` | 1.56 kg (1.7 ⚠) | 4.2 W | low | Duty cycle adjustable | `OPERATING` |
| PH2 | Seismometer | SEIS (InSight) | `LANDER` | 29.5 kg ⚠ (11.5 ⚠) | ≤8.5 W | 38 Mb/day | Arm must place it under a wind/thermal shield; needs a stationary lander | `FLOWN` |
| PH3 | Radio geodesy (planet wobble) | RISE (InSight) | `LANDER` | 7.3 kg | 78 W, ≤1 h/day | — | Needs an X-band link to the Deep Space Network; ~900 sols for the result | `FLOWN` |
| PH4 | Ground-penetrating radar | RIMFAX (Perseverance) | `ROVER-BODY` | <3 kg | 5–10 W | 5–10 kB/sounding | Works while driving (1 sounding per 10 cm); >10 m deep | `OPERATING` |
| PH4b | Deep ground radar | RoPeR (Zhurong) | `ROVER-BODY` | n/f | n/f | n/f | Two bands: ~100 m deep, or 3–10 m at high resolution | `FLOWN` |
| PH4c | Drill-site radar | WISDOM (Rosalind Franklin) | `ROVER-BODY` | ~1.6 kg ⚠ | ~12 W ⚠ (6 W low mode) | n/f | ~3 m deep, cm resolution | `READY` |
| PH5 | Active neutron water detector | DAN (Curiosity) | `ROVER-BODY` | <5 kg ⚠ | n/f | — | Generator good for ~10 million pulses in total; 2–30 min per reading | `OPERATING` |
| PH6 | Orbital water map (neutrons/gamma) | GRS suite (Odyssey); FREND (TGO) | `ORBITER` | 30.5 kg (GRS suite) | 32 W | — | GRS ~300 km resolution; FREND much sharper | `OPERATING` |
| PH7 | Orbital sounding radar | SHARAD (MRO); MARSIS (Mars Express) | `ORBITER` | 15 kg (SHARAD) | 10 W transmit | 40–90 Gb/day (capped at 15% of MRO data) | SHARAD ~1 km deep, ~15 m vertical resolution; MARSIS a few km deep with a 40 m antenna | `OPERATING` |
| PH8 | Atmospheric escape / space plasma | MAVEN (8 instruments); ESCAPADE (twin smallsats) | `ORBITER` | 65 kg payload (MAVEN) | MAVEN spacecraft 1,150–1,700 W | — | ESCAPADE: $49M for both spacecraft | MAVEN lost; ESCAPADE `READY` |
| PH9 | Weather station | MEDA (Perseverance); REMS (Curiosity) | `ROVER-BODY` | 5.5 kg (MEDA) | ≤17 W | ~11 MB ⚠ | REMS samples 5 min/hour, 2–3 h/sol | `OPERATING` |
| PH10 | Orbital climate sounder | MCS + MARCI (MRO); EMUS, EXI, EMIRS (Hope) | `ORBITER` | MCS 9 kg; MARCI 0.48 kg; EMUS 22.3 kg | 11 W; <5 W; <15 W ⚠ | MARCI ~6.2 Gb/day for a global map | — | `OPERATING` |
| PH11 | Microphone (sound on Mars) | SuperCam microphone (Perseverance) | `ROVER-MAST` | part of SuperCam | — | — | — | `OPERATING` |

**PH1 · Radiation dosimeter**
- **Result:** surface ~0.67 mSv/day, cruise ~1.8 mSv/day. A crewed 500-day stay plus transits gives ~1 Sv. See `P10`.
- **Game hook:** crew radiation budget; "solar storm" event.

**PH2 · Seismometer**
- **Result:**
  - **1,319 marsquakes**; the largest was Mw 4.7 (May 2022; NASA announced ~5) ⚠.
  - Liquid core ~1,830 km in radius.
  - Crust 20 or 37 km thick.
- **Game hook:** only works on a lander that never moves. Wind noise ruins daytime data. See `G9`.
- **Sources:** [NASA](https://www.nasa.gov/missions/insight/nasa-marsquake-data-reveals-lumpy-nature-of-red-planets-interior/) · [NASA instruments](https://science.nasa.gov/mission/insight/science-instruments/)

**PH3 · Radio geodesy**
- **Result:** core radius 1,835 ± 55 km with no solid inner core. Mars' spin is speeding up by ~4 milliarcseconds/year (Nature 2023).
- **Game hook:** a long-term experiment that pays only after ~900 sols. It is shared with the Navigator and Comms roles.
- **Sources:** [Le Maistre et al., Nature 2023](https://www.nature.com/articles/s41586-023-06150-0.pdf)

**PH4 · Ground-penetrating radar**
- **Results:**
  - RIMFAX saw lake sediments ~20 m deep under the Jezero delta (Science Advances, 2024).
  - RoPeR (Zhurong) found a ~70 m layered structure and buried coastal "beach" deposits, read as the shore of an ancient ocean (PNAS 2025).
  - WISDOM exists to pick safe spots for the 2 m drill.
- **Game hook:** passive science gathered while driving; it reveals hidden layers that guide where to drill.
- **Sources:** [NASA M2020 instruments](https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/) · [ScienceDaily](https://sciencedaily.com/releases/2024/01/240126171636.htm) · [Nature 2022](https://www.nature.com/articles/s41586-022-05147-5) · [Astronomy](https://www.astronomy.com/science/scientists-have-discovered-a-3-billion-year-old-beach-buried-on-mars/)

**PH5 · Active neutron water detector**
- **Result:** 0.5–6.1 wt% water-equivalent hydrogen along 27 km of driving ⚠.
- **Game hook:** the neutron generator has a finite number of pulses, so it is a consumable.
- **Sources:** [NSSDCA DAN](https://nssdc.gsfc.nasa.gov/nmc/experiment/display.action?id=2011-070A-11)

**PH6 · Orbital water map**
- **Results:**
  - Odyssey found regions ~50% water ice by volume and made the first global map of chemical elements.
  - FREND found up to **40% water by weight** in Candor Chaos (Valles Marineris), over an area about the size of the Netherlands.
- **Game hook:** a cheap way to find water for a crewed base. It unlocks `EN2` (water extraction).
- **Sources:** [NASA Odyssey instruments](https://science.nasa.gov/mission/odyssey/science-instruments/) · [ESA FREND](https://esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/ExoMars_discovers_hidden_water_in_Mars_Grand_Canyon)

**PH7 · Orbital sounding radar**
- **Results:**
  - SHARAD found buried ice under Utopia Planitia holding ~14,300 km³ of water, about as much as Lake Superior ⚠.
  - In 2018, MARSIS reported a 20 km "subglacial lake" under 1.5 km of polar ice. In 2025 SHARAD rolled 120° to look at the site, saw only a faint echo, and the lake became very hard to support.
- **Game hook:** "Disputed discovery" event. A very data-hungry instrument.
- **Sources:** [JPL ice](https://www.jpl.nasa.gov/news/mars-ice-deposit-holds-as-much-water-as-lake-superior/) · [JPL MARSIS lake](https://www.jpl.nasa.gov/news/nasa-orbiter-shines-new-light-on-long-running-martian-mystery/)

**PH8 · Atmospheric escape**
- **MAVEN:**
  - Found ~100 g/s of atmosphere lost to space ⚠, ~65% of the planet's argon lost ⚠, 800+ papers.
  - Lost in Dec 2025, cause unknown.
- **ESCAPADE:** two cheap twin smallsats that measure from two points at once. They fly together for 6 months, then apart for 5.
- **Game hook:** "Spacecraft lost, cause unknown" event. Trade-off between two cheap smallsats and one big orbiter.
- **Sources:** [NASA MAVEN](https://science.nasa.gov/mission/maven/) · [NASA ESCAPADE](https://science.nasa.gov/science-research/heliophysics/nasas-escapade-ready-to-study-space-weather-from-earth-to-mars)

**PH9 · Weather station**
- **Results:**
  - MEDA counted 374 dust devils in its first 365 sols ⚠; ~4 whirlwinds pass per day and >25% of them carry dust.
  - REMS measured ground temperature swings of ~90 K in a day ⚠.
- **Game hook:** a weather forecast lowers the risk of helicopter flights and dust events.
- **Sources:** [NASA M2020 instruments](https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/) · [Newman et al. 2022](https://pmc.ncbi.nlm.nih.gov/articles/9132482)

**PH10 · Orbital climate sounder**
- **Results:**
  - MCS detected CO₂ snow clouds, one ~500 km wide ⚠.
  - Hope made the first global images of Mars' "discrete" aurora (2021) and sees the whole planet every 9 days.
- **Game hook:** an orbital "weather service" that supports surface operations.
- **Sources:** [NASA MRO instruments](https://science.nasa.gov/mission/mars-reconnaissance-orbiter/science-instruments/) · [Dubai Media Office](https://mediaoffice.ae/en/news/2021/June/30-06/Emirates-Mars-Mission-Captures-Global-Images-of-Mars-Discrete-Aurora)

**PH11 · Microphone**
- **Result:** Mars has **two speeds of sound**: ~240 m/s for low pitches and ~250 m/s for high pitches ⚠.
- **Game hook:** a cheap outreach bonus.
- **Sources:** [DLR](https://www.dlr.de/en/latest/news/2022/02/20220401_the-sound-of-mars)

---

## 4. Geologist

Cameras, rock chemistry and mineralogy, drilling and sampling, orbital mapping, sample return.

| ID | Game experiment | Real hardware (mission) | Platform | Mass | Power | Data | Limits / consumables | Status |
|---|---|---|---|---|---|---|---|---|
| GE1 | Mast stereo zoom camera | Mastcam-Z (Perseverance) | `ROVER-MAST` | ~4 kg | ~17.4 W | ~148 Mb/sol avg | 1600×1200 px; 0.15–7.4 mm/px depending on distance | `OPERATING` |
| GE1b | Mast camera (alt.) | PanCam (Rosalind Franklin) | `ROVER-MAST` | 1.75–2.13 kg ⚠ | 9.2 W ⚠ | n/f | — | `READY` |
| GE2 | Remote laser spectrometer | SuperCam (Perseverance) | `ROVER-MAST` | 10.6 kg | 17.9 W | 15.5 Mb/experiment (~4.2 Mb/day) | Range >7 m; no arm needed | `OPERATING` |
| GE2b | Remote laser spectrometer (alt.) | ChemCam (Curiosity); MarSCoDe (Zhurong) | `ROVER-MAST` | ChemCam ≤10–10.8 kg ⚠ | n/f | n/f | Dozens of laser pulses per spot | `OPERATING` / `FLOWN` |
| GE3 | Contact X-ray chemistry map | PIXL (Perseverance) | `ROVER-ARM` | ~6.9 kg | ~25 W | ~16 Mb/experiment | Arm must place it on the rock | `OPERATING` |
| GE3b | Contact X-ray chemistry (simple) | APXS (Curiosity) | `ROVER-ARM` | n/f | n/f | n/f | Contact <2 cm; 15 min – 3 h per reading; works better when cold | `OPERATING` |
| GE4 | Mineral identifier (X-ray diffraction) | CheMin (Curiosity) | `ROVER-BODY` | ~10 kg | ~40 W ⚠ | n/f | Needs drilled powder <150 µm; up to 10 h over 2+ nights; **74 analyses max** | `OPERATING` |
| GE5 | Close-up hand-lens camera | MAHLI (Curiosity); WATSON (Perseverance) | `ROVER-ARM` | n/f | n/f | — | 13.9–15.9 µm/px | `OPERATING` |
| GE6 | Rock drill + sample handling | Curiosity drill; Perseverance corer + tubes; Rosalind Franklin 2 m drill | `ROVER-ARM` / `ROVER-BODY` | arm turret 33–45 kg | n/f | — | See card | `OPERATING` / `READY` |
| GE7 | High-resolution orbital camera | HiRISE, CTX (MRO); HRSC (Mars Express); CaSSIS (TGO) | `ORBITER` | HiRISE 65 kg; CTX 3 kg | 60 W; 7 W | HiRISE up to 28 Gb/image | 30 cm/px (HiRISE), 6 m/px (CTX), 4.6 m/px (CaSSIS) | `OPERATING` |
| GE8 | Orbital mineral mapper | CRISM (MRO); THEMIS (Odyssey) | `ORBITER` | 32.9 kg; 11.2 kg | 44–47 W; 14 W | CRISM 2–2.5 Gb/observation | CRISM's cooler wore out (2017) | `FLOWN` / `OPERATING` |
| GE9 | Phobos sample return | MMX | `ORBITER` + landings | n/f | n/f | — | Target >10 g, back on Earth 2031 | `READY` |

**GE1 · Mast camera**
- **Result:** confirmed that Jezero crater held a delta and a lake. Boulders up to 1.5 m point to floods of 6–30 km/h.
- **Game hook:** cheap context science, and the Navigator needs it to plan drives.
- **Sources:** [JPL](https://www.jpl.nasa.gov/news/nasas-perseverance-sheds-more-light-on-jezero-craters-watery-past/)

**GE2 · Remote laser spectrometer**
- **Results:**
  - ChemCam fired **1 million laser shots** by Aug 2024, though it was designed for 2 years.
  - MarSCoDe found hydrated sulfates and silica, a sign of relatively recent water.
- **Game hook:** fast readings from a distance without using the arm, so many targets per sol.
- **Sources:** [CNES](https://cnes.fr/en/news/1-million-shots-chemcam-mars) · [Eos](https://eos.org/articles/zhurong-rover-spots-evidence-of-recent-liquid-water-on-mars)

**GE3 · Contact X-ray chemistry**
- **Results:**
  - PIXL and SHERLOC studied the "leopard spots" on the Cheyava Falls rock (see `B14`).
  - APXS found zinc and germanium at 100–300× normal levels, a sign of hot water ⚠.
- **Game hook:** PIXL, SHERLOC, APXS, the hand-lens cameras and the drill all share one robotic arm, so the team has to schedule it.
- **Sources:** [NASA M2020 instruments](https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/) · [NSSDCA APXS](https://nssdc.gsfc.nasa.gov/nmc/experiment/display.action?id=2011-070A-07)

**GE4 · Mineral identifier**
- **Results:**
  - Found siderite (an iron carbonate) in sulfate layers: evidence of an ancient carbon cycle (Science 2025).
  - The Gale crater lake mudstone is ~20% clay ⚠.
- **Game hook:** needs the drill, needs the night, and has a finite number of cells.
- **Sources:** [PDS CheMin](https://pds-geosciences.wustl.edu/msl/msl-m-chemin-4-rdr-v1/mslcmn_1xxx/document/chemin_basics.htm) · [JPL carbonate](https://jpl.nasa.gov/news/nasas-curiosity-rover-may-have-solved-mars-missing-carbonate-mystery)

**GE5 · Close-up camera**
- **Game hook:** a low-cost "zoom in" card that makes the other arm instruments more effective.
- **Sources:** [NSSDCA MAHLI](https://nssdc.gsfc.nasa.gov/nmc/experiment/display.action?id=2011-070A-02)

**GE6 · Drill and sample handling.** Three real options:
- **Curiosity drill:**
  - Holes 1.6 cm wide, up to 5 cm deep; 2 spare bits.
  - 42+ holes so far (49 per a later NASA blog ⚠).
- **Perseverance corer:**
  - 43 single-use tubes; cores ~13 × 60 mm, 10–15 g each.
  - 27 rock cores by Sep 2025.
  - A 10-tube backup depot was left at "Three Forks".
- **Rosalind Franklin drill:**
  - Reaches **2 m deep** at ~50 cm/sol.
  - An infrared spectrometer (Ma_MISS) reads the borehole wall.
  - 20 samples planned ⚠.
- **Game hook:** tubes are a consumable. Depth costs time. "Sample return cancelled" event (see `G8`).
- **Sources:** [JPL rover](http://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission/spacecraft/perseverance_rover/) · [NASA depot](https://science.nasa.gov/blogs/the-role-of-a-rover-a-lander-and-helicopters-in-the-unique-shape-of-the-first-sample-depot-on-mars/) · [Vago et al. 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5685153/)

**GE7 · Orbital camera**
- **Results:**
  - HiRISE took its 100,000th image in Oct 2025.
  - A global CTX mosaic covers 99.5% of Mars at 5 m/px ⚠.
  - HRSC has imaged >85% of Mars at better than 20 m/px.
- **Game hook:** essential for picking a landing site, but very expensive in data.
- **Sources:** [HiRISE specs](https://www.uahirise.org/specs/) · [NASA](https://www.nasa.gov/missions/mars-reconnaissance-orbiter/one-of-nasas-key-cameras-orbiting-mars-takes-100000th-image/) · [Caltech](https://www.caltech.edu/about/news/scientists-unveil-a-57-terapixel-global-image-of-mars)

**GE8 · Orbital mineral mapper**
- **Results:**
  - CRISM mapped 86% of Mars at 180 m/px and helped pick the Gale and Jezero landing sites.
  - THEMIS mapped carbonates, sulfates and hot-spring silica.
- **Game hook:** "Cooler wears out" lifetime limiter. Orbital data lowers landing risk.
- **Sources:** [JPL CRISM](https://www.jpl.nasa.gov/news/nasa-retires-mineral-mapping-instrument-on-mars-orbiter/) · [NASA Odyssey instruments](https://science.nasa.gov/mission/odyssey/science-instruments/)

**GE9 · Phobos sample return (MMX)**
- **What:** launched 20 Oct 2026. It will land twice on the moon Phobos (2027–2030) and carries a small rover. The goal is >10 g of soil back on Earth in 2031.
- **Game hook:** a sample-return objective that does not need a Mars ascent rocket.
- **Sources:** [JAXA MMX](https://www.mmx.jaxa.jp/en/)

---

## 5. Biologist

**Robotic astrobiology:** organics, methane, habitability, biosignatures.

| ID | Game experiment | Real hardware (mission) | Platform | Mass | Power | Data | Limits / consumables | Status |
|---|---|---|---|---|---|---|---|---|
| BI1 | Organics & minerals (UV Raman) | SHERLOC + WATSON (Perseverance) | `ROVER-ARM` | 4.72 kg | 48.8 W | 79.7 Mbit raw ⚠ | Arm placement; 7×7 mm field | `OPERATING` |
| BI2 | Organic molecule lab | SAM (Curiosity) | `ROVER-BODY` | ~40 kg | n/f | n/f | 74 sample cups | `OPERATING` |
| BI2b | Organic molecule lab (new) | MOMA (Rosalind Franklin) | `ROVER-BODY` | 11.5 kg | 65–82 W avg, 133–154 W peak | n/f | **32 single-use ovens**; works −40 to +20 °C; needs drill samples | `READY` |
| BI3 | Trace-gas hunter (methane) | NOMAD + ACS (TGO) | `ORBITER` | n/f | n/f | n/f | Looks at the Sun through the atmosphere, so only at orbital sunrise/sunset | `OPERATING` |
| BI4 | Wet chemistry lab (soil salts, pH) | MECA Wet Chemistry Lab (Phoenix) | `LANDER` | n/f | n/f | — | **4 single-use cells**; 2 sols per test | `FLOWN` |
| BI5 | Oven gas analyser | TEGA (Phoenix) | `LANDER` | n/f | n/f | — | **8 single-use ovens**; ~1,000 °C | `FLOWN` |
| BI6 | Biosignature sample cache | Perseverance tubes (`GE6`) | `ROVER` | — | — | — | Pays off only if returned to Earth | `OPERATING` (return cancelled ⚠) |

**Crewed-mission biology:** proven on the ISS or on Earth, not yet at Mars.

| ID | Game experiment | Real hardware | Platform | Mass | Power | Data | Limits | Status |
|---|---|---|---|---|---|---|---|---|
| BI7 | Greenhouse | Veggie / APH (ISS); Mars-soil-simulant tests; CHAPEA | `CREW` | n/f | ~70 W (Veggie) | — | Water, crew time | `SPACE-PROVEN` |
| BI8 | Crew health monitoring | Twins Study protocols; bone and eye checks | `CREW` | — | — | — | 2.5 h exercise per astronaut per day | `SPACE-PROVEN` |
| BI9 | DNA sequencer | MinION (ISS) | `CREW` | ~0.12 kg ⚠ | n/f | 4–20 Gb/run ⚠ | Flow cells are consumables | `SPACE-PROVEN` |
| BI10 | Biomining (microbes extract metals) | BioRock (ISS) | `CREW` | n/f | n/f | — | 21-day runs; the choice of microbe decides the result | `SPACE-PROVEN` |
| BI11 | Radiation protection vest | AstroRad (Artemis I) | `CREW` | ~26 kg per crew member | 0 | — | — | `SPACE-PROVEN` (uncrewed flight) |

**BI1 · Organics (UV Raman)**
- **Results:**
  - Organic-type signals in all 10 crater-floor targets studied (Nature 2023).
  - Key instrument behind the Cheyava Falls "potential biosignature" (Nature, Sep 2025).
- **Game hook:** the most power-hungry of the arm instruments (48.8 W).
- **Sources:** [NASA M2020 instruments](https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/) · [NASA biosignature](https://www.jpl.nasa.gov/news/nasa-says-mars-rover-discovered-potential-biosignature-last-year/)

**BI2 · Organic molecule lab**
- **SAM:** methane background of 0.41 ppb with spikes of ~7 ppb, and organics in 3-billion-year-old mudstone. See `C4`.
- **MOMA:**
  - Will detect organics down to 10 ppb by weight.
  - It analyses samples from up to 2 m deep, below the surface layer most altered by radiation.
- **Game hook:** single-use ovens make every sample a decision.
- **Sources:** [Goesmann et al. 2017 (MOMA)](https://science.gsfc.nasa.gov/699/projects/pdf/Goesmann-2017-MOMA.pdf)

**BI3 · Trace-gas hunter**
- **Results:**
  - TGO puts methane **below 0.05 ppbv** (best 0.012 ppbv), while Curiosity measures 0.2–0.7 ppbv at the ground. The conflict is still unresolved.
  - Nov 2026: hydrogen chloride (HCl) spikes coming from fissures on Alba Mons, possibly from a dormant magma chamber.
- **Game hook:** "Conflicting data" event: orbit and ground disagree, and the team must design a cross-check.
- **Sources:** [ESA first results](https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/First_results_from_the_ExoMars_Trace_Gas_Orbiter) · [ESA Alba Mons](https://www.esa.int/articles/news-media/news/european-orbiter-detects-hints-of-volcanic-activity-on-mars)

**BI4 · Wet chemistry lab**
- **Result:** **0.4–0.6% perchlorate**, a reactive salt that matters for habitability and for crew safety. It also explains the confusing Viking results (see `B13`).
- **Game hook:** only 4 tests in the whole mission.
- **Sources:** [WUSTL PHX WCL](https://an.rsl.wustl.edu/help/Content/About%20the%20mission/PHX/Instruments/PHX%20WCL.htm)

**BI5 · Oven gas analyser**
- **Result:** confirmed water ice on 31 Jul 2008. Calcium carbonate at 3–5 wt% ⚠.
- **Game hook:** 8 ovens means 8 analyses in total.
- **Sources:** [NSSDCA TEGA](https://nssdc.gsfc.nasa.gov/nmc/experiment/display.action?id=2007-034A-04)

**BI6 · Biosignature cache**
- See `G8` and `B14`. The reward is delayed and depends on a sample-return mission.

**BI7 · Greenhouse**
- **Results:**
  - Lettuce grown and eaten on the ISS (2015).
  - 10 crops grew in a Mars-soil simulant with added organic matter (2019); spinach did poorly.
  - CHAPEA 2: 4 crew lived 378 days in a 158 m² 3D-printed habitat (ended Nov 2026).
  - **No plant has ever grown in real Martian soil.**
- **Game hook:** food mass shipped vs power and water.
- **Sources:** [Sci.News](https://www.sci.news/space/crops-simulated-martian-lunar-dirt-07697.html) · [Star-Advertiser](https://www.staradvertiser.com/2026/11/01/breaking-news/nasa-crew-emerges-after-378-days-in-isolation/)

**BI8 · Crew health**
- **Results:**
  - Bone loss of 1–1.5% per month.
  - 64% of long-duration crew show optic-disc swelling.
  - 146 mSv of radiation in 340 days (see `B1`–`B3`).
  - The effect of Mars' 0.38 g on long stays is **unknown**.
- **Game hook:** crew health meter.

**BI9 · DNA sequencer**
- **Result:** 9 runs on the ISS in 2016, with accuracy matching ground runs (see `B11`).
- **Game hook:** microbial monitoring and a future life-detection tool, but data-heavy.

**BI10 · Biomining**
- **Result:** one microbe extracted 1.1–4.3× more rare-earth elements from basalt; another made things worse (see `B8`).
- **Game hook:** biology as a resource tool (ISRU).

**BI11 · Radiation vest**
- **Result:** modelled dose reduction of 40–60% for the largest historical solar storms ⚠.
- **Game hook:** costs mass per astronaut.
- **Sources:** [Space.com](https://www.space.com/space-exploration/artemis/artemis-i-radiation-vest-astrorad-protect-astronauts-moon-mars-missions) ⚠

---

## 6. Engineer

In-situ resource use (ISRU), power, landing, mobility, aerial scouts, propulsion tricks, communications, life support.

| ID | Game experiment / component | Real hardware | Platform | Mass | Power | Data | Limits | Status |
|---|---|---|---|---|---|---|---|---|
| EN1 | Oxygen from the air (ISRU) | MOXIE (Perseverance) | `ROVER-BODY` / `LANDER` | 17.1 kg | 300 W | — | ~1 kWh per run ⚠; runs at 800 °C | `FLOWN` |
| EN2 | Water from buried ice | Rodwell prototype (MIT, NASA RASC-AL) | `LANDER` / `CREW` | ~210 kg system mass | n/f | — | Needs ice that has been mapped first | `EARTH-TESTED` |
| EN3a | Solar arrays | InSight, Phoenix, Opportunity, Zhurong | any | n/f | InSight 600–700 W clear, 200–300 W dusty | — | Dust, night, storms | `FLOWN` |
| EN3b | Radioisotope generator | MMRTG | any | 45 kg | ~110 W, −a few %/year | — | 4.8 kg plutonium dioxide; ~2 kW of heat ⚠ | `OPERATING` |
| EN3c | Fission reactor | Kilopower (KRUSTY) → Fission Surface Power | `LANDER` / `CREW` | n/f | 1–10 kW electric (design) | — | 100 kW target for 2030 (Moon first) | `EARTH-TESTED` / `IN DEVELOPMENT` |
| EN3d | Batteries for peak loads | Perseverance Li-ion | any | 26.5 kg (2 × 43 Ah) | covers ~900 W peaks | — | — | `OPERATING` |
| EN4 | Precision landing | Terrain Relative Navigation / Lander Vision System (Mars 2020) | `LANDER` | n/f | n/f | — | — | `FLOWN` |
| EN5 | Supersonic parachute | 21.5 m chute (ASPIRE-tested) | `LANDER` | ~82 kg (180 lb) | — | — | — | `FLOWN` |
| EN6 | Entry sensors | MEDLI2 | `LANDER` | n/f | — | — | — | `FLOWN` |
| EN7 | Inflatable heat shield | LOFTID (HIAD) | `LANDER` | n/f | — | — | Mars would need ≥20 m ⚠ | `EARTH-TESTED` |
| EN8 | Self-driving | AutoNav (Perseverance) | `ROVER` | — | compute | — | — | `OPERATING` |
| EN9 | Helicopter scout | Ingenuity | `AIR` | 1.8 kg | ~350 W in flight | via rover | Battery: ~90 s of flight per sol | `FLOWN` |
| EN9b | Helicopter scouts dropped during entry | SkyFall (3 helicopters) | `AIR` | n/f | n/f | n/f | No lander needed | `IN DEVELOPMENT` (2028) |
| EN9c | Heavy helicopter | Mars Chopper concept | `AIR` | ~36 kg ⚠ | n/f | n/f | 5 kg payload ⚠, 3 km/sol | `IN DEVELOPMENT` |
| EN10 | Aerobraking | MRO, TGO | `ORBITER` | saves ~600 kg of propellant ⚠ | — | — | Takes ~5–12 months | `FLOWN` |
| EN11 | UHF relay radio | Electra (rover ↔ orbiter) | all | n/f | n/f | up to 2 Mbps | Needs an orbiter overhead; 4–5 passes/sol | `OPERATING` |
| EN12 | New relay orbiter | MTN orbiter (Blue Origin) | `ORBITER` | n/f | n/f | 150 Mbps to Earth ⚠; ≥1 TB storage ⚠ | ≥20 kg science payload ⚠ | `IN DEVELOPMENT` |
| EN13 | Laser communications | DSOC (Psyche) | `ORBITER` | n/f | n/f | 267 Mbps at 31 M km; ~8 Mbps at ~400 M km | Clouds over the ground station | `SPACE-PROVEN` |
| EN14 | CubeSat relay companion | MarCO | `ORBITER` (flyby) | 6U | — | 8 kbps | Short, fragile life | `FLOWN` |
| EN15 | Life support & habitat | ISS water recovery (98%); BEAM inflatable; CHAPEA habitat | `CREW` | BEAM 1,413 kg | — | — | — | `SPACE-PROVEN` |

**EN1 · Oxygen from the air**
- **Result:** 122 g of O₂ over 16 runs, peaking at 12 g/h (see `E2`).
- **Game hook:** scaled up, it unlocks "propellant for the trip home".

**EN2 · Water from buried ice**
- **Result:**
  - 24.3 L of water in 12 h from ice under ~0.5 m of simulated soil; peak rate 4.3 L/h.
  - A crew of 4 needs ~68 t of water for a 500-day stay ⚠.
- **Game hook:** found water directly saves launch mass. Needs `PH6`, `PH7` or SkyFall to locate the ice first.
- **Sources:** [MIT](https://spaceresources.mit.edu/projects/hydration-iii-2019-2021)

**EN3 · Power.** The core trade-off of any Mars mission:
- **Solar:**
  - Mars gets 43% of Earth's sunlight.
  - Dust cut InSight's power from 600–700 W to 200–300 W. Dust ended InSight, Zhurong and Opportunity.
- **MMRTG:** steady output that decays slowly (see `E6`).
- **Kilopower:**
  - Passed a 28-hour full-power ground test.
  - Designed for up to 10 kW electric for 10 years; 4 units could power an outpost.
  - Cost <$20M ⚠. Mass not verified.
- **Fission Surface Power:** 100 kW target by 2030, for the Moon first.
- **Batteries:** Perseverance handles ~900 W peaks with a 110 W generator plus batteries.
- **Sources:** [NASA Kilopower](https://nasa.gov/news-release/demonstration-proves-nuclear-fission-system-can-provide-space-exploration-power/) · [ANS](https://www.ans.org/news/2026-01-14/article-7674/nasa-doe-solidify-collaboration-on-a-lunar-surface-reactor/) · [JPL Mars 2020 power](https://www.jpl.nasa.gov/news/press_kits/mars_2020/launch/mission/spacecraft/power/)

**EN4 · Precision landing**
- **Result:**
  - Perseverance landed **~5 m from its target** (≤8.53 m in post-landing analysis); the requirement was 60 m.
  - It could divert up to 600 m.
  - Its landing ellipse was 10× smaller in area than Curiosity's.
- **Game hook:** unlocks hazardous but science-rich landing sites.
- **Sources:** [NTRS](https://ntrs.nasa.gov/citations/20230007014)

**EN5 · Supersonic parachute**
- **Result:**
  - 21.5 m chute that opens at ~11 km altitude and 1,512 km/h.
  - In Earth tests it took ~70,000 lbf, 85% above the expected Mars load, and inflated in 0.4 s.
- **Game hook:** an upgrade that raises the maximum landing mass.
- **Sources:** [JPL](https://www.jpl.nasa.gov/news/mars-2020-parachute-a-go)

**EN6 · Entry sensors**
- **Result:** 28 sensors on the heat shield and back shell ⚠. Their data allows lighter heat shields on future missions.
- **Game hook:** a "flight data" card that reduces the heat-shield mass of the next mission.
- **Sources:** [JPL](https://www.jpl.nasa.gov/news/sensors-collect-crucial-nasa-data-on-mars-environment-with-perseverance-landing)

**EN7 · Inflatable heat shield**
- **Result:**
  - A 6 m shield ⚠ slowed from >18,000 mph to <80 mph on Earth entry (Nov 2022).
  - NASA calls it "key to landing humans on Mars".
- **Game hook:** late-game tech for heavy or crewed landers.
- **Sources:** [NASA](https://www.nasa.gov/feature/loftid-inflatable-heat-shield-test-a-success-early-results-show)

**EN8 · Self-driving**
- **Result:**
  - Record of 347.7 m in one sol (2023), ~412 m in later reporting ⚠.
  - The rover plans >90% of its distance by itself.
  - Off-world record of **45.22 km** (Oct 2026).
  - It crossed a boulder field in 6 sols, ~12 sols faster than Curiosity would have.
- **Game hook:** a distance-per-sol multiplier that is not limited by light time.
- **Sources:** [NASA](https://www.nasa.gov/?p=527797) · [Nextgov](https://nextgov.com/emerging-tech/2026/10/nasas-self-driving-mars-rover-sets-world-mileage-record/416718)

**EN9 · Helicopter scouts**
- **Ingenuity:** 72 flights (see `E1`).
- **SkyFall:**
  - 3 helicopters released **during atmospheric entry**, with no lander.
  - Each carries ground-penetrating radar, cameras and a radiation sensor.
  - Their job is to map shallow ice and scout landing sites for humans.
  - Contract awarded Aug 2026; targets the 2028 window.
- **Mars Chopper:** a concept with 6 rotors and a 5 kg payload ⚠.
- **Game hook:** a scout reveals ice and hazards on the map before the main landing.
- **Sources:** [JPL SkyFall](https://www.jpl.nasa.gov/missions/skyfall/) · [JPL Mars Chopper](https://www.jpl.nasa.gov/images/pia26375-nasas-mars-chopper-concept-rendering/)

**EN10 · Aerobraking**
- **MRO:** ~2 m/s of braking and ~1 kg of fuel saved per pass, over ~400+ passes and ~5 months; ~600 kg saved in total ⚠.
- **TGO:** took about a year (2017–18), with a pause for solar conjunction.
- **Game hook:** trade time for propellant mass (Navigator decision).
- **Sources:** [Spaceflight Now](https://spaceflightnow.com/news/n0606/19mroaerobraking/) · [ESA](https://exploration.esa.int/web/mars/-/59991-aerobraking-progress)

**EN11 · UHF relay**
- **Result:** Perseverance returns >1 Gbit/sol over 4–5 passes. Relay capacity per orbiter is in [section 2.2](#22-relay-capacity-how-surface-data-gets-home).
- **Game hook:** data budget per sol = passes × Mb per pass. Losing an orbiter cuts it.

**EN12 · New relay orbiter**
- **Result:** $700M fixed-price contract to Blue Origin, due by end of 2028, operational ~2030. Contested by Rocket Lab ⚠.
- **Game hook:** "comms upgrade" event after 2030.
- **Sources:** [Hackaday](https://hackaday.com/2026/09/24/after-decades-nasa-may-finally-replace-mars-relays/) ⚠

**EN13 · Laser comms**
- **Result:** rates at Mars-like distances range from ~8 to 267 Mbps depending on geometry (see `E11`).
- **Game hook:** a high-bandwidth option that is weather-dependent on Earth.

**EN14 · CubeSat relay**
- **Result:** relayed InSight's landing live (see `E12`).
- **Game hook:** a cheap companion for landing day.

**EN15 · Life support and habitat**
- **Result:** 98% water recycling (`E3`), the BEAM inflatable module (`E4`), and CHAPEA's 158 m² 3D-printed analog habitat on Earth.
- **Game hook:** crewed missions only.

---

## 7. Dependencies between experiments (tech tree)

Real hardware dependencies the game can turn into rules:

- **Drill → lab instruments:** CheMin, SAM and MOMA need drilled powder (`GE6`). MOMA needs the 2 m drill.
- **One arm, many tools:** PIXL, SHERLOC, APXS, the hand-lens cameras and the drill all share the robotic arm, one at a time.
- **Seismometer → lander:** SEIS needs a stationary lander with an arm and a wind shield. RISE needs a direct X-band link to Earth.
- **Helicopter → relay:** Ingenuity relays through its rover. SkyFall needs no lander.
- **Water extraction → ice map:** `EN2` needs ice located by `PH6`, `PH7` or SkyFall radar.
- **Hazardous landing site → precision landing:** a hazardous site needs `EN4`, plus orbital images (`GE7`) and mineral maps (`GE8`) to pick it.
- **Biosignature payoff → sample return:** `BI6` pays off only through a sample-return mission, which is currently cancelled (real-world).
- **Heavy or crewed lander:** needs the inflatable heat shield (`EN7`) and a bigger parachute (`EN5`).
- **All surface data → relay:** every surface instrument needs relay passes (`EN11`) or a direct link to Earth.
- **Crew survival:** needs the greenhouse (`BI7`), health monitoring (`BI8`), the radiation vest (`BI11`), oxygen (`EN1`), water (`EN2`), life support (`EN15`) and enough power (`EN3`).

---

## 8. Data cost of experiments

Compare these with the budget: a rover returns **~250 Mb/sol** (Curiosity's plan) up to **>1 Gbit/sol** (Perseverance). MRO's orbiter-to-Earth link reaches up to 6 Mbit/s.

| Experiment | Data | Ref |
|---|---|---|
| RIMFAX radar | 5–10 kB per sounding; 100 m of driving ≈ 5–10 MB (calc.) | PH4 |
| SuperCam | 15.5 Mb per experiment, ~4.2 Mb/day | GE2 |
| PIXL | ~16 Mb per experiment, ~2 MB/day | GE3 |
| MEDA weather | ~11 MB ⚠ (period not stated) | PH9 |
| SEIS seismometer | 38 Mb/day | PH2 |
| SHERLOC | 79.7 Mbit raw ⚠ | BI1 |
| Mastcam-Z | ~148 Mb/sol average | GE1 |
| HP3 heat probe | 350 Mb for the whole mission | `G9` |
| MinION | 4–20 Gb per run ⚠ | BI9 |
| MARCI | ~6.2 Gb per global weather map | PH10 |
| HiRISE | up to 28 Gb per image (~78 min at 6 Mbit/s, calc.) | GE7 |
| SHARAD | 40–90 Gb/day (capped at 15% of MRO's data) | PH7 |

---

## 9. Mapping to optional specializations

If the game adds the specializations suggested in [experiments.md §5](experiments.md#5-suggested-new-specializations), these items move to them:

| Optional role | Takes |
|---|---|
| Chemist | GE2, GE3, BI2, BI4, BI5, PH6 |
| Atmospheric scientist | PH8, PH9, PH10, BI3 |
| Navigator (flight dynamics) | GE1, GE7, PH3, EN4, EN8, EN10 |
| Comms & data engineer | PH3, EN11, EN12, EN13, EN14 |

---

## 10. Not usable today: lessons and events

These are real Mars cases that should not be selectable experiments but work well as **events or tutorial lessons**:

| Case | Lesson | Ref |
|---|---|---|
| Viking Labeled Release (1976) | A positive life signal contradicted by another instrument | `B13` |
| Mars Climate Orbiter (1999) | Unit mix-up between teams caused the loss of the spacecraft | `E15` |
| Schiaparelli (2016) | An overloaded sensor made the software trust bad data | `E16` |
| InSight HP3 "mole" (2019–21) | Unknown soil defeated good hardware | `G9` |
| Opportunity (2018), InSight (2022), Zhurong (2022) | Dust ends solar-powered missions | `G6`, `G9` |
| MAVEN (2025) | A relay orbiter lost suddenly, cause unknown | PH8 |
| Mars Sample Return (cancelled) | Samples are stranded without a return mission | `G8` |
| MARSIS "lake" (2018 → disputed 2025) | Discoveries can be overturned by better data | PH7 |
| Methane (TGO vs Curiosity) | Orbit and ground disagree | BI3 |

---

## 11. Known gaps

- **Mass and power not found:** APXS, MAHLI, DAN power, REMS, the drills, HRSC, MARSIS, NOMAD, ACS, CaSSIS, FREND.
- **Mission costs not found:** Odyssey, Mars Express, TGO, MAVEN, Hope, Tianwen-1, MMX, Rosalind Franklin.
- **Unverified in 2026:** Curiosity's operating status, Odyssey's remaining fuel, Tianwen-1 orbiter health (CNSA has said nothing).
- **Exact launch-window dates** for late 2026 and 2028 were not found in a NASA source.
- **Every ⚠ value** should be checked before it appears as a "real fact" in game text.
