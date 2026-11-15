# Equipamentos da Cabine da Tripulação (Catálogo de Gameplay e Missões)

Este documento descreve os **12 módulos reais de equipamento** pesquisados para equipar o interior da **Cabine (`parts/structures/crew-cabin.glb`)** na Fase 3 (construção do foguete), operando diretamente na visão em primeira pessoa do lançamento (Fase 5), no reabastecimento orbital e viagem de ida/volta (Fase 6) e nas missões de superfície em Marte (Fase 7).

Enquanto os 21 motores e tanques de [references/parts/parts.md](../../references/parts/parts.md) compõem o **Main Booster**, e os 16 equipamentos de [equipamentos-estagios.md](equipamentos-estagios.md) ocupam os **1 a 7 estágios do meio**, os módulos da cabine definem os **painéis internos, suporte à vida, acoplamento orbital e segurança da tripulação**.

- **Referência técnica e instruções low-poly 3D:** [references/parts/cabin-equipment.md](../../references/parts/cabin-equipment.md)
- **Minigames por personagem:** [docs/minigames.md](../minigames.md)
- **Fluxo completo em 7 fases:** [space-mission-game-transcricao-organizada.md](space-mission-game-transcricao-organizada.md)

---

## 1. Papel da Cabine no fluxo do jogo

A **Cabine (`parts/structures/crew-cabin.glb`)** é um dos dois módulos **obrigatórios** da nave (junto ao *Main Booster*). Sua cavidade principal pressurizada (`Ø 0,92 m × 0,95 m` na escala normalizada do modelo *cutaway*, antes do funil superior da torre de escape) recebe módulos padronizados de até **`0,68 × 0,72 × 0,56 m`** assentados no piso (`y = 0`).

### O que a personalização da Cabine altera nas Fases 5, 6 e 7
- **Fase 5 (Lançamento em 1ª pessoa):** os painéis exibidos a cada astronauta (`§7.1`) e a tolerância da tripulação à aceleração e vibração dependem do cockpit (`cabin-orion-cockpit`), dos assentos amortecedores (`cabin-launch-seats`) e do barramento elétrico (`cabin-pcdu-thermal`).
- **Fase 6 (Reabastecimento orbital obrigatório & Viagem até Marte):**
  - O acoplamento para reabastecimento em órbita da Terra (`§6.1`, `§8.1`) utiliza o anel `cabin-idss-docking`;
  - Os ~203–259 dias de viagem consomem água/oxigênio (`cabin-eclss-wrs`), exigem exercícios diários (`cabin-ared-exercise`), permitem reparos em EVA (`cabin-eva-airlock`), pesquisas biológicas em microgravidade (`cabin-msg-minion`) e proteção contra tempestades solares (`cabin-hera-dosimetry` + `cabin-storm-shelter`).
- **Fase 7 (Superfície de Marte e Retorno):** a filtragem de poeira na saída/entrada (`cabin-eva-airlock`), a autonomia durante o blecaute da conjunção solar (`cabin-autonav-conjunction`) e a saúde médica no retorno (`cabin-ared-exercise`, `cabin-storm-shelter`) definem quem volta no prazo e com qual nota (**S+**, **A**, **B**).

---

## 2. Catálogo por personagem (12 módulos de Cabine)

Legenda ([AGENTS.md](../../AGENTS.md) §7): `⚠` = fonte secundária / resumo ou divergência entre fontes; `n/f` = não encontrado (usar valor balanceado do jogo); `derived` = calculado a partir de dados com fonte.

### A. Helena — Comandante e Piloto *(Cockpit, Acoplamento e Assentos)*

