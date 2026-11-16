# Servidor de salas (multiplayer)

Servidor WebSocket das partidas cooperativas (até 4 jogadores). Cuida de **salas, vagas, fase e repasse de mensagens**, e não conhece as regras do jogo:

- quem cria a sala é o **host**, e o navegador dele roda as regras (`flightTick`, `surfaceTick`, `showResults`);
- os outros mandam intenções e recebem o estado.

O plano de como o `index.html` usa isto está em [docs/multiplayer.md](../docs/multiplayer.md).

Pacote separado do resto do repositório: tem `package.json` próprio, a única dependência é `ws`, e precisa de Node ≥ 22.

```text
config.mjs             limites e padrões (vagas, fases de entrada); tudo sobrescrevível por variável de ambiente
rooms.mjs              lógica das salas, sem rede (testável com relógio falso)
server.mjs             HTTP (/health, página de teste) + WebSocket em /ws
client/room-client.js  window.RoomClient para o navegador (script clássico, funciona em file://)
demo/index.html        página de teste
deploy/                VM no GCP: criar a VM, instalar e atualizar (setup.sh), Caddy e systemd
test/                  node:test: unidade (rooms) e integração (servidor + RoomClient)
```

## Rodar e testar

```bash
cd multiplayer
npm install
npm test          # unidade + integração, precisa passar sem ✖
npm start         # http://localhost:8787/ abre a página de teste
```

**Na página de teste:**
1. Uma janela clica em **Create room** e copia o link (`?room=CODE`).
2. Outra janela, ou outro aparelho, abre o link e entra.
3. Daí dá para trocar de vaga, mudar a fase (host) e mandar mensagens em cada canal.
4. Recarregar a página volta para a mesma vaga.

A página também abre direto do disco: `multiplayer/demo/index.html?server=ws://localhost:8787/ws`.

## Protocolo (v1)

Mensagens JSON. `create`, `join` e `resume` levam `v: 1`. Todo erro volta como `{t:'error', code, ref}`, onde `ref` é o tipo da mensagem que falhou.

### Cliente → servidor

| Mensagem | Quem pode | Efeito |
|---|---|---|
| `create {seat?, seats?, joinable?, phase?, meta?}` | Qualquer um | Cria a sala; quem cria vira host. Sem listas, usa as do jogo atual (`config.mjs`) |
| `join {code, seat?, meta?}` | Qualquer um, só em fase de entrada | Entra na vaga pedida ou na primeira livre |
| `resume {code, id, token}` | Quem caiu, em qualquer fase | Volta para a mesma vaga |
| `seat {seat}` | Convidado, só em fase de entrada | Troca para uma vaga livre |
| `meta {meta}` | Qualquer um | Atualiza o próprio `meta` (objeto livre, até 512 B) |
| `phase {phase}` | Host | Muda a fase da sala (a tela atual do jogo) |
| `state {key, data}` | Host | Estado para os convidados. **Guardado** por `key`; `data: null` apaga |
| `event {data}` | Host | Evento único para os convidados (toast, som, resultado) |
| `act {data}` | Convidado | Intenção para o host, com quem enviou carimbado |
| `pose {data}` | Qualquer um | Para os outros. **A última fica guardada** por participante |
| `send {to, data}` | Qualquer um | Repasse livre: `to` = `host`, `all` (inclui você), `others` ou um id |
| `leave` | Qualquer um | Sai da sala. Se for o host, a sala fecha |

### Servidor → cliente

| Mensagem | Conteúdo |
|---|---|
| `created` / `joined` / `resumed` | `{code, you:{id, seat, token}, host, seats, joinable, phase, peers, state, poses}`: quem chega já recebe o estado guardado e as últimas poses |
| `peers` | `{host, seats, peers:[{id, seat, host, online, meta}]}` a cada mudança de presença |
| `phase`, `state`, `event` | O que o host enviou |
| `act`, `pose`, `msg` | `{from:{id, seat}, data}`. O `from` é carimbado pelo servidor, então o host pode confiar na vaga de quem enviou |
| `closed {reason}` | `host-left`, `expired`, `server` ou `replaced` (a mesma vaga foi retomada em outra conexão) |
| `left` | Confirma o `leave` |

