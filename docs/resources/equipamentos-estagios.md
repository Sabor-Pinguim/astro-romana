# Equipamentos dos Estágios do Meio (Catálogo de Gameplay e Missões)

Este documento descreve os **16 módulos reais de equipamento** pesquisados para serem instalados nos **estágios internos do meio do foguete** (`parts/structures/stage-module.glb`) durante a Fase 3 (construção por *drag and drop*) e utilizados nas Fases 5 a 7 da missão.

Enquanto os 21 modelos de motores e tanques de [references/parts/parts.md](../../references/parts/parts.md) compõem o **Main Booster** (Base), os **1 a 7 estágios intermediários idênticos** ficam entre o *Main Booster* e a *Cabine* e abrigam a carga útil: energia, comunicação, navegação de pouso, perfuração, suporte à vida e instrumentos científicos.

- **Referência técnica e instruções low-poly 3D:** [references/parts/stage-equipment.md](../../references/parts/stage-equipment.md)
- **Minigames desbloqueados:** [docs/minigames.md](../minigames.md)
- **Fluxo completo do jogo:** [space-mission-game-transcricao-organizada.md](space-mission-game-transcricao-organizada.md)

---

## 1. Como funcionam os 1 a 7 estágios do meio na construção

O foguete montado pelo time possui:
1. **Main Booster (obrigatório):** motor + tanque que fornecem empuxo e Δv de saída da Terra (ver [parts.md](../../references/parts/parts.md)).
2. **Estágios do meio (0/1 a 7 opcionais idênticos):** compartimentos modulares abertos em *cutaway* (`Ø 1,00 m × 1,00 m` normalizado no visual, cavidade útil interna de `Ø 0,91 m × 0,84 m`). Cada estágio adicionado libera espaço para **1 módulo de equipamento** arrastado da barra lateral direita.
3. **Cabine (obrigatória):** módulo superior da tripulação/comando.

### Consequências diretas no gameplay (trade-offs reais)
- **Mais estágios = mais capacidades e redundância**, porém aumenta **massa seca estrutural**, eleva a altura do veículo e exige **mais Δv / empuxo** do *Main Booster* (risco de falha estrutural ou falta de empuxo no lançamento — Fase 5).
- **Mais massa embarcada para o pouso = mais risco na EDL** (*Entry, Descent and Landing* — Fases 4 e 6). Pousar uma configuração com 5–7 estágios cheios exige investir em módulos de freio atmosférico e pouso de precisão (`edl-aspire-loftid` e `edl-trn-medli2`).
- **Disputa interna de recursos entre os 4 personagens:** cada equipamento instalado altera o tripé **Custo ($) × Massa (kg) × Energia (W) × Banda/Dados (Mb–Gb)** e ativa ou protege a equipe contra **eventos reais** durante o voo e na superfície.

---

## 2. Catálogo por personagem (16 módulos)

Legenda dos marcadores (regra de dados reais em [AGENTS.md](../../AGENTS.md) §7):
- `⚠` = valor proveniente de fonte secundária / resumo ou com divergência entre fontes (conferir antes de exibir como fato fixo em texto ao jogador).
- `n/f` = não encontrado em fontes públicas (usar valor balanceado do jogo).
- `derived` = calculado a partir de dados reais com fonte.

### A. Helena — Comandante e Piloto *(Massa, Órbita, Navegação e EDL)*