| ID do módulo | Nome na Cabine | Base real | Tier | Massa / Energia reais | Fases e impacto direto no gameplay |
|---|---|---|---|---|---|
| `cabin-launch-seats` | **Assentos Amortecedores de Lançamento (4×)** | Assentos reclináveis com absorção de impacto (**Apollo / Orion / Crew Dragon**) | 1 | `n/f` (~140 kg `game-balance`); `0 W` (passivo/mecânico) | Absorve picos de força *g* na decolagem pesada (Fase 5) e reduz lesões da tripulação caso o pouso em Marte sofra impacto forte (*SLIM* `E14`). |
| `cabin-orion-cockpit` | **Console Glass Cockpit de Comando (`3 DUs`)** | **Orion Cockpit** (`3` Display Units multifunção, controles RHC/THC e ~57 chaves físicas ⚠) | 2 | `n/f`; barramento **120 VDC ⚠** | Melhora o HUD de 1ª pessoa na Fase 5 e amplia a precisão/margem de tempo da Helena em **H-O1 ("Aerofrenagem")** e **H-S2 ("Ache o lugar seguro")**. |
| `cabin-idss-docking` | **Anel de Acoplamento `IDSS / NDS` & Umbilicais Criogênicos** | **NASA Docking System (`NDS`) / `IDSS`** (`JSC 65795`) com conectores `PDTU` | 3 | **~319–340 kg ⚠** (`NDS-301..304`, +~29 kg aviônicos remotos ⚠); transfere **28 / 120 VDC ⚠** | **Reabastecimento orbital (Fase 6):** acelera a transferência de propelente em órbita da Terra e reduz risco de vazamento no minigame/evento de reabastecimento. |

---

### B. Lucas — Engenheiro de Sistemas *(Energia da Cabine, Airlock e Ciclo Fechado ECLSS)*

| ID do módulo | Nome na Cabine | Base real | Tier | Massa / Energia reais | Fases e impacto direto no gameplay |
|---|---|---|---|---|---|
| `cabin-pcdu-thermal` | **Barramento `120 VDC` & Trocador de Calor Condensador** | **PCDU `120 VDC`** + bomba térmica de cabine (**Orion / ISS** + lição *AMS-02* `P8`) | 1 | `n/f` (~45 kg `game-balance`); barramento **120 VDC ⚠** (reduz massa de cabos) | Evita desarme elétrico ao acionar equipamentos pesados e fornece bancada interna (`FX_Sparks`) para diagnosticar/conter o evento *"Falha na bomba térmica"* (`P8`). |
| `cabin-eva-airlock` | **Airlock de Eclusa & Suporte Duplo de Trajes (`Suitport`)** | **Quest Airlock / Suitport** + selos anti-poeira marciana (**AxEMU / xEMU**, `EN15`) | 2 | `n/f` (~180 kg `game-balance`); pico elétrico na despressurização | Desbloqueia **EVAs de reparo em órbita** (soltar painel `ROSA` travado `E5` ou trocar bomba `AMS-02` `P8`) e evita entrada de regolito tóxico (percloratos `BI4`) na Fase 7. |
| `cabin-eclss-wrs` | **Rack `ECLSS` Recuperação `98%` de Água & Sanitário `UWMS`** | **ISS WRS (`WPA` + `UPA` + `BPA`, 98% água em jun/2023)** + **UWMS** (`EN15`, `E3`) | 3 | `UWMS` **40% mais leve / 65% menor** (~`5 ft³ ⚠`); `WRS` na ISS ocupa 2 racks `ISPR` (`~2 × 1,05 × 0,85 m ⚠`) | Reduz drasticamente a massa de água de lançamento (`~68 t` base para 4 tripulantes / 500 dias, `EN2`) e previne o evento *"Falha no suporte à vida, usar reservas"* (*sanitário ISS 2026* `E3` ⚠). |

---

### C. Oscar — Especialista de Dados e Telecom *(Alerta de Radiação, DTN e Autonomia)*

| ID do módulo | Nome na Cabine | Base real | Tier | Massa / Energia reais | Fases e impacto direto no gameplay |
|---|---|---|---|---|---|
| `cabin-hera-dosimetry` | **Sensor Ativo `HERA` & Matriz de Alarme Solar** | Orion **HERA** (sensores `Timepix` derivados do CERN, Artemis `⚠`) + curva `PH1` | 1 | Módulos na casa de **dezenas de gramas ⚠** (kit < alguns kg ⚠); **~2 W ⚠** | Monitora radiação em tempo real (`~1,8 mSv/dia` na viagem `PH1`) e dispara alerta antecipado de tempestade solar, dando **mais janela de reação** para Maya em **M-S5 ("Abrigo!")**. |
| `cabin-scan-console` | **Estação de Telecom `DTN` & Controle de Latência** | Rede **Delay-Tolerant Networking (`DTN`)** (`mars-experiments.md` §1) | 2 | `n/f` (~28 kg / ~65 W `game-balance`) | Gerencia os **3–22 min** (`4–24 min ⚠`) de tempo de luz só de ida sem congelar comandos internos (`FX_Antenna`) e organiza a fila para **O-O1** / **O-S1**. |
| `cabin-autonav-conjunction` | **Coprocessador `AutoNav` & Blecaute de Conjunção Solar** | **AutoNav** do Perseverance (`EN8`: `347,7–412 m/sol ⚠`, >90% autônomo) + ops de Conjunção Solar | 3 | `~16 kg / ~85 W` (`game-balance`); cruza campos de rochas **~3× mais rápido** (6 sóis vs ~18 do Curiosity, `EN8`) | Mantém a missão operando com segurança durante o **blecaute de 2–3 semanas da Conjunção Solar** (a cada ~26 meses, `§1`) e acelera deslocamentos da equipe em Marte (Fase 7). |

