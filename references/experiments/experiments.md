# Real Space Experiments — Game Reference

Real experiments, instruments and technology demonstrations from actual space missions, grouped by player specialization. Use it to build game content: experiment/instrument cards, real mass/power/data/cost numbers for balancing, and random events based on real failures.

Compiled on 2026-11-14 from web research (NASA, JPL, ESA, JAXA, ISRO, CNSA, CNES, NSSDCA, peer-reviewed papers). Sources are linked in every entry.

**For a Mars mission**, see [mars-experiments.md](mars-experiments.md): a catalog of what is usable *today*, with instrument specs, the current Mars fleet, and real Mars mission constraints.

## How to read this file

Each entry has:

- **Meta line:** agency · years · destination/orbit · crewed or robotic.
- **What:** what it did, in plain language.
- **Results:** key real numbers.
- **Hardware:** mass, power, data and cost when public.
- **Game hook:** a *suggestion* for how it could become game content. It is not a fact.
- **Sources.**

Markers:

| Marker | Meaning |
|---|---|
| **n/f** | Not found in public sources. If the game needs a value, invent a balanced one and treat it as fictional. |
| **⚠** | Sources conflict, or the number was only seen in a secondary source or search snippet. Check it before presenting it as a real fact in game text. |
| **$** | Costs are in then-year US dollars, not adjusted for inflation. |

## Contents