| ID do módulo | Nome no jogo | Base real | Tier | Massa / Energia reais | Minigame(s) que desbloqueia | Eventos e consequências no jogo |
|---|---|---|---|---|---|---|
| `truss-ingenuity` | **Baia do Helicóptero Batedor** | **Ingenuity** (`EN9`, `E1`), **SkyFall** (`EN9b`) / **Mars Chopper** (`EN9c`) | 2 | **1,8 kg** (Ingenuity) ou ~36 kg ⚠ (Mars Chopper); **~350 W** em voo; **\$80M + \$5M ops** (`E1`) | **H-S1 ("Batedor" — MVP)**: reconhecimento aéreo com bateria de ~90 s/sol | Revela obstáculos, rochas-alvo e gelo (`SkyFall`) para a Maya. Risco real: *"Navegação perdida sobre areia lisa"* (`E1`, voo 6 e queda final no voo 72). Depende do relay do Oscar (`O-S1`). |
| `edl-trn-medli2` | **Módulo de Pouso de Precisão & Sensores EDL** | **TRN / Lander Vision System `LCAM`** (`EN4`) + **MEDLI2** (`EN6`) + **DSAC** (`E20`) | 2 | Câmera LCAM **~0,88 kg ⚠** / **< 10 W ⚠**; **28 sensores** MEDLI2 (`EN6`); relógio atômico `DSAC` (~25 cm, deriva **< 4 ns** em 20+ dias, `E20`) | **H-S2 ("Ache o lugar seguro")** na descida de 7 min e bônus térmico em **H-O1 ("Aerofrenagem")** | Reduz erro de pouso de centenas de metros para **~5 m** (Perseverance `EN4`), evitando dias perdidos dirigindo até o alvo. Previne a falha catastrófica de sensor de altitude (*Schiaparelli* `E16`) e erro de unidades na inserção (*Mars Climate Orbiter* `E15`). |
| `edl-aspire-loftid` | **Morteiro Supersônico & Escudo Inflável** | Paraquedas **21,5 m ASPIRE** (`EN5`) + **LOFTID HIAD** (`EN7`) | 3 | Paraquedas **~82 kg** (`180 lb`, abre a **11 km / 1.512 km/h**, `EN5`); veículo teste LOFTID **~1.100 kg ⚠** (escudo 6 m; Marte exige **≥ 20 m ⚠**, `EN7`) | Aumenta o **limite máximo de massa de pouso** na Fase 4/6 | Sem este módulo, foguetes com muitos estágios científicos ou habitacionais sofrem avaria ou fracassam no pouso em Marte devido ao ar rarefeito (~6,36 mbar, `0,6%` da Terra). |
| `attitude-reaction-wheels` | **Conjunto de 4 Rodas de Reação & Star Trackers** | **Kepler** / **MRO** / **Dawn** (`E18`, `E8`, `G4`) | 1 | **~2–5 kg/roda ⚠**, **~10–30 W/roda ⚠** (4 rodas: 3 ativas + 1 reserva inclinada) | **H-O2 ("Virar a nave")**: rolagem de 120° em órbita para o radar `SHARAD` (`M-O2`) | Economiza hidrazina de controle de atitude e protege contra *"Falha na roda de reação"* (*Kepler/K2* `E18`, *Dawn* `E8`, *Hayabusa* `G4`), permitindo continuar a missão se 1 ou 2 rodas falharem. |

---

### B. Lucas — Engenheiro de Sistemas *(Energia, Criogenia, ISRU e Perfuração)*

