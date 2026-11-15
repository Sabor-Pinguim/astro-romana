# AGENTS.md: regras de desenvolvimento do Astro Romana

Regras para **qualquer pessoa ou agente de IA** (Claude Code, OpenAI Codex, Google Antigravity, Cursor etc.) que mexer neste repositório.

- Este é o **único** arquivo de instruções para agentes: as ferramentas acima o leem sozinhas (veja a seção 14). Não crie cópias por ferramenta.
- Se uma regra daqui conflitar com o pedido de alguém do time, pergunte antes de seguir.
- Se o time mudar uma regra, atualize este arquivo no mesmo commit.

---

## 1. O projeto

Jogo cooperativo (1 a 4 jogadores) para o **NASA Space Apps Challenge 2026**, desafio "Space Mission Design Game". Os jogadores projetam e operam uma missão científica a Marte, equilibrando massa, energia, orçamento, dados, comunicação e tempo de vida.

| Documento | Conteúdo |
|---|---|
| [docs/description.md](docs/description.md) | Enunciado oficial do desafio (em inglês) |
| [docs/characters.md](docs/characters.md) | Os 4 personagens jogáveis e os recursos de cada um |
| [docs/minigames.md](docs/minigames.md) | Experimentos e minigames por personagem |
| [references/experiments/](references/experiments/) | Dados reais de missões, com fontes |
| [references/parts/parts.md](references/parts/parts.md) | Peças reais de foguete (motores, tanques): tiers, dados, fotos e instruções low poly |
| [references/datasets/msl-rad/](references/datasets/msl-rad/) | Radiação medida pelo detector RAD do Curiosity, com fonte |
| [references/datasets/earth/](references/datasets/earth/) | Grades globais da Terra (cobertura do solo, relevo, gelo marinho) que geram o planeta low poly |
| [docs/visual-identity.md](docs/visual-identity.md) | Identidade visual (low poly facetado): paleta, fontes, formas, arte gerada, como levar ao Godot |
| [docs/audio.md](docs/audio.md) | Paisagem sonora gerada a partir desses dados de radiação |

---

## 2. Estrutura do repositório

```text
docs/                   design do jogo (PT-BR) e material do desafio
references/             dados reais com fontes (EN): experimentos, peças, datasets
godot/                  projeto Godot 4.7 (o jogo)
  assets/models/        GERADO: GLBs + manifest.json (não editar à mão)
  assets/audio/         GERADO: WAVs + manifest.json (não editar à mão)
tools/
  modeling/             gerador procedural dos modelos 3D (Node + three.js)
    characters/<id>.mjs um arquivo por personagem: equipamento + animação de ação
    bodies/<id>.mjs     um arquivo por planeta/lua: dados reais → classe de cada face
    lib/                rig, formas, paleta, animações, presets de partículas
  audio/                gerador da paisagem sonora a partir de dados reais (Node, sem dependências)
  model-viewer/         visualizador HTML para validar modelos
  godot/                scripts de verificação headless do Godot
  web/                  empacota modelos e specs usados pelo index.html (index.models.js)
package.json            dependências e scripts dos geradores (npm run models, npm run audio)
```

---

## 3. Stack e decisões técnicas

