# Crew Characters and Classes

This document defines the **4 playable characters** (classes) for solo or cooperative play (up to 4 players).  
The structure uses **named characters with a dual specialization**, combining a narrative identity with full coverage of the systems and constraints described in [description.md](../docs/description.md).

---

## Team Overview

| # | Character | Class / Position | Dual Specialization | Main Resources |
| :- | :--- | :--- | :--- | :--- |
| 1 | **Helena** *(suggestion)* | Commander and Pilot | Aerospace Eng. & Test Piloting | **Mass**, **Orbit/Rocket** and **Budget** |
| 2 | **Lucas** *(suggestion)* | Systems Engineer | Electrical Eng. (Power) & Mechanical Eng. | **Power** and **Lifetime (Time)** |
| 3 | **Oscar** | Data and Telecom Specialist | Computer Eng. & Telecommunications | **Data** and **Communications** |
| 4 | **Maya** | Mission Scientist and Medical Officer | Planetary Geology & Astrobiology / Medicine | **Science Value** and **Crew Support** |

---

## Detailed Sheets

### 1. Helena *(suggestion)*: Commander and Pilot
* **Dual Specialization:** Aerospace Engineering & Test Piloting
* **Profile:** Pragmatic and focused on physical feasibility. She makes sure the mission gets off the ground and reaches the right orbit without going over the rocket's limit.
* **Systems she is responsible for:**
  * Launch vehicle (rocket) selection
  * Propulsion and delta-v (maneuvering capability)
  * Attitude control (spacecraft pointing)
  * Mission orbit and trajectory
* **Resources she controls and defends:** **Total Mass**, **Orbit** and shared management of the **Budget**.
* **Role and tension in the team:**
  * Keeps the spacecraft **light and lean**, holding the team back when the total mass threatens to require a much more expensive rocket (or makes the launch impossible).
  * Negotiates directly with **Maya** (instrument mass) and **Lucas** (battery and structure mass).
* **Suggested Passive Ability (Perk):**
  * *Precision Piloting:* Reduces fuel use in orbital maneuvers by a small percentage, or slightly increases the payload margin of the selected launch vehicle.

---

### 2. Lucas *(suggestion)*: Systems Engineer
* **Dual Specialization:** Electrical Engineering (Power) & Mechanical / Structural Engineering
* **Profile:** Methodical and preventive. Thinks about durability, redundancy and the power balance so the spacecraft survives eclipses, radiation and long periods of operation.
* **Systems he is responsible for:**
  * Structure / chassis and thermal protection
  * Solar panels or other power sources
  * Batteries and power distribution
  * Maintenance and repair of in-flight failures
* **Resources he controls and defends:** **Power** and **Lifetime / Integrity (Time)**.
* **Role and tension in the team:**
  * He is the **"guardian of the Watts"**: he works out whether the power generated and stored can handle the consumption peaks when the science instruments and the antennas run at the same time.
  * He has to say "no", or demand structural improvements, when **Oscar** and **Maya** want to run everything at full power.
* **Suggested Passive Ability (Perk):**
  * *Redundant Engineering:* Lowers the chance of components degrading in random events, or improves power generation and storage efficiency during orbital shadow.

---

### 3. Oscar: Data and Telecom Specialist
* **Dual Specialization:** Computer Engineering & Telecommunications
* **Profile:** Analytical and strategic. He knows that science not sent back to Earth is science lost, and that communication bandwidth is a constant bottleneck.
* **Systems he is responsible for:**
  * Onboard computer and processing
  * Memory / data storage
  * Antennas (gain, band and pointing)
  * Contact windows with ground stations
* **Resources he controls and defends:** **Data** and **Communications**.
* **Role and tension in the team:**
  * Balances the data volume the experiments generate against onboard memory and the transmission rate available in the orbit **Helena** chose.
  * Negotiates bandwidth priority and transmission windows with **Maya**, and asks **Lucas** for budget and power for stronger antennas.
* **Suggested Passive Ability (Perk):**
  * *Smart Compression:* Increases the effective transmission rate or reduces the storage space taken by science data packets.

---

### 4. Maya: Mission Scientist and Medical Officer
* **Dual Specialization:** Planetary Geology & Astrobiology / Space Medicine
* **Profile:** Curious and ambitious. Seeks the highest science return from the mission while keeping the crew safe (when the scenario has a crew).
* **Systems she is responsible for:**
  * Selection and operation of science instruments (cameras, spectrometers, radars, biological sensors)
  * Choice of observation and sampling targets
  * Life support and crew health (on crewed missions)
* **Resources she controls and defends:** **Science Value (Mission Score)** and **Crew Safety**.
* **Role and tension in the team:**
  * The best instruments are **heavy, expensive, power-hungry and generate a lot of data**, which puts **Maya** in direct negotiation with **Helena**, **Lucas** and **Oscar** in almost every decision.
* **Suggested Passive Ability (Perk):**
  * *Experimental Synergy:* Science instruments combined in the ideal orbit give a science value bonus, or reduce the impact of medical or biological events on the crew.

---

## Trade-off and Negotiation Matrix

This matrix shows how one character's decisions directly affect another character's resources, which encourages collaboration in team mode:

| Decision | Who proposes it | Who feels the impact | Conflict / Negotiation |
| :--- | :--- | :--- | :--- |
| Add an advanced instrument | **Maya** | **Helena**, **Lucas**, **Oscar** | Increases **Mass**, **Power**, **Cost** and the **Data** generated. |
| Choose a higher / more distant orbit | **Helena** or **Maya** | **Oscar**, **Lucas** | Needs a stronger antenna (**Communications**) and changes the light/shadow cycles (**Power**). |
| Switch to a smaller rocket (to save money) | **Helena** | **Everyone** | Sharply lowers the **Mass** limit, forcing cuts in the payload or the batteries. |
| Shrink the batteries / panels | **Lucas** or **Helena** | **Maya**, **Oscar** | Science and transmission can no longer run at the same time; use has to be scheduled. |
| Prioritize a high-capacity antenna | **Oscar** | **Helena**, **Lucas** | Uses more **Mass**, **Power** and **Budget** to avoid a **Data** bottleneck. |