| ID do módulo | Nome no jogo | Base real | Tier | Massa / Energia reais | Minigame(s) que desbloqueia | Eventos e consequências no jogo |
|---|---|---|---|---|---|---|
| `power-rosa-solar` | **Casulos de Painéis Solares Enroláveis** | **ROSA / iROSA** (ISS `E5`, **DART** `E10`) + solares marcianos (`EN3a`) | 2 | **~36–43 kg ⚠** (versão leve); gera **~2,84 kW `derived`** em Marte limpo (de **6,6 kW** no DART × **43%** sol marciano `586 W/m²`); InSight deu **600–700 W** limpo → **200–300 W** com poeira | **L-O1 ("Desenrolar" — MVP)**: abertura em órbita na tensão correta | Alta energia por kg, mas vulnerável ao evento *"Painel trava ao retrair"* (`ROSA 2017` `E5` ⚠) e sofre forte degradação em *"Tempestade global de poeira"* (*Opportunity* `G6`, *InSight* `G9`, *Zhurong*). |
| `power-mmrtg-kilopower` | **Gerador Nuclear & Banco de Baterias Li-ion** | **MMRTG** + **Baterias Li-ion** (Perseverance `EN3b`, `EN3d`, `E6`) / **Kilopower `KRUSTY`** (`EN3c`) | 3 | MMRTG **45 kg** (`4,8 kg PuO₂`, **~110 W** elétricos + **~2 kW** térmicos ⚠) + baterias **26,5 kg** (**~900 W pico**); Kilopower **~150–400 kg ⚠**, **1–10 kW** (`<$20M ⚠`) | Sustenta operações pesadas sem apagão | **Imune à noite marciana e tempestades de poeira.** Evita que o pico de 300 W do `MOXIE` (`L-S1`) desligue o laboratório da Maya (`SHERLOC` / `PIXL`). |
| `isru-moxie-rodwell` | **Reator ISRU de Oxigênio & Extrator de Gelo** | **MOXIE** (Perseverance `EN1`, `E2`) + **Rodwell** (`EN2`) | 2 | MOXIE **17,1 kg**, **300 W** (~1 kWh/rodada ⚠, **800 °C**); produziu **122 g O₂** (pico **12 g/h**). Rodwell **~210 kg** (`24,3 L` água em 12 h, `EN2`) | **L-S1 ("Fazer oxigênio" — MVP)**: manter forno a ~800 °C na zona verde | Gera O₂ para respiração e propelente de retorno, mas disputa bateria com a Maya (`300 W`). O `Rodwell` só funciona se `PH6`, `PH7` ou `SkyFall` tiverem mapeado gelo enterrado (`EN2`). |
| `drill-corer-cryo` | **Torre de Perfuração & Criocooler Ativo** | Broca **Curiosity / ExoMars 2 m** (`GE6`) + **HP3** (`G9`) + **CRISM/AMS-02** (`GE8`, `P8`) | 2 | Torreta **33–45 kg** (`GE6`, **2 brocas reserva** no Curiosity); resfriador `CRISM` **32,9 kg**, **44–47 W** (`GE8`) | **L-S2 ("Furar sem quebrar")** no solo e **L-O2 ("Criogenia")** em órbita | Gera amostras de rocha/pó para os tubos da Maya (`M-S4`). Ocupa o braço robótico. Contém proteção contra *"Solo traiçoeiro"* (*toupeira HP3* parada a 37 cm, `G9`) e permite reparo em EVA para *"Falha na bomba térmica"* (*AMS-02* `P8`). |

---

### C. Oscar — Especialista de Dados e Telecom *(Dados e Comunicação)*

| ID do módulo | Nome no jogo | Base real | Tier | Massa / Energia reais | Minigame(s) que desbloqueia | Eventos e consequências no jogo |
|---|---|---|---|---|---|---|
| `comm-dsoc-laser` | **Transceptor Óptico a Laser de Espaço Profundo** | **DSOC** (sonda *Psyche* `EN13`, `E11`) | 3 | **< 29 kg ⚠**, abertura **22 cm**, **~76 W (< 100 W) ⚠**; **267 Mbps** (31M km) a **~8 Mbps** (400M km), **13,6 Tb** entregues (`E11`) | **O-O1 ("Feixe estável" — MVP)**: manter a mira do feixe enquanto a nave vibra | Esvazia rapidamente as fotos gigantes da `HiRISE` (28 Gb) e radargramas do `SHARAD` (40–90 Gb/dia). Sofre interrupção se houver **nuvens sobre a estação receptora na Terra** (`EN13`). |
| `comm-electra-marco` | **Rádio Relay UHF & Par de CubeSats MarCO** | **Electra UHF** (`EN11`) + **MarCO-A/B 6U** (`EN14`, `E12`) | 2 | Electra **~6,5 kg ⚠**, **~20–50 W ⚠**, até **2 Mbps** (`>1 Gbit/sol` em 4–5 passagens); MarCO **2 × 6U** (`$18,5M`, **8 kbps** ao vivo na EDL) | **O-S1 ("Janela de contato" — MVP)**: priorizar pacotes antes da passagem fechar | Protege a missão contra o evento real **"Orbitador perdido"** (**MAVEN perdido em dez/2025**, que cortou **897,5 Mb/dia** de toda a frota, restando `~3,2 Gb/dia`, `mars-experiments.md` §2.2) e *"Antena travada"* (*Galileo* `CD1`). |
| `comm-rise-xband` | **Transponder Banda X de Rádio-Geodésia** | **RISE** (lander InSight `PH3`) | 1 | **7,3 kg**, **78 W** por `≤ 1 h/dia`; mede variações de **< 10 cm** via DSN | **O-S2 ("Sintonizar o Doppler")**: travar o tom de rádio com a Terra | Revela o **núcleo líquido de Marte (`1.835 ± 55 km`)** e aceleração da rotação (`~4 mas/ano`), mas exige link direto e missão longa (`~900 sóis`). |
| `data-rad750-ssr` | **Computador de Voo RAD750 & Gravador Solid-State** | **RAD750 SBC** + arquitetura de recorte/compressão **Kepler / Galileo** (`A2`, `CD1`, `CD2`, `O-O2`) | 2 | Processador **~5–10 W ⚠** (`110–200 MHz`); compressão da Galileo recuperou **~10×** retorno científico (`CD1`) | **O-O2 ("Recorte inteligente")**: escolher quais pixels da foto enviar | Amplia a memória de bordo (Gb) para sobreviver à **Conjunção Solar** (blecaute de **2–3 semanas** a cada ~26 meses, `mars-experiments.md` §1) e à fila de download lento (`CD2`). |

