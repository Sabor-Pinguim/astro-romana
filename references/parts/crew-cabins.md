# Crew Cabins and Control Panels: Real References (`crew-cabins.md`)

Technical data on real crew capsules and their control panels, for the game's crew cabin (`rocket/cabin_cutaway.glb`, [cabin-equipment.md](cabin-equipment.md)) and the first-person pilot panel ([pilot-cockpit.md](pilot-cockpit.md)). Checked 2026-11. Rules as in the rest of `references/`: every number has a source in section 5; `⚠` = sources disagree (both values given); `n/f` = not found; `derived` = calculated here.

## 1. Cabins compared

| Key | Orion (crew module) | Crew Dragon | Starliner | Apollo (command module) | Soyuz MS |
|---|---|---|---|---|---|
| `crew` | 4 [1] | 4 on NASA missions, 7 max [6] | 4 for NASA, 7 max [9] | 3 [11] | 3 [12] |
| `habitable_volume` | 8.95 m³ ⚠ [1][3] | n/f | ~11 m³ [9][10] | 6.17 m³ ⚠ [11] | n/f (descent module alone) |
| `pressurized_volume` | 19.56 m³ [3] | 9.3 m³ ⚠ [5][6] | n/f | n/f | 10.5 m³ (orbital + descent modules) [12] |
| `diameter` | 5.0 m [3] | 4.0 m [6] | ~4.56 m [9][10] | n/f | n/f |
| `height` | 3.35 m [3] | 8.1 m with trunk [6] | n/f | n/f | n/f |
| `mass` | 9,299–10,387 kg ⚠ [1][3] | 12,519 kg launch [6] | n/f | n/f | n/f |
| `volume_per_crew` | 2.2 m³ (derived: 8.95 / 4) | 2.3 m³ (derived: 9.3 / 4) | 2.75 m³ (derived: 11 / 4) | 2.1 m³ (derived: 6.17 / 3) | 3.5 m³ (derived: 10.5 / 3, two modules) |

Notes:

- ⚠ **Orion habitable volume:** 316 ft³ = 8.95 m³ [1]; other sources give 330 ft³ = 9.34 m³ [3] and 353 ft³ ≈ 10 m³ [4]. The definition of "habitable" changes between sources.
- ⚠ **Orion mass:** 9,299 kg is the nominal landed mass [3]; 10,387 kg is a capsule mass figure [1]. Say which phase when using it.
- ⚠ **Crew Dragon volume:** 9.3 m³ is quoted without saying whether it is pressurized or habitable [5][6].
- ⚠ **Apollo habitable volume:** 6.17 m³ [11] vs 5.9 m³ (210 ft³) in a secondary page; 6.17 m³ is the better supported value.
- **Soyuz:** the 10.5 m³ covers the orbital module and the descent module together; the crew rides in the descent module only during launch and landing [12].

## 2. Control panels compared

