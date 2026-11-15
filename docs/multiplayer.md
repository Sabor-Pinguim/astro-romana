# Multiplayer

Partida cooperativa online de 1 a 4 jogadores. O **servidor de salas** já está pronto em [multiplayer/](../multiplayer/README.md) (protocolo, testes e deploy no Cloud Run). Este documento é o **plano do que muda no cliente** (`index.html` e `web/`) para ligar o jogo a ele. Nada daqui foi implementado ainda.

## Princípios

- **O host decide.** Quem cria a sala é o host e fica com a vaga da Helena. O navegador dele roda as regras que já existem: `flightTick`, `surfaceTick`, `completeSurfaceTask` e `showResults`.
- **Os convidados mandam intenções** (`act`) e desenham o estado que recebem (`state`). Eles não rodam os loops de regra.
- **Cada um move o próprio astronauta** na superfície e manda a pose (`pose`).
- **Um minigame roda no navegador do dono da vaga**, e só o resultado vai para o host, como `act`. Essa regra vale para os minigames de hoje e para os que vierem.
- **Vaga sem jogador fica com a IA**, como hoje. O solo é um host sem convidados, e sem servidor o jogo funciona igual a agora.
- **O servidor carimba quem enviou** cada `act` (`from.seat`). O host confere o dono por esse carimbo, nunca pelo que o cliente diz.

## Fluxo atual → canais

| Tela (`state.screen`) | Hoje | No multiplayer |
|---|---|---|
| `menu`, `orbit` | `selectWorld` local | O host anda pelas telas e manda `phase`. O destino vai em `state lobby` |
| `lobby` | Vagas falsas (`state.friends`), `site`, `difficulty` | Vagas reais (`peers`). `site` e `difficulty` vão em `state lobby`; convidados mudam via `act` |
| `planner` | `togglePart`, `addStage`, `removeStage` mudam `state.rocket` | Convidado manda `act`; o host aplica e manda `state planner` |
| `cockpit` | `startFlight` + `flightTick`; ações em `handleCockpitAction` | O host roda o voo e manda `state flight` (~10 Hz); as ações dos convidados chegam por `act` |
| `surface` | `surfaceTick` (timer) + `step()` em `views.js`; a IA move os colegas | O host manda `state surface` (locais, timer, feitos, quem controla quem, ~2 Hz) e roda a IA; cada um manda `pose` (~10 Hz) dos astronautas que controla |
| `results` | `showResults` | O host manda `event results`; cada cliente roda o mesmo `showResults` |

Só dá para **entrar** na sala até o `planner`. Depois do lançamento, só volta quem caiu (`resume`). Essas fases são os padrões do servidor, e o host pode mudá-las no `create`.

## O que muda, por arquivo

### 1. Carregar o cliente: `index.html` e `web/net.js` (novo)
- O `index.html` passa a carregar `multiplayer/client/room-client.js` e depois `web/net.js`, os dois **antes** de `web/app.js`. São scripts clássicos e funcionam em `file://`.
- O `web/net.js` liga o `RoomClient` ao jogo e expõe `window.ASTRO_NET`:
  - `mode`: `'solo'`, `'host'` ou `'guest'`;
  - `seat`, `isHost`, `peers`;
  - `act(name, ...args)`;
  - `owns(seat)`: a vaga é minha, ou é da IA e eu sou o host.
- A URL do servidor fica numa constante nomeada (`NET_SERVER = 'wss://…run.app/ws'`). Pode ser trocada com `?server=`, e em `localhost` aponta para `ws://localhost:8787/ws`.
- Ao abrir a página:
  - com sessão salva, `room.rejoin()`;
  - com `?room=CODE`, `room.join(code)`;
  - sem nenhum dos dois, solo.

### 2. Lobby: `web/app.js` (`renderLobby`, `renderDetail`)
- **Host:** o botão "Invite player" vira "Create room". Ele mostra o código e o link (`RoomClient.linkFor(code)`) com um botão de copiar.
- **Convidado:** um campo "Join" (código) ou o link.
- O status de cada card vem de `peers`, não mais de `state.friends`:
  - `HOST (PLAYER)` para o host;
  - `PLAYER` para uma vaga ocupada (o card marca se é você);
  - `AI (NPC)` para uma vaga livre.
- `#crew-count` conta quem está online.
- No convidado, clicar numa vaga livre chama `room.setSeat(seat)`.
- O resumo do lançamento ("Crew: N players · M AI") usa `peers`.

