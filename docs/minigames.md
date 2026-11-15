# Experimentos e Minigames por Personagem

Este documento escolhe, para cada personagem de [characters.md](characters.md), os **experimentos reais** que combinam com a especialidade dele. Os experimentos estão separados entre **órbita** (feitos da órbita de Marte) e **solo** (feitos depois do pouso), e cada um vira um **minigame simples**.

Todos os números vêm de missões reais. Os dados completos e as fontes estão em:

- [mars-experiments.md](../references/experiments/mars-experiments.md): o catálogo de Marte. Os códigos entre crases, como `EN10`, apontam para lá.
- [experiments.md](../references/experiments/experiments.md): o histórico geral.
- [minigames/](../references/experiments/minigames/): especificação dos modelos 3D e animações de cada minigame de solo do MVP (H-S1, L-S1, O-S1, M-S1), no formato das peças do foguete ([_template.md](../references/experiments/minigames/_template.md)).

---

## Regras gerais

1. **Cada experimento tem um custo real.** Ele pesa no lançamento (**massa**), consome **energia** quando roda e gera **dados** que precisam ser transmitidos. É isso que obriga a equipe a negociar (veja a matriz em [characters.md](characters.md)).
2. **O dono do experimento joga o minigame.** O resultado afeta os recursos dos outros personagens.
3. **O resultado vale de 0 a 3 estrelas**, que multiplicam a recompensa (pontos de ciência, dados, energia, etc.).
4. **Falhar traz uma consequência inspirada em um caso real**, nunca só "game over".
5. **Ao final, aparece um card "Fato real"** explicando o que aconteceu na missão de verdade. Isso atende ao objetivo educacional do desafio ([description.md](description.md)): explicar *por que* uma decisão afeta a missão.
6. **Os experimentos de órbita só ficam disponíveis com um orbitador.** Os de solo exigem lander ou rover, e por isso passam pelo pouso.

---

## Resumo

A coluna **Candidato a MVP** marca 1 minigame de órbita e 1 de solo por personagem, 8 no total.

| ID | Personagem | Onde | Experimento | Base real | Mecânica | Candidato a MVP |
|---|---|---|---|---|---|---|
| H-O1 | Helena | Órbita | Aerofrenagem | MRO, TGO | Manter na faixa | Sim |
| H-O2 | Helena | Órbita | Rolagem para o radar | MRO (2025) | Pilotagem | Não |
| H-S1 | Helena | Solo | Rota de escolta | Reconhecimento / Ingenuity | Planejamento de rota | Sim |
| H-S2 | Helena | Solo | Pouso de precisão | Perseverance (TRN) | Escolha sob limite | Não |
| L-O1 | Lucas | Órbita | Painel solar enrolável | ROSA / iROSA | Timing | Sim |
| L-O2 | Lucas | Órbita | Manter o detector frio | CRISM (MRO) | Manter na faixa | Não |
| L-S1 | Lucas | Solo | Forno de oxigênio | MOXIE | Manter na faixa | Sim |
| L-S2 | Lucas | Solo | Perfuração | Broca do Curiosity, HP3 | Timing (ritmo) | Não |
| O-O1 | Oscar | Órbita | Laser para a Terra | DSOC (Psyche) | Mira | Sim |
| O-O2 | Oscar | Órbita | Compressão de imagem | Kepler, Galileo | Escolha sob limite | Não |
| O-S1 | Oscar | Solo | Passagem do orbitador | Relay UHF (Electra) | Escolha sob limite | Sim |
| O-S2 | Oscar | Solo | Rádio-geodésia | RISE (InSight) | Manter na faixa | Não |
| M-O1 | Maya | Órbita | Foto de alta resolução | HiRISE (MRO) | Timing | Sim |
| M-O2 | Maya | Órbita | Radar de gelo | SHARAD (MRO) | Busca de padrão | Não |
| M-O3 | Maya | Órbita | Caçador de metano | NOMAD/ACS (TGO) | Busca de padrão | Não |
| M-S1 | Maya | Solo | Caçador de bioassinaturas | PIXL + SHERLOC | Busca de padrão | Sim |
| M-S2 | Maya | Solo | Laser nas rochas | SuperCam / ChemCam | Mira | Não |
| M-S3 | Maya | Solo | Escutar terremotos | SEIS (InSight) | Busca de padrão | Não |
| M-S4 | Maya | Solo | Escolher amostras | Tubos do Perseverance | Escolha sob limite | Não |
| M-S5 | Maya | Solo *(tripulada)* | Alerta de radiação | RAD (Curiosity) | Timing | Não |
| M-S6 | Maya | Solo *(tripulada)* | Estufa marciana | Veggie, testes em solo simulado | Manter na faixa | Não |