---

### D. Maya — Cientista e Oficial Médica *(Contramedidas, Bio-Lab e Abrigo Médico)*

| ID do módulo | Nome na Cabine | Base real | Tier | Massa / Energia reais | Fases e impacto direto no gameplay |
|---|---|---|---|---|---|
| `cabin-ared-exercise` | **Plataforma de Exercício Resistivo `ARED`** | ISS **ARED** (cilindros a vácuo de `20 cm` + volantes de inércia até `2.700 N ⚠`) | 2 | **~610–680 kg ⚠** (`1.350–1.500 lb` na Terra); `0 W` mecânico (`ISS ARED`) | Tarefa de viagem na Fase 6 (cumprindo **2,5 h/dia** de treino `BI8`) para conter perda óssea de **1–1,5%/mês** e evitar fraqueza grave no pouso em Marte. |
| `cabin-storm-shelter` | **Abrigo Parede-d'Água & Baia Médica ISO 7010** | **Abrigo de Água para SPE** (Orion/Mars + `AstroRad` `BI11`) + ultrassom `SANS` (`BI8`) | 2 | Reaproveita massa de água de bordo; **~25 W** diagnósticos; reduz **40–60% ⚠** com `AstroRad` (`BI11`) | Refúgio seguro durante **M-S5 ("Abrigo!")** em tempestades solares e monitora **inchaço do disco óptico** (ocorre em **64%** das tripulações longas, `BI8`). *(Usa cruz branca em fundo verde **ISO 7010**, sem cruz vermelha — [AGENTS.md](../../AGENTS.md) §5.3).* |
| `cabin-msg-minion` | **Glovebox de Microgravidade `MSG` & Sequenciador `MinION`** | ISS **Microgravity Science Glovebox** + **Oxford Nanopore `MinION`** (`BI9`, `B11`) + `BioRock` (`BI10`) | 3 | `MinION` **~0,12 kg ⚠**, gera **4–20 Gb/corrida ⚠** (`BI9`); rack estufa/glovebox (~85 kg / ~95 W `game-balance`) | Desbloqueia ciência biológica/biomining durante os ~203–259 dias de viagem (Fase 6), gerando muitos pontos mas pressionando os buffers de dados de Oscar (`data-rad750-ssr` / `comm-dsoc-laser`). |

---

## 3. Presets de Cabine sugeridos (por perfil de missão)

### Cabine 1 (MVP) — *Comando Ágil & Acoplamento Orbital*
Ideal para validar o loop completo (Fases 5, 6 e 7) com foco em pilotagem, energia básica e segurança:
- **Helena:** `cabin-orion-cockpit` + `cabin-launch-seats` (ou `cabin-idss-docking` para a etapa de reabastecimento em órbita)
- **Lucas:** `cabin-pcdu-thermal`
- **Oscar:** `cabin-hera-dosimetry`
- **Maya:** `cabin-storm-shelter`

### Cabine 2 — *Laboratório Orbital & Rede de Espaço Profundo*
Focada em ciência biológica na viagem e operação remota sob alta latência:
- **Helena:** `cabin-orion-cockpit` + `cabin-idss-docking`
- **Lucas:** `cabin-eva-airlock`
- **Oscar:** `cabin-scan-console` + `cabin-autonav-conjunction`
- **Maya:** `cabin-msg-minion`

### Cabine 3 — *Longa Duração Humana (500 Sóis em Marte)*
Otimizada para missões tripuladas completas com máxima autossuficiência e retorno seguro da equipe:
- **Helena:** `cabin-idss-docking` + `cabin-orion-cockpit`
- **Lucas:** `cabin-eclss-wrs` *(98% recuperação de água)* + `cabin-eva-airlock`
- **Oscar:** `cabin-hera-dosimetry` + `cabin-autonav-conjunction`
- **Maya:** `cabin-ared-exercise` + `cabin-storm-shelter`