### 3. Telas: `showScreen`
- **No host**, `showScreen(id)` também chama `room.setPhase(id)`.
- **No convidado:**
  - a tela segue o `phase` recebido;
  - os botões de avançar ou voltar (`#objective-next`, `#to-assembly`, `#launch-button`, `#launch-confirm`, `#play-button`) ficam desativados, com o texto "Waiting for host";
  - entrar no cockpit e na superfície acontece quando o host avisa (ver 5 e 6).

### 4. Planner: `web/app.js`
- Criar `act(name, ...args)` e a tabela `ACTIONS`, que é a lista de ações permitidas: `world`, `site`, `difficulty`, `addStage`, `removeStage`, `togglePart`.
  - No solo e no host, `act` aplica a mutação e manda `state planner`.
  - No convidado, `act` manda `{name, args}` para o host.
  - O host recebe o `act`, confere se o nome está na lista e aplica.
- Os handlers de clique passam a chamar `act(...)` em vez das funções direto.
- `togglePart(id)` hoje lê a seleção local (`state.sel`, `state.tab`). Ela passa a receber `togglePart(id, selKey, tab)`, e o convidado manda a seleção dele.
- Criar `snapshot()` e `applySnapshot()`.
  - Sincronizam: `site`, `difficulty`, `world` e `rocket`.
  - Continuam locais: `sel`, `tab` e `detail`.
  - Depois de aplicar, se o estágio selecionado sumiu, a seleção cai no booster.
- Os toasts das mutações (como "Stage removed.") vão para todos via `event`.

### 5. Cockpit: `web/app.js` e `web/flight.js`
- **Entrada:** o host roda `startFlight()` e manda `state flight`. Ao ver `phase = 'cockpit'`, o convidado mostra a tela e desenha a partir do estado. Para isso, `startFlight` e `renderFlightUI` passam a ser exportados em `ASTRO_SIM`.
- **Ações:** `handleCockpitAction(actionId, arg)` já é o ponto único de entrada.
  - No convidado, vira `act('cockpit', actionId, arg)`.
  - No host, só é aplicada se `from.seat` é o dono da ação (tabela abaixo) ou se a vaga do dono é da IA.
- **Estado no convidado:** ele não roda `flightTick`. Copia o `state flight` para dentro do próprio `ASTRO_SIM.flight`, o mesmo objeto que `web/flight.js` lê a cada quadro, então o cockpit 3D anima sem mudança. Chama `renderFlightUI()` só quando `step`, `breakers` ou os botões mudam, e `updateCockpitHUD()` a cada snapshot.
- **O que vai no `state flight`:** os campos numéricos e booleanos de `flight`, a última linha do log e o valor do medidor do liftoff. Não vão `keys`, `raf` nem funções.
- **Botões:** os de papéis que não são seus ficam desativados, com o nome do dono, em `renderFlightUI` e nos cliques 3D (`tagPivot` em `web/flight.js`).
- **Minigames da Helena:** o liftoff no navball e o EDL rodam no host, porque o host é a Helena. As teclas de pilotagem só valem para quem tem a vaga dela.

**Dono de cada ação do cockpit** (vem dos rótulos de cada etapa em `renderFlightUI`):

| Ação | Dono |
|---|---|
| `throttle_up`, `steer`, `stabilize`, `edl_arm`, `complete_step` | helena |
| `breaker`, `stage_sep` | lucas |
| `pump_fuel` | oscar |
| `shield_storm` | maya |

### 6. Superfície (mundo aberto): `web/views.js` e `web/app.js`

**Problema de hoje:** cada navegador roda a IA dos três colegas (passear, `action_loop` com as ferramentas, acenar de volta) com `Math.random`. Sem mudança, cada tela mostraria os NPCs em lugares diferentes. Os locais dos experimentos também são sorteados em cada navegador. A regra passa a ser: **a IA e os sorteios rodam só no host**.

O servidor não muda. A `pose` é livre e fica guardada por participante, então o host manda num só pacote o astronauta dele e os da IA.

**Quem controla cada astronauta.** Cada avatar de `world.avatars` ganha `a.ctrl`:

| `a.ctrl` | Quem | Como se move |
|---|---|---|
| `local` | O meu (`world.avatar`) | `step()` com teclado e toque, como hoje |
| `ai` | Só no host, para personagens sem jogador | A IA de hoje (`pickNpcTarget`, estados `idle`, `walk`, `action`, `wave`) |
| `remote` | Outro jogador, ou a IA vista de um convidado | Interpola as poses recebidas |