Maya tem mais opções porque é a cientista da missão. As de "tripulada" só entram se o cenário tiver tripulação.

---

## Mecânicas reutilizáveis

Os 21 minigames usam só **6 mecânicas base**. Implementando as mecânicas como componentes genéricos no jogo (three.js), cada minigame vira basicamente arte + parâmetros.

| Mecânica | Como funciona | Usada em |
|---|---|---|
| **Manter na faixa** | Um indicador deriva sozinho; o jogador corrige (↑/↓ ou slider) para mantê-lo na zona verde por X segundos | H-O1, L-O2, L-S1, O-S2, M-S6; já implementada na decolagem do piloto (`createKeepInRange` em `web/app.js`, 1 ou 2 eixos): manter o alvo da navball no centro em arfagem e guinada; as aletas do booster reduzem as rajadas |
| **Timing** | Um cursor oscila; o jogador aperta no momento certo (variante: ritmo) | L-O1, L-S2, M-O1, M-S5 |
| **Mira** | Manter ou acertar uma mira 2D num alvo que se move | O-O1, M-S2 |
| **Escolha sob limite** | Escolher itens com tamanho e valor para caber num limite (tempo, banda, tubos) | H-S2, O-O2, O-S1, M-S4 |
| **Busca de padrão** | Achar o sinal certo no meio do ruído: grade, gráfico ou espectro | M-O2, M-O3, M-S1, M-S3 |
| **Planejamento de rota** | Traçar um caminho contínuo em grade conectando marcos em ordem sem cruzar a rota | H-S1 |
| **Pilotagem** | Controle direto de um veículo com recurso limitado (bateria, combustível) | H-O2 |

Os 8 candidatos a MVP usam 5 mecânicas (o planejamento de rota em grade substituiu a antiga pilotagem de helicóptero em H-S1, mantendo o H-O2 fora do MVP).

---

## Fluxo de voo do MVP

As quatro etapas do cockpit têm um minigame cronometrado. Os tempos, os limites de alinhamento e as penalidades abaixo são `game-balance`; as peças usadas para montar a nave continuam vindo de `references/parts/`.

| Etapa | Dono | Minigame | Consequência |
|---|---|---|---|
| 01 · Liftoff & Max-Q | Helena | manter o alvo do navball no centro em dois eixos; a duração segue o TWR de decolagem (15 s com TWR 1,5; proporcional a 1/√(TWR − 1), entre 9 e 30 s): mais empuxo por tonelada, subida mais curta | uma ascensão ruim cria um disjuntor extra na separação. Sem motor capaz de acender no estágio 1 (sem motor, sem tanque ou propelente trocado) ou com TWR abaixo de 1,0, o foguete não sai da plataforma: a missão falha, o debriefing mostra a causa e o pódio fica vazio. Se o Δv somado não chega à órbita (9.400 m/s), a tripulação aborta no MECO: a cápsula desce de paraquedas no mar e a missão falha |
| 02 · Cabin docking | Helena | alinhar a escotilha da cabine em 3D no monitor central com `← →` (`A/D`), `↑ ↓` e `E/Q` (`W/S`), sem gastar todo o combustível | falha exibe X vermelho, custa pontos e avança para a próxima etapa |
| 03 · Orbital docking | Oscar e Maya | manter a nave alinhada com o tanque na câmera externa do monitor central; depois, transferir propelente | aproximação ruim dificulta a injeção transmarciana; a janela vencida usa captura automática com penalidade. Se nem com o tanque cheio o foguete chega aos 4.300 m/s da transferência, a tripulação volta para a Terra: a cápsula desce de paraquedas no mar e a missão falha |
| 04 · Mars landing | Helena | repetir o navball da decolagem durante o pouso em Marte | pouco tempo na faixa reduz a pontuação da missão |

