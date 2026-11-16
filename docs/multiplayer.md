# Multiplayer

Partida cooperativa online de 1 a 4 jogadores. O **servidor de salas** já está pronto em [multiplayer/](../multiplayer/README.md) (protocolo, testes e deploy no Cloud Run). Este documento é o **plano do que muda no cliente** (`index.html` e `web/`) para ligar o jogo a ele. Os itens marcados com ✅ já estão no jogo; os outros ainda são plano.

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
| `menu`, `orbit` | `selectWorld` local | O host anda pelas telas e manda `phase`. O destino vai em `state setup` |
| `lobby` | Vagas falsas (`state.friends`), `site`, `difficulty` | Vagas reais (`peers`). `site` e `difficulty` são do host e vão em `state setup` |
| `planner` | `togglePart`, `addStage`, `removeStage` mudam `state.rocket` | Convidado manda `act`; o host aplica e manda `state setup` |
| `cockpit` | `startFlight` + `flightTick`; ações em `handleCockpitAction` | O host roda o voo e manda `state flight` (~10 Hz); as ações dos convidados chegam por `act` |
| `surface` | `surfaceTick` (timer) + `step()` em `views.js`; a IA move os colegas | O host manda `state surface` (locais, timer, feitos, quem controla quem, ~2 Hz) e roda a IA; cada um manda `pose` (~10 Hz) dos astronautas que controla |
| `results` | `showResults` | O host manda `event results`; cada cliente roda o mesmo `showResults` |

Só dá para **entrar** na sala até o `planner`. Depois do lançamento, só volta quem caiu (`resume`). Essas fases são os padrões do servidor, e o host pode mudá-las no `create`.

## O que muda, por arquivo

### 1. Carregar o cliente: `index.html` e `web/net.js` ✅
- O `index.html` carrega `multiplayer/client/room-client.js` e depois `web/net.js`, os dois **antes** de `web/app.js`. São scripts clássicos e funcionam em `file://`.
- O `web/net.js` liga o `RoomClient` ao jogo e expõe `window.ASTRO_NET`:
  - `mode` (`'solo'`, `'host'` ou `'guest'`), `isHost`, `isGuest`, `seat`, `peers`, `code` e `link`;
  - `act(name, ...args)`, `setPhase`, `setState`, `emit`, `pose`, `send` e `setSeat`; cada um só envia no papel certo (host ou convidado);
  - `owns(seat)`: a vaga é minha, ou é da IA e eu sou o host;
  - `on(tipo, fn)` repassa os eventos da sala para o jogo.
- **Endereço do servidor:**
  - uma página servida pelo site (a VM com Caddy) usa o mesmo endereço da página, `wss://<host>/ws`;
  - em `localhost`, usa `ws://localhost:8787/ws`;
  - em `file://`, usa a constante `NET_SERVER` (`wss://<domínio>/ws`, preenchida depois do deploy) ou, enquanto ela está vazia, o servidor local;
  - qualquer página aceita `?server=`.
- **Sem servidor,** "Create room" mostra um toast, e o jogo continua no solo.
- **Ao abrir a página:** com sessão salva, volta para a sala (`rejoin`); com `?room=CODE`, entra nela; sem nenhum dos dois, fica no solo.

### 2. Lobby: `web/app.js` (`renderLobby`, `renderRoom`) ✅
- **Painel da sala**, embaixo da tripulação:
  - no solo: "Create room", ou um código e "Join";
  - na sala: o código, "Copy invite link" e "Leave".
- O status de cada card vem de `peers` (`seatStatus`): `HOST`, `PLAYER`, `(OFFLINE)` e `· YOU`, ou `AI (NPC)` numa vaga livre. `#crew-count` conta quem está online.
- **Convidado:** cada vaga livre ganha o botão "Take seat" (`room.setSeat`) enquanto a sala está numa fase de entrada.
- **Destino, local de pouso e dificuldade são controles do host.** A tela já dizia "Host control". O convidado vê os botões desativados e pode abrir os detalhes de cada local.
- O resumo do lançamento ("Crew: N players · M AI") usa `peers`.

### 3. Telas: `showScreen` ✅
- **No host**, `showScreen(id)` também chama `setPhase(id)`.
- **No convidado:**
  - a tela segue o `phase` recebido (`guestScreen`), por enquanto até o `planner`;
  - os botões que trocam de tela ou lançam (`#orbit-back`, `#objective-next`, `#lobby-back`, `#to-assembly`, `#planner-back`, `#launch-button`) ficam desativados, com o texto "Waiting for host";
  - quando o host lança, o convidado vê um toast e espera; o cockpit e a superfície vêm nos itens 5 e 6.