O mapa `control` (personagem → id do peer, ou `null` para a IA) vem do host em `state surface`. A vaga (`seat`) diz quem você é na sala; `control` diz qual corpo você move agora.

**Entrada.**
- O host roda `startSurface()`. Os locais vêm de `placeBlocks(spots)`, sorteados no host, e vão em `state surface {site, spots, timerSec, completed, control}`.
- O convidado vê `phase = 'surface'` e o `state surface` e chama `land({ site, crew, spots })`, com `crew = room.you.seat`. `CREW_START` já é fixo, então todos começam no mesmo lugar.
- **O timer só começa quando todos carregaram o terreno.** Cada um manda `act('loaded')`, e o host espera no máximo 20 s (`game-balance`). Hoje o host já pausa o timer enquanto `running()` é falso; ele passa a contar também os convidados que ainda carregam.

**Pose (~10 Hz).**
- Cada peer manda `{av: {<personagem>: {x, y, z, yaw, anim, spd}}}` com todos os astronautas que controla: o convidado manda o dele; o host manda o dele e os da IA.
- `anim` é `idle`, `walk`, `wave` ou `action`. Vale para os emotes do jogador e para os estados da IA. Os `Prop_*` aparecem com `action`, e `spd` acerta o `walk.timeScale`. O pulo vai no `y`.
- Manda só quando algo mudou, e no mínimo 1 vez por segundo. São uns 300 B por pacote, bem abaixo do limite do servidor (60 mensagens/s).
- Quem entra ou volta recebe as últimas poses de todos no `welcome`, e os astronautas já aparecem no lugar certo.

**Interpolação (`remote`).**
- `ASTRO_SURFACE.setRemote(personagem, pose)` (novo) guarda as poses com a hora de chegada.
- O `step()` desenha cerca de 100 ms atrás e interpola entre as duas últimas poses. O ângulo usa o `stepYaw`, que já existe. Os pesos de `idle`, `walk` e `action` reaproveitam o bloco de mistura da IA.
- Um salto maior que 5 m (por exemplo `goTo`) não interpola: o astronauta aparece direto no destino.
- Se as poses de um jogador param de chegar, o astronauta fica parado onde está. Depois de 30 s a vaga fica livre, e no host o personagem volta para a IA a partir dali.

**IA no host (`ai`).**
- Usa o mesmo código de hoje. Ao fugir de aglomeração e de colisão, considera todos os astronautas, inclusive os remotos.
- **Aceno de volta:** hoje o NPC acena quando a câmera do jogador local olha para ele. No convidado, a mesma checagem manda `act('greet', personagem)`, no máximo uma vez a cada 8 s por NPC (o `waveCd`). O host faz o NPC acenar virado para quem pediu, e todos veem o mesmo aceno.

**Trocar de personagem (teclas 1–4).**
- No multiplayer, só vale para personagens da IA. O pedido é `act('control', personagem)`.
- O host confere se o personagem está livre e atualiza `control`. O personagem que você largou volta para a IA no lugar onde estava, como o `useCrew` já faz com `prev.ai`.
- O convidado só troca quando chega o `control` novo. Assim, dois jogadores não pegam o mesmo astronauta.
- Tecla de um personagem que já tem dono: toast "Lucas is controlled by another player".

**Minigames sem congelar o mundo.**
- Hoje o `frame()` só chama `step()` com o diálogo fechado (`if (!dlg.open) step(dt)`). No multiplayer, isso congelaria a IA e as poses do host enquanto ele joga, e os colegas na tela do convidado.
- O `step()` se divide em duas partes:
  - `stepLocal`: entrada e movimento do meu astronauta, pausada durante o minigame;
  - `stepOthers`: remotos e IA, que roda sempre.
- Enquanto o minigame está aberto, a pose leva `busy: '<experimento>'`, e os outros veem uma etiqueta sobre o astronauta.
- **Timer (regra nova, `game-balance`):** no multiplayer, o timer da janela de retorno **não pausa** durante os minigames, porque um jogador não pode congelar os outros. No solo, continua como hoje.

**Experimentos.**
- O minigame roda no navegador de quem controla o dono do experimento. Os prompts (`run`, `locked`) já comparam com o personagem que você move (`s.crew`).
- Ao terminar, o jogador manda `act('task', id)`. Em `completeSurfaceTask`, o host passa a conferir o dono pelo `control` de quem enviou (`from.id`), e não mais por `surf.activeCrew`.
- O visual de bloco concluído sai de `finishExperiment` para uma função `ASTRO_SURFACE.markDone(id)`, chamada também quando o `state surface` traz um experimento novo em `completed`.