**Regras da montagem que barram a missão** (as mesmas da telemetria do planejador):
- **Decolagem:** precisa de um motor no estágio 1 que acenda (com tanque do mesmo propelente) e de TWR de pelo menos 1,0.
- **Estágios superiores:** precisam de TWR no vácuo de pelo menos 0,3 na ignição (`minUpperStageTwr`, `game-balance`, estimado de estágios da classe do Centaur). Um estágio mais fraco não acende: vira peso morto, como um estágio incompleto, e o catálogo mostra o TWR que cada motor e tanque daria.
- **Δv:** precisa chegar à órbita e, reabastecido, fazer a transferência. Quando falta, a revisão de lançamento avisa ("This rocket will not reach orbit" ou "cannot reach Mars") e o botão vira "Launch anyway".

**Dificuldade** (escolhida pelo host no lobby; tabela `difficulty` em `web/app.js`, toda `game-balance`):

| | Fácil | Normal | Difícil |
|---|---|---|---|
| Orçamento | $300M (×1,2) | $250M | $200M (×0,8) |
| Tempo na superfície | 3:30 | 3:00 | 2:20 |
| Tipos de propelente | ignorados | ignorados | motor e tanque precisam do mesmo |
| Problemas de telemetria | só aviso: a missão sempre voa | podem falhar a missão | podem falhar a missão |
| Penalidades (TWR baixo, falta de energia, orçamento estourado) | nenhuma | sim | sim |
| Δv exigido (órbita / Marte) | — (só aviso) | 7.520 / 3.440 m/s (−20%) | 9.400 / 4.300 m/s |

O selo do lobby resume o nível ("$250M · 3:00 on Mars · Δv −20%"), e cada botão explica as regras ao passar o mouse.

**Telemetria do cockpit** (`updateTelemetry` em `web/app.js`), coerente com o foguete montado e com a ordem real de um voo:
- **Subida:** a velocidade segue o Δv gasto pelo foguete montado (Tsiolkovsky, estágio a estágio) e chega a 7.670 m/s numa órbita de 400 km (`derived`: √(GM/r)). A altitude é uma curva de jogo. A etapa 01 esvazia o estágio 1. Os primeiros 6 s da etapa 02 completam a subida com o estágio de cima. A leitura de propelente é a do tanque do estágio que está queimando.
- **Órbita:** motores desligados. O reabastecimento enche o tanque do estágio que vai a Marte.
- **Pouso:** o perfil de entrada, descida e pouso (EDL) do Perseverance comprimido no minigame, com dados reais de `references/experiments/mars-experiments.md`. Entrada a 125 km e 19.500 km/h; paraquedas a 11 km e 1.512 km/h; retrofoguetes a partir de 2,1 km; toque no solo a ~0 m/s. O tanque de descida só é gasto com os retrofoguetes.
- **Radiação:** só aparece em Marte, com a mediana real do RAD do Curiosity em período calmo (165 µGy/dia, detector E). Marte só aparece na janela nesta etapa.

---

## 1. Helena: Comandante e Piloto

**Recursos:** Massa, Órbita, Orçamento. Os experimentos dela são **manobras e voos**: tecnologias que foram testadas de verdade em Marte.

### Órbita

#### H-O1 · Aerofrenagem (candidato a MVP)
- **Base real:** MRO (2006) e TGO (2017–18) · `EN10`
- **O que é:** usar o atrito da atmosfera de Marte para frear a nave e baixar a órbita, em vez de gastar combustível.
- **Minigame "Mergulho"** *(manter na faixa)*:
  - A cada passagem pelo ponto mais baixo da órbita, Helena ajusta a altitude do mergulho.
  - Uma barra mostra calor × frenagem: fundo demais aquece a nave, raso demais quase não freia.
  - São 5 passagens.
- **Acertou:** economiza propelente, o que libera massa para instrumentos (ajuda Maya).
- **Errou:** superaquecimento, que tira integridade da nave (problema para Lucas); ou a missão precisa de mais passagens, o que custa tempo.
- **Custo:** nenhuma massa extra; custa **tempo**.
- **Fato real:** "O MRO fez ~400 mergulhos em ~5 meses. Cada um freava ~2 m/s e economizava ~1 kg de combustível. No total, foram ~600 kg a menos para levar."

