# 3 Missões em Marte — Maya (Cientista de Missão e Oficial Médica)

## Por que a Maya é a melhor escolha para o MVP?

Dentre os 4 personagens definidos em [characters.md](characters.md), **Maya** (**Geologia Planetária & Astrobiologia / Medicina Espacial**) é a que tem **maior potencial imediato** para integrar os datasets da NASA na **Fase 7 (Exploração de Marte)**:

1. **Conexão direta com os datasets mais ricos da NASA:** Coordenadas e amostras reais da Cratera Jezero (*Perseverance*), clima/poeira/radiação (*MEDA/REMS/RAD*) e morfologia de solo (*MOLA/HiRISE*).
2. **Alinhamento com o escopo de MVP:** Em [space-mission-game-transcricao-organizada.md](space-mission-game-transcricao-organizada.md#L209), definiu-se que **3 missões** já fecham o ciclo completo do MVP.
3. **Fecha o loop de causa e efeito:** As missões da Maya dependem dos instrumentos comprados na **Fase 3 (Construção)**, sofrem efeito do clima real da NASA na **Fase 7** e adicionam **peso real de amostras** que impacta a decolagem de retorno!

---

## Pré-requisitos de Interface (Compartilhados pelas 3 Missões)

* **Menu Lateral Esquerdo:** Lista as 3 missões da Maya. Clicar em uma missão ativa o marcador dela.
* **Bússola no Topo (estilo PUBG/Fortnite):** Mostra graus (`0°–360°`), direção e distância em metros até o ponto real do dataset selecionado.
* **Inventário Inferior:** Exibe o instrumento/ferramenta equipado (ex.: *Laser Spectrometer*, *Rock Corer*, *Radiation Dosimeter*) e as amostras coletadas.
* **Timer da Missão (Sol Limit):** Contagem regressiva antes da janela de retorno à nave fechar.

---

## Missão 1 — *Biosignature Hunt at Cheyava Falls* (Geologia & Astrobiologia)

* **Inspiração Real:** Em julho de 2024, o rover *Perseverance* perfurou a rocha *Cheyava Falls* (amostra #25, *Sapphire Canyon*) na Cratera Jezero e encontrou "manchas de leopardo" com fosfato de ferro e sulfeto de ferro — uma potencial bioassinatura ([mars-experiments.md](mars-experiments.md#L328-L329)).
* **Dataset Integrado:** `mars_targets.json` (Coordenadas reais na borda de *Neretva Vallis*, composição química e massa do testemunho de rocha).
* **Dependência da Construção (Fase 3):**
  * **Exige:** *Rock Corer / Drill* ou *UV Raman Spectrometer (SHERLOC)* instalado no Slot de Ciência.
  * *Sem o instrumento avançado:* Maya só consegue fazer análise visual superficial (rende 40% dos pontos).
* **Passo a Passo da Jogabilidade (3D):**
  1. Selecionar a missão no menu lateral $\rightarrow$ seguir o marcador na bússola até a formação rochosa *Cheyava Falls*.
  2. Pressionar interação (`E`) para posicionar o espectrômetro/broca.
  3. **Ação rápida:** Manter o feixe estabilizado por alguns segundos (ou aguardar a leitura) enquanto o scanner consome energia da bateria do traje.
  4. O HUD exibe o dado real do dataset (*"Vivianite & Greigite detected — Potential Biosignature"*).
  5. Maya decide se **coleta a amostra física** (`+15 kg` no inventário / nave para o retorno) ou **apenas transmite os dados** pela antena da nave (sem peso extra, mas depende da banda do **Oscar**).
* **Pontuação / Recompensa:** Alto valor científico (`+400 pts` se retornar com a amostra física para a Terra; `+200 pts` se apenas transmitir os dados).

---

## Missão 2 — *Dust & Radiation Field Calibration* (Medicina Espacial & Clima)

* **Inspiração Real:** Sensores *MEDA* (clima e poeira) e *RAD* (radiação na superfície de Marte: $\sim 0,67\text{ mSv/dia}$), essenciais para manter astronautas vivos ([mars-experiments.md](mars-experiments.md#L145-L150)).
* **Dataset Integrado:** `mars_weather_sols.json` (Temperatura mínima/máxima, pressão atmosférica, velocidade do vento e índice de opacidade de poeira de um Sol real da NASA).
* **Dependência da Construção (Fase 3):**
  * **Exige:** *Weather & Radiation Kit (MEDA/RAD)* no Slot de Ciência ou Suporte à Vida.
  * A eficiência dos **Painéis Solares** da nave (escolhidos na Fase 3) é multiplicada pelo índice de poeira lido desse dataset.
* **Passo a Passo da Jogabilidade (3D):**
  1. Seguir a bússola até uma área aberta e elevada (fora da sombra de crateras/rochas).
  2. Instalar a estação portátil de medição no solo (`E`).
  3. **Evento Dinâmico do Dataset:** Se o Sol real sorteado no dataset tiver vento alto (`> 15 m/s`) ou poeira alta, a visibilidade cai e o traje consome mais bateria para aquecimento.
  4. Maya precisa completar a leitura de 3 pontos próximos (ou calibrar o sensor mantendo-o protegido do vento) e retornar ao alcance da nave antes que a dose de radiação/frio exceda o limite seguro.
* **Pontuação / Recompensa:** `+250 pts` + **Bônus de Segurança da Tripulação** (reduz penalidade de saúde/radiação de toda a equipe no Placar Final).

---

## Missão 3 — *Buried Water Ice Survey* (Geologia & Suporte à Vida / ISRU)

* **Inspiração Real:** A descoberta de gelo de água raso logo abaixo do solo marciano (missão *Phoenix* e radar *SHARAD/RIMFAX*), fundamental para produzir água e combustível para o retorno ([mars-experiments.md](mars-experiments.md#L166-L188)).
* **Dataset Integrado:** `mars_targets.json` + `mola_elevation_sample.json` (Elevação real do terreno e profundidade estimada de gelo/hidrogênio equivalente em água).
* **Dependência da Construção (Fase 3):**
  * **Exige:** *Ground-Penetrating Radar (RIMFAX)* ou *Neutron Water Detector (DAN)*.
  * Se a nave não tiver radar, Maya precisa procurar manualmente em 3 crateras usando apenas a pá de coleta, gastando muito mais tempo do relógio da missão.
* **Passo a Passo da Jogabilidade (3D):**
  1. Seguir a bússola até a zona de depressão/cratera indicada pelo mapa de elevação (MOLA).
  2. Ativar o radar de subsolo enquanto caminha pela área demarcada até o sinal atingir o pico (feedback visual/sonoro estilo "detector de metais" usando os dados de profundidade do dataset).
  3. Ao encontrar o depósito de gelo raso, escavar/coletar uma amostra selada antes que o gelo sublime (ou marcar o ponto com um *beacon* para extração futura).
  4. Levar a cápsula refrigerada de volta para o compartimento da nave antes do fim do timer.
* **Pontuação / Recompensa:** `+350 pts` + **Bônus de Engenharia** (se coletado a tempo, reduz o consumo de oxigênio/água da equipe na viagem de volta).

---

## Resumo de Estrutura de Dados para Codar Hoje (GDScript / JSON)

Para agilizar a programação na Godot ainda hoje, todas as 3 missões podem usar uma **única estrutura genérica de missão (`MissionPoint.gd`)** alimentada por JSON:

```json
{
  "missions": [
    {
      "id": "maya_m1_cheyava",
      "title": "Analyze Cheyava Falls Rock",
      "character": "MAYA",
      "dataset_source": "NASA Mars 2020 Perseverance",
      "real_coords": { "lat": 18.38, "lon": 77.58 },
      "map_pos_xz": [42.0, -65.0],
      "required_part_id": "SCIENCE_DRILL_OR_RAMAN",
      "interaction_type": "SCAN_AND_COLLECT",
      "sample_mass_kg": 15.0,
      "base_points": 400,
      "nasa_fact": "Vivianite and greigite detected in Jezero Crater mudstone."
    },
    {
      "id": "maya_m2_weather",
      "title": "Calibrate MEDA/RAD Station",
      "character": "MAYA",
      "dataset_source": "NASA MEDA / REMS Sol Telemetry",
      "real_coords": { "lat": 18.44, "lon": 77.45 },
      "map_pos_xz": [-30.0, 48.0],
      "required_part_id": "SCIENCE_WEATHER_RAD",
      "interaction_type": "DEPLOY_SENSOR",
      "sample_mass_kg": 0.0,
      "base_points": 250,
      "nasa_fact": "Surface radiation averages ~0.67 mSv/day; dust cuts solar output."
    },
    {
      "id": "maya_m3_ice",
      "title": "Locate Subsurface Water Ice",
      "character": "MAYA",
      "dataset_source": "NASA MOLA & RIMFAX Subsurface Data",
      "real_coords": { "lat": 18.50, "lon": 77.62 },
      "map_pos_xz": [75.0, 20.0],
      "required_part_id": "SCIENCE_GPR_RADAR",
      "interaction_type": "RADAR_SWEEP",
      "sample_mass_kg": 10.0,
      "base_points": 350,
      "nasa_fact": "Shallow subsurface water ice detected via radar and neutron spectroscopy."
    }
  ]
}
```

### Checklist Rápido de Implementação (Hoje)
1. **Autoload `MarsDataset.gd`:** Carrega o JSON no `_ready()` e expõe os pontos da missão e os parâmetros do Sol atual (temperatura/poeira).
2. **Bússola UI (`CompassHUD.gd`):** Calcula o ângulo entre o vetor `forward` da câmera/Maya e o `map_pos_xz` da missão selecionada no menu lateral.
3. **Prefab `MissionZone3D.tscn`:** Um `Area3D` reutilizado para as 3 missões que lê o `id` da missão, mostra o prompt `[E] Interact`, executa um progresso de 3–5 segundos e registra conclusão + peso no `ShipState`.