---

### D. Maya — Cientista de Missão e Oficial Médica *(Valor Científico e Segurança da Tripulação)*

| ID do módulo | Nome no jogo | Base real | Tier | Massa / Energia reais | Minigame(s) que desbloqueia | Eventos e consequências no jogo |
|---|---|---|---|---|---|---|
| `sci-hirise-sharad` | **Pacote Orbital: Telescópio, Radar & Gases-Traço** | **HiRISE** (`GE7`) + **SHARAD** (`PH7`) + **NOMAD / ACS** (`BI3`) | 3 | HiRISE **65 kg / 60 W** (`30 cm/px`, **28 Gb/foto**); SHARAD **15 kg / 10 W** (**40–90 Gb/dia**); NOMAD/ACS **~29–35 kg ⚠ / 30–60 W ⚠** | **M-O1 ("Clique perfeito" — MVP)**, **M-O2 ("Ler o radargrama")**, **M-O3 ("Impressão digital do gás")** | Desbloqueia locais de pouso seguros (`EN4`) e gelo enterrado (`14.300 km³` estilo Utopia, `PH7`) para o `Rodwell` (`EN2`). Ativa o evento *"Dados em conflito"* (TGO `< 0,05 ppbv` metano vs Curiosity `0,2–0,7 ppb`, `BI3`). |
| `sci-pixl-sherloc-supercam` | **Bancada de Astrobiologia & Laser de Rochas** | **PIXL** (`GE3`) + **SHERLOC** (`BI1`, `B14`) + **SuperCam** (`GE2`, `PH11`) | 3 | Total **22,22 kg `derived`** (`6,9 + 4,72 + 10,6 kg`); **25 W / 48,8 W / 17,9 W**; `16 + 79,7 + 15,5 Mb/exp` | **M-S1 ("Manchas de leopardo" — MVP)** e **M-S2 ("Tiro certeiro" >7 m)** | Gera a **maior pontuação científica** (*bioassinatura em Cheyava Falls*, jul/2024–2025 `B14`), mas **só pontua se guardada em tubo** (`M-S4`). Evita o evento de *"Falso positivo de vida"* (*Viking* `B13`). |
| `sci-seis-caching` | **Domo Sismômetro & Carrossel de 43 Tubos** | **SEIS** (`PH2`, `G9`) + **Sample Caching System / ACA** (`43 tubos`, `GE6`, `G8`) | 2 | SEIS **29,5 kg ⚠** (`≤ 8,5 W`, `38 Mb/dia`, `1.319 marsquakes`); 43 tubos de titânio **< 57 g vazio cada ⚠** (`10–15 g` núcleo) | **M-S3 ("Sismograma")** *(só lander parado)* e **M-S4 ("Quais rochas guardar?")** | **Obrigatório para validar e armazenar** as amostras da broca (`L-S2`) e de bioassinaturas (`M-S1`). Remete ao evento *"Missão de retorno cancelada"* (*MSR orçamento 2026 = \$0 ⚠*, `G8`). |
| `hab-veggie-rad-astrorad` | **Estufa Hidropônica & Kit Anti-Radiação** *(tripulada)* | **Veggie / APH** (`BI7`, `B4`) + **RAD** (`PH1`, `P10`) + **AstroRad** (`BI11`) | 2 | Veggie **~7,2 kg ⚠** (`~70–115 W ⚠`); RAD **1,56 kg / 4,2 W**; AstroRad **~26 kg/tripulante** (`-40 a -60% ⚠` dose solar) | **M-S5 ("Abrigo!")** e **M-S6 ("Fazer brotar")** *(cenário tripulado)* | Protege contra *"Tempestade Solar"* (viagem `~1,8 mSv/dia`, solo `~0,67 mSv/dia`, `~1 Sv` em 500 dias, `PH1`) e *"Estresse hídrico / sementes não germinam"* (`B4`), reduzindo massa de comida e preservando saúde. |