#### H-O2 · Rolagem para o radar
- **Base real:** em nov/2025 o MRO girou 120° para o radar SHARAD olhar de outro ângulo o suposto "lago" sob o gelo do polo sul · `PH7`
- **Minigame "Giro preciso"** *(pilotagem)*:
  - Girar a nave até o ângulo pedido usando poucos pulsos de propulsor.
  - Segurar estável durante a janela de medição.
  - Passar do ângulo gasta combustível para corrigir.
- **Acertou:** Maya recebe dados de radar de um alvo especial (bônus em M-O2).
- **Errou:** combustível desperdiçado, o que encurta a vida útil.
- **Custo:** combustível (massa).
- **Fato real:** "Com o giro, o radar viu só um eco fraco no local do 'lago'. A descoberta de 2018 ficou muito difícil de sustentar: na ciência, dados melhores podem derrubar conclusões."

### Solo

#### H-S1 · Rota de escolta (Reconhecimento de superfície — candidato a MVP)
- **Base real:** planejamento de rotas de travessia em Marte com apoio de reconhecimento aéreo (*Ingenuity*, `EN9`, 72 voos e 17 km voados entre 2021 e 2024).
- **Minigame "Escolta"** *(planejamento de rota em grade 5×5)*:
  - Traçar uma rota contínua de escolta pelos setores seguros da grade 5×5, visitando em sequência os pontos de passagem, marcados com os símbolos dos elementos mais abundantes da crosta marciana (`O → Si → Fe → Mg → Ca`), e desviando das áreas de areia fofa (`⚠`).
- **Acertou:** define a rota segura da tripulação pelo terreno e revela alvos científicos para Maya.
- **Errou:** rota incompleta deixa trechos de areia fofa sem mapeamento de risco.
- **Custo:** tempo de navegação e reconhecimento da equipe na superfície (relays coordenados com Oscar).
- **Fato real:** "Rotas de reconhecimento em Marte evitam ondulações de areia lisa sem textura: o Ingenuity foi planejado para 5 voos e fez 72 (17 km no total), encerrando em jan/2024 quando a câmera de navegação perdeu referência visual sobre areia lisa no voo 72."

#### H-S2 · Pouso de precisão
- **Base real:** Terrain Relative Navigation do Perseverance (2021) · `EN4`
- **Minigame "Ache o lugar seguro"** *(escolha sob limite)*:
  - Durante a descida aparece a imagem do terreno.
  - Helena tem **10 segundos** para escolher um ponto sem rochas e crateras, dentro do alcance de desvio.
- **Acertou:** pousa perto do alvo científico, então o rover dirige menos.
- **Errou:** pousa longe, o que exige mais sóis de direção; um ponto perigoso dá chance de dano.
- **Custo:** baixo; é um sistema de software e câmera.
- **Fato real:** "O Perseverance pousou a ~5 m do alvo; o requisito era 60 m. O sistema decide sozinho em menos de 10 s, porque o pouso inteiro dura 7 min e um sinal leva ~11 min para chegar à Terra."
- **Sugestão:** este minigame pode ser a **fase obrigatória de pouso** de toda missão de solo, em vez de um experimento opcional.

---

## 2. Lucas: Engenheiro de Sistemas

**Recursos:** Energia, Tempo de Vida / Integridade. Os experimentos dele são de **energia, calor e mecânica**.

### Órbita

#### L-O1 · Painel solar enrolável (candidato a MVP)
- **Base real:** ROSA (teste na ISS em 2017) e iROSA (ISS, 2021–23); o DART usou ROSA · `E5`
- **Minigame "Desenrolar"** *(timing)*:
  - O painel abre em etapas.
  - Lucas aperta quando a tensão está na zona certa: cedo demais o painel trava, tarde demais ele enrola torto.
- **Acertou:** mais energia gerada (Watts para todos).
- **Errou:** o painel trava parcialmente, com menos energia; consertar exige uma ação de reparo.
- **Custo:** massa de painel; nenhuma energia (ele *gera* energia).
- **Fato real:** "No teste de 2017 na ISS, o ROSA abriu, mas não conseguiu fechar e foi descartado. A versão melhorada hoje aumenta em ~30% a energia da estação. Em Marte, o Sol fornece só 43% da energia que chega à Terra."