1. [Physics](#1-physics)
2. [Geology](#2-geology)
3. [Biology](#3-biology)
4. [Engineering](#4-engineering)
5. [Suggested new specializations](#5-suggested-new-specializations)
6. [Cross-cutting tables for game balancing](#6-cross-cutting-tables-for-game-balancing)
7. [Known gaps](#7-known-gaps)

---

## 1. Physics

Fundamental physics, gravity/relativity, radiation and space environment, heliophysics, microgravity physical science.

### P1 · Explorer 1 — discovery of the Van Allen radiation belts
*US Army / JPL / Univ. of Iowa · 1958 · Earth orbit 354 × 2,515 km · robotic*
- **What:** A Geiger counter measured cosmic rays. At high altitude the counts dropped to zero. James Van Allen realized the radiation was so intense it had *saturated* the detector, and so discovered Earth's radiation belts. Explorer 3 confirmed it.
- **Results:**
  - The counter went silent above ~1,100 km.
  - It transmitted until 23 May 1958, when the batteries died.
  - It re-entered on 31 Mar 1970 after 58,000+ orbits.
- **Hardware:** 14 kg spacecraft, mercury batteries. Power, data and cost: n/f.
- **Game hook:** "Saturated sensor" event: a zero reading can mean *too much* signal, and the physicist earns a discovery by reinterpreting it. Battery-limited lifetime.
- **Sources:** [JPL](https://www.jpl.nasa.gov/missions/explorer-1/) · [NASA History](https://www.nasa.gov/history/story-of-explorer-1/)

### P2 · Lunar Laser Ranging retroreflectors
*NASA · Apollo 11 (1969), 14 and 15 (1971) · Moon surface · crewed deployment, still in use*
- **What:** Passive panels of glass corner-cube prisms. Observatories fire lasers at them and time the round trip to measure the Earth–Moon distance.
- **Results:**
  - The Moon recedes ~3.8 cm/year.
  - Range accuracy is ~3 cm (older NASA figure).
  - Einstein's equivalence principle was confirmed to ±1.4×10⁻¹³.
  - No change in the gravitational constant G was detected.
  - The data show evidence of a liquid lunar core.
- **Hardware:** Apollo 11 has 100 fused-silica cubes (3.8 cm each) on a 46 cm panel; Apollo 15 has 300 cubes. **0 W** (passive). Mass n/f.
- **Game hook:** A zero-power, zero-data "legacy" payload that keeps producing science for 50+ years, but only while ground stations keep using it.
- **Sources:** [NASA GSFC](https://eclipse.gsfc.nasa.gov/help/ApolloLaser.html) · [JPL](https://www.jpl.nasa.gov/news/apollo-11-experiment-continues-to-return-valuable-data/) · [Williams et al. 2004](https://arxiv.org/abs/gr-qc/0412049)

### P3 · Apollo 15 hammer–feather drop
*NASA · 1971 · Moon (Hadley Rille) · crewed*
- **What:** David Scott dropped a hammer and a falcon feather at the same time on live TV. With no air, they landed together, confirming Galileo's prediction that all bodies fall equally in a vacuum.
- **Results:**
  - Qualitative only. Hammer 1.32 kg (aluminium); drop height ~1.6 m.
  - The feather is listed as "0.03 kg" in NASA SP-289, probably a typo, since real feathers weigh 0.3–3 g ⚠.
- **Hardware:** No extra mass (geology hammer plus a feather). 0 W.
- **Game hook:** "Crew-time demo" card: free in mass and power, but uses the last minutes of an EVA. High outreach points, low science points.
- **Sources:** [NSSDCA](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_15_feather_drop.html) · [NASA](https://science.nasa.gov/resource/the-apollo-15-hammer-feather-drop/)

### P4 · Skylab Apollo Telescope Mount (ATM)
*NASA · 1973–74 · low Earth orbit · crewed (3 crews, 171 days)*
- **What:** A solar observatory (X-ray to visible) that recorded on photographic film. Astronauts chose targets based on solar activity and swapped film cassettes on spacewalks. It linked coronal holes to the fast solar wind and observed coronal mass ejections.
- **Results:**
  - 150,000–170,000+ solar images ⚠ (NASA pages differ).
  - The coronagraph saw 110 coronal transients in 227 days.
  - The X-ray telescope took ~27,000 images.
- **Hardware:** Mass and power n/f. Data was physical film; the last retrieval took a 5 h 19 min EVA (3 Feb 1974).
- **Game hook:** Data volume capped by film canisters, recovered only by an EVA. Crewed bonus: astronauts react to solar flares in real time.
- **Sources:** [NASA History](https://www.nasa.gov/history/45-years-ago-splashdown-of-third-and-final-skylab-crew/) · [NTRS](https://ntrs.nasa.gov/api/citations/19760020063/downloads/19760020063.pdf)

### P5 · Voyager 1 and 2 — crossing the heliopause
*NASA/JPL · launched 1977 · interstellar space · robotic*
- **What:** They detected where the Sun's bubble ends: solar particles dropped sharply while galactic cosmic rays rose. Voyager 1's plasma instrument was dead, so the team inferred plasma density from plasma waves triggered by solar eruptions.
- **Results:**
  - Voyager 1 crossed on 25 Aug 2012 at ~121.6 AU; Voyager 2 on 5 Nov 2018 at ~119 AU.
  - Interstellar plasma is >40× denser than in the outer heliosphere.
  - The heliosphere blocks >70% of cosmic radiation.
  - Voyager 1 reaches **one light-day from Earth (25.9 billion km) on 18 Nov 2026**.
- **Hardware:**
  - Radioisotope power falls ~4 W/year.
  - Instruments are being switched off to save power: Voyager 1's cosmic ray instrument in Feb 2025, its low-energy particle instrument (LECP) in Apr 2026.
  - ~23 W transmitter, 3.7 m high-gain antenna, ~160 bit/s ⚠.
- **Game hook:** A shrinking power budget: every few years the team chooses which instrument to turn off. "Broken sensor, creative workaround" event.
- **Sources:** [JPL 2013](https://jpl.nasa.gov/news/news.php?release=2013-277) · [NASA Voyager 2](https://www.nasa.gov/news-release/nasas-voyager-2-probe-enters-interstellar-space/) · [Where are the Voyagers](https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/)

### P6 · Plasma Kristall series (PKE-Nefedov, PK-3 Plus, PK-4)
*Roscosmos / DLR / Max Planck Institute (+ESA) · Mir 1998, ISS 2001–today · low Earth orbit · crewed*
- **What:** Tiny plastic grains floating in a low-pressure glowing gas become electrically charged and arrange themselves into "plasma crystals". These are visible models of how solids and liquids form. Gravity squashes the structure, so the experiment needs microgravity.
- **Results:**
  - **PKE-Nefedov (2001–05)**, the first basic-science experiment on the ISS, found an unexpected particle-free "void".
  - **PK-3 Plus (2006–13)** gave the first observation of an "electrorheological" plasma, whose structure changes under an electric field.
  - **PK-4** (in ESA's Columbus module since 2014) ran 3 campaigns in 2019, totalling 12 experiment days and ~9 TB of data ⚠.
  - 100+ papers.
- **Hardware:** Mass, power and cost n/f.
- **Game hook:** Short crew-run campaigns that produce huge video data volumes and strain the downlink. "Unexpected void" discovery event.
- **Sources:** [MPE PK-3 Plus](https://projects.mpe.mpg.de/theory/plasma-crystal/PK3P/results3p_e.html) · [DLR PK-4 report](https://elib.dlr.de/136471/1/Munich-Aerospace-Annual-Report-PK-4-2020.pdf)

### P7 · Gravity Probe B — testing general relativity
*NASA / Stanford · 2004–05 (results 2011) · 642 km polar orbit · robotic*
- **What:** Four ultra-round quartz gyroscopes, chilled in liquid helium, pointed at a star. Their slow drift measured how Earth warps spacetime (geodetic effect) and drags it around as it spins (frame-dragging).
- **Results:**
  - Geodetic effect: −6,601.8 ± 18.3 mas/yr, against Einstein's prediction of −6,606.1.
  - Frame-dragging: −37.2 ± 7.2 mas/yr, against a prediction of −39.2.
  - **Anomaly:** unexpected torques on the gyroscopes raised the frame-dragging error to ~19%, against a ~1% goal.
- **Hardware:**
  - 3,100 kg; 606 W (293 W spacecraft + 313 W payload).
  - 2,441 L of superfluid helium at 1.8 K, which ran out on 29 Sep 2005.
  - Gyroscope rotors 38 mm across, round to within 10 nm.
  - 1.9 Gbit recorder, 2.5 Mbit/s downlink.
  - ~$750M (1963–2007).
- **Game hook:** The coolant sets a hard mission lifetime. "Unexpected systematic error" event inflates error bars and adds years of analysis.
- **Sources:** [Everitt et al. 2011](https://arxiv.org/abs/1105.3456) · [NASA](https://www.nasa.gov/image-article/results-implications/) · [eoPortal](https://www.eoportal.org/satellite-missions/gp-b) · [Stanford FAQ](http://einstein.stanford.edu/content/faqs/faqs.html)

### P8 · AMS-02 (Alpha Magnetic Spectrometer)
*International collaboration (16 countries, 600+ people) · 2011–present · ISS truss · robotic, crew-serviced*
- **What:** A magnet-based particle detector that measures the charge, energy and type of cosmic rays, searching for antimatter and signs of dark matter.
- **Results:**
  - An unexplained excess of positrons (anti-electrons) at high energy (PRL 2013, 2014). It could come from dark matter or from pulsars.
  - ~180 billion cosmic-ray events recorded.
- **Hardware:** ~6,700–6,800 kg; 2,000–2,500 W ⚠; ~1 GB/s raw data, compressed to ~300 kB/s ⚠; ~$2B ⚠ (Wikipedia).
- **Failure and repair:**
  - The cooling pumps began degrading in 2014; by 2017 only 1 of 4 worked.
  - AMS-02 was never designed to be serviced, yet 4 spacewalks (Nov 2019 – Jan 2020) with 29 purpose-built tools fixed it.
  - It was planned for 3 years and is still running.
- **Game hook:** A mass, power and data hog. "Cooling pump failure" event: attempt a risky EVA repair or lose the instrument.
- **Sources:** [NASA 10 years](https://www.nasa.gov/general/alpha-magnetic-spectrometer-hits-ten-years-of-space-station-research/) · [APS PRL 2013](https://physics.aps.org/featured-article-pdf/10.1103/PhysRevLett.110.141102) · [Wikipedia](https://en.wikipedia.org/wiki/Alpha_Magnetic_Spectrometer) ⚠

### P9 · FLEX — discovery of "cool flames"
*NASA Glenn / UC San Diego · 2009–2011 (published 2014) · ISS Combustion Integrated Rack · crewed*
- **What:** A fire-safety study that burned free-floating fuel droplets. Large heptane droplets **kept burning invisibly after the visible flame went out**: a "cool flame" that only survives without buoyancy. It was an unplanned discovery ("something that we didn't think could exist").
- **Results:**
  - Tested heptane, octane and decane at 0.5–1.0 atm with 14–25% oxygen.
  - The cool flame produced carbon monoxide and formaldehyde instead of soot.
  - The flame is much cooler than a candle's (~2.5× per NASA ⚠).
- **Hardware:** Combustion chamber ~90–100 L; rack/insert "~560 lb" ⚠ (unclear which). Power n/f.
- **Game hook:** "Serendipity" event: leaving sensors running after an experiment "ends" pays off.
- **Sources:** [NASA 20 breakthroughs](https://www.nasa.gov/missions/station/20-breakthroughs-from-20-years-of-science-aboard-the-international-space-station/) · [NTRS](https://ntrs.nasa.gov/citations/20140006750) · [UCSD](https://jacobsschool.ucsd.edu/news/release/1548)

### P10 · Curiosity RAD — radiation on the way to Mars
*NASA / SwRI / Univ. of Kiel · 2011–present · cruise to Mars + Gale crater · robotic*
- **What:** Measured the radiation dose an astronaut would receive inside a spacecraft on the way to Mars and on the Martian surface.
- **Results:**
  - Cruise: ~1.8 mSv/day. Surface: ~0.64–0.67 mSv/day.
  - The round-trip transit alone gives ~0.66 Sv.
  - A 180-day trip, 500-day stay and 180-day return totals ~1.01 Sv.
  - For comparison, the ISS rate is ~0.43 mSv/day (146 mSv in 340 days, see B1).
- **Hardware:** **1.56 kg** (the MSL press kit says 1.7 kg ⚠), **4.2 W.** The duty cycle can be adjusted to fit power and data budgets.
- **Game hook:** Radiation dose as a resource: a longer cruise means more dose, and shielding costs mass. "Solar storm" event.
- **Sources:** [JPL](https://www.jpl.nasa.gov/news/data-from-nasa-rovers-voyage-to-mars-aids-planning/) · [NASA](https://science.nasa.gov/resource/radiation-measurements-on-mars/) · [SwRI](https://www.swri.org/press-release/swri-scientists-publish-first-radiation-measurements-surface-mars)

### P11 · MICROSCOPE — testing the equivalence principle
*CNES / ONERA · 2016–18 · ~710 km sun-synchronous orbit · robotic*
- **What:** Titanium and platinum test masses were kept in free fall inside a satellite that cancels air drag. If they had fallen differently, Einstein's equivalence principle would be broken.
- **Results:**
  - η = (−1.5 ± 2.3 stat ± 1.5 syst)×10⁻¹⁵: no violation, and ~100× better than ground experiments.
  - Only ~5 months of usable data came out of 2.5 years in orbit.
- **Hardware:**
  - Spacecraft ~300–330 kg ⚠, ~140 W.
  - T-SAGE instrument 40 kg (20 W per accelerometer).
  - Cold-gas thrusters of 1–300 µN.
  - 625 kbit/s downlink. Cost n/f.
- **Game hook:** A small, cheap satellite beats ground labs. Trade-off between precision and how much mission time yields usable data.
- **Sources:** [Touboul et al. 2022](https://arxiv.org/abs/2209.15487) · [eoPortal](https://eoportal.org/satellite-missions/microscope)

### P12 · LISA Pathfinder — near-perfect free fall
*ESA · 2015–17 · Sun–Earth L1 · robotic*
- **What:** Two ~2 kg gold–platinum cubes floated freely inside the spacecraft while a laser measured their relative motion. It was a test of the technology for a future gravitational-wave observatory (LISA).
- **Results:**
  - Free fall was >5× better than required.
  - Precision **improved over time** as leftover gas vented to space.
  - The laser system beat its requirement by >100×.
- **Hardware:** 1,910 kg at launch including fuel; cubes 46 mm. Cost €490M ⚠ (Wikipedia). Power and data n/f.
- **Game hook:** "Patience bonus": precision improves the longer the mission runs.
- **Sources:** [ESA fact sheet](https://sci.esa.int/lisa-pathfinder/47363-fact-sheet) · [ESA](https://www.esa.int/Science_Exploration/Space_Science/LISA_Pathfinder_exceeds_expectations)

### P13 · Cold Atom Lab — quantum matter in orbit
*NASA/JPL · 2018–present · ISS · robotic (operated from Earth), crew-installed upgrades*
- **What:** Cools rubidium and potassium atoms to ~100 nanokelvin, forming Bose–Einstein condensates (a quantum state of matter). In orbit the atom clouds float for seconds instead of fractions of a second.
- **Results:**
  - First Bose–Einstein condensate in orbit (2018), observed for 5–10 s.
  - First two-species atom interferometry in space (Nature, 2023).
  - 4th hardware upgrade in May 2026.
- **Hardware:** ~205 kg (quad locker) + 62 kg (single locker), "size of a mini-fridge". Power and cost n/f.
- **Game hook:** Needs no crew time to operate, but crew must install upgrades. "Upgrade" event unlocks new experiments.
- **Sources:** [JPL mission](https://www.jpl.nasa.gov/missions/cold-atom-laboratory-cal/) · [JPL milestone](https://www.jpl.nasa.gov/news/space-station-experiment-reaches-ultracold-milestone) · [JPL upgrade](https://www.jpl.nasa.gov/news/nasas-quantum-lab-aboard-space-station-gets-chilly-upgrade/)

### P14 · Parker Solar Probe — "touching the Sun"
*NASA / Johns Hopkins APL · 2018–present · solar orbit (7 Venus flybys) · robotic*
- **What:** Flies through the Sun's outer atmosphere (the corona), measuring fields and particles. It was the first spacecraft to enter the corona (2021), and it discovered magnetic "switchbacks" in the solar wind.
- **Results:**
  - Closest pass on 24 Dec 2024: **6.1 million km** from the solar surface at ~430,000 mph (~690,000 km/h).
  - That is the fastest any human-made object has gone.
- **Hardware:** 635–685 kg ⚠; heat shield 11.43 cm thick, ~73 kg. ~$1.5B ⚠. Power n/f.
- **Game hook:** Heat-shield mass competes with instrument mass. No contact during the closest pass, so a "nervous wait" event: the "I'm alive" signal arrives days later.
- **Sources:** [NASA closest pass](https://science.nasa.gov/missions/parker-solar-probe/nasas-parker-solar-probe-makes-history-with-closest-pass-to-sun/) · [APL spacecraft](https://parkersolarprobe.jhuapl.edu/Spacecraft/index.php)

### P15 · ACES — atomic clocks testing Einstein
*ESA / CNES · 2025–present · ISS (outside Columbus) · robotic*
- **What:** A laser-cooled caesium clock (PHARAO) and a hydrogen maser are compared with clocks on the ground to measure how gravity changes the rate of time (gravitational redshift).
- **Results:**
  - Design target: lose 1 s in 300 million years.
  - CNES (Oct 2026): PHARAO is accurate to the 16th decimal place and can sense a 1 m change in altitude.
  - The redshift result is not yet published.
  - **Anomaly:** the maser gave no signal after launch and took ~10 months to recover.
- **Hardware:** 227–240 kg, 450–600 W ⚠ (ESA slides differ), ~1 m³. Planned for 30 months. Cost n/f.
- **Game hook:** "Clock won't start" event: commissioning delays eat into mission lifetime.
- **Sources:** [ESA](https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/ACES_Atomic_Clock_Ensemble_in_Space) · [CNES](https://cnes.fr/en/news/pharao-takes-timekeeping-accuracy-new-heights)

### P16 · Galileo 5 & 6 — a launch failure turned into a physics result
*ESA / European Commission · 2014 · wrong elliptical orbit · robotic*
- **What:** A faulty Soyuz upper stage left two navigation satellites in elongated orbits, useless for navigation. Scientists used 1,008 days of their clock data to test gravitational redshift.
- **Results:** Deviation from Einstein's prediction (0.19 ± 2.48)×10⁻⁵, 5.6× better than the previous best test, Gravity Probe A (1976). Published in PRL, 2018.
- **Game hook:** "Wrong orbit" event: a launch failure can be repurposed into a science opportunity.
- **Sources:** [ESA](https://www.esa.int/Applications/Satellite_navigation/Galileo_satellites_prove_Einstein_s_Relativity_Theory_to_highest_accuracy_yet)

---

## 2. Geology

Planetary geoscience: sample return, rover field geology, seismology, geochemistry/mineralogy, water and ice in rocks and regolith. Stardust (comet dust) is under the Chemist, in [C1](#c1--stardust--comet-dust-and-glycine).

### G1 · Apollo field geology and sample return
*NASA · 1969–72 · Moon · crewed*
- **What:** Six crews collected rocks, cores and soil by hand. On Apollo 17, **Harrison Schmitt, the only geologist to walk on the Moon**, spotted orange soil at Shorty crater. It turned out to be volcanic glass beads.
- **Results:**
  - **382 kg** returned in ~2,200 samples; Apollo 17 alone brought ~111 kg.
  - The "Genesis Rock" (Apollo 15, 269.4 g, 98% plagioclase, ~4 billion years old) is a piece of the Moon's primordial crust.
  - The orange glass carries volatiles (zinc, sulfur) from deep in the mantle.
- **Hardware:** n/f per instrument.
- **Game hook:** A trained geologist on an EVA earns an "unexpected discovery" roll. Sample mass is capped by what the ascent stage can lift.
- **Sources:** [JSC curation](https://curator.jsc.nasa.gov/lunar/) · [USGS Schmitt](https://www.usgs.gov/centers/astrogeology-science-center/harrison-h-schmitt) · [LROC](https://lroc.im-ldi.com/images/417)

### G2 · Apollo Passive Seismic Experiment — moonquakes
*NASA · 1969–77 · Moon near side · crewed deployment*
- **What:** Seismometers left at Apollo 12, 14, 15 and 16 formed a 4-station network. It recorded moonquakes, meteorite impacts and deliberate crashes of spent rocket stages until it was **switched off in 1977 because of budget cuts**.
- **Results:**
  - ~6,000 deep moonquakes at 700–1,000 km depth. They repeat with the tidal cycle and are magnitude ~1 or less.
  - Only 28 shallow moonquakes, but large ones (M3–5 ⚠).
  - The crash of Apollo 12's spent ascent stage made the Moon "ring" for ~1 hour.
- **Hardware:** Each station's whole surface experiment package was powered by a SNAP-27 radioisotope generator of ~70 W.
- **Game hook:** A network needs 3+ stations to locate quakes. Crashing spent stages turns junk into free calibration. "Budget cut, network switched off" event.
- **Sources:** [PDS Lunar seismology](https://pds-geosciences.wustl.edu/Lunar/urn-nasa-pds-apollo_seismic_event_catalog/document/lunar_seismology_background.pdf) · [NASA SP-4029](https://www.nasa.gov/wp-content/uploads/static/history/SP-4029/Apollo_18-33_Lunar_Surface_Experiments.htm)

### G3 · Robotic lunar sample return — Luna 16/20/24 vs Chang'e 5/6
*USSR 1970–76; CNSA 2020 and 2024 · Moon, including the far side · robotic*
- **What:** Automated landers drilled or scooped soil and launched it back to Earth. Chang'e 6 returned the first samples ever taken from the Moon's far side.
- **Results:**
  - **Luna:** Luna 16 brought 101 g, Luna 20 55 g ⚠ (some sources say 30 g), Luna 24 170 g from a ~2 m drill core. About 300 g in total.
  - **Chang'e 5:** 1,731 g, including the youngest lunar basalt ever dated (2.03 billion years). That extends lunar volcanism by ~800 million years.
  - **Chang'e 6:** 1,935.3 g (returned 25 Jun 2024). Far-side basalts are ~2.8 billion years old; one fragment is 4.2 billion.
- **Hardware:** n/f.
- **Game hook:** Robotic return is cheaper but brings back grams, not kilograms. A deeper drill or a surface scoop. The far side gives novel science but needs a relay satellite for communications.
- **Sources:** [LROC](https://lroc.im-ldi.com/images/9) · [CAS](https://english.cas.cn/newsroom/cas_media/202110/t20211020_285846.shtml) · [gov.cn CE-6](https://english.www.gov.cn/news/202406/28/content_WS667e2277c6d0868f4e8e8a54.html)

### G4 · Hayabusa and Hayabusa2 — asteroid sample return
*JAXA · 2003–10 and 2014–20 · asteroids Itokawa and Ryugu · robotic*
- **What:** Two touch-and-go asteroid samplers. Hayabusa survived a **chain of failures** and still came home. Hayabusa2 fired an impactor to dig an artificial crater and then sampled the fresh material underneath.
- **Results:**
  - **Hayabusa's failures:** a solar flare degraded the solar panels; 2 reaction wheels failed (2005); a thruster leak caused contact loss from Dec 2005 to Mar 2006; 4 of 11 battery cells failed.
  - Hayabusa still returned ~1,500 grains (2010), mostly smaller than 10 µm.
  - **Hayabusa2** returned **5.4 g**, against a 0.1 g goal.
  - Ryugu is rich in water-altered minerals that formed ~5 million years after the solar system began, and contains tiny inclusions of liquid water.
- **Hardware:** Hayabusa 510 kg; Hayabusa2 ~600 kg; impactor ~2 kg of copper ⚠. Cost n/f.
- **Game hook:** A cascading-failure event chain, where the "limp home" option costs 3 years. An impactor buys subsurface access but costs a payload slot.
- **Sources:** [NASA Hayabusa](https://science.nasa.gov/mission/hayabusa/) · [JAXA Hayabusa2](https://www.isas.jaxa.jp/en/missions/spacecraft/current/hayabusa2.html) · [JAXA Ryugu summary](https://cosmos.isas.jaxa.jp/the-sample-from-asteroid-ryugu-summary-early-2023/)

### G5 · OSIRIS-REx — asteroid Bennu
*NASA · 2016–23 · asteroid Bennu · robotic*
- **What:** Touched Bennu on 20 Oct 2020 and returned the sample capsule to Utah on 24 Sep 2023.
- **Results:**
  - Bennu's surface behaved like a **"plastic ball pit"**: the sampler sank far deeper than expected and left an 8 m crater.
  - **121.6 g** returned, more than 2× the requirement and the largest asteroid sample ever collected.
  - **Anomaly:** 2 of the 35 fasteners on the sampler head could not be removed with the cleanroom tools. Curation paused from Oct 2023 until new tools freed them in Jan 2024.
  - The sample contains 11 minerals left by evaporating brine, including trona, found for the first time outside Earth.
- **Hardware:** Mass and cost n/f.
- **Game hook:** Unknown surface strength creates a sink risk on touchdown. "Stuck fasteners delay sample analysis" event.
- **Sources:** [NASA mission](https://science.nasa.gov/mission/osiris-rex/) · [NASA ball pit](https://www.nasa.gov/missions/surprise-again-asteroid-bennu-reveals-its-surface-is-like-a-plastic-ball-pit) · [U. Arizona](https://news.arizona.edu/news/nasas-osiris-rex-curation-team-clears-hurdle-access-remaining-bennu-sample)

### G6 · Opportunity — hematite "blueberries"
*NASA · 2004–2018 · Mars (Meridiani Planum) · robotic*
- **What:** It landed where an orbiter had detected the mineral hematite. It found the hematite inside small spheres ("blueberries") eroding out of layered sandstone: evidence of past groundwater.
- **Results:**
  - Planned for **90 sols and ~1 km**; it ran **~15 years and 45.16 km** (~60× the plan).
  - A planet-wide dust storm ended contact in Jun 2018.
- **Hardware:** Rover 185 kg. The Mars Exploration Rover program cost **$1.08B for both rovers**: $744M for development and launch plus $335.8M for operations.
- **Game hook:** An orbital mineral map lowers landing-site risk. "Mission extended" event (more science, more operations cost) and "Global dust storm" event.
- **Sources:** [NASA](https://science.nasa.gov/mission/mer-opportunity/) · [Planetary Society cost](https://planetary.org/space-policy/cost-of-the-mars-exploration-rovers)

### G7 · Curiosity — ChemCam laser and CheMin X-ray diffraction
*NASA (ChemCam with CNES) · 2012–present · Mars (Gale crater) · robotic*
- **What:** ChemCam vaporizes pinhead-sized spots up to 7 m away with a laser and reads which elements are present. CheMin identifies minerals by X-ray diffraction of drilled rock powder. Together they showed that Gale crater once held lakes.
- **Results:**
  - Lakes and streams existed sometime between ~3.8 and 3.3 billion years ago.
  - The Yellowknife Bay mudstone records a neutral-pH lake (~20% clay ⚠).
  - ChemCam fired its **1 millionth shot** in Aug 2024, though it was designed for 2 years.
  - 42 drill samples by 2026.
- **Hardware:**
  - Rover 899 kg.
  - CheMin uses ~10 mm³ of powder per analysis and takes up to 10 h over 2+ nights.
  - CheMin has 27 fresh sample cells (74 analyses with reuse).
  - ChemCam and CheMin mass and power n/f.
- **Game hook:** A fast remote laser vs a slow drill + X-ray analysis. Sample cells are a finite consumable.
- **Sources:** [JPL ancient lakes](https://www.jpl.nasa.gov/news/nasas-curiosity-rover-team-confirms-ancient-lakes-on-mars/) · [PDS CheMin](https://pds-geosciences.wustl.edu/msl/msl-m-chemin-4-rdr-v1/mslcmn_1xxx/document/chemin_basics.htm) · [CNES 1M shots](https://cnes.fr/en/news/1-million-shots-chemcam-mars)

### G8 · Perseverance — sample caching and the "Cheyava Falls" rock
*NASA · 2021–present · Mars (Jezero crater) · robotic*
- **What:** Drills rock cores and seals them in tubes for a future return to Earth.
- **Results:**
  - 43 tubes were flown; a 10-tube backup depot was laid at "Three Forks" (from Dec 2022).
  - The "Cheyava Falls" rock (~1 × 0.6 m) was cored on 21 Jul 2024 as sample #25, "Sapphire Canyon".
  - It has mm-sized "leopard spots" containing iron phosphate (vivianite) and iron sulfide (greigite) (Nature, Sep 2025). The biology interpretation is in [B14](#b14--perseverance--cheyava-falls-potential-biosignature).
  - **Setback:** Mars Sample Return was estimated at $8–11B with no return before 2040. It was cancelled in the FY2026 budget (Jan 2026) ⚠ (per the Planetary Society).
- **Hardware:** n/f.
- **Game hook:** A limited number of tubes forces the team to choose which rocks to keep. "Return mission cancelled: samples stranded" event.
- **Sources:** [JPL Cheyava Falls](https://www.jpl.nasa.gov/news/nasas-perseverance-rover-scientists-find-intriguing-mars-rock/) · [JPL depot](https://www.jpl.nasa.gov/news/nasas-perseverance-rover-deposits-first-sample-on-mars-surface) · [Planetary Society](https://www.planetary.org/articles/nasa-is-funded-now-what) ⚠

### G9 · InSight — marsquakes and the failed "mole"
*NASA (seismometer built by CNES) · 2018–22 · Mars (Elysium Planitia) · robotic*
- **What:** A seismometer on the surface listened for marsquakes to map the planet's interior. A self-hammering heat probe (the "mole") was meant to dig in and measure heat flow.
- **Results:**
  - **1,319 marsquakes**; the largest was announced as magnitude 5 (May 2022). Later analyses give Mw 4.7 or lower ⚠.
  - Liquid core radius ~1,830 km; crust 20 or 37 km thick.
  - **Failure:** the mole needed to reach ≥3 m but barely got below the surface (its top only 2–3 cm down). The clumpy soil gave it no friction, and the team tried for ~2 years.
  - Dust on the solar panels ended the mission in Dec 2022.
- **Hardware:** Mass, power and cost n/f.
- **Game hook:** "Unknown soil" event: a subsurface tool can fail even with good hardware. Solar power decays as dust builds up.
- **Sources:** [JPL retirement](https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/) · [JPL mole](https://www.jpl.nasa.gov/news/nasa-insights-mole-ends-its-journey-on-mars/) · [JPL interior](https://www.jpl.nasa.gov/news/nasas-insight-reveals-the-deep-interior-of-mars/)

### G10 · Phoenix — water ice confirmed on Mars
*NASA · 2008 · Mars arctic (68°N) · robotic*
- **What:** Its robotic arm dug trenches in the arctic soil. Bright chunks exposed in a trench **vanished in ~4 days**: they were ice turning directly into vapor, not salt.
- **Results:**
  - A hard icy layer lies ~5 cm down.
  - An onboard oven and gas analyser confirmed water ("We have water", 31 Jul 2008).
  - Perchlorate (a reactive salt) was also found.
  - The mission ended in Nov 2008 with the arrival of the Martian winter.
- **Hardware:** Mass and cost n/f.
- **Game hook:** A time-critical observation: exposed ice disappears in days. Landing at high latitude gives access to ice but a short season.
- **Sources:** [JPL ice](https://www.jpl.nasa.gov/news/bright-chunks-at-phoenix-landers-mars-site-must-have-been-ice/) · [JPL water](https://www.jpl.nasa.gov/news/nasa-spacecraft-confirms-martian-water-mission-extended/)

### G11 · Water on the Moon — Chandrayaan-1 M3 and LCROSS
*ISRO/NASA 2008–09 · Moon · robotic*
- **What:** The Moon Mineralogy Mapper (M3) on Chandrayaan-1 mapped the infrared signature of water from orbit. LCROSS crashed a spent rocket stage into a permanently shadowed crater and flew through the plume.
- **Results:**
  - M3 found up to ~1,000 ppm of water in the surface soil (2009).
  - Surface ice in polar shadowed craters was confirmed from M3 data (2018).
  - The LCROSS plume (Cabeus crater, Oct 2009) was ~5.6 ± 2.9% water by mass ⚠.
  - **Anomaly:** Chandrayaan-1 lost contact in Aug 2009, short of its planned 2 years.
- **Hardware:** Chandrayaan-1 1,380 kg; LCROSS 621 kg; impacting rocket stage ~2,305 kg ⚠.
- **Game hook:** Orbital spectroscopy is a cheap, wide survey. An impactor is a single shot that gives ground truth.
- **Sources:** [NASA Chandrayaan-1](https://science.nasa.gov/mission/chandrayaan-1/) · [JPL ice confirmed](https://www.jpl.nasa.gov/news/ice-confirmed-at-the-moons-poles/) · [NASA LCROSS](https://science.nasa.gov/mission/lcross/) · [Colaprete et al. 2010](https://doi.org/10.1126/science.1186986)

### G12 · Chandrayaan-3 — Pragyan rover finds sulfur
*ISRO · 2023 · Moon (~69°S, near the south pole) · robotic*
- **What:** A small rover used a laser spectrometer to measure elements on the spot near the lunar south pole.
- **Results:**
  - Sulfur was detected unambiguously, something orbiters could not establish. Al, Ca, Fe, Cr, Ti, Mn, Si and O were also detected.
  - It was designed for **one lunar day (~14 Earth days)**. It was put to sleep in Sep 2023, and no wake-up was reported.
- **Hardware:** **Rover 26 kg, 50 W**; lander module 1,752 kg.
- **Game hook:** Race against the lunar night. A cheap, small rover with instant chemistry but no night survival.
- **Sources:** [ISRO LIBS results](https://www.isro.gov.in/LIBSResults.html) · [ISRO Chandrayaan-3](https://www.isro.gov.in/Chandrayaan3_Details.html)

### G13 · MESSENGER — ice on Mercury
*NASA / Johns Hopkins APL · 2004–15 · Mercury orbit · robotic*
- **What:** The first Mercury orbiter. It confirmed that bright radar spots in permanently shadowed polar craters are water ice.
- **Results:**
  - The polar deposits are "dominantly water ice".
  - Polar craters are up to 10% shallower than expected, suggesting thick buried ice.
  - When its propellant ran out, it was deliberately crashed into Mercury (30 Apr 2015).
- **Hardware:** 1,107.9 kg. Cost under $450M ⚠.
- **Game hook:** Even the planet closest to the Sun has ice in the shadows. Thermal design is the trade-off.
- **Sources:** [NASA](https://science.nasa.gov/mission/messenger/) · [NASA thick ice](https://www.nasa.gov/solar-system/the-moon-and-mercury-may-have-thick-ice-deposits/)

### G14 · Dawn — Vesta and Ceres
*NASA · 2007–18 · main asteroid belt · robotic (propulsion in [E8](#e8--ion-propulsion--deep-space-1-and-dawn))*
- **What:** The first spacecraft to orbit two different bodies beyond Earth: Vesta (2011) and the dwarf planet Ceres (2015).
- **Results:**
  - **Vesta:** the Rheasilvia impact basin is 500 km wide, ~95% of Vesta's diameter. Vesta has an iron core ~225 km across.
  - Vesta was confirmed as the parent body of the HED meteorites, ~6% of all meteorites found on Earth.
  - **Ceres:** ~25% ice by mass. The bright spots in Occator crater are carbonates and other salts.
  - The mission ended when the hydrazine used for pointing ran out (2018).
- **Hardware:** See E8.
- **Game hook:** Bonus for linking meteorites in hand to their parent body. Pointing fuel, not the instruments, sets the end of the mission.
- **Sources:** [NASA Vesta](https://science.nasa.gov/mission/dawn/science/vesta/) · [NASA Ceres](https://science.nasa.gov/mission/dawn/science/ceres/) · [JPL end](https://www.jpl.nasa.gov/news/nasas-dawn-mission-to-asteroid-belt-comes-to-end/)

---

## 3. Biology

Life sciences and astrobiology: human physiology, plants, microbes, animals, molecular biology in orbit, life detection and habitability.

### B1 · NASA Twins Study
*NASA · 2015–16 (340 days) · ISS · crewed*
- **What:** Scott Kelly spent nearly a year on the ISS while his identical twin Mark stayed on Earth as a genetic control. Ten research teams compared genes, immune system, heart, eyes, gut microbes and cognition.
- **Results:**
  - Scott lost 7% of his body mass.
  - His telomeres (chromosome end caps) grew ~14.5% longer in flight, then shortened within ~48 h of landing.
  - 9,317 genes changed their activity, and 811 remained altered after the flight.
  - Radiation dose: **146 mSv** in 340 days.
  - His flu-vaccine response was normal.
- **Hardware:** Cost n/f. Data collection ran 27 months.
- **Game hook:** "Biological baseline" card: a matched ground control doubles the science value but costs a crew slot or a second subject.
- **Sources:** [NASA](https://www.nasa.gov/news-release/nasas-landmark-twins-study-reveals-resilience-of-human-body-in-space/) · [Garrett-Bakelman et al., Science 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC7580864)

### B2 · Bone and muscle loss in microgravity
*NASA and others · known since Skylab, measured on ISS · crewed*
- **What:** Without gravity, weight-bearing bones and leg muscles waste away. Exercise slows the loss but does not stop it.
- **Results:**
  - Crews lose **~1–1.5% of hip and spine bone density per month**; NASA says up to 2%.
  - For comparison, adults over 50 on Earth lose ~1% per *year* ⚠.
  - Leg muscle and aerobic capacity drop ~10–15% on long missions.
- **Hardware:** **~2.5 h of exercise is scheduled per astronaut per day.** The ISS exercise machine (ARED) reduces the loss but does not eliminate it.
- **Game hook:** Crew-time tax: each astronaut loses ~2.5 h/day to exercise. Skipping it gives a cumulative health penalty.
- **Sources:** [NASA bone](https://www.nasa.gov/content/bone-and-mineral-evaluation-and-analysis) · [NASA health FAQ](https://www.nasa.gov/missions/station/faq-the-real-story-about-astronaut-health-care-in-space) · [NTRS](https://ntrs.nasa.gov/citations/20230013277)

### B3 · SANS — vision changes in space
*NASA · first described 2011 · ISS long-duration crews*
- **What:** Body fluids shift toward the head and reshape the eye and optic nerve. Some changes may be permanent.
- **Results (US crews, NASA 2023):**
  - 64% had optic-disc swelling.
  - 26% had a flattened eyeball.
  - 15% had folds in the retina.
  - 14% shifted toward farsightedness.
- **Game hook:** "Blurred vision" event, whose chance grows with mission length. A countermeasure costs power and crew time.
- **Sources:** [NTRS SANS overview](https://ntrs.nasa.gov/api/citations/20230006218/downloads/Brunstetter%20-%20Crewmember%20SANS%20Overview%20-%20Export%20Control%20-FINAL%20-%2001May23.pdf) · [NTRS](https://ntrs.nasa.gov/citations/20220014606)

### B4 · Veggie and the Advanced Plant Habitat — growing food in orbit
*NASA · 2014–present · ISS · crewed*
- **What:** Veggie is a simple LED "garden" that grows plants in seed "pillows". The Advanced Plant Habitat (APH) is an automated, closed growth chamber run from the ground.
- **Results:**
  - **First crop (2014):** one pillow failed to germinate and two plants died of water stress.
  - **10 Aug 2015:** first space-grown lettuce eaten.
  - Zinnias flowered in orbit (2016).
  - 15 plant types grown, 8 leafy greens eaten.
- **Hardware:** Veggie ~70 W; mass n/f (~7 kg ⚠). Each pillow gets 2–3 seeds "as a hedge against germination failure". APH has 180+ sensors and runs up to 135-day experiments.
- **Game hook:** A cheap, low-power food and morale module with a germination failure roll. Upgrading to APH costs more but needs less crew time.
- **Sources:** [NASA Veggie fact sheet](https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf) · [NASA APH](https://www.nasa.gov/sites/default/files/atoms/files/advanced-plant-habitat.pdf)

### B5 · Chang'e 4 — the first plants sprouted on the Moon
*CNSA / Chongqing University · 2019 · Moon far side · robotic*
- **What:** A sealed can carried cotton, potato, rapeseed and Arabidopsis seeds, plus yeast and fruit-fly eggs, to test a tiny biosphere on the Moon.
- **Results:**
  - **Only the cotton sprouted.**
  - The can had no heating, so everything died when the first lunar night began (~−170 to −190 °C).
- **Hardware:** **2.6 kg** (limit 3 kg), 18 cm × 16 cm. Power n/f.
- **Game hook:** "Lunar night" event: a biology payload without a thermal budget dies after one lunar day.
- **Sources:** [ScienceAlert / Universe Today](https://www.sciencealert.com/china-s-lander-successfully-grew-some-cotton-plants-on-the-moon) (no official CNSA page found)

### B6 · TARDIS — tardigrades in open space
*ESA · 2007 · FOTON-M3 capsule, ~270 km orbit · robotic*
- **What:** Dried tardigrades ("water bears") were exposed to the vacuum of space, with and without the Sun's ultraviolet light.
- **Results:**
  - ~3,000 animals spent ~10–12 days in orbit.
  - **Vacuum and cosmic rays alone:** survival similar to ground controls.
  - **Full solar UV:** most died. A few survived and laid viable eggs ⚠ (sources disagree on the survivors).
- **Hardware:** Biopan exposure container, mass n/f.
- **Game hook:** A "UV shield yes or no" choice: shielded samples survive; unshielded ones give rarer, higher-value results with high mortality.
- **Sources:** [ESA](https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Research/Tiny_animals_survive_exposure_to_space) · [National Geographic](https://www.nationalgeographic.com/science/article/tardigrades-become-first-animals-to-survive-vacuum-of-space)

### B7 · BIOMEX — lichens, microbes and mosses outside the ISS
*ESA / Roscosmos · 2014–16 · outside the ISS (EXPOSE-R2) · robotic*
- **What:** Hundreds of samples were exposed to space or to simulated Mars conditions, some mixed into Mars-like or Moon-like soil, to see whether life or its traces could survive.
- **Results:**
  - The exposure lid was open ~469 days (533 days from mounting to retrieval).
  - Survival was detected in all organisms tested.
  - Bacteria and biofilms were the toughest; lichens and fungi declined significantly (one lichen showed up to ~98–100% mortality ⚠).
  - UV combined with vacuum did the most damage.
- **Hardware:** n/f. 30 institutes in 12 countries took part.
- **Game hook:** Same exposure tray, different organisms: hardy microbes (safe) or lichens and mosses (fragile but more interesting).
- **Sources:** [DLR](https://www.dlr.de/en/latest/news/2019/01/20190326_can-organisms-survive-on-mars) · [de Vera et al. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6383581)

### B8 · BioRock — microbes mining rock in space
*ESA · 2019 · ISS · crewed*
- **What:** Three kinds of bacteria grew on basalt slices for 21 days under microgravity, simulated Mars gravity and simulated Earth gravity, to test whether they could extract metals (biomining).
- **Results:**
  - *Sphingomonas desiccabilis* extracted **1.1–4.3×** more rare-earth elements than sterile controls.
  - *Bacillus subtilis* extracted *less* than controls, and *Cupriavidus metallidurans* made no difference.
  - Gravity level had no significant effect.
- **Hardware:** 18 containers holding 36 samples, in incubators with centrifuges. Mass and power n/f.
- **Game hook:** "Choose your microbe": one works, one backfires, one does nothing. The biologist's pick decides the result.
- **Sources:** [Cockell et al., Nature Communications 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7656455)

### B9 · Medaka fish — first vertebrate mating in space
*NASDA (Japan) · 1994 · Space Shuttle Columbia (STS-65), 15 days · crewed*
- **What:** Four Japanese rice fish (medaka) were flown to test whether vertebrates could mate and reproduce in weightlessness.
- **Results:** The fish mated and laid eggs, and the eggs developed normally to hatching in orbit.
- **Hardware:** n/f. The authors say success "totally depended on selection of the four fish".
- **Game hook:** Choosing the right subjects matters: a "pre-flight animal screening" card raises the success chance of animal experiments.
- **Sources:** [Ijiri 1995](https://www.jstage.jst.go.jp/article/bss/9/1/9_1_3/_article) · [PubMed](https://pubmed.ncbi.nlm.nih.gov/11541366/)

### B10 · Skylab spiders Anita and Arabella
*NASA · 1973 (59 days) · Skylab · crewed*
- **What:** Two spiders were filmed to see whether they could spin webs in weightlessness. A 17-year-old student, Judith Miles, proposed the experiment; it was one of 25 picked from 3,400+ proposals.
- **Results:**
  - Only 5 webs were photographed, mostly small and irregular.
  - The spiders got no food or water, which confuses the result; Anita died during the mission.
  - A 2011 ISS follow-up showed spiders use light to orient themselves without gravity.
- **Game hook:** "Student proposal" card: cheap, high outreach. A "forgot life support" event ruins the data.
- **Sources:** [NASA](https://www.nasa.gov/?p=348085) · [Zschokke et al. 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7716925/)

### B11 · First DNA sequencing in space (MinION)
*NASA · 2016 · ISS · crewed (Kate Rubins)*
- **What:** A pocket-sized DNA sequencer read DNA samples from a mouse, a bacterium (E. coli) and a virus, with identical control runs on Earth.
- **Results:**
  - 9 runs produced ~280,000 DNA reads.
  - Accuracy matched the ground runs; E. coli's genome was assembled at 98.6% identity.
- **Hardware:**
  - Device ~120 g ⚠, run from a tablet computer.
  - Each run made **~4–20 Gb of data** ⚠ and took 1–6 h to downlink.
- **Game hook:** Tiny mass but a big data-downlink load. "Air bubble in the flow cell" failure event.
- **Sources:** [Castro-Wallace et al. 2017](https://escholarship.org/content/qt04n6093d/qt04n6093d.pdf) · [Space.com](https://www.space.com/34108-nasa-astronaut-sequences-dna-first-time.html)

### B12 · Cancer drug crystals grown in orbit (Keytruda)
*Merck / ISS National Lab · 2017 · ISS · crewed*
- **What:** The cancer drug pembrolizumab (Keytruda) was crystallized in microgravity to get uniform crystals, which could allow an injection instead of an IV drip.
- **Results:**
  - Flight crystals came out a single size (~39 µm); ground crystals came in two sizes (~13 and ~102 µm).
  - The flight version was less viscous (3.66 vs 5.48 cP), which makes it easier to inject.
  - The drug kept >94% of its potency.
- **Hardware:** Handheld crystallization kit, 35 small experiments in an incubator. Mass and power n/f.
- **Game hook:** A commercial "pharma payload" card: small and cheap, pays out in budget or reputation instead of pure science.
- **Sources:** [Reichert et al., npj Microgravity 2019](https://pmc.ncbi.nlm.nih.gov/articles/doi/10.1038/s41526-019-0090-3)

### B13 · Viking Labeled Release — the ambiguous life test
*NASA · 1976 · Mars (Viking 1 and 2 landers) · robotic*
- **What:** Nutrients tagged with radioactive carbon were added to Martian soil. Microbes "eating" them would release radioactive gas.
- **Results:**
  - The first injections were **positive on both landers**.
  - But the organic-chemistry instrument found **no organic molecules**, and NASA concluded there was "no definitive evidence of life".
  - In 2008 Phoenix found perchlorate, a reactive salt that offers a chemical explanation. The debate lasted decades.
- **Hardware:** Biology package **15 kg, 15 W average**. Each lander ran on two 30 W radioisotope generators and had a 40 Mbit tape recorder. The whole Viking project cost ~$1B.
- **Game hook:** "False positive?" event: a positive life signal contradicted by a second instrument. The team must choose to announce it or cross-check it.
- **Sources:** [NSSDCA LR](https://nssdc.gsfc.nasa.gov/nmc/experiment/display.action?id=1975-075C-03) · [NSSDCA Viking](https://nssdc.gsfc.nasa.gov/planetary/viking.html) · [NASA Viking 1](https://science.nasa.gov/mission/viking-1/)

### B14 · Perseverance — "Cheyava Falls" potential biosignature
*NASA · sample 2024, published Sep 2025 · Mars (Jezero crater) · robotic (rock details in [G8](#g8--perseverance--sample-caching-and-the-cheyava-falls-rock))*
- **What:** A rock with "leopard spots" rich in iron phosphate and iron sulfide next to organic carbon. On Earth, microbes drive reactions that produce minerals like these.
- **Results:**
  - NASA calls it a **"potential biosignature"**: non-biological explanations are less likely but cannot be ruled out.
  - It sits at Step 1 of NASA's 7-step confidence scale for detecting life (CoLD).
  - Confirmation needs the sample on Earth.
- **Hardware:** Analysed by the PIXL and SHERLOC instruments; their figures were not checked.
- **Game hook:** A discovery card that only pays off if a later "sample return" mission is funded, creating a dependency between missions.
- **Sources:** [NASA](https://www.nasa.gov/news-release/nasa-says-mars-rover-discovered-potential-biosignature-last-year/) · [JPL](https://www.jpl.nasa.gov/news/nasas-perseverance-rover-scientists-find-intriguing-mars-rock/)

### B15 · Cassini at Enceladus — ingredients for life
*NASA / ESA / ASI · plume dive 2015 (published 2017) · Saturn orbit · robotic (instrument details in [C3](#c3--cassini-inms--tasting-the-plume-of-enceladus))*
- **What:** Cassini flew through the water plume of Saturn's moon Enceladus and "tasted" it with its mass spectrometer.
- **Results:**
  - **~1% molecular hydrogen (H₂)**, which points to hydrothermal vents on the seafloor, a possible energy source for microbes.
  - Organics were more abundant than expected.
  - Phosphates were reported in 2023 ⚠ (paper not accessed).
- **Game hook:** Biology from a flyby, with no lander: plume sampling earns "habitability" points. The biologist and the chemist share one instrument.
- **Sources:** [NASA](https://www.nasa.gov/news-release/nasa-missions-provide-new-insights-into-ocean-worlds-in-our-solar-system/) · [NASA Enceladus](https://science.nasa.gov/saturn/moons/enceladus/)

---

## 4. Engineering

Technology demonstrations and engineering successes and failures: power, propulsion, communications, landing, life support and in-situ resource use (ISRU), structures, robotics, navigation.

### E1 · Ingenuity — first powered flight on another planet
*NASA/JPL · 2021–24 · Mars (Jezero) · robotic*
- **What:** A 5-flight, 30-day technology demo that became a scout for the Perseverance rover.
- **Results:**
  - **72 flights**, 128.8 min of flight time, 17 km flown; max altitude 24 m.
  - **End:** most likely, its navigation camera lost track of featureless sand. The hard landing broke all 4 rotor blades (Jan 2024).
- **Hardware:**
  - **1.8 kg**, ~350 W during flight; the battery allows ~90 s of flight per sol.
  - No direct link to Earth: everything relays through the rover.
  - **$80M** to build + $5M for operations.
- **Game hook:** A "scout drone" add-on that depends on the rover for relay and is battery-limited per day. "Featureless terrain: navigation lost" event.
- **Sources:** [NASA](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/) · [NASA accident investigation](https://www.nasa.gov/missions/mars-2020-perseverance/ingenuity-helicopter/nasa-performs-first-aircraft-accident-investigation-on-another-world/)

### E2 · MOXIE — making oxygen from Mars air
*NASA / MIT · 2021–23 · Mars (Perseverance) · robotic*
- **What:** Split the Martian atmosphere's CO₂ to make oxygen at ~800 °C. It was the first demo of using local resources on another planet (ISRU).
- **Results:**
  - **122 g of O₂** over 16 runs, at ≥98% purity.
  - Peak 12 g/h, twice the goal.
  - The final run (Aug 2023) made 9.8 g.
- **Hardware:** **17.1 kg, 300 W**, microwave-oven size. One run uses ~1 kWh including warm-up ⚠. Cost n/f.
- **Game hook:** An ISRU module whose high power draw competes with the science instruments. A scaled-up version could unlock "propellant for the return trip" as an objective.
- **Sources:** [JPL](https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/) · [NASA instruments](https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/)

### E3 · ISS water recovery — 98% recycling
*NASA · 2009–present · ISS · crewed*
- **What:** Recycles urine, sweat and cabin humidity into drinking water. A brine processor added in 2021 recovers the water left in urine brine.
- **Results:**
  - Total recovery rose **from 93–94% to 98%** (2023).
  - The urine processor was designed for 85% but dropped to ~70–75% in 2009 because of urine-quality problems; a chemical pretreatment brought it back to 85% in 2016.
- **Hardware:** Each crew member needs ~1 gallon (~3.8 L) of water/day. The water reserve rose from 818 to 1,413 L in 2026. Mass and power n/f.
- **Game hook:** A life-support tier choice (93% vs 98%): a higher tier means less resupply mass. "Toilet down, draw on the water reserve" event (a real 2026 case ⚠).
- **Sources:** [NASA](https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/) · [NTRS ICES-2026](https://ntrs.nasa.gov/citations/20260004140)

### E4 · BEAM — the inflatable module
*NASA / Bigelow · 2016–present · ISS · crewed*
- **What:** The first inflatable module rated for humans. It launched folded and was inflated on the station.
- **Results:**
  - **Volume grew from 3.6 to 16 m³ (4.4×).**
  - Inflation took 7+ hours and 25 short bursts of air.
  - Planned as a 2-year demo, it is still in use as storage.
  - Radiation dose was slightly higher than in rigid modules.
- **Hardware:** ~1,413 kg. Contract $17.8M ⚠.
- **Game hook:** A habitat that trades launch volume for living volume. Risks: more radiation, and deployment can stall.
- **Sources:** [NASA](https://www.nasa.gov/international-space-station/bigelow-expandable-activity-module-beam/) · [NTRS](https://ntrs.nasa.gov/citations/20180006494)

### E5 · ROSA / iROSA — roll-out solar arrays
*NASA / Air Force Research Laboratory / Redwire · 2017 demo, ISS upgrades 2021–23 · ISS · crewed install*
- **What:** A flexible solar blanket that rolls into a cylinder for launch.
- **Results:**
  - **2017 demo:** deployed, but it could not be retracted, so it was jettisoned ⚠.
  - **iROSA upgrade:** each unit adds >20–28 kW ⚠ (sources differ) and is about half the size of the old ISS arrays, raising station power by ~30%.
  - **DART** was the first planetary mission powered by ROSA.
- **Hardware:** Mass and cost n/f.
- **Game hook:** A power component with more watts per launch volume. "Array won't retract" event. An "upgrade kit" card restores power lost to degradation.
- **Sources:** [NASA impact story](https://www.nasa.gov/directorates/stmd/impact-story-roll-out-solar-arrays/) · [NASA iROSA](https://www.nasa.gov/missions/station/iss-research/power-up-roll-out-solar-arrays-boost-space-station-power-supply/)

### E6 · MMRTG — nuclear power for rovers
*NASA / DOE · Curiosity (2012), Perseverance (2021) · Mars · robotic*
- **What:** Turns heat from decaying plutonium into steady electricity, day or night and regardless of dust. The waste heat also keeps the rover warm.
- **Results:**
  - **~110 W of electricity at launch**, falling a few percent per year (120 W ⚠ in another source).
  - Lifetime 14+ years.
- **Hardware:**
  - **45 kg**, 4.8 kg of plutonium dioxide fuel, ~2,000 W of heat ⚠.
  - Perseverance adds 2 batteries (26.5 kg total), because peak demand reaches ~900 W.
- **Game hook:** Constant but low power that decays each year, vs solar that is large but variable. It forces the team to size batteries for peak loads.
- **Sources:** [JPL Mars 2020 power](https://www.jpl.nasa.gov/news/press_kits/mars_2020/launch/mission/spacecraft/power/) · [MMRTG fact sheet](https://discovery.larc.nasa.gov/PDF_FILES/26_MMRTG_Fact_Sheet_update_5-7-19-Mission_Planner.pdf)

### E7 · Juno — solar power at Jupiter and the valve problem
*NASA · 2011–present · Jupiter polar orbit · robotic*
- **What:** The first solar-powered spacecraft at Jupiter. A propulsion anomaly changed its mission plan.
- **Results:**
  - **Solar:** ~60 m² of panels (18,698 cells). They give **~14 kW at Earth's distance but only ~400–500 W at Jupiter**, where sunlight is 25× weaker.
  - **Valves:** in 2016, two engine valves opened slowly. NASA cancelled the engine burn and kept Juno in a **53-day orbit instead of the planned 14-day one**, which means fewer science passes but less time in Jupiter's radiation belts.
- **Hardware:** 3,625 kg at launch (1,593 kg spacecraft + 2,032 kg propellant). **$1.13B.**
- **Game hook:** Solar-panel area grows fast with distance from the Sun. "Suspect valve" event: skip the risky burn and accept fewer passes.
- **Sources:** [JPL facts](https://www.jpl.nasa.gov/news/press_kits/juno/facts/) · [JPL record](https://www.jpl.nasa.gov/news/nasas-juno-spacecraft-breaks-solar-power-distance-record/) · [NASA orbit](https://www.nasa.gov/news-release/nasas-juno-mission-to-remain-in-current-orbit-at-jupiter/)

### E8 · Ion propulsion — Deep Space 1 and Dawn
*NASA/JPL · DS1 1998–2001; Dawn 2007–18 · asteroids, Vesta, Ceres · robotic*
- **What:** Electric engines that accelerate xenon ions: extremely efficient, but with tiny thrust.
- **Results:**
  - **DS1:** 0.09 N of thrust at 2,300 W, 16,265 h of operation, ~4.3 km/s of velocity change (delta-v).
  - **Dawn:** **~11.5 km/s of delta-v, a record**, using ~416 of its 425 kg of xenon over ~51,000 h of thrusting. NASA's analogy: "0 to 60 mph in 4 days".
  - **Dawn's end:** reaction wheels failed, so it had to point using hydrazine thrusters, and the hydrazine ran out in 2018.
- **Hardware:**
  - **DS1:** 486 kg, 2,500 W of solar arrays, **$152.3M**.
  - **Dawn:** solar >10 kW at 1 AU and only 1.4 kW at its farthest point; **$500M** total.
- **Game hook:** A high-efficiency engine that needs kilowatts and months of thrusting. "Reaction wheel lost" event: pointing fuel now sets the lifetime.
- **Sources:** [NASA DS1](https://science.nasa.gov/mission/deep-space-1/) · [NSSDCA DS1](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1998-061A) · [NASA Dawn ion](https://science.nasa.gov/mission/dawn/technology/ion-propulsion/) · [Dawn quick facts](https://science.nasa.gov/mission/dawn/toolkit/quick-facts/)

### E9 · Solar sails — IKAROS and LightSail 2
*JAXA 2010 (interplanetary) · Planetary Society 2019–22 (Earth orbit) · robotic*
- **What:** Propellant-free thrust from the pressure of sunlight.
- **Results:**
  - **IKAROS:** measured thrust of 1.12 mN. Its sail had built-in thin-film solar cells, and it steered with liquid-crystal panels instead of fuel.
  - **LightSail 2:** raised its orbit's high point by ~7 km in a month, but at 720 km altitude it eventually lost to air drag. It re-entered in Nov 2022 after ~3.5 years.
- **Hardware:**
  - **IKAROS:** ~310 kg; 14 m square sail, 7.5 µm thick.
  - **LightSail 2:** 32 m² sail; **$7M** total project cost ($1.24M from crowdfunding).
- **Game hook:** Infinite but tiny thrust that only works well above the atmosphere. Very cheap, but very slow.
- **Sources:** [JAXA IKAROS](https://global.jaxa.jp/projects/sas/ikaros/) · [Planetary Society LightSail](https://www.planetary.org/sci-tech/lightsail)

### E10 · DART — deflecting an asteroid
*NASA / Johns Hopkins APL · 2021–22 · Didymos–Dimorphos asteroid pair · robotic*
- **What:** Deliberately crashed into the small moonlet Dimorphos to change its orbit, steering autonomously in the final hours.
- **Results:**
  - The orbit shortened by **33 ± 1 min** (from 11 h 55 min). NASA's first announcement said 32 ± 2.
  - That is **25× more than the 73 s minimum for success**.
  - Recoil from the debris thrown out by the impact provided much of the push.
- **Hardware:** ~610 kg at launch, ~580 kg at impact, ~6.1 km/s impact speed ⚠ (sources range 6.1–6.6). Power 6.6 kW from 2 ROSA arrays. ~$325M ⚠.
- **Game hook:** A "planetary defense" objective with a pass/fail threshold. Autonomous terminal guidance costs avionics budget.
- **Sources:** [NASA](https://www.nasa.gov/news-release/nasa-confirms-dart-mission-impact-changed-asteroids-motion-in-space/) · [NSSDCA](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2021-110A) · [Thomas et al., Nature 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10115643/) · [Planetary Society](https://www.planetary.org/space-missions/dart)

### E11 · Laser communications — LLCD and DSOC
*NASA · LLCD 2013 (lunar orbit) · DSOC 2023–25 (on Psyche, deep space) · robotic*
- **What:** Sends data with an infrared laser instead of radio.
- **Results:**
  - **LLCD:** **622 Mbit/s** down from the Moon, 20 Mbit/s up.
  - **DSOC:** 267 Mbit/s at 31 million km; 25 Mbit/s at 226 million km; ~8 Mbit/s at ~400 million km. It reached a record distance of 494 million km, and 13.6 terabits were received in total.
- **Hardware:** On the ground, a 3 kW uplink laser and the 5 m Palomar telescope as receiver. The goal is 10–100× the data rate of radio. Flight terminal mass and power n/f.
- **Game hook:** A high-bandwidth comms option whose rate drops steeply with distance. "Clouds over the ground station" event (game idea, not a sourced fact).
- **Sources:** [NASA LLCD](https://www.nasa.gov/news-release/nasa-laser-communication-system-sets-record-with-data-transmissions-to-and-from-moon/) · [NASA DSOC](https://www.nasa.gov/mission/deep-space-optical-communications-dsoc/) · [JPL DSOC](https://www.jpl.nasa.gov/news/nasas-deep-space-communications-demo-exceeds-project-expectations/)

### E12 · MarCO — the first interplanetary CubeSats
*NASA/JPL · 2018–19 · Mars flyby · robotic*
- **What:** Two briefcase-sized CubeSats relayed InSight's landing data to Earth in near real time.
- **Results:**
  - **8 kbit/s relay** during the landing (26 Nov 2018).
  - Both went silent ~5–6 weeks later; one had a leaking thruster.
- **Hardware:** 6U CubeSats (~37 × 24 × 12 cm), flat high-gain antenna, cold-gas thrusters. **$18.5M** for both. Mass n/f.
- **Game hook:** A cheap relay companion that buys landing-day data but has a short, fragile life.
- **Sources:** [JPL press kit](https://www.jpl.nasa.gov/news/press_kits/insight/landing/appendix/mars-cube-one/) · [JPL end](https://www.jpl.nasa.gov/news/the-marco-mission-comes-to-an-end/)

### E13 · Landing systems — Pathfinder airbags vs Curiosity sky crane
*NASA · 1997 and 2012 · Mars · robotic*
- **What:** Pathfinder bounced to a stop inside airbags. Curiosity (~900 kg) was too heavy for airbags, so a rocket-powered "sky crane" lowered it on cables.
- **Results:**
  - **Pathfinder:** hit the ground at 18 m/s and bounced ~15 times, up to ~15 m high. It returned 2.3 Gbit of data, including 16,500 lander images and 550 rover images.
  - **Curiosity:** lowered 7.5 m below the descent stage at 0.75 m/s.
- **Hardware:** Pathfinder 463 kg ⚠, lander power 35 W; Sojourner rover 10.6 kg. **~$265M total** ($150M lander, $25M rover).
- **Game hook:** Landing-system choice depends on mass. Airbags are cheap but for light payloads and imprecise; the sky crane is precise but complex and expensive.
- **Sources:** [NASA Pathfinder](https://science.nasa.gov/mission/mars-pathfinder/) · [NSSDCA](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A) · [NASA sky crane](https://www.nasa.gov/missions/mars-science-laboratory/curiosity-rover/heres-how-curiositys-sky-crane-changed-the-way-nasa-explores-mars/)

### E14 · SLIM — pinpoint Moon landing (upside down)
*JAXA · 2024 · Moon · robotic*
- **What:** Japan's first lunar landing and the world's first "pinpoint" landing.
- **Results:**
  - Navigation error was **≤10 m** (probably 3–4 m); it came to rest ~55 m from the target.
  - **Failure:** one of its two main engines lost its nozzle at ~50 m altitude. It landed tipped over, with its solar panels facing the wrong way, and was shut down to save power.
  - **Recovery:** it later woke up and survived **3 lunar nights**.
- **Hardware:** ~200 kg dry, ~715 kg at launch ⚠.
- **Game hook:** Precise landing unlocks small, specific science targets. "Lost engine: tip-over, panels facing the wrong way, power crisis" event.
- **Sources:** [JAXA Jan 2024](https://global.jaxa.jp/press/2024/01/20240125-1_e.html) · [JAXA Aug 2024](https://global.jaxa.jp/press/2024/08/20240826-1_e.html)

### E15 · FAILURE: Mars Climate Orbiter — the unit mix-up
*NASA/JPL / Lockheed Martin · 1998–99 · Mars orbit insertion · robotic*
- **What:** One team supplied thruster data in imperial units (pound-force·seconds) while the navigation software expected metric (newton·seconds), a factor of ~4.45. Trajectory errors built up unnoticed.
- **Results:** The planned closest approach was 140–150 km; it actually passed at ~57 km, and the spacecraft was lost (23 Sep 1999).
- **Hardware:** 629 kg (338 kg dry + 291 kg propellant), 500 W at Mars. ~$327.6M ⚠ (may include program costs shared with another lander).
- **Game hook:** "Units/interface check skipped" event. Spending a team action on independent verification prevents it.
- **Sources:** [NSSDCA](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1998-073A) · [JPL](https://www.jpl.nasa.gov/news/mars-climate-orbiter-team-finds-likely-cause-of-loss/)

### E16 · FAILURE: Schiaparelli lander
*ESA / Roscosmos (ExoMars 2016) · 2016 · Mars · robotic*
- **What:** Fast spinning under the parachute briefly overloaded a motion sensor. The software then calculated a *negative* altitude, released the parachute early and fired the braking thrusters for 3 s instead of 30 s.
- **Results:** It fell from ~3.7 km and hit the ground at ~540 km/h. The inquiry said it was "very close" to succeeding.
- **Hardware:** 577 kg. Cost n/f.
- **Game hook:** "Sensor overloaded, software trusts bad data" event. A testing / sanity-check budget line lowers the odds.
- **Sources:** [ESA investigation](https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/Schiaparelli_landing_investigation_completed) · [Inquiry report](https://sci.esa.int/documents/33431/35950/1567260317467-ESA_ExoMars_2016_Schiaparelli_Anomaly_Inquiry.pdf)

### E17 · PARTIAL FAILURE: Philae comet lander
*ESA / DLR (Rosetta) · 2014 · comet 67P · robotic*
- **What:** Its anchoring harpoons did not fire and its hold-down thruster failed. Philae bounced ~1 km over ~2 h and ended up in shadow, where its solar panels could not recharge.
- **Results:** It ran **64 h on its primary battery** and completed ~80% of its first science sequence.
- **Hardware:** 100 kg lander, ~21 kg of instruments.
- **Game hook:** "Anchoring failure: bounced into shadow, battery-only operations" event. Trade-off between a primary battery and solar recharging.
- **Sources:** [ESA](https://www.esa.int/Science_Exploration/Space_Science/Rosetta/Philae_s_extraordinary_comet_landing_relived) · [ESA lander](https://www.esa.int/Science_Exploration/Space_Science/Rosetta/The_Rosetta_lander)

### E18 · RECOVERY: Kepler becomes K2
*NASA · 2009–18 · Earth-trailing solar orbit · robotic*
- **What:** Kepler needed 3 of its 4 reaction wheels to point precisely, and the second one failed in 2013. Engineers balanced the telescope against the pressure of sunlight ("like a kayak steering into the current") and re-pointed it every ~3 months.
- **Results:** About 10 observing campaigns were expected from the remaining fuel; it delivered **19**. It retired in Oct 2018, out of fuel. 2,600+ planets were discovered over the whole mission.
- **Game hook:** "Reaction wheel failure" event. The engineer can try a creative recovery that costs fuel and limits where the telescope can look.
- **Sources:** [NASA Kepler](https://science.nasa.gov/mission/kepler/)

### E19 · Hubble — the flawed mirror and the first servicing mission
*NASA / ESA · launched 1990, repaired 1993 · ~540–600 km orbit · crewed servicing*
- **What:** Hubble's mirror was ground **2.2 µm too flat** at the edge, because a test instrument was mis-assembled by 1.3 mm. In 1993 a Shuttle crew installed corrective optics.
- **Results:** 5 spacewalks totalling 35 h 28 min. They installed a new camera (281 kg) and corrective mirrors. By then 3 of Hubble's 6 gyroscopes had also failed.
- **Hardware:** 2.4 m mirror (828 kg).
- **Game hook:** "Flaw discovered after launch" event. Choosing a serviceable orbit (reachable by crews) makes a repair possible.
- **Sources:** [NASA mirror flaw](https://science.nasa.gov/mission/hubble/observatory/design/optics/hubbles-mirror-flaw/) · [NASA SM1](https://science.nasa.gov/mission/hubble/observatory/missions-to-hubble/servicing-mission-1/)

### E20 · Deep Space Atomic Clock
*NASA/JPL · 2019–21 · Earth orbit · robotic*
- **What:** A small, ultra-stable clock that lets a spacecraft navigate by itself instead of waiting for round-trip timing from Earth.
- **Results:** Drift was <4 ns after 20+ days, 10× more stable than GPS satellite clocks. 1 ns of timing error ≈ 30 cm of distance error.
- **Hardware:** ~25 cm per side. Mass and power n/f.
- **Game hook:** An "autonomous navigation" component that reduces dependence on ground stations.
- **Sources:** [JPL](https://www.jpl.nasa.gov/news/deep-space-atomic-clock-moves-toward-increased-spacecraft-autonomy)

---

## 5. Suggested new specializations

The four planned roles are physicist, geologist, biologist and engineer. Three of them are science roles. The challenge text, however, suggests responsibilities tied to *resources and decisions*: mission planning, spacecraft design, science, communications and resource management.

Of the specializations below, **Flight Dynamics/Navigation** and **Communications/Data** map directly onto those responsibilities (orbit/launch and comms/data). The science roles could then be "science lead" variants that players choose by discipline.

| # | Specialization | Main game resource/decision | Why it's distinct |
|---|---|---|---|
| S1 | **Chemist** (analytical chemist / astrochemist) | Instrument mass and power; analyse on site vs return samples | Asks *what things are made of*: mass spectrometers, sample return |
| S2 | **Astronomer** | Orbit choice (L2, Earth-trailing, LEO), cooling, data volume | Plans observations: telescope, pointing, cold. The physicist covers fields and particles |
| S3 | **Atmospheric scientist** | Lifetime (probes last minutes to hours), entry mass, relay comms | Probes, balloons and low passes through atmospheres play very differently from an orbiter |
| S4 | **Earth system scientist** (climate/hydrology) | Orbit (sun-synchronous, paired satellites), data continuity, budget | Studies Earth as a system (water, ice, soil), not planetary rocks |
| S5 | **Flight dynamics / navigation officer** | Launch, propellant mass → lifetime, orbit insertion risk | Owns trajectory, delta-v and unit errors, which no other role covers |
| S6 | **Communications & data engineer** | Comms, data, antenna mass, power, ground-station time | The bandwidth budget is a real constraint with its own decisions |

**Also considered:**
- **Physician / flight surgeon:** strong *if crewed missions are in scope*. Entries B1–B3 and P10 already give real data (radiation, bone loss, vision).
- **Materials scientist:** overlaps too much with the engineer.

### S1 · Chemist

**Real precedents:**
- Tracy Caldwell Dyson, NASA astronaut with a PhD in chemistry (ISS 2024).
- Hunter Waite, principal investigator of Cassini's mass spectrometer (INMS).
- Hasso Niemann, principal investigator of Huygens' gas chromatograph–mass spectrometer (GCMS).

#### C1 · Stardust — comet dust and glycine
*NASA · 1999–2006 · comet Wild 2 flyby, sample return · robotic*
- **What:** Flew through the comet's dust cloud ~250 km from the nucleus at 6.1 km/s and caught grains in aerogel, an ultra-light foam that is >99% empty space. The capsule landed in Utah in 2006.
- **Results:**
  - **~1 mg of material** in total, spread over 10,000+ particles larger than 1 µm.
  - The grains include high-temperature minerals formed near the Sun that ended up in a cold comet.
  - **Glycine**, a building block of proteins, was found (2009). Its carbon-isotope signature shows it came from space, not from contamination on Earth.
- **Hardware:**
  - 385 kg at launch, including 85 kg of propellant; return capsule 46 kg.
  - ~330 W at the encounter; data rate 7.9 kbit/s through the DSN's 70 m antennas.
  - **~$200M** (NSSDCA; $164.6M without the launch).
- **Game hook:** A 46 kg return capsule buys lab-grade answers, but there is only one shot at the comet and years of waiting.
- **Sources:** [NASA Astrobiology](https://astrobiology.nasa.gov/news/nasa-researchers-make-first-discovery-of-lifes-building-block-in-comet/) · [NSSDCA](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1999-003A) · [JSC curation](https://curator.jsc.nasa.gov/stardust/)

#### C2 · Huygens GCMS — the chemistry of Titan
*ESA / NASA · 2005 · Titan (Saturn's moon) · robotic*
- **What:** A gas chromatograph–mass spectrometer that sampled Titan's air during the descent and the gases released from the surface after landing.
- **Results:**
  - 2 h 27 min of descent data and **69 min on the surface**.
  - Methane makes up ~1.4% of the stratosphere, and more below 32 km.
  - Argon-40 points to gas escaping from Titan's interior.
  - There is evidence of recent methane rain.
- **Hardware:** Mass and power n/f.
- **Game hook:** "The probe survives landing" event: bonus surface minutes, but only if the battery and the relay spacecraft hold out.
- **Sources:** [Niemann et al., Nature 2005](https://public.websites.umich.edu/~atreya/Articles/2005_GCMS_nature04122.pdf) · [ESA instruments](https://sci.esa.int/web/cassini-huygens/31193-instruments)

#### C3 · Cassini INMS — tasting the plume of Enceladus
*NASA / ESA / ASI · 2015 flyby (published 2017) · Saturn orbit · robotic*
- **What:** A mass spectrometer that measured the gas in Enceladus' water plume. The biology interpretation is in [B15](#b15--cassini-at-enceladus--ingredients-for-life).
- **Results (Waite et al. 2017):**

  | Gas | Share of plume |
  |---|---|
  | Water (H₂O) | 96–99% |
  | Hydrogen (H₂) | 0.4–1.4% |
  | Carbon dioxide (CO₂) | 0.3–0.8% |
  | Methane (CH₄) | 0.1–0.3% |
  | Ammonia (NH₃) | 0.4–1.3% |

- **Hardware:** **6 kg, 15 W, 1 kbit/s** (NSSDCA) vs **9.25 kg, 27.7 W, 1.5 kbit/s** (NASA technical page) ⚠.
- **Game hook:** One instrument serves both chemist and biologist, so they negotiate who uses the flyby time.
- **Sources:** [Waite et al., Science 2017](https://sseh.uchicago.edu/doc/Waite_et_al_2017.pdf) · [NSSDCA INMS](https://nssdc.gsfc.nasa.gov/nmc/experiment/display.action?id=1997-061A-12)

#### C4 · Curiosity SAM — methane and organics on Mars
*NASA · 2012–present · Mars (Gale crater) · robotic*
- **What:** A portable chemistry lab that heats drilled rock in ovens and analyses the gases, and uses a laser spectrometer to track methane in the air.
- **Results:**
  - **Methane:** a background of ~0.41 ppb that rises and falls with the seasons (0.24–0.65 ppb), plus unexplained spikes of ~7 ppb.
  - **Organics:** ~10 ppm or more of organic carbon in 3-billion-year-old mudstone.
- **Hardware:** **~40 kg**; 74 sample cups; ovens reach ~1,000 °C. Power n/f.
- **Game hook:** A 40 kg lab with a limited number of cups: every sample spends a consumable.
- **Sources:** [NASA instruments](https://science.nasa.gov/mission/msl-curiosity/science-instruments/) · [Webster et al., Science 2018](https://public.websites.umich.edu/~atreya/Articles/Mars_CH4_Science_2018_Webster_etal.pdf) · [JPL](https://www.jpl.nasa.gov/news/nasa-finds-ancient-organic-material-mysterious-methane-on-mars)

### S2 · Astronomer

**Real precedents:**
- Steven Hawley, astronaut with a PhD in astronomy, who deployed Hubble (1990) and helped service it (1997).
- Jeffrey Hoffman, astronomer on the first Hubble repair mission (1993).

#### A1 · Hubble Deep Field
*NASA / ESA · Dec 1995 · Hubble, ~593 km orbit · robotic*
- **What:** Stared at one "empty" patch of sky for ~10 days.
- **Results:** 342 exposures revealed **~3,000 galaxies** in a field ~1/13 the width of the full Moon.
- **Hardware:** Hubble 11,110 kg, 2.4 m mirror. ~5,500 W generated and ~2,100 W used on average ⚠; ~140 Gbit of raw data per week ⚠.
- **Game hook:** Spending 10 days of observing time on "nothing" pays off big: a lesson in risk and reward when allocating time.
- **Sources:** [NASA Deep Fields](https://science.nasa.gov/mission/hubble/science/universe-uncovered/hubble-deep-fields/) · [ESA fact sheet](https://sci.esa.int/web/hubble/-/47358-fact-sheet)

#### A2 · Kepler — hunting exoplanets
*NASA · 2009–18 · Earth-trailing solar orbit · robotic (recovery story in [E18](#e18--recovery-kepler-becomes-k2))*
- **What:** Watched ~100,000 stars continuously for the tiny dips in brightness caused by planets passing in front of them.
- **Results:** **2,600+ planets** discovered.
- **Hardware:** 1,039 kg, 1.4 m primary mirror, 95-megapixel camera. Bandwidth was so limited that **only the pixels around selected stars were sent to Earth**, not whole images.
- **Game hook:** A perfect camera, but you choose which pixels go home: the data budget becomes a science decision.
- **Sources:** [NASA Kepler](https://science.nasa.gov/mission/kepler/in-depth/) · [Planetary Society](https://www.planetary.org/articles/farewell-kepler)

#### A3 · James Webb Space Telescope (JWST)
*NASA / ESA / CSA · 2021–present · Sun–Earth L2, 1.5 million km from Earth · robotic*
- **What:** An infrared observatory kept below 50 K (−223 °C) behind a 5-layer sunshield.
- **Results:** Galaxy JADES-GS-z14-0 dates from ~290 million years after the Big Bang. It was the distance record when announced in May 2024; check whether it has since been beaten.
- **Hardware:**
  - **~6,200 kg**; 6.5 m mirror (18 segments, 25 m²).
  - Sunshield 21 × 14 m.
  - 28 Mbit/s downlink ⚠.
  - **~$9.7B** life-cycle cost.
- **Game hook:** L2 buys cold and stability, at the price of no servicing and an expensive cooling system.
- **Sources:** [NASA fact sheet](https://science.nasa.gov/mission/webb/fact-sheet) · [ESA](https://www.esa.int/ESA_Multimedia/Images/2024/05/Webb_finds_most_distant_known_galaxy) · [GAO](https://www.gao.gov/products/gao-20-224)

### S3 · Atmospheric scientist

**Real precedents:**
- Bruce Jakosky, principal investigator of MAVEN.
- The international team (Sagdeev, Blamont and others) behind the Vega balloons at Venus.

#### AT1 · Galileo atmospheric probe — diving into Jupiter
*NASA · 1995 · Jupiter · robotic*
- **What:** The first direct sampling of a giant planet's atmosphere.
- **Results:**
  - Entered at 170,590 km/h, with peak deceleration of **228 g**.
  - It returned **58 min of data** before failing at a pressure of 22.7 atmospheres.
  - The entry site turned out to be unusually dry; winds reached ~180 m/s deep down.
- **Hardware:** ~335–339 kg ⚠. The whole Galileo mission cost $1.39B.
- **Game hook:** One hour of data, then the probe is crushed. The lifetime card is the whole story.
- **Sources:** [NASA probe](https://science.nasa.gov/mission/galileo-jupiter-atmospheric-probe/) · [NTRS Young 2003](https://ntrs.nasa.gov/citations/20030053065)

#### AT2 · Huygens descent — weather on Titan
*ESA · 2005 · Titan · robotic*
- **What:** Measured temperature, pressure and winds from 162 km altitude down to the ground.
- **Results:** At the surface: **93.65 K (−180 °C) and 1.47 bar**, about 1.5× Earth's air pressure.
- **Hardware:** The wind experiment's ultra-stable oscillator weighed 1.9 kg and drew <18.4 W.
- **Game hook:** The probe needs its mother spacecraft overhead as a relay, or the descent data is lost.
- **Sources:** [ESA instruments](https://sci.esa.int/web/cassini-huygens/31193-instruments)

#### AT3 · Vega balloons — floating in the clouds of Venus
*USSR / France + international tracking · 1985 · Venus atmosphere · robotic*
- **What:** Two helium balloons floated in Venus' cloud layer, tracked by radio telescopes on Earth to measure the winds.
- **Results:** They floated at ~54 km altitude for **46+ h each** and drifted ~1/3 of the way around the planet. **20 radio observatories** tracked them.
- **Hardware:** Balloon 3.54 m across; gondola ~7 kg ⚠; total ~21 kg ⚠.
- **Game hook:** A tiny payload with a huge ground network: Earth-side communications *are* the science instrument.
- **Sources:** [JPL IPN report](https://ipnpr.jpl.nasa.gov/progress_report/42-85/85Q.html) · [NTRS](https://ntrs.nasa.gov/citations/19860046078)

#### AT4 · MAVEN — how Mars lost its air
*NASA · 2013–2025 (contact lost Dec 2025, declared lost Jun 2026) · Mars orbit · robotic*
- **What:** Measures how fast Mars loses its atmosphere to space.
- **Results:** **~100 g/s lost today**, much more during solar storms.
- **Hardware:** 8 instruments; lowest orbit point 150 km, with "deep dips" to 125 km; 1,640 kg of hydrazine propellant. Mass, power and cost n/f.
- **Game hook:** Dip lower for better data, at the cost of drag and propellant, which shortens the lifetime.
- **Sources:** [NASA Astrobiology](https://astrobiology.nasa.gov/news/nasa-mission-reveals-speed-of-solar-wind-stripping-martian-atmosphere/) · [NSSDCA](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2013-063A)

### S4 · Earth system scientist

**Real precedents:**
- Piers Sellers, NASA climate modeller and astronaut (3 Shuttle flights, 6 spacewalks).
- Matt Rodell, NASA hydrologist who led the GRACE groundwater study.

#### ES1 · GRACE — weighing water from space
*NASA / DLR · 2002–17 · polar Earth orbit, twin satellites · robotic*
- **What:** Two satellites ~220 km apart measured tiny changes in the distance between them. Those changes map variations in Earth's gravity, and therefore in water and ice.
- **Results:**
  - Northern India lost groundwater at **4.0 cm/year (17.7 km³/year)**, 109 km³ in total, affecting 114 million people.
  - Designed for 5 years, it ran **15+**.
  - **It ended because of a battery failure on one of the two satellites.**
- **Hardware:** Mass, power and cost n/f.
- **Game hook:** With paired satellites, one battery failure ends the whole mission.
- **Sources:** [Rodell et al., Nature 2009](https://fore.yale.edu/files/Rodell_Velicogna_Famiglietti.pdf) · [JPL end](https://www.jpl.nasa.gov/news/prolific-earth-gravity-satellites-end-science-mission/)

#### ES2 · GRACE-FO — continuing the record
*NASA / GFZ · 2018–present · ~490 km polar orbit · robotic*
- **What:** GRACE's successor. It carries the first laser link between two satellites, >10× more precise than microwave ranging.
- **Results:**
  - Greenland loses ~259–270 Gt of ice per year and Antarctica ~128–150 Gt ⚠ (the same source gives both numbers).
  - **A 1-year data gap** (2017–18) separated the two missions.
- **Hardware:** **600.2 kg each**; NASA investment ~$430M; shared launch with 5 commercial satellites.
- **Game hook:** "Continuity gap" penalty if the replacement launches late.
- **Sources:** [JPL facts](https://www.jpl.nasa.gov/news/press_kits/grace-fo/facts/) · [earth.gov Greenland](https://earth.gov/sealevel/vital-signs/greenland-ice-sheet/)

#### ES3 · SMAP — soil moisture
*NASA · 2015–present · 685 km sun-synchronous orbit · robotic*
- **What:** Maps the moisture in the top few cm of soil, and whether the ground is frozen, across the whole globe every 2–3 days.
- **Results:**
  - **The radar failed after ~6 months** (Jul 2015). With only the radiometer left, resolution dropped from ~9 km to ~40 km.
  - ~135 TB of data were returned anyway.
- **Hardware:** 944 kg; 6 m mesh antenna spinning at 14.6 rpm; solar array ~1,500 W. **$916M** ⚠.
- **Game hook:** One instrument fails, and the mission continues at lower quality.
- **Sources:** [JPL specs](https://smap.jpl.nasa.gov/observatory/specifications/) · [JPL radar](https://www.jpl.nasa.gov/news/nasa-soil-moisture-radar-ends-operations-mission-science-continues/)

### S5 · Flight dynamics / navigation officer

**Real precedent:** Katherine Johnson (NASA Langley), who calculated trajectories for the first US crewed flights and hand-checked the computer for John Glenn's orbital flight.

**Related entries:** DART ([E10](#e10--dart--deflecting-an-asteroid)), Mars Climate Orbiter ([E15](#e15--failure-mars-climate-orbiter--the-unit-mix-up)), Deep Space Atomic Clock ([E20](#e20--deep-space-atomic-clock)), Juno's valves ([E7](#e7--juno--solar-power-at-jupiter-and-the-valve-problem)).

#### N1 · JWST launch precision → extra lifetime
*NASA / ESA · 2021 · Earth to Sun–Earth L2*
- **What:** The Ariane 5 launch was more accurate than required, so the course-correction burns were small (~20 m/s, then 2.8 m/s).
- **Results:** The saved propellant extends the expected lifetime from a 5-year baseline to "significantly more than 10 years", possibly ~20 ⚠.
- **Game hook:** A precise launch vehicle converts directly into lifetime cards.
- **Sources:** [NASA blog](https://science.nasa.gov/blogs/webb/2021/12/29/nasa-says-webbs-excess-fuel-likely-to-extend-its-lifetime-expectations)

#### N2 · New Horizons — Pluto flyby timing
*NASA / Johns Hopkins APL · 2015 · Pluto flyby*
- **What:** After 9.5 years and ~5 billion km, it flew past Pluto at **~12,500 km** from the surface. It arrived within about a minute of the time predicted at launch ⚠.
- **Game hook:** Instrument commands for a flyby depend on knowing the exact arrival time. Better navigation means more usable data.
- **Sources:** [JHU Hub](https://hub.jhu.edu/2015/07/14/new-horizons-pluto-flyby-just-incredible) ⚠

### S6 · Communications & data engineer

**Real precedent:** the Deep Space Network team at JPL, who redesigned Galileo's whole data link after its main antenna failed.

**Related entries:** laser comms ([E11](#e11--laser-communications--llcd-and-dsoc)), MarCO relay ([E12](#e12--marco--the-first-interplanetary-cubesats)), Voyager ([P5](#p5--voyager-1-and-2--crossing-the-heliopause)), Kepler's pixel selection ([A2](#a2--kepler--hunting-exoplanets)).

#### CD1 · Galileo — the antenna that didn't open
*NASA · 1991 onward · Jupiter mission*
- **What:** The 4.8 m high-gain antenna stuck partly open, so the planned **134.4 kbit/s** link was lost. The mission had to use a low-gain antenna with a tiny fraction of that rate.
- **Results:** Data compression on board and upgrades to the ground antennas raised the effective return ~10×. NASA says "the great majority" of science goals were still met.
- **Hardware:** The whole mission cost $1.39B.
- **Game hook:** "Antenna failure" card, recovered through software and ground-station upgrades.
- **Sources:** [NASA Galileo](https://science.nasa.gov/mission/galileo/) · [JPL TDA report](https://ipnpr.jpl.nasa.gov/progress_report/42-116/116k.html)

#### CD2 · New Horizons — 15 months to send home the Pluto data
*NASA / Johns Hopkins APL · 2015–16 · from Pluto*
- **What:** The flyby collected data in a few days. Sending it home took far longer.
- **Results:** **50+ Gbit at ~2 kbit/s** took **~15–16 months** to download (the last bits arrived Oct 2016). The one-way light time was 5 h 08 min.
- **Game hook:** "Collect fast, transmit slowly": data waits in the onboard recorder, so recorder size and downlink rate both matter.
- **Sources:** [Spaceflight Now](https://spaceflightnow.com/2016/10/27/final-pluto-data-transmission-received-from-flyby-probe/)

---

## 6. Cross-cutting tables for game balancing

### 6.1 Real instrument and payload figures

| Item | Type | Mass | Power | Data | Cost | Ref |
|---|---|---|---|---|---|---|
| Curiosity RAD | Radiation detector | 1.56 kg | 4.2 W | — | n/f | P10 |
| MinION | DNA sequencer | ~0.12 kg ⚠ | n/f | 4–20 Gb/run ⚠ | n/f | B11 |
| Ingenuity | Helicopter | 1.8 kg | ~350 W in flight | via rover | $80M + $5M | E1 |
| Chang'e 4 biosphere | Sealed ecosystem | 2.6 kg | n/f | — | n/f | B5 |
| Cassini INMS | Mass spectrometer | 6–9.25 kg ⚠ | 15–27.7 W ⚠ | 1–1.5 kbit/s | n/f | C3 |
| Viking biology package | Life detection | 15 kg | 15 W avg | — | — | B13 |
| MOXIE | Oxygen production (ISRU) | 17.1 kg | 300 W | — | n/f | E2 |
| Pragyan | Small rover | 26 kg | 50 W | — | n/f | G12 |
| Curiosity SAM | Chemistry lab | ~40 kg | n/f | — | n/f | C4 |
| MICROSCOPE T-SAGE | Accelerometers | 40 kg | 20 W each | — | n/f | P11 |
| MMRTG | Nuclear power source | 45 kg | ~110 W out, decaying | — | n/f | E6 |
| Philae | Comet lander | 100 kg (21 kg instruments) | battery + solar | — | n/f | E17 |
| Opportunity | Rover | 185 kg | — | — | $1.08B for 2 rovers | G6 |
| ACES | Atomic clocks | 227–240 kg ⚠ | 450–600 W ⚠ | — | n/f | P15 |
| Cold Atom Lab | Quantum lab | ~267 kg | n/f | — | n/f | P13 |
| Curiosity | Rover | 899 kg | MMRTG | — | n/f | G7 |
| BEAM | Inflatable habitat | ~1,413 kg | — | — | $17.8M ⚠ | E4 |
| AMS-02 | Particle detector | ~6,700 kg | 2–2.5 kW ⚠ | ~300 kB/s ⚠ | ~$2B ⚠ | P8 |

### 6.2 Real spacecraft figures

| Spacecraft | Launch mass | Power | Downlink | Cost | Ref |
|---|---|---|---|---|---|
| Explorer 1 | 14 kg | batteries | — | n/f | P1 |
| MarCO (each) | 6U CubeSat | n/f | 8 kbit/s relay | $18.5M (pair) | E12 |
| MICROSCOPE | ~300 kg ⚠ | ~140 W | 625 kbit/s | n/f | P11 |
| IKAROS | ~310 kg | thin-film cells | — | n/f | E9 |
| Galileo probe | ~335–339 kg ⚠ | battery | — | (mission $1.39B) | AT1 |
| Stardust | 385 kg | ~330 W | 7.9 kbit/s | ~$200M | C1 |
| Pathfinder | 463 kg ⚠ | 35 W (lander) | 2.3 Gbit total | ~$265M | E13 |
| DS1 | 486 kg | 2.5 kW | — | $152.3M | E8 |
| Hayabusa / Hayabusa2 | 510 / ~600 kg | n/f | — | n/f | G4 |
| GRACE-FO (each) | 600.2 kg | n/f | — | ~$430M (NASA share) | ES2 |
| DART | ~610 kg | 6.6 kW (ROSA) | — | ~$325M ⚠ | E10 |
| Mars Climate Orbiter | 629 kg | 500 W at Mars | — | ~$327.6M ⚠ | E15 |
| Parker Solar Probe | 635–685 kg ⚠ | n/f | — | ~$1.5B ⚠ | P14 |
| SLIM | ~715 kg ⚠ | solar | — | n/f | E14 |
| SMAP | 944 kg | ~1.5 kW | — | $916M ⚠ | ES3 |
| Kepler | 1,039 kg | n/f | partial pixels | n/f | A2 |
| MESSENGER | 1,107.9 kg | n/f | — | <$450M ⚠ | G13 |
| Chandrayaan-1 | 1,380 kg | n/f | — | n/f | G11 |
| LISA Pathfinder | 1,910 kg | n/f | — | €490M ⚠ | P12 |
| Gravity Probe B | 3,100 kg | 606 W | 2.5 Mbit/s | ~$750M | P7 |
| Juno | 3,625 kg | 14 kW at Earth → ~0.5 kW at Jupiter | — | $1.13B | E7 |
| JWST | ~6,200 kg | n/f | 28 Mbit/s ⚠ | ~$9.7B | A3 |
| Hubble | 11,110 kg | ~2.1 kW avg ⚠ | ~140 Gbit/week ⚠ | n/f | A1 |

### 6.3 Data rate vs distance (real links)

| Link | Distance | Rate | Ref |
|---|---|---|---|
| MICROSCOPE (radio) | Low Earth orbit | 625 kbit/s | P11 |
| Gravity Probe B (radio) | Low Earth orbit | 2.5 Mbit/s | P7 |
| LLCD (laser) | Moon, ~384,000 km | **622 Mbit/s** | E11 |
| JWST (radio) | L2, 1.5 million km | 28 Mbit/s ⚠ | A3 |
| DSOC (laser) | 31 million km | 267 Mbit/s | E11 |
| DSOC (laser) | 226 million km | 25 Mbit/s | E11 |
| DSOC (laser) | ~400 million km | ~8 Mbit/s | E11 |
| Galileo (planned, radio) | Jupiter | 134.4 kbit/s (lost to antenna failure) | CD1 |
| MarCO relay (radio) | Mars | 8 kbit/s | E12 |
| Stardust (radio, 70 m DSN) | comet encounter | 7.9 kbit/s | C1 |
| New Horizons (radio) | Pluto, ~5 billion km | ~2 kbit/s | CD2 |
| Voyager 1 (radio) | ~25 billion km | ~160 bit/s ⚠ | P5 |

The rule of thumb these numbers show: the rate falls roughly with the *square* of the distance. Laser links buy back 10–100×.

### 6.4 Power vs distance and time

- **Solar falls with the square of distance from the Sun:**
  - Juno: ~14 kW at Earth → ~0.4–0.5 kW at Jupiter (5.2 AU, 25× less sunlight) (E7).
  - Dawn: >10 kW at 1 AU → 1.4 kW at its farthest point (E8).
- **Radioisotope power decays slowly:**
  - MMRTG: ~110 W at launch, falling a few % per year (E6).
  - Voyager: loses ~4 W per year, so instruments get switched off (P5).
- **Dust kills solar on Mars:** InSight (G9) and Opportunity (G6).
- **Night kills unheated hardware:** a lunar night is ~14 Earth days (B5, G12). SLIM survived 3 nights (E14).

### 6.5 What actually ended real missions (lifetime limiters)

| Limiter | Real cases |
|---|---|
| Coolant ran out | Gravity Probe B (P7) |
| Pointing/attitude fuel ran out | Dawn (G14/E8), Kepler (E18), MESSENGER (G13) |
| Main propellant | Kepler (E18), JWST (N1, extended by a precise launch) |
| Dust on solar panels / dust storm | InSight (G9), Opportunity (G6) |
| Lunar night with no heating | Chang'e 4 biosphere (B5), Pragyan (G12) |
| Battery | Explorer 1 (P1), Philae (E17), GRACE (ES1) |
| Radioisotope power decay | Voyager (P5) |
| Budget cut | Apollo seismometers (G2) |
| Lost contact | Chandrayaan-1 (G11), MarCO (E12) |
| Hardware failure in operations | Ingenuity (E1), Galileo probe (AT1, by design) |

### 6.6 Random-event deck from real cases

| Event | Real case | Main resource hit | Possible counter-play in game |
|---|---|---|---|
| Saturated sensor (zero = too much) | Explorer 1 (P1) | Science | Analysis action reinterprets the data |
| Unexpected systematic error | Gravity Probe B (P7) | Science quality, time | Extra analysis time |
| Cooling pump failure | AMS-02 (P8) | Instrument | Risky EVA repair |
| Clock/instrument won't start | ACES (P15) | Lifetime | Commissioning reserve |
| Wrong orbit after launch | Galileo 5 & 6 (P16) | Orbit | Repurpose for different science |
| Serendipitous discovery | FLEX (P9) | +Science | Keep sensors on |
| Solar storm | RAD (P10), MAVEN (AT4) | Crew dose, hardware | Shielding mass |
| Budget cut, switch off | Apollo seismometers (G2) | Budget | Prioritize instruments |
| Cascading failures | Hayabusa (G4) | Everything | "Limp home" option (+time) |
| Surface softer than expected | OSIRIS-REx (G5) | Sampling risk | Surface survey first |
| Stuck fasteners delay analysis | OSIRIS-REx (G5) | Time | Spare tooling |
| Global dust storm / dusty panels | Opportunity (G6), InSight (G9) | Power | RTG instead of solar |
| Unknown soil — tool fails | InSight HP3 (G9) | Instrument | Soil survey before deploying |
| Return mission cancelled | Mars Sample Return (G8) | Science payoff | — |
| Lost contact early | Chandrayaan-1 (G11) | Lifetime | Redundancy |
| Lunar night | Chang'e 4 (B5), Pragyan (G12) | Lifetime | Heater/thermal budget |
| Seeds don't germinate / water stress | Veggie (B4) | Science, crew morale | Extra seeds (redundancy) |
| False positive life signal | Viking (B13) | Reputation | Cross-check instrument |
| Navigation lost over featureless terrain | Ingenuity (E1) | Vehicle | Better navigation sensor |
| Solar array won't retract | ROSA 2017 (E5) ⚠ | Power, mass | — |
| Suspect valve — skip burn | Juno (E7) | Orbit, science passes | Accept safer orbit |
| Reaction wheel failure | Kepler (E18), Dawn (E8), Hayabusa (G4) | Pointing, fuel | Spare wheel / creative recovery |
| Unit mismatch | Mars Climate Orbiter (E15) | Mission loss | Independent verification action |
| Sensor overload, software trusts bad data | Schiaparelli (E16) | Mission loss | Testing budget |
| Anchoring failure, landed in shadow | Philae (E17) | Power, lifetime | Bigger battery |
| Engine lost, tip-over on landing | SLIM (E14) | Power | — |
| Antenna stuck | Galileo (CD1) | Comms, data | Compression, ground upgrades |
| One satellite of a pair fails | GRACE (ES1) | Mission end | Spare satellite |
| Instrument fails, mission continues degraded | SMAP radar (ES3) | Science quality | Instrument redundancy |
| Flaw found after launch | Hubble mirror (E19) | Science | Serviceable orbit |
| Life-support failure, use reserves | ISS toilet 2026 (E3) ⚠ | Water/consumables | Reserve mass |
| **Positive:** mission extended | Opportunity 60× plan (G6) | +Science, +ops cost | — |
| **Positive:** precise launch saves fuel | JWST (N1) | +Lifetime | Pick a precise launcher |
| **Positive:** precision improves with time | LISA Pathfinder (P12) | +Science | Longer mission |

---

## 7. Known gaps

The research hit a web-search budget limit, so some things were not covered or not checked:

- **Not researched:**
  - Rodent Research, BioSentinel (yeast in deep space), Bion-M1.
  - Any Mir or Tiangong biology experiment.
  - The first 3D printer on the ISS.
  - MISSE materials exposure.
  - Telemedicine/ultrasound on the ISS (for a physician role).
- **Missing numbers:** Most per-instrument power and cost figures are **n/f**. Agencies rarely publish cost per experiment.
- **To verify before using as facts in game text:** every ⚠ number, especially:
  - AMS-02 power, data and cost.
  - DART cost and impact speed.
  - The ROSA 2017 retraction failure.
  - The MMRTG heat output.
  - SLIM mass.
  - The JWST data rate.
  - The Cassini INMS mass and power conflict.
- **Paywalled primary papers** (numbers taken from agency pages or secondary sources instead): tardigrades (Jönsson 2008), Enceladus phosphates (Postberg 2023), Perseverance biosignature (Hurowitz 2025), LCROSS (Colaprete 2010).