| Tema | Decisão | Por quê |
|---|---|---|
| Entrega executável (MVP Hackathon) | **Web / JavaScript + Three.js (`0.186.1`)** em `index.html` + `index.models.js` | Reaproveita 100% das telas 3D/2D já prontas, os GLBs e os WAVs gerados; roda direto no navegador (`file://` ou hospedado) sem fricção de export |
| Assets compartilhados | `godot/assets/models/` e `godot/assets/audio/` + Godot 4.7.2 | Mantêm-se como diretórios canônicos de saída dos geradores offline e base futura caso o projeto retome build nativa |
| Linguagem (código do jogo MVP) | **HTML / CSS / JS (ES modules CDN)** sem etapa de build | Edição imediata, zero dependências de runtime além do Three.js 0.186.1 |
| GDScript (opcional / legado futuro) | **GDScript** (sem C#) / **GL Compatibility** / Thread Support desligado | Mantido caso o time decida portar o MVP web para executável/servidor Godot dedicado pós-hackathon |
| Física (referência Godot) | Jolt (configurado em `project.godot`) | Padrão do projeto Godot |
| Multiplayer, protótipo web / futuro | Simulação cooperativa local com tripulação IA em `index.html` (multiplayer P2P/WebSocket opcional pós-hackathon) | Garante entrega jogável das 7 fases no prazo do desafio |
| Ferramentas | Node ≥ 20; `three` fixado em **0.186.1** (mesma versão nos import maps do visualizador e do `index.html`) | Builds reprodutíveis |

---

## 4. Regras de código

### GDScript (jogo)
- **Estilo:** siga o [guia oficial](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_styleguide.html).
  - `snake_case` para arquivos, funções e variáveis.
  - `PascalCase` para `class_name` e nomes de nós.
  - `CONSTANT_CASE` para constantes.
- **Tipagem estática obrigatória:** `var power_w: float`, `func launch() -> void`.
- **Sinais no passado:** `mission_launched`, `data_downlinked`.
- **Acesso a nós:** use `%UniqueName` / `@onready`, em vez de caminhos longos com `get_node`.
- **Números de balanceamento** (massa, potência, custo) ficam em `Resource` (`.tres`) ou arquivos de dados, nunca espalhados no código. Cada valor diz se é real (com a fonte em `references/`) ou de jogo (`game-balance`).
- **Multiplayer:**
  - Mudanças de estado só no servidor (`multiplayer.is_server()`).
  - Clientes pedem por RPC, e o servidor valida a entrada.
- **Compatível com web:**
  - Nada de threads nem APIs exclusivas de um sistema operacional.
  - ENet só fora da web: esconda essas opções com `OS.has_feature("web")`.
- **Verificação:** rode headless antes de concluir (veja a seção 11).

### HTML (jogo web executável, `index.html`)
- **Identidade visual:** siga [docs/visual-identity.md](docs/visual-identity.md) (low poly facetado, paleta, fontes, formas, arte gerada). Se mudar o visual, atualize esse arquivo no mesmo commit.
- **Arquivo único, sem build.** O three.js vem do CDN, na mesma versão fixada do visualizador. A tela tem que funcionar sem WebGL (o mapa 2D e a planta 2D são o fallback).
- **3D e dados na página:** vêm de `index.models.js`, gerado por `npm run web:models` (o `file://` bloqueia `fetch`); `npm run models` já o roda.
- **Teste** em 1440 px e 390 px de largura e com movimento reduzido.

### JavaScript (ferramentas)
- Módulos ES puros (`.mjs`), sem etapa de build.
- Dependências novas só se necessárias, sempre com **versão exata**.
- Ferramentas não contêm lógica de jogo.

---

## 5. Pipeline de modelos 3D (avatares)

### 5.1 O código é a fonte da verdade
- Os GLBs em `godot/assets/models/` são **gerados** por `tools/modeling/`.
- **Nunca edite um GLB à mão**, nem no Blender: a próxima geração sobrescreve.
- **Para mudar um personagem**, edite `tools/modeling/characters/<id>.mjs`.
- **Para mudar o que é comum a todos**, edite `tools/modeling/lib/`.
- O gerador usa three.js (formas, hierarquia, `AnimationClip`) e exporta com `GLTFExporter`.

### 5.2 Convenções geométricas
- **Unidades:** metros; **+Y** é para cima.
- **Frente:** o personagem olha para **+Z** (`Vector3.MODEL_FRONT` no Godot).
- **Lados:** o lado esquerdo do personagem é **+X**.
- **Origem:** entre os pés, no chão (y = 0).
- **Altura:** topo do capacete entre 1,75 e 1,95 m; com acessórios, no máximo 2,4 m.

### 5.3 Estilo e orçamento

| Regra | Limite |
|---|---|
| Triângulos por avatar | **≤ 3.000** |
| Meshes (≈ draw calls) por avatar | **≤ 50** |
| Tamanho do GLB | ≤ 400 KB |
| Texturas | **nenhuma**: só cores da paleta |

- **Low poly facetado:** a geometria não é indexada e tem normal por face, o que garante o sombreamento chapado também no Godot.
- **Segmentos baixos:** cilindros de 5 a 10 lados.
- **Materiais:** só os da paleta compartilhada (`lib/palette.mjs`). A cor de identidade do personagem vai em `Accent` (e `Screen` para telas e LEDs).
- **Equipamento:** todo item visível precisa de uma **base real** registrada em `equipment` (item + base). As fotos de referência da NASA ficam listadas no `manifest.json`.
- **Símbolos:**
  - Sem logos ou insígnias reais (como as da NASA).
  - Sem cruz vermelha, que é emblema protegido. Para primeiros socorros, use cruz branca em fundo verde (ISO 7010).

### 5.4 Rig compartilhado
Todos os avatares têm **os mesmos 15 pivôs, com os mesmos nomes**. Assim as animações e o código do jogo valem para qualquer personagem:

```text
Hips > Torso > Head
             > UpperArm_L > LowerArm_L > Hand_L
             > UpperArm_R > LowerArm_R > Hand_R
     > UpperLeg_L > LowerLeg_L > Foot_L
     > UpperLeg_R > LowerLeg_R > Foot_R
```

- Pivôs são nós vazios na articulação. As meshes ficam como filhas e se chamam `<Pivô>_<Material>`.
- **Não renomeie pivôs.** Para adicionar um, atualize juntos:
  - `RIG` em `lib/avatar.mjs`;
  - `validate.mjs`;
  - `tools/godot/check_models.gd`;
  - este arquivo.
- Não use escala negativa (inverte as faces): espelhe pela posição.

### 5.5 Animações
- **Obrigatórias:** `idle_loop`, `walk_loop`, `wave`, `action_loop` (a ação própria de cada personagem).
- **Sufixo `_loop`:** o importador do Godot marca a animação como loop e **remove o sufixo**. No jogo os nomes ficam `idle`, `walk`, `action` (em loop) e `wave` (toca uma vez).
- **Definição:** cada animação é uma função `pose(u)` com `u ∈ [0, 1]`, com rotações em graus e posições em metros relativas ao repouso. Em loops, `pose(0)` precisa ser igual a `pose(1)`.
- **Sinais de rotação:**

  | Movimento | Rotação |
  |---|---|
  | Membro para a frente | X negativo |
  | Dobrar joelho ou tronco para a frente | X positivo |
  | Braço esquerdo para fora | Z positivo |
  | Braço direito para fora | Z negativo |

- **Mão direita:** segura as ferramentas. Gestos genéricos (como o aceno) usam a mão **esquerda**.

### 5.6 Partículas
O glTF não transporta partículas, então o projeto usa âncoras:
- **Âncoras:** nós vazios chamados `FX_<Nome>`. Emitem ao longo do seu **+Y local** e guardam `userData.fx = "<preset>"`, que vira `extras` no glTF.
- **Registro:** cada âncora é registrada com `clips`, a lista de animações em que fica ativa. Exemplo: o propulsor da Helena só liga em `action_loop`.
- **Presets:** ficam em `lib/fx-presets.mjs`, em unidades SI, com a gravidade de Marte de 3,71 m/s². O gerador os copia para o `manifest.json`.
- **No Godot:** os `GPUParticles3D` devem ser criados a partir desses mesmos números.
- **Âncoras atuais:**

  | Âncora | Personagem | Preset |
  |---|---|---|
  | `FX_Thruster_L/R` | Helena | thrust |
  | `FX_Sparks` | Lucas | sparks |
  | `FX_Antenna` | Oscar | signal |
  | `FX_Scoop` | Maya | dust |
  | `FX_Foot_L/R` | todos | footdust |

### 5.7 Fluxo obrigatório ao mudar um modelo
1. `npm run models`: gera e valida. Precisa passar sem ✘; o validador oficial da Khronos não pode reportar erros.
2. `godot --headless --path godot --import`, depois `godot --headless --path godot --script "$PWD/tools/godot/check_models.gd"`. Precisa terminar com `RESULT: OK`.
3. Abra o visualizador (seção 6) e confira visualmente cada animação, as partículas e os pivôs (opção "Pivôs do rig e âncoras FX").
4. Faça commit **junto** do código-fonte, dos GLBs, do `manifest.json` e dos arquivos `.import`.

### 5.8 Planetas e luas (`bodies/`)
- **Gerados de dados reais:** `build-bodies.mjs` lê só as grades já baixadas em `references/datasets/<corpo>/` (sem rede). Para baixar de novo: `npm run models:fetch:bodies`.
- **Convenções:** raio médio = 1 (o jogo escala; o raio real vai no `manifest.json`); +Y = polo norte; +Z = lat. 0°/long. 0°; +X = 90° L.
- **Relevo exagerado** (`game-balance`, valor no manifesto). Âncoras `Site_*` na superfície: +Y para cima, +X leste, −Z norte.
- **Cores:** só as da paleta `BODY` em `lib/palette.mjs`. O orçamento fica no arquivo de cada corpo, e as mesmas regras de commit da seção 5.7 valem aqui.

---

## 6. Visualizador de modelos (`tools/model-viewer/`)

- **É um HTML puro:** abra `tools/model-viewer/index.html` (duplo clique) e escolha `godot/assets/models` (ou a raiz do repositório, ou arraste a pasta). Precisa de internet para o three.js do CDN.
- **Chrome/Edge:** lembra a pasta e **recarrega sozinho** quando o `manifest.json` muda (depois de `npm run models:build`). No Firefox, use "Trocar pasta…" para recarregar.
- **Página hospedada:** num servidor (GitHub Pages, por exemplo) carrega `godot/assets/models/manifest.json` sozinha; para outro arquivo, use `?manifest=<url relativa>`.
- **Recursos:** animações, partículas por âncora, cenário de Marte ou estúdio, wireframe, pivôs/âncoras e validação por modelo. Dá para arrastar um `.glb` avulso para a tela.
- **Escopo:** é ferramenta de **validação**. Não coloque lógica de jogo nele.

---

## 7. Pipeline de áudio (paisagem sonora da radiação)

- **O código é a fonte da verdade:** `tools/audio/` gera o som offline dos dados reais do RAD (`references/datasets/msl-rad/`). Os WAVs em `godot/assets/audio/` são **gerados**: edite o código e rode `npm run audio`.
- **Nada de síntese em tempo real:** a exportação web sem threads toca no modo "Sample" (sem efeitos; `AudioStreamGenerator` pode picotar). O jogo só toca arquivos prontos e ajusta volume.
- **Sem dependências:** JavaScript puro. O gerador é determinístico: os mesmos dados e o mesmo código geram os mesmos bytes.
- **Arquivos gerados:**

  | Arquivo | Tipo | Uso no jogo |
  |---|---|---|
  | `rad_surface_bed.wav` | loop, 40 s | Fundo na superfície de Marte |
  | `rad_storm_2024_05_20.wav` | único, 32 s | Tempestade solar real, por cima do fundo |
  | `geiger_click_<n>.wav` | únicos, 50 ms | Contador Geiger; a taxa segue a dose (parâmetros no `manifest.json`) |

- **Loops:** o WAV leva um chunk `smpl`, que o Godot lê sozinho (importação "Detect From WAV"). Gere loops com `closeLoop()` (`lib/wav.mjs`): o Godot repete os quadros `início+1 … fim`, e o quadro extra deixa a emenda exata.
- **Formato:** PCM 16 bits. Ambientes em 24 kHz estéreo (cada arquivo abaixo de 5 MB); efeitos em 44,1 kHz mono. O Godot importa com compressão QOA.
- **Escolhas musicais** (tom de Ré, escala pentatônica menor, volumes, compressão de tempo) são `game-balance`. Os eventos e as curvas que as controlam vêm dos dados. O mapeamento está em [docs/audio.md](docs/audio.md) e no `manifest.json`.
- **Fluxo ao mudar o áudio:**
  1. `npm run audio`: gera e valida. Precisa passar sem ✘.
  2. `godot --headless --path godot --import`, depois `godot --headless --path godot --script "$PWD/tools/godot/check_audio.gd"`. Precisa terminar com `RESULT: OK`.
  3. Ouça os arquivos: a validação não julga se o som ficou bom.
  4. Faça commit **junto** do código, dos WAVs, do `manifest.json` e dos arquivos `.import`.

---

## 8. Dados científicos e textos do jogo

- **Números "reais":** tudo que for apresentado ao jogador como real vem de `references/`, com a fonte.
- **Marcas nas referências:**
  - **⚠** = fontes divergem: confira antes de usar como fato.
  - **n/f** = não encontrado: use um valor de jogo e marque como fictício.
- **Marcas extras:** `derived` = calculado a partir de outros valores (com a fórmula); `est.` = estimado por nós (diz como).
- **Peças de foguete:** pasta `references/parts/<engines|tanks|structures>/<id>/` com `README.md` no formato de `_template.md` (mesmas seções e chaves) e fotos. Os números de jogo e de simulação de cada peça (com a fonte de cada um) ficam em `tools/modeling/parts/specs.mjs` e saem no `manifest.json` das peças.
- **Fotos de referência:** só com licença livre (domínio público, CC0, CC BY, CC BY-SA), com fonte, autor e licença na tabela do README. As demais entram só como link.
- **Cards "Fato real":** nunca invente fatos.
- **Datas:** o "hoje" do projeto segue a data real. Status de missões (operando, perdida, cancelada) devem ser conferidos quando forem usados.

---

## 9. Idioma

| O quê | Idioma |
|---|---|
| Docs de design do time (`docs/`) | PT-BR |
| Textos vistos pelo jogador (telas, nomes e descrições das peças) | Inglês |
| Enunciado do desafio e `references/` | Inglês |
| Código, identificadores, nomes de nós, arquivos e commits | Inglês |

---

## 10. Git

- **Commits:** no padrão já usado pelo time (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`), em inglês.
- **Fazer commit de:** arquivos `.import` do Godot e assets gerados (assim quem não tem Node consegue abrir o projeto).
- **Nunca fazer commit de:**
  - `godot/.godot/`
  - `node_modules/`
  - builds exportadas
  - áudios de rascunho
- **Binários grandes:** acima de 5 MB, só depois de combinar com o time.

---

## 11. Checklist antes de concluir uma tarefa

- [ ] `npm run models` passa (se tocou em modelos).
- [ ] `check_models.gd` retorna `RESULT: OK` (se tocou em modelos ou na importação).
- [ ] `npm run audio` passa e `check_audio.gd` retorna `RESULT: OK` (se tocou em áudio ou na importação).
- [ ] Os scripts GDScript carregam sem erro no modo headless.
- [ ] O visualizador abre sem erros no console.
- [ ] Nenhum número apresentado como real ficou sem fonte.
- [ ] Docs e este arquivo atualizados, se alguma convenção mudou.

---

## 12. Comandos

```bash
npm install                    # uma vez: three + validador glTF
npm run models                 # gera os 4 avatares e valida
npm run models:build -- maya   # gera só um personagem
npm run models:validate        # só valida
npm run web:models             # empacota GLBs e specs usados pelo index.html em index.models.js
npm run models:build:bodies    # gera os planetas (ex.: -- earth)
# visualizador: abrir tools/model-viewer/index.html no navegador e escolher godot/assets/models
npm run audio                  # gera a paisagem sonora e valida
npm run audio:fetch            # baixa de novo os dados do RAD (só para mudar as janelas de dados)

godot --headless --path godot --import
godot --headless --path godot --script "$PWD/tools/godot/check_models.gd"
godot --headless --path godot --script "$PWD/tools/godot/check_audio.gd"
```

---

## 13. Referências para quem for mexer no pipeline

- **Skills de three.js:** [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills) (MIT). Ler `threejs-geometry`, `threejs-animation` e `threejs-asset-pipeline` antes de alterar o gerador ou o visualizador.
- **Godot:**
  - [Importing 3D scenes: node type customization](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/node_type_customization.html): sufixos de nome, incluindo animações em loop.
  - [GDScript style guide](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_styleguide.html).
- **Fotos de referência dos trajes:** NASA Image and Video Library. As URLs estão em `references` no `manifest.json`.

---

## 14. Ferramentas de IA que leem este arquivo

| Ferramenta | Como encontra este arquivo | Limite |
|---|---|---|
| OpenAI Codex (CLI, IDE, nuvem) | Lê o `AGENTS.md` de cada pasta, da raiz do Git até a pasta onde foi aberto | 32 KiB somados (`project_doc_max_bytes`) |
| Google Antigravity (App, IDE, CLI `agy`) | Lê o `AGENTS.md` da pasta aberta e das pastas acima até a raiz do repositório; sempre ativo | 24 KB por arquivo; 20 mil tokens somando todas as regras |
| Claude Code | O `CLAUDE.md` da raiz importa este arquivo (`@AGENTS.md`) | — |

- **Tamanho:** mantenha este arquivo abaixo de ~20 KB para caber com folga nos limites acima.
- **Sem cópias:** não crie `GEMINI.md`, `.agents/rules/` nem `AGENTS.override.md` com cópias destas regras. O Antigravity soma todos os arquivos de regras que encontra, e as cópias divergem com o tempo.
- **Regras de uma parte só do projeto:** coloque na seção correspondente daqui. Só divida em arquivos por pasta se este passar do limite.
- **Para conferir o que o agente carregou:**
  - Codex: `codex --ask-for-approval never "Summarize the current instructions."`
  - Antigravity: Customizations → Rules, onde o `AGENTS.md` aparece na lista.
