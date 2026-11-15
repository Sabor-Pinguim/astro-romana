# AGENTS.md: regras de desenvolvimento do Astro Romana

Regras para **qualquer pessoa ou agente de IA** (Claude Code, OpenAI Codex, Google Antigravity, Cursor etc.) que mexer neste repositório.

- Este é o **único** arquivo de instruções para agentes: as ferramentas acima o leem sozinhas (veja a seção 13). Não crie cópias por ferramenta.
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

---

## 2. Estrutura do repositório

```text
docs/                   design do jogo (PT-BR) e material do desafio
references/             dados reais com fontes (EN): experimentos, peças
godot/                  projeto Godot 4.7 (o jogo)
  assets/models/        GERADO: GLBs + manifest.json (não editar à mão)
tools/
  modeling/             gerador procedural dos modelos 3D (Node + three.js)
    characters/<id>.mjs um arquivo por personagem: equipamento + animação de ação
    lib/                rig, formas, paleta, animações, presets de partículas
  model-viewer/         visualizador HTML para validar modelos
  godot/                scripts de verificação headless do Godot
package.json            dependências e scripts do gerador (npm run models)
```

---

## 3. Stack e decisões técnicas

| Tema | Decisão | Por quê |
|---|---|---|
| Engine | **Godot 4.7.2** | Versão instalada e usada pelo time |
| Linguagem | **GDScript** (sem C#) | A exportação web com C# não é confiável |
| Renderizador | **GL Compatibility** | É o único que roda na web; não trocar para Forward+/Mobile |
| Export web | **Thread Support desligado** | Roda em itch.io/hospedagem estática sem headers COOP/COEP |
| Física | Jolt (já configurado em `project.godot`) | Padrão do projeto |
| Multiplayer, rede | Autoload `Network` cria o *peer*; o resto do jogo não sabe qual é | Troca de transporte sem reescrever o jogo |
| Multiplayer, protótipo | P2P via **ENet**, só desktop/editor (*listen server*, host = peer 1) | No navegador, P2P exigiria WebRTC + sinalização |
| Multiplayer, produção | Servidor **dedicado headless** + `WebSocketMultiplayerPeer`, atrás de Caddy (`wss://`) numa VM da GCP | Navegadores só falam WebSocket/WebRTC |
| Autoridade | **O servidor manda no estado**; clientes só pedem ações | Funciona igual em P2P e dedicado |
| Ferramentas | Node ≥ 20; `three` fixado em **0.186.1** (mesma versão no import map do visualizador) | Builds reprodutíveis |

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
- **Verificação:** rode headless antes de concluir (veja a seção 10).

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

---

## 6. Visualizador de modelos (`tools/model-viewer/`)

- **É um HTML puro:** abra `tools/model-viewer/index.html` direto no navegador (duplo clique) e escolha a pasta `godot/assets/models`. Também aceita a raiz do repositório, ou a pasta arrastada para a tela. Precisa de internet para baixar o three.js do CDN.
- **Chrome/Edge:** o navegador lembra a pasta e **recarrega sozinho** quando o `manifest.json` muda, ou seja, depois de `npm run models:build`. No Firefox a pasta é uma cópia do momento: use "Trocar pasta…" para recarregar.
- **Página hospedada:** se o repositório for publicado em algum servidor (GitHub Pages, por exemplo), a página carrega `godot/assets/models/manifest.json` sem perguntar. Para outro arquivo, passe `?manifest=<url relativa>`.
- **Recursos:** animações, partículas por âncora, cenário de Marte ou estúdio, wireframe, pivôs/âncoras e validação por modelo. Dá para arrastar um `.glb` avulso para a tela.
- **Escopo:** é ferramenta de **validação**. Não coloque lógica de jogo nele.

---

## 7. Dados científicos e textos do jogo

- **Números "reais":** tudo que for apresentado ao jogador como real vem de `references/`, com a fonte.
- **Marcas nas referências:**
  - **⚠** = fontes divergem: confira antes de usar como fato.
  - **n/f** = não encontrado: use um valor de jogo e marque como fictício.
- **Marcas extras:** `derived` = calculado a partir de outros valores (com a fórmula); `est.` = estimado por nós (diz como).
- **Peças de foguete:** cada peça tem uma pasta em `references/parts/<engines|tanks>/<id>/` com um `README.md` que segue `references/parts/_template.md` (mesmas seções e chaves) e as fotos.
- **Fotos de referência:** só com licença livre (domínio público, CC0, CC BY, CC BY-SA), com fonte, autor e licença na tabela do README. As demais entram só como link.
- **Cards "Fato real":** nunca invente fatos.
- **Datas:** o "hoje" do projeto segue a data real. Status de missões (operando, perdida, cancelada) devem ser conferidos quando forem usados.

---

## 8. Idioma

| O quê | Idioma |
|---|---|
| Docs de design do time (`docs/`) e textos vistos pelo jogador | PT-BR |
| Enunciado do desafio e `references/` | Inglês |
| Código, identificadores, nomes de nós, arquivos e commits | Inglês |

---

## 9. Git

- **Commits:** no padrão já usado pelo time (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`), em inglês.
- **Fazer commit de:** arquivos `.import` do Godot e assets gerados (assim quem não tem Node consegue abrir o projeto).
- **Nunca fazer commit de:**
  - `godot/.godot/`
  - `node_modules/`
  - builds exportadas
  - áudios de rascunho
- **Binários grandes:** acima de 5 MB, só depois de combinar com o time.

---

## 10. Checklist antes de concluir uma tarefa

- [ ] `npm run models` passa (se tocou em modelos).
- [ ] `check_models.gd` retorna `RESULT: OK` (se tocou em modelos ou na importação).
- [ ] Os scripts GDScript carregam sem erro no modo headless.
- [ ] O visualizador abre sem erros no console.
- [ ] Nenhum número apresentado como real ficou sem fonte.
- [ ] Docs e este arquivo atualizados, se alguma convenção mudou.

---

## 11. Comandos

```bash
npm install                    # uma vez: three + validador glTF
npm run models                 # gera os 4 avatares e valida
npm run models:build -- maya   # gera só um personagem
npm run models:validate        # só valida
# visualizador: abrir tools/model-viewer/index.html no navegador e escolher godot/assets/models

godot --headless --path godot --import
godot --headless --path godot --script "$PWD/tools/godot/check_models.gd"
```

---

## 12. Referências para quem for mexer no pipeline

- **Skills de three.js:** [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills) (MIT). Ler `threejs-geometry`, `threejs-animation` e `threejs-asset-pipeline` antes de alterar o gerador ou o visualizador.
- **Godot:**
  - [Importing 3D scenes: node type customization](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/node_type_customization.html): sufixos de nome, incluindo animações em loop.
  - [GDScript style guide](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_styleguide.html).
- **Fotos de referência dos trajes:** NASA Image and Video Library. As URLs estão em `references` no `manifest.json`.

---

## 13. Ferramentas de IA que leem este arquivo

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