| Vehicle | Displays | Hand controllers | Physical switches | Backup philosophy | Sources |
|---|---|---|---|---|---|
| **Orion** | 3 display units | 2 rotational hand controllers (attitude), 2 translational hand controllers, 2 cursor control devices | 7 switch interface panels, about 60 switches | A backup set of switches can fly Orion if a display or hand controller fails | [2][3] |
| **Crew Dragon** | 3 central touchscreens (work with and without suit gloves) | n/f | A row of buttons and an abort handle under the screens; only the most essential controls are physical | Critical functions keep a physical control | [5][7][8] |
| **Starliner** | Touchscreen displays (much simpler than the Shuttle's) | n/f | Physical switches kept as urgent backup | Switches back up the screens | [9][10] |
| **Apollo CM** | No screens: the computer interface is the DSKY (numeric keypad, status lights, lighted digit displays); 2 DSKYs, one on the main panel and one in the lower equipment bay | n/f | Main panel divided by crew role; commander's side has the flight controls. Switch count n/f | Analog gauges and switches | [11][13] |
| **Soyuz** | Neptune-ME console (descent module), an upgrade of Neptune-M | n/f | n/f | Manual control interface differs from Neptune-M | [14] |

## 3. What the game takes from this

Game choices, labelled `game-balance` wherever numbers are used.

- **Cabin size:** real capsules give 2.1–2.75 m³ per crew member (section 1, derived). A 4-person Mars cabin in the game should look cramped. Supplies come from the 4 cabin module slots ([cabin-equipment.md](cabin-equipment.md)), not from a roomy interior.
- **Pilot panel layout** ([pilot-cockpit.md](pilot-cockpit.md)):
  - follow Orion: 3 large displays in a row, a hand controller on each side for attitude, translation controls next to them, and switch panels below;
  - this matches the "3 DUs" panel the team already planned, and the switch count can now be cited (about 60, 7 panels) instead of `~57 ⚠`.
- **Physical controls for critical actions:** every modern capsule (Dragon, Starliner, Orion) keeps physical controls for abort and emergencies even with touchscreens. In the game, abort, stage separation and parachute deploy should be big guarded buttons or handles, not touch buttons on a display.
- **Retro option:** an Apollo-style DSKY (numeric keypad + lit digits + status lights) is a recognizable, low-poly-friendly prop for a backup computer or a "manual mode" minigame.

## 4. Gaps and cautions

- No reference images were downloaded, to save effort. Free candidates are on the NASA Image Library (images.nasa.gov) by searching "Orion crew module interior", "Crew Dragon cockpit" and "Apollo command module main display console". NASA images are public domain unless marked otherwise.
- Starliner, Apollo and Soyuz display and switch details are thin; the Apollo Operations Handbook (NASA NTRS) and the Soyuz crew manuals would fill them.
- Starliner status should be rechecked before showing it to players: crewed flights after the 2024 Crew Flight Test have been uncertain.
- [pilot-cockpit.md](pilot-cockpit.md) cites the Shuttle "MEDS 9-LCD upgrade" without a source. Check it against NASA Shuttle documentation; it is commonly described with more displays.

## 5. Sources

1. Wikipedia, *Orion (spacecraft)*. https://en.wikipedia.org/wiki/Orion_(spacecraft) (accessed 2026-11-15)
2. NASA, *Orion crew systems* (reference page). https://www.nasa.gov/reference/crew-systems/ (accessed 2026-11-15)
3. Plant Services, *The Industrial Science Report: Inside Lockheed Martin's Orion crew capsule*. https://www.plantservices.com/industrial-science-report/article/55378102/inside-lockheed-martins-orion-crew-capsule (accessed 2026-11-15)
4. Smithsonian Air & Space, *America's Next Spaceship*. https://www.smithsonianmag.com/air-space-magazine/americas-next-spaceship-180952126/ (accessed 2026-11-15)
5. Orbital Velocity, *Crew Dragon builds on experience with ISS resupply*. https://www.orbital-velocity.com/crew-dragon (accessed 2026-11-15)
6. SpaceX, *Dragon*. https://new.spacex.com/vehicles/dragon (accessed 2026-11-15)
7. NASA Commercial Crew blog, *Crew Dragon Displays and Crew Spacesuits Ready for Mission to Space Station*, 2020. https://blogs.nasa.gov/commercialcrew/2020/05/12/crew-dragon-displays-and-crew-spacesuits-ready-for-mission-to-space-station (accessed 2026-11-15)
8. Space.com, *The touchscreen controls of SpaceX's Crew Dragon give astronauts a sci-fi way to fly in space*. https://www.space.com/spacex-crew-dragon-touchscreen-astronaut-thoughts.html (accessed 2026-11-15)
9. Space.com, *How Boeing's Commercial CST-100 Starliner Spacecraft Works*. https://www.space.com/41360-how-boeing-starliner-commercial-spacecraft-works.html (accessed 2026-11-15)
10. NASASpaceflight, *Boeing Starliner crew spacecraft*, 2018. https://www.nasaspaceflight.com/2018/08/boeing-starliner-crew-spacecraft/ (accessed 2026-11-15)
11. Astronautix, *Apollo CM*. https://dcmpx.remotevs.com/com/astronautix/www/PL/a/apollocm.html (mirror; accessed 2026-11-15)
12. Wikipedia, *Soyuz MS*. https://ipfs.ssi.eecc.de/ipns/en.wikipedia-on-ipfs.org/wiki/Soyuz_MS (mirror; accessed 2026-11-15)
13. Smithsonian National Air and Space Museum, *Keyboard, Display, DSKY, Apollo*. https://www.airandspace.si.edu/es/collection-objects/keyboard-display-dsky-apollo/nasm_A19720317000 (accessed 2026-11-15)
14. Wikipedia, *Information display systems* (Neptune-M / Neptune-ME). https://en.wikipedia.org/wiki/Information_display_systems (accessed 2026-11-15)