**Códigos de erro:** `bad-version`, `bad-message`, `already-in-room`, `not-in-room`, `room-not-found`, `room-full`, `in-progress`, `seat-taken`, `bad-seat`, `bad-token`, `not-host`, `not-guest`, `host-offline`, `peer-not-found`, `too-many-rooms`, `too-many-keys`, `rate-limited`, `too-large`.

### Ciclo de vida
- O código da sala tem 4 caracteres e não usa os que se confundem (sem 0/O nem 1/I/L).
- Quem cai fica `online: false` e pode voltar com `resume` por 30 s. Depois disso, a vaga fica livre (no jogo, volta para a IA).
- Se o host cair e não voltar em 30 s, a sala fecha para todos.
- A sala vence em 4 h.
- O servidor manda ping a cada 25 s e derruba quem não responde.
- **As salas ficam só na memória:** se o servidor reiniciar, as partidas abertas se perdem.

## Configuração (variáveis de ambiente)

Os valores padrão estão em [config.mjs](config.mjs). Os principais:

| Variável | Padrão | Uso |
|---|---|---|
| `PORT` | 8787 | O Cloud Run define 8080 sozinho |
| `HOST` | vazia (todas as interfaces) | `127.0.0.1` atrás de um proxy na mesma máquina (o Caddy da VM) |
| `ALLOWED_ORIGINS` | vazia (aceita tudo) | Origens que podem abrir o WebSocket, separadas por vírgula. `null` = páginas abertas em `file://` |
| `DEFAULT_SEATS` | `helena,lucas,oscar,maya` | Vagas quando o host não manda as suas. A primeira é a do host |
| `DEFAULT_JOINABLE` | `menu,orbit,lobby,planner` | Fases em que dá para entrar; depois do lançamento, só `resume` |
| `MAX_PEERS` | 4 | — |
| `MAX_ROOMS` | 500 | — |
| `MAX_MESSAGE_BYTES` | 16384 | — |
| `RATE_PER_SEC` / `RATE_BURST` | 60 / 120 | — |
| `RESUME_GRACE_MS` | 30000 | — |
| `ROOM_TTL_MS` | 4 h | — |

## Cliente (`client/room-client.js`)

```js
const room = new RoomClient({ url: 'wss://…/ws' });
await room.create();                         // host, ou: await room.join(RoomClient.codeFromUrl())
const link = RoomClient.linkFor(room.code);  // a mesma página com ?room=CODE
room.on('peers', peers => …);                // também: welcome, phase, state, event, act, pose, msg, status, closed, error
room.setPhase('planner'); room.setState('planner', snapshot); room.emit({ k: 'toast', text });   // host
room.act({ name: 'togglePart', args });      // convidado
room.pose({ x, z, yaw });                    // qualquer um
```

- Se a conexão cair, o cliente reconecta e retoma a vaga sozinho, por até 35 s.
- O `sessionStorage` guarda a sessão: depois de recarregar a página, `room.rejoin()` volta para a mesma vaga, e `room.join(code)` tenta retomar antes de entrar como novo.
- Enquanto está reconectando, os envios voltam `false` e não são guardados.

## Deploy (GCP, VM com Caddy)

Uma VM serve tudo no mesmo domínio:
- **o jogo:** os arquivos estáticos do repositório;
- **o servidor de salas:** em `/ws`, atrás do Caddy;
- **o HTTPS:** o Caddy pede e renova o certificado do Let's Encrypt sozinho.

```text
navegador ──https/wss──> Caddy (:443) ──/ws, /health──> node server.mjs (127.0.0.1:8787, systemd)
                                     └─ o resto ──────> /srv/astro-romana (checkout do repositório)
```

| Arquivo em `deploy/` | O que faz |
|---|---|
| `gcp-create-vm.sh` | Cria o IP fixo, a regra de firewall (80, 443) e a VM Debian em São Paulo. Roda no Cloud Shell |
| `setup.sh` | Na VM, instala e atualiza tudo: Node 22, Caddy, usuário `astro`, checkout em `/srv/astro-romana`, serviço e Caddyfile |
| `astro-rooms.service` | Serviço do systemd do servidor de salas (reinicia sozinho, só escuta em `127.0.0.1`) |
| `Caddyfile.site` | O site: `/ws` e `/health` para o servidor, o resto estático. Esconde `.git` e `node_modules` |