#### L-O2 · Manter o detector frio
- **Base real:** CRISM, o espectrômetro de minerais do MRO, tinha resfriadores que se desgastaram até 2017; o instrumento foi aposentado em 2023 · `GE8`
- **Minigame "Criogenia"** *(manter na faixa)*:
  - Durante as observações de Maya, Lucas mantém o detector na faixa fria, dividindo a energia entre o resfriador e o resto da nave.
  - Forçar o resfriador aumenta o medidor de **desgaste**.
- **Acertou:** Maya ganha bônus no mapa de minerais.
- **Errou:** imagem ruidosa; o desgaste acumulado encurta a vida do instrumento.
- **Custo:** o CRISM tinha 32,9 kg e consumia 44–47 W.
- **Fato real:** "O CRISM mapeou 86% de Marte e ajudou a escolher os locais de pouso do Curiosity e do Perseverance. O fim dele veio do desgaste dos resfriadores, não da câmera."

### Solo

#### L-S1 · Forno de oxigênio (candidato a MVP)
- **Base real:** MOXIE, no Perseverance (2021–23) · `EN1`
- **Minigame "Fazer oxigênio"** *(manter na faixa)*:
  - Esquentar o reator até ~800 °C e mantê-lo na zona verde.
  - Quente demais danifica a célula; frio demais não produz nada.
  - A bateria descarrega durante a operação.
- **Acertou:** gramas de O₂, que contam para o objetivo de "preparar a chegada humana".
- **Errou:** dano à célula, com menor produção nas rodadas seguintes.
- **Custo:** **17,1 kg e 300 W**, o consumo mais alto da lista; disputa energia com os instrumentos de Maya.
- **Fato real:** "O MOXIE produziu 122 g de oxigênio em 16 rodadas, com pico de 12 g/h, o dobro da meta. Foi a primeira vez que se fabricou um recurso a partir do ar de outro planeta."

#### L-S2 · Perfuração
- **Base real:** broca do Curiosity (furos de até 5 cm, 2 brocas reserva) e a "toupeira" HP3 do InSight, que falhou · `GE6`, `G9`
- **Minigame "Furar sem quebrar"** *(timing / ritmo)*:
  - Apertar no pico de cada batida da broca.
  - Força demais quebra a broca (só há 2 reservas); força de menos não avança.
  - Às vezes o solo é **traiçoeiro**: a broca não avança no ritmo normal e é preciso trocar a estratégia (empurrar com o braço).
- **Acertou:** gera uma amostra (pó de rocha ou núcleo) que Maya usa em M-S4.
- **Errou:** broca quebrada, ou um furo raso que gera uma amostra pior.
- **Custo:** braço robótico ocupado (nenhum instrumento de braço da Maya pode rodar ao mesmo tempo).
- **Fato real:** "A toupeira do InSight precisava descer 3–5 m, mas parou a ~37 cm: o solo não oferecia atrito. A equipe tentou por 2 anos, até empurrando com o braço robótico."

---

## 3. Oscar: Especialista de Dados e Telecom

**Recursos:** Dados, Comunicação. Os experimentos dele são de **transmissão, compressão e rádio**.

### Órbita

#### O-O1 · Laser para a Terra (candidato a MVP)
- **Base real:** DSOC, comunicação a laser testada na sonda Psyche (2023–25) · `EN13`
- **Minigame "Feixe estável"** *(mira)*:
  - Manter a mira do laser sobre a estação na Terra enquanto a nave vibra.
  - Quanto maior a distância Terra–Marte no momento, mais difícil (e menor a taxa).
  - Nuvens passando sobre a estação cortam o sinal.
- **Acertou:** esvazia a memória de bordo, transmitindo dados de Maya.
- **Errou:** dados ficam presos na memória.
- **Custo:** massa e energia da antena laser (valor de jogo; os números reais não foram publicados).
- **Fato real:** "O laser do DSOC transmitiu 267 Mbps a 31 milhões de km, mas só ~8 Mbps a ~400 milhões de km. Comunicação piora muito com a distância."