---

## 3. Presets de Missão para Montagem do Foguete (1 a 7 Estágios)

Como guia rápido para testar o balanceamento no MVP (3–4 estágios) até missões avançadas (6–7 estágios):

### Missão 1 (MVP) — *Caçadores de Bioassinaturas em Jezero* *(4 estágios do meio)*
- **Objetivo:** Encontrar uma potencial bioassinatura como *Cheyava Falls*, perfurar o núcleo e selar a amostra antes do retorno/depósito, mantendo comunicação e energia estáveis.
- **Módulos recomendados (1 por estágio):**
  1. `power-rosa-solar` (Lucas — `L-O1` energia solar em órbita/solo)
  2. `comm-electra-marco` (Oscar — `O-S1` relay UHF + respaldo de EDL)
  3. `truss-ingenuity` (Helena — `H-S1` batedor aéreo revelando alvos) ou `edl-trn-medli2` (`H-S2` pouso de precisão)
  4. `sci-pixl-sherloc-supercam` (Maya — `M-S1` bioassinaturas) — *em versão de 5–6 estágios, somar `drill-corer-cryo` (`L-S2`) + `sci-seis-caching` (`M-S4`) para fechar a cadeia completa de amostragem!*

### Missão 2 — *Geofísica Profunda & Caça ao Gelo Subterrâneo* *(5 estágios do meio)*
- **Objetivo:** Mapear reservas de água enterrada da órbita, fazer rolagem de radar, pousar com precisão e medir a estrutura interna de Marte.
- **Módulos recomendados:**
  1. `attitude-reaction-wheels` (Helena — `H-O2` rolagem de 120° para o radar)
  2. `sci-hirise-sharad` (Maya — `M-O1` foto + `M-O2` radar de gelo)
  3. `comm-dsoc-laser` (Oscar — `O-O1` laser para escoar `40–90 Gb/dia` do SHARAD)
  4. `sci-seis-caching` (Maya — `M-S3` sismômetro `SEIS`) + `comm-rise-xband` (Oscar — `O-S2` núcleo líquido)
  5. `drill-corer-cryo` (Lucas — `L-O2` criocooler + `L-S2` perfuração)

### Missão 3 — *Precursora Humana ISRU & Clima Espacial* *(7 estágios do meio — carga máxima)*
- **Objetivo:** Sustentação de missão tripulada com produção de O₂ e água, proteção contra tempestades solares e poeira global, e pouso de carga pesada.
- **Módulos recomendados (ocupa todos os 7 slots):**
  1. `edl-aspire-loftid` (Helena — garante sobrevivência na EDL com 7 estágios de massa)
  2. `edl-trn-medli2` (Helena — `H-S2` pouso a 5 m do gelo/base)
  3. `power-mmrtg-kilopower` (Lucas — energia nuclear imune a tempestades de poeira para sustentar o MOXIE)
  4. `isru-moxie-rodwell` (Lucas — `L-S1` oxigênio a `300 W` + extração de água do gelo)
  5. `comm-dsoc-laser` **ou** `data-rad750-ssr` (Oscar — link óptico + memória contra conjunção solar de 2–3 semanas)
  6. `sci-hirise-sharad` (Maya — mapeamento orbital de gelo para o `Rodwell` + alerta meteorológico)
  7. `hab-veggie-rad-astrorad` (Maya — `M-S5` alerta solar `RAD` + `AstroRad` + `M-S6` estufa `Veggie`)