- **Host que recarrega a página** volta para a mesma sala, com a montagem e a tela guardadas no servidor.

### 4. Planner e montagem compartilhados: `web/app.js` ✅
- **Estado `setup`:** o host manda `{world, site, difficulty, rocket}` sempre que algo muda (`syncSetup`), e o convidado copia (`applySetup`). Continuam locais em cada tela: `sel`, `tab` e `detail`.
- **Ações do foguete (`ROCKET_ACTIONS`):** `addStage(index)`, `removeStage(index)`, `stageType(index, tipo)` e `togglePart(id, sel, tab)`. Cada uma confere os argumentos e devolve um texto de erro quando não se aplica.
  - `plan(nome, ...args)`: no solo e no host, aplica e redesenha; no convidado, manda `act('rocket', nome, ...args)`.
  - O host só aceita nomes da tabela, e só no lobby e no planner. Um erro volta só para quem enviou, como toast (`send`).
  - `togglePart` leva o módulo e a aba de quem clicou, porque a seleção é de cada um.
- Depois de uma mudança de outro jogador, se o estágio selecionado sumiu, a seleção cai no booster (`fitSelection`).

### 5. Lançamento e cockpit: `web/app.js` (`SIM`) ✅
- **Lançamento:** ao confirmar, o host manda `event {k:'launch', lift}`. O convidado vê a mesma plataforma e contagem (`ASTRO_LAUNCHPAD`). Se o foguete não sai do chão, cada um mostra o mesmo debrief (`failLaunch`). Num aborto por Δv, o host manda `event {k:'abort', info}`, e todos veem a amerissagem.
- **O host roda o voo** como no solo e manda `state flight` a cada 100 ms e a cada mudança de etapa ou de controles (`flightSnapshot`). Vão os campos de `flight`, os minigames de manter na faixa como números, as linhas do log e o tempo restante das faíscas.
- **O convidado não roda o `flightTick`.** Ele copia o snapshot para dentro do próprio `ASTRO_SIM.flight`, que o cockpit 3D (`web/flight.js`) já lê a cada quadro. Depois redesenha o painel (`renderFlightUI`) se a etapa ou os controles mudaram, ou só o HUD (`updateCockpitHUD`). O `flight.design` sai do mesmo foguete e da mesma dificuldade (`captureDesign`).
- **Quem pilota cada etapa (`STEP_CREW`):**

  | Etapa | Quem age e pilota |
  |---|---|
  | 0 · Liftoff & Max-Q | Helena |
  | 1 · Acoplagem da cabine | Helena |
  | 2 · Acoplagem orbital e transferência | Oscar ou Maya |
  | 3 · Pouso em Marte | Helena |

  Exceções (`ACTION_CREW`): `breaker` e `stage_sep` são do Lucas; `shield_storm`, da Maya. Um personagem da IA vale para o host (`owns`).
- **Ações:** `handleCockpitAction` continua sendo a entrada única (botões, teclas e cliques 3D). Quem não é dono vê um toast ("Helena does that."). O convidado dono manda `act('cockpit', ação, arg)`, e o host confere a vaga carimbada e aplica (`applyCockpitAction`).
- **Pilotagem:** o convidado dono manda as teclas de pilotagem e o direcional na tela (`act('input', teclas, hold)`) quando mudam. O host junta as dele com as de quem pilota a etapa (`inputOf`).
- **Quem não pilota** vê os controles desativados e o aviso "Helena flies this phase: watch the crew work.".
- Os toasts da missão (estrelas do liftoff, acoplagem, pouso, experimentos, tempo esgotado) vão para todos (`crewToast` → `event {k:'toast'}`).

### 6. Superfície (mundo aberto): `web/views.js` e `web/app.js` ✅
**Problema que motivou o desenho:** cada navegador rodava a IA dos colegas e sorteava os locais dos experimentos com `Math.random`, então cada tela mostraria os NPCs e os blocos em lugares diferentes. A regra passou a ser: **a IA roda só no host, e os locais vêm de uma semente do host.**

O servidor não mudou. A `pose` é livre e fica guardada por participante, então o host manda num só pacote o astronauta dele e os da IA.