#### O-O2 · Compressão de imagem
- **Base real:**
  - O Kepler não tinha banda para mandar imagens inteiras e só enviava os pixels em volta das estrelas escolhidas · `A2`
  - A Galileo salvou a missão comprimindo dados depois que a antena principal falhou · `CD1`
- **Minigame "Recorte inteligente"** *(escolha sob limite)*:
  - Uma foto de Maya chega pesada demais.
  - Oscar seleciona as regiões que contêm os alvos científicos.
  - Menos pixels economizam dados, mas cortar um alvo perde ciência.
- **Acertou:** a mesma ciência com muito menos dados (combina com o perk *Compressão Inteligente*).
- **Errou:** alvos cortados, com menos ciência.
- **Custo:** processamento (pouca energia).
- **Fato real:** "Uma única imagem do HiRISE pode ter até 28 Gb, mais do que um rover manda em vários dias. O Kepler e a Galileo provaram que escolher bem *o que* enviar vale tanto quanto ter uma antena maior."

### Solo

#### O-S1 · Passagem do orbitador (candidato a MVP)
- **Base real:** relay UHF (Electra), a rede de orbitadores que repassa os dados dos rovers · `EN11`, [frota atual](../references/experiments/mars-experiments.md#22-relay-capacity-how-surface-data-gets-home)
- **Minigame "Janela de contato"** *(escolha sob limite)*:
  - O orbitador passa por cima por poucos segundos.
  - Pacotes de dados dos experimentos chegam numa fila, cada um com tamanho e prioridade.
  - Oscar escolhe quais enviar antes da janela fechar.
- **Exemplos de pacotes com tamanho real:**
  - Câmera Mastcam-Z: ~148 Mb
  - Sismômetro: 38 Mb/dia
  - PIXL: ~16 Mb
  - SuperCam: 15,5 Mb
- **Acertou:** a ciência chega à Terra e conta pontos.
- **Errou:** a memória enche e experimentos param.
- **Evento:** "Orbitador perdido" reduz o número de janelas por sol.
- **Fato real:** "Um rover passa ~12 h por dia sem linha de visada com a Terra. O Perseverance manda >1 Gbit por sol em 4–5 passagens de orbitadores. Em 2025 a NASA perdeu o MAVEN, e todas as missões de solo perderam ~0,9 Gb/dia de capacidade."

#### O-S2 · Rádio-geodésia
- **Base real:** RISE, no lander InSight (2018–22) · `PH3`
- **Minigame "Sintonizar o Doppler"** *(manter na faixa)*:
  - Um tom de rádio desliza devagar por causa do movimento de Marte.
  - Oscar gira o sintonizador para manter o sinal travado.
  - O tempo travado se acumula ao longo dos sóis.
- **Acertou:** após muitos sóis, revela o tamanho do núcleo de Marte (grande bônus de ciência).
- **Errou:** sessão perdida; o experimento demora mais.
- **Custo:** 7,3 kg; **78 W por até 1 h/dia**; precisa de link direto com a Terra.
- **Fato real:** "Só rastreando o rádio do InSight por ~900 sóis, os cientistas mediram que o núcleo líquido de Marte tem ~1.835 km de raio e que a rotação do planeta está acelerando."

---

## 4. Maya: Cientista de Missão e Oficial Médica

**Recursos:** Valor Científico, Segurança da Tripulação. Os experimentos dela são os **instrumentos científicos**: geologia e astrobiologia, e medicina em missões tripuladas.

### Órbita

#### M-O1 · Foto de alta resolução (candidato a MVP)
- **Base real:** HiRISE, câmera do MRO (2006–hoje) · `GE7`
- **Minigame "Clique perfeito"** *(timing)*:
  - O solo de Marte rola por baixo da nave.
  - Maya tira a foto quando o alvo (cratera, delta, dunas) passa no centro do quadro.
  - Tempestades de poeira podem borrar a imagem.
- **Acertou:** imagens que liberam locais de pouso e alvos para o rover.
- **Errou:** foto desfocada, que gasta dados à toa.
- **Custo:** **65 kg, 60 W**, e cada foto é **enorme em dados** (pressão sobre Oscar).
- **Fato real:** "A HiRISE vê detalhes de 30 cm da órbita e tirou sua 100.000ª foto em 2025. As imagens dela ajudam a escolher onde pousar com segurança."

#### M-O2 · Radar de gelo
- **Base real:** SHARAD, radar do MRO · `PH7`
- **Minigame "Ler o radargrama"** *(busca de padrão)*:
  - No gráfico de ecos do radar, achar a linha do gelo enterrado no meio do ruído.
  - Os ecos laterais do relevo enganam.
- **Acertou:** revela gelo no mapa. Isso libera locais de pouso para humanos e futura extração de água.
- **Errou:** falso positivo (marca gelo onde não há).
- **Custo:** 15 kg, 10 W; gera **40–90 Gb/dia**.
- **Fato real:** "O SHARAD achou sob a planície Utopia gelo enterrado com tanta água quanto o Lago Superior, nos EUA (~14.300 km³)."

#### M-O3 · Caçador de metano
- **Base real:** espectrômetros NOMAD e ACS, do orbitador TGO · `BI3`
- **Minigame "Impressão digital do gás"** *(busca de padrão)*:
  - Só no nascer ou pôr do sol visto da órbita a luz atravessa a atmosfera.
  - Nessa janela curta, Maya compara as linhas escuras do espectro com as "impressões digitais" dos gases (metano, água, ácido clorídrico).
- **Acertou:** gás identificado, com ciência de habitabilidade.
- **Evento "Dados em conflito":** o orbitador não vê metano, mas o rover vê. A equipe precisa decidir como verificar.
- **Fato real:** "Da órbita, o TGO não encontra metano acima de 0,05 partes por bilhão, mas no solo o Curiosity mede 0,2–0,7. Ninguém sabe ainda quem está certo. Em nov/2026 o TGO detectou gás saindo de fissuras de um vulcão, possível sinal de magma adormecido."

### Solo

#### M-S1 · Caçador de bioassinaturas (candidato a MVP)
- **Base real:** PIXL + SHERLOC, no Perseverance; a rocha "Cheyava Falls" (2024–25) · `BI1`, `GE3`, `B14`
- **Minigame "Manchas de leopardo"** *(busca de padrão)*:
  - A rocha é uma grade.
  - Cada célula escaneada custa tempo e energia; cores-pista indicam a química.
  - Maya precisa achar as manchas escondidas antes do tempo acabar.
- **Acertou:** "possível bioassinatura", a maior pontuação científica do jogo, mas só **se a amostra for guardada** (M-S4).
- **Errou:** a rocha fica sem análise.
- **Custo:** braço robótico ocupado; PIXL 6,9 kg / 25 W + SHERLOC 4,72 kg / **48,8 W**.
- **Fato real:** "Em 2025 a NASA anunciou que manchas na rocha Cheyava Falls são uma 'possível bioassinatura'. Para confirmar, a amostra precisa vir para a Terra, mas a missão de retorno foi cancelada."

#### M-S2 · Laser nas rochas
- **Base real:** SuperCam (Perseverance) e ChemCam (Curiosity) · `GE2`
- **Minigame "Tiro certeiro"** *(mira)*:
  - Acertar pontos pequenos numa rocha a vários metros.
  - Os primeiros tiros só limpam a poeira; os seguintes leem a química.
- **Acertou:** a composição da rocha, rápido e sem usar o braço.
- **Errou:** tiros gastos em poeira.
- **Custo:** 10,6 kg, 17,9 W, 15,5 Mb por experimento.
- **Fato real:** "O laser do Curiosity já disparou mais de 1 milhão de vezes, embora tenha sido projetado para 2 anos. Ele lê rochas a mais de 7 m de distância."

#### M-S3 · Escutar terremotos
- **Base real:** SEIS, no lander InSight (2018–22) · `PH2`
- **Minigame "Sismograma"** *(busca de padrão)*:
  - Na linha do sismógrafo, marcar os terremotos e ignorar as rajadas de vento.
  - À noite o vento diminui e fica mais fácil.
- **Acertou:** terremotos registrados, que revelam o interior do planeta.
- **Errou:** vento marcado como terremoto (dado falso).
- **Custo:** ~29,5 kg (a confirmar), ≤8,5 W, 38 Mb/dia. Só funciona em **lander parado**.
- **Fato real:** "O InSight registrou 1.319 terremotos marcianos e descobriu que o núcleo de Marte é líquido, com ~1.830 km de raio."

#### M-S4 · Escolher amostras
- **Base real:** os 43 tubos de amostra do Perseverance · `GE6`, `G8`
- **Minigame "Quais rochas guardar?"** *(escolha sob limite)*:
  - Os tubos são poucos e não podem ser reusados.
  - Maya escolhe entre as amostras perfuradas por Lucas (L-S2), cada uma com pistas do que contém.
  - O valor real de cada uma só aparece no fim da missão.
- **Acertou:** guarda as amostras de maior valor (incluindo a bioassinatura de M-S1).
- **Errou:** tubos gastos em rochas comuns.
- **Fato real:** "O Perseverance coletou 27 núcleos de rocha e deixou um depósito de 10 tubos de reserva no chão de Marte. Em 2026 a missão para trazê-los foi cancelada. Hoje eles esperam uma futura missão."

#### M-S5 · Alerta de radiação *(missão tripulada)*
- **Base real:** detector RAD, do Curiosity · `PH1`
- **Minigame "Abrigo!"** *(timing)*:
  - Quando chega o alerta de tempestade solar, Maya decide quando mandar a tripulação para o abrigo.
  - Cedo demais perde tarefas; tarde demais a tripulação toma dose alta.
- **Acertou:** tripulação segura.
- **Errou:** dose de radiação acima do limite (saúde −).
- **Custo:** 1,56 kg, 4,2 W.
- **Fato real:** "Na superfície de Marte a dose é ~0,67 mSv por dia, e na viagem ~1,8 mSv por dia. Uma missão humana de ~500 dias acumularia ~1 Sv."

#### M-S6 · Estufa marciana *(missão tripulada)*
- **Base real:** estufas Veggie/APH na ISS e testes com solo marciano simulado · `BI7`
- **Minigame "Fazer brotar"** *(manter na faixa)*:
  - Manter água e luz na faixa certa por vários sóis.
  - Rega demais ou de menos mata as plantas.
- **Acertou:** comida fresca, que reduz a massa de comida a levar e melhora a saúde da tripulação.
- **Errou:** sementes não germinam.
- **Custo:** ~70 W, água e tempo da tripulação.
- **Fato real:** "Na primeira colheita da ISS, sementes não germinaram e plantas morreram de sede. A primeira alface espacial só foi comida em 2015. Nenhuma planta jamais cresceu em solo marciano de verdade, só em imitações dele na Terra."

---

## 5. Cadeias de cooperação

Estas ligações fazem os minigames de um personagem dependerem dos outros. É o "efeito dominó" que o desafio pede.

```text
Helena H-O1 (aerofrenagem) ──► economiza massa ──► mais instrumentos para Maya
Helena H-O2 (rolagem) ──────► alvo especial no radar de Maya (M-O2)
Helena H-S1 (escolta) ───────► garante rota segura ───► Maya escolhe onde investigar
                         └──► depende do relay do rover (banda de Oscar)
Lucas  L-O1 (painel) ───────► energia para todos os experimentos
Lucas  L-O2 (resfriador) ───► mantém vivo o espectrômetro de Maya
Lucas  L-S1 (MOXIE, 300 W) ─► disputa energia com os instrumentos de Maya
Lucas  L-S2 (broca) ────────► gera amostras ──► Maya escolhe tubos (M-S4)
Maya   M-O1, M-O2 (imagem, radar) ──► geram dados enormes ──► Oscar precisa transmitir
Maya   M-S1 (bioassinatura) ──► só vale se guardada em tubo (M-S4)
Maya   M-O2 (gelo) ──► libera locais de pouso para missão tripulada
Oscar  O-O1, O-S1 (laser, relay) ──► transforma dados de todos em pontos
Oscar  O-O2 (compressão) ──► reduz o peso das fotos de Maya
```

---

## 6. Próximos passos sugeridos

1. Decidir se o cenário principal é **robótico** ou **tripulado**. Isso define se M-S5 e M-S6 entram.
2. Validar os candidatos a MVP com a equipe.
3. Prototipar as mecânicas base no jogo (começando por **manter na faixa** e **escolha sob limite**, que cobrem 9 minigames).
4. Escrever os textos finais dos cards "Fato real". Valores marcados como incertos no catálogo precisam ser conferidos antes.
