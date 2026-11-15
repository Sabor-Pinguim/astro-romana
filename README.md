# astro-romana

## A soundtrack made from real Mars data

The game's background sound is generated from the radiation that the Curiosity rover measured on the surface of Mars (RAD instrument, NASA dataset `MSL_RAD_OBS-L2`). The **data** sets when each sound happens and how strong it is. The **code** sets how it sounds: key, scale and timbres.

- **Surface ambience** (40 s loop): 4 quiet Martian days from May 2024, compressed. The rise and fall of radiation through each day opens and closes a chord, and each reading well above the trend plays a bell note.
- **Solar storm** (32 s): 48 real hours on 20–21 May 2024, when radiation rose about 79-fold in under an hour. The Geiger counter clicks follow the measured dose, and a deep impact marks the moment of the jump.

The audio is generated ahead of time, outside the game, in plain JavaScript with no libraries and no recorded sounds (`npm run audio`). The same data always produces the same file. Details (in Portuguese) in [docs/audio.md](docs/audio.md).

### Dataset

| | |
|---|---|
| Dataset | **`MSL_RAD_OBS-L2`**, "MSL/RAD Level 2 observational radiation data" |
| Variable | `DOSIMETRY_TOTAL_f` (quality-filtered dose rate, µGy/day): detector B (silicon, rover power source contribution removed) and detector E (tissue-equivalent plastic) |
| Instrument | Radiation Assessment Detector (RAD), Curiosity rover, Gale crater |
| Provider | NASA Space Physics Data Facility (SPDF), [CDAWeb](https://cdaweb.gsfc.nasa.gov/WS/cdasr/1/dataviews/sp_phys/datasets/MSL_RAD_OBS-L2/variables); also archived at the [PDS PPI node](https://pds-ppi.igpp.ucla.edu/data/MSL-M-RAD-3-RDR-V1.0/AAREADME.TXT) (`MSL-M-RAD-3-RDR-V1.0`) |
| Instrument team | D. Hassler (PI), Southwest Research Institute ([Hassler et al. 2012](https://link.springer.com/article/10.1007/s11214-012-9913-1)) |
| Windows used | 1–5 May 2024 (surface ambience) and 20–21 May 2024 (solar storm), UTC |

The downloaded measurements, the derived values and the caveats are in [references/datasets/msl-rad/](references/datasets/msl-rad/README.md).
