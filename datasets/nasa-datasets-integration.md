# Integração de Datasets Reais da NASA (`data.nasa.gov`)

Este documento organiza os datasets reais da NASA recomendados para o **Space Mission Game** e define como cada um deles altera **regras, falhas, equilíbrio de recursos e objetivos** ao longo das fases do jogo, evitando que os dados sejam apenas texto decorativo.

> **Estratégia recomendada para o Hackathon (MVP):** Em vez de depender de APIs externas ao vivo durante a apresentação, baixe **2 ou 3 datasets em CSV/JSON** do portal [`data.nasa.gov`](https://data.nasa.gov/) (e/ou NASA PDS) e embarque versões enxutas diretamente no repositório, junto do jogo web.

---

## 1. Mapa de Integração por Fase do Jogo

| Dataset NASA | O que fornece | Onde entra no fluxo | Impacto direto no Gameplay |
| :--- | :--- | :--- | :--- |
| **1. Mars 2020 Perseverance / MSL Targets** | Coordenadas reais, nomes de alvos e composição mineral/orgânica | **Fase 7** (Exploração de Marte) | Alimenta a bússola (estilo PUBG) e os resultados reais das análises da tripulação. |
| **2. REMS (Curiosity) / MEDA (Perseverance) Weather** | Temperatura ($\text{°C}$), pressão ($\text{Pa}$), vento e opacidade de poeira por Sol | **Fases 6 e 7** (Superfície de Marte) | Reduz eficiência dos painéis solares em dias de poeira e aumenta gasto de bateria térmica dos trajes. |
| **3. MOLA Elevation / HiRISE Terrain** | Altitude real ($\text{m}$), relevo (*heightmap*) e rugosidade do solo | **Fases 4 e 7** (Prep. de Pouso e Mapa 3D) | Define se o paraquedas escolhido aguenta frear a nave naquela altitude e gera o relevo/cor de Marte. |
| **4. DONKI (Space Weather) + Curiosity RAD** | Histórico de ejeções solares ($\text{km/s}$) e dose de radiação ($\text{mSv/dia}$) | **Fase 6** (Viagem até Marte) | Dispara eventos de tempestade solar reais durante o cruzeiro, exigindo tarefas internas dos 4 papéis. |
| **5. NASA Lessons Learned (LLIS)** | Catálogo histórico de falhas reais de engenharia em missões | **Fases 5 e 8** (Decolagem e Placar Final) | Resolve o "porquê" de falhas por excesso de peso/falta de energia e gera cards educativos no relatório final. |

---

## 2. Detalhamento Criativo dos 5 Datasets

### 2.1. Coordenadas e Amostras Reais em Marte (Mars 2020 / MSL)
* **Origem:** *Mars 2020 Perseverance Sample Caching* / *MSL Curiosity ChemCam Targets* (`data.nasa.gov` / NASA PDS).
* **Mecânica no jogo:**
  * A **bússola no topo da tela** aponta para **coordenadas reais da Cratera Jezero** convertidas para o mapa 3D plano (ex.: *Cheyava Falls*, *Three Forks Depot*, *Belva Crater*).
  * Ao clicar em uma missão no menu lateral esquerdo, o marcador aparece na bússola e no terreno 3D.
  * Quando o experimento é concluído, o jogo lê o registro real do dataset e exibe a descoberta científica autêntica (ex.: presença de fosfato de ferro, sulfatos hidratados ou carbonatos).

### 2.2. Clima Vivo de Marte — Sol a Sol (REMS / MEDA)
* **Origem:** *Rover Environmental Monitoring Station (REMS)* e *Mars Environmental Dynamics Analyzer (MEDA)*.
* **Mecânica no jogo:**
  * Ao pousar em Marte, o jogo sorteia ou seleciona um **Sol real** do dataset (ex.: `Sol 1240: Min -82°C / Max -18°C | Pressão 740 Pa | Opacidade Poeira: Alta`).
  * **Efeito nos Painéis Solares:** A luz solar em Marte já é ~43% da Terra; se o Sol sorteado tiver alta opacidade de poeira, a geração dos painéis solares cai mais **40%**.
  * **Efeito no Tempo/Bateria dos Trajes:** Temperaturas mais extremas drenam mais rápido a bateria térmica dos astronautas na superfície, pressionando o retorno à nave antes do prazo.

### 2.3. Topografia e Densidade Atmosférica no Pouso (MOLA / HiRISE)
* **Origem:** *MOLA (Mars Orbiter Laser Altimeter) Digital Elevation* / *HiRISE Terrain Classification*.
* **Mecânica no jogo:**
  * Na **Fase 4 (Preparação para Marte e Pouso)**, a altitude da região de pouso define a densidade do ar.
  * Áreas mais altas têm ar mais fino: se a nave estiver pesada e o jogador não tiver equipado **frenagem atmosférica / paraquedas adequado**, a aterrissagem causa dano estrutural na nave.
  * **Visual 3D:** O *heightmap* e a paleta cromática do terreno da Fase 7 podem ser derivados diretamente dos dados topográficos e orbitais da NASA.

### 2.4. Tempestades Solares na Viagem (DONKI + Curiosity RAD)
* **Origem:** *DONKI (Space Weather Database)* e medições do detector *RAD* ($\sim 1,8\text{ mSv/dia}$ em cruzeiro).
* **Mecânica no jogo:**
  * Durante a viagem até Marte, eventos de ejeção de massa coronal reais (com data e velocidade reais do dataset) disparam alertas dentro da nave.
  * A tripulação precisa agir em tempo real: **Lucas** redireciona energia para proteção, **Oscar** corrige corrupção de dados no computador de bordo e **Maya** monitora o limite de radiação da equipe.

### 2.5. Falhas Reais de Engenharia (NASA Lessons Learned - LLIS)
* **Origem:** *NASA Lessons Learned Information System (LLIS)*.
* **Mecânica no jogo:**
  * Conecta diretamente os erros da **Fase 3 (Construção do Foguete)** a consequências reais.
  * Se o foguete decolar acima da massa ideal ou com energia insuficiente, o sistema associa a falha a um registro real do LLIS e apresenta no relatório final: *"O que aconteceu na sua nave vs. o que aconteceu na história da NASA"*.

---

## 3. Combinação Mínima Viável (Para fechar o MVP hoje)

Para codificar rápido sem comprometer a obrigação do hackathon, o **combo mínimo de ouro** é embarcar **2 arquivos JSON locais** no jogo:

1. `res://data/mars_targets.json` *(Extraído de Mars 2020 / MOLA)* — Coordenadas, altitude, tipo de rocha, massa da amostra e valor científico para a bússola e missões de superfície.
2. `res://data/mars_weather_sols.json` *(Extraído de REMS / MEDA)* — 10 a 20 linhas reais de Sol marciano com temperatura, pressão, vento e índice de poeira para ditar energia e dificuldade na superfície.

Com apenas esses dois arquivos, o jogo já usa dados reais da NASA para **navegação, ciência, geração de energia e risco operacional**.