**Primeira vez:**
1. **Criar a VM.** No [Cloud Shell](https://shell.cloud.google.com/), com o projeto selecionado (`gcloud config set project <id>`), rode `bash gcp-create-vm.sh` (envie o arquivo pelo menu ⋮ → Upload, ou cole o conteúdo).
   - Ele mostra o IP externo.
   - Com domínio próprio, crie um registro A apontando para esse IP antes do passo 3.
   - Sem domínio, o site fica em `https://<ip-com-hífens>.sslip.io`.
2. **Entrar na VM:** botão SSH na página da VM, ou `gcloud compute ssh astro-romana --zone southamerica-east1-a`. Envie o `setup.sh` pelo botão de upload da janela SSH.
3. **Instalar:** `sudo bash setup.sh [domínio] [email]`. Os dois argumentos são opcionais: sem domínio, usa o sslip.io; o email serve para avisos do Let's Encrypt.
   - Na primeira vez o script para e mostra uma **deploy key**, porque o repositório é privado.
   - Adicione a chave em GitHub → Settings → Deploy keys, **sem** "Allow write access".
   - Rode o mesmo comando de novo.
4. **Conferir:**
   - o jogo em `https://<domínio>/`;
   - a página de teste das salas em `https://<domínio>/multiplayer/demo/`;
   - `https://<domínio>/health`, que responde `{"ok":true,…}`.

**Atualizar** (depois de um push na `main`): `sudo bash /srv/astro-romana/multiplayer/deploy/setup.sh`.
- Os arquivos do jogo mudam na hora.
- O servidor de salas só reinicia se algo em `multiplayer/` mudou, e aí as salas abertas fecham. Evite atualizar no meio de uma partida.
- O domínio e o email ficam guardados em `/etc/astro-romana/site.env`. Para trocar o domínio, passe o novo como argumento.

**No dia a dia:**
- **Logs:** `journalctl -u astro-rooms -f` e `journalctl -u caddy -f`.
- **Reiniciar:** `sudo systemctl restart astro-rooms`.
- **Origens permitidas:** `https://<domínio>` e `null` (páginas em `file://`), em `/etc/astro-romana/rooms.env`. O `setup.sh` reescreve esse arquivo.
  - Para o jogo no GitHub Pages usar esta VM (`…github.io/…?server=wss://<domínio>/ws`), rode `sudo EXTRA_ORIGINS=https://<usuário>.github.io bash /srv/astro-romana/multiplayer/deploy/setup.sh`.
  - O valor fica guardado como o domínio.
- **Custo:** a VM fica ligada o tempo todo. O padrão é `e2-small`, e `MACHINE=e2-micro bash gcp-create-vm.sh` usa uma menor. Pare a VM quando não precisar dela; o IP fixo continua reservado.
- **Se o certificado falhar com sslip.io** (limite de emissões do Let's Encrypt), use um domínio próprio.

### Alternativa: Cloud Run (sem VM)

Só o servidor de salas, com HTTPS automático em `*.run.app`. O jogo fica hospedado em outro lugar, como o Firebase Hosting. Pelo [Cloud Shell](https://shell.cloud.google.com/) ou por uma máquina com `gcloud`, na raiz do repositório:

```bash
gcloud run deploy astro-romana-rooms --source multiplayer --region southamerica-east1 \
  --allow-unauthenticated --max-instances 1 --concurrency 1000 --timeout 3600 \
  --set-env-vars "^;^ALLOWED_ORIGINS=https://<origem-do-jogo>,null"
```

- `--max-instances 1`: as salas ficam na memória de uma instância só. Com duas, jogadores da mesma sala poderiam cair em instâncias diferentes.
- `--concurrency 1000`: cada WebSocket aberto conta como uma requisição. O padrão de 80 limitaria a 20 salas cheias.
- `--timeout 3600`: é o máximo de uma conexão no Cloud Run (60 min). O cliente reconecta e retoma sozinho.
- **Na demo**, acrescente `--min-instances 1` para não haver partida a frio. Tire depois, para não pagar a instância parada.
- O `^;^` troca o separador do `--set-env-vars`, porque a lista de origens já usa vírgula.

**Depois do deploy:**
1. O `https://<serviço>.run.app/health` responde `{"ok":true,…}`.
2. A página de teste fica em `https://<serviço>.run.app/`.
3. O jogo vai usar `wss://<serviço>.run.app/ws`.