**Embarque (regra do time, `game-balance`).**
- **Só embarca com todos os jogadores no lander.** Hoje, qualquer um que aperta E no lander encerra a missão de todos.
- No multiplayer, o E só funciona quando todos os jogadores online estão a até `BOARD_REACH` do lander. Antes disso, o prompt mostra "Waiting for crew · 2/3 at the lander".
- Quem aperta manda `act('board')`. O host confere as distâncias pelas poses e embarca. Os personagens da IA embarcam junto, como no solo.
- Um jogador offline não trava o embarque. Se ele não voltar em 30 s, o personagem dele vira IA.
- **Se o tempo acabar, fica em Marte quem não voltou.** É a regra que já vale no solo: no timeout, quem está a mais de 35 m do lander fica para trás, jogador ou IA. Ela funciona sem mudança, porque `distanceToLander` já usa `a.pos` dos avatares, que no host vem das poses.

**Fica local em cada cliente:** câmera (primeira e terceira pessoa), capacete, bússola, lista de objetivos e distâncias, etiquetas dos blocos, emote wheel e movimento reduzido. As etiquetas com o nome dos outros jogadores sobre os astronautas são opcionais (`meta.name`).

### 7. Resultados
- O host chama `showResults` e manda `event {k:'results', forced, score, completed, stranded, timerSec}`.
- O convidado copia esses dados para dentro de `flight` e `surf` e chama o mesmo `showResults`, que é determinístico (exportado em `ASTRO_SIM`).
- "Replay" só aparece para o host. Ele leva todos de volta ao lobby, e a sala continua aberta.

### 8. Áudio
- Cada cliente toca o próprio som a partir do estado recebido: o fundo da superfície ao entrar nela, o Geiger pela dose e os tons quando um valor muda.
- Os arquivos continuam os mesmos ([audio.md](audio.md)).

### 9. Quedas e erros
- **Convidado cai:** o `RoomClient` reconecta e retoma a vaga sozinho. Se não voltar em 30 s, a vaga fica livre, e no host o personagem volta para a IA.
- **Host cai:** se não voltar em 30 s, a sala fecha para todos (`closed host-left`). O convidado vê um toast e volta ao menu.
- **Erros de entrada** viram toasts em inglês:

  | Código | Toast |
  |---|---|
  | `room-not-found` | "Room not found" |
  | `room-full` | "This crew is full" |
  | `in-progress` | "The mission already launched" |

- Sem servidor, "Create room" mostra um toast, e o jogo continua no solo.

## Minigames novos

1. O minigame pertence a uma vaga e roda no navegador de quem tem essa vaga. Se a vaga é da IA, roda no host.
2. Ao terminar, manda `act` com o resultado (por exemplo `{name: 'task', args: [id, stars]}`). O host confere o dono pelo carimbo e aplica.
3. Se os outros precisam ver o minigame enquanto ele acontece, o dono manda o progresso por `send` com `to: 'others'`. Esse progresso não muda regra nenhuma.

## Ordem sugerida e testes

1. Itens 1 e 2: entrar na sala e ver as vagas. 3 e 4: planner compartilhado. 5: cockpit. 6 em duas partes (primeiro astronautas, poses e IA no host; depois experimentos, minigames e embarque). 7: resultados. Cada um num commit, jogável.
2. A cada passo, testar com o servidor local (`cd multiplayer && npm start`) e duas janelas:
   - o host em `index.html`;
   - o convidado em `index.html?room=CODE&server=ws://localhost:8787/ws`.
3. No fim, um roteiro no Playwright com dois contextos:
   - o convidado pega o Lucas;
   - o planner fica igual nos dois;
   - o Lucas reseta os breakers e a Helena pilota;
   - cada um anda e o outro vê;
   - os NPCs (Oscar e Maya, da IA) estão no mesmo lugar e no mesmo estado nas duas telas;
   - com o minigame aberto num navegador, o outro continua vendo todos se mexerem;
   - L-S1 só fecha pelo Lucas;
   - o embarque só acontece com os dois no lander, e no timeout fica em Marte quem estiver longe;
   - o placar fica igual.

   Sem erros no console em 1440 e 390 px e com movimento reduzido. O solo em `file://`, sem servidor, continua como hoje.