**Quem move cada astronauta (`driverOf`):**

| Valor | Quem | Como se move |
|---|---|---|
| `me` | O meu (`world.avatar`) | `step()` com teclado e toque, como no solo |
| `ai` | No solo, ou no host para quem não tem jogador | A IA de sempre (passear, `action_loop`, acenar de volta) |
| `player` | Outro jogador, ou a IA vista de um convidado | Desliza até a última pose recebida (`followRemote`) |

O mapa `surf.control` (personagem → id do peer, ou `null` para a IA) vem do host em `state surface`.

**Entrada.**
- O host roda `startSurface()` e sorteia `surf.seed`. Os locais dos blocos saem dessa semente (`placeBlocks(seed)`), então todos os blocos ficam iguais sem esperar o host.
- O host manda `state surface {site, seed, timerSec, completed, control, active}` a cada 500 ms e a cada mudança.
- O convidado entra pela fase `surface` com esse estado (`applySurface`). Cada um começa no próprio astronauta.
- **O timer só começa quando todos carregaram o terreno.** Cada convidado manda `act('loaded')`, e o host espera no máximo 20 s (`LOAD_WAIT_MS`).

**Pose (~10 Hz).**
- Cada tela manda `pose {av: {<personagem>: {x, y, z, yaw, anim, spd}}}` com os astronautas que move. O host inclui os da IA.
- `anim` é `idle`, `walk`, `wave` ou `action`. Vale para os emotes do jogador e para os estados da IA.
- A pose só sai quando muda, e no mínimo 1 vez por segundo.
- Quem entra ou volta aplica as últimas poses guardadas (`ASTRO_NET.poses`).

**Movimento dos outros (`player`):**
- O astronauta desliza até a última pose (`FOLLOW_RATE`). Um salto maior que `SNAP_M` (5 m) acontece de uma vez.
- A animação segue o `anim` da pose.
- Ao trocar quem move um astronauta, a pose antiga é descartada.

**Trocar de personagem (teclas 1–4 e barra da tripulação).**
- No multiplayer, o pedido vai para o host (`requestCrew` → `act('control', id)`). O host só entrega um personagem livre ou da IA (`grantCrew`), e o que você largou volta para a IA no lugar onde estava.
- Os botões dos personagens de outros jogadores ficam desativados ("player").
- Quem sai da sala de vez devolve o personagem para a IA (`onPeers`).

**Minigames sem congelar o mundo.**
- Com o minigame aberto, o meu astronauta fica parado (`step(dt, false)`), e os outros e a IA continuam se mexendo.
- **Timer (regra nova, `game-balance`):** no multiplayer, o timer da janela de retorno não pausa durante os minigames. No solo, continua pausando.

**Experimentos.**
- O minigame roda no navegador de quem move o dono do experimento.
- Ao terminar, o convidado manda `act('task', id)` e já vê o bloco concluído. O host confere pelo `control` (`completeSurfaceTask(id, from.id)`).
- O bloco concluído por outro jogador aparece como feito em todas as telas (`markDone`).

**Embarque (regra do time, `game-balance`).**
- **Só embarca com todos os jogadores online no lander**, a até `BOARD_REACH` mais `BOARD_SLACK_M` (1,5 m), porque o host vê os outros com um pequeno atraso.
- O E no lander, ou o botão "Board & depart", pede o embarque (`act('board')` no convidado). Se alguém está longe, quem pediu vê "Waiting for the crew at the lander: Oscar.".
- **Se o tempo acabar, fica em Marte quem não voltou:** quem está a mais de 35 m do lander, jogador ou IA, como no solo.

**Fica local em cada tela:** câmera, capacete, bússola, objetivos, etiquetas, emote wheel e movimento reduzido.

**Ficou para depois:** o aceno de volta dos NPCs quando um convidado olha para eles (hoje só reage à câmera do host) e as etiquetas com o nome dos jogadores.

### 7. Resultados ✅
- O host manda `event {k:'results', forced, flight, surf}` com os números finais. O convidado copia esses números e roda o mesmo `showResults`, que não tem sorteio.
- "Retry" e "Replay" são do host. Eles limpam `state flight` e `state surface` na sala e levam todos de volta ao planner ou ao lobby. A sala continua aberta.

### 8. Áudio
- Cada cliente toca o próprio som: o fundo da superfície ao entrar nela. Os tons do cockpit tocam só no host, por enquanto.
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
