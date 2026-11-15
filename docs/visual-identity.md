# Identidade visual: low poly facetado

O minigame de reconhecimento da Helena abre em um diálogo sobre a superfície, com uma grade facetada, trajeto âmbar e controles por arrasto, toque ou teclado. A confirmação de conclusão usa um ícone quadrado chanfrado em verde-lima (`#B4DB55`).

Guia para reproduzir o visual do Astro Romana em qualquer tela: web (`index.html`), cartazes e slides. A referência viva é o [index.html](../index.html). Quando este guia e o código divergirem, corrija os dois no mesmo commit.

## 1. A ideia em uma frase

A interface é feita do mesmo material que os modelos 3D: **superfícies planas de cor chapada, cortadas em ângulo**. Cada painel parece uma face de um objeto low poly iluminado de cima e da esquerda. Nada é macio: não há desfoque, vidro, brilho difuso nem canto arredondado.

| Faça | Não faça |
|---|---|
| Facetas com transição dura entre tons (gradiente com parada dura) | Gradiente suave, glassmorphism, `backdrop-filter`, `blur` |
| Cantos chanfrados a 45°, paralelogramos, hexágonos, losangos, setas | `border-radius`, pílulas, círculos perfeitos em botões |
| Separar áreas por **tom** (faceta mais clara ou mais escura) | Bordas finas de 1 px em volta de tudo, sombras projetadas |
| Planetas, terrenos e personagens em triângulos de cor chapada | Fotos, texturas, ícones de emoji, ilustrações com contorno |
| Texto escuro sobre laranja e âmbar | Texto branco sobre laranja (contraste baixo) |
| Movimento curto e mecânico (varredura diagonal, piscar em degraus) | Fade lento, bounce, parallax |

## 2. Paleta

Use só estes tokens. Os nomes são os das variáveis CSS de `:root`.

| Token | Hex | Papel |
|---|---|---|
| `--bg-void` | `#11071F` | Fundo da página; texto sobre laranja e âmbar |
| `--bg-plum` | `#1D1128` | Faceta média dos painéis |
| `--bg-indigo` | `#281147` | Faceta clara, tags, botão secundário |
| `--bg-viewport` | `#17183B` | Fundo de "janelas" para o espaço (mapa orbital, planta do foguete) |
| `--violet-electric` | `#6D28D9` | Reservado para destaques raros |
| `--amethyst` | `#9B5DE5` | Acento frio: abas ativas, Δv, linhas de órbita, citações |
| `--mars-orange` | `#E04F26` | Ação principal, etapa atual, marcador ▲ |
| `--coral-hover` | `#EE7B57` | Faceta clara da ação principal; estado de perigo nos medidores |
| `--crimson-alert` | `#8F241E` | Fundo de alerta |
| `--solar-amber` | `#F59E0B` | Seleção, foco, valores numéricos, rótulos de seção |
| `--starlight-cream` | `#FCE8A6` | Títulos |
| `--text-white` | `#FFFFFF` | Texto de dados |
| `--muted` | `#B9B0CE` | Texto secundário |
| `--safe` | `#7EDAC2` | OK, equipado, energia positiva |

**Tons de faceta** (derivados, para uma mesma superfície): `--f0 #0c0517`, `--f1 #160b25`, `--f2 = --bg-plum`, `--f3 #24143a`, `--f4 = --bg-indigo`. Um painel usa 3 tons próximos; um botão usa 2 tons do mesmo matiz.

**Rampas dos astros** (do escuro para o claro; ficam em `RAMPS` no `index.html`): `mars`, `marsDark`, `ice`, `ocean`, `land`, `jupiter`, `jupiterBand`, `sun`, `rock`, `jezero`, `gale`, `ground`. Cada rampa tem 6 cores. A luz escolhe a cor: a face mais iluminada pega o fim da rampa.

**Cores dos personagens** (variável `--crew` nos cards):

| Personagem | Interface (`index.html`) | Modelo 3D (`Accent`) |
|---|---|---|
| Helena | `#EAA668` | `#D7263D` |
| Lucas | `#7EDAC2` | `#F2A900` |
| Oscar | `#95B8F6` | `#1FA2FF` |
| Maya | `#D5A5EE` | `#2BB673` |

> ⚠ **Pendente:** as duas colunas divergem. O time precisa escolher um conjunto e atualizar o outro lado (`tools/modeling/characters/<id>.mjs` ou a lista `crew` do `index.html`).

## 3. Tipografia

| Uso | Fonte | Peso | Detalhes |
|---|---|---|---|
| Títulos, rótulos, botões, números | **Chakra Petch** | 500–700 | Os cortes angulares das letras combinam com os chanfros. Títulos em CAIXA ALTA. Números com `tabular-nums` |
| Texto corrido | **Barlow** | 400–600 | Itálico só em citações |

- **Rótulo de seção ("eyebrow"):** Chakra Petch 600, 0,7 rem, CAIXA ALTA, espaçamento 0,14 em, âmbar, precedido de um triângulo ▲ laranja desenhado em CSS.
- **Título do menu:** três linhas desalinhadas. A primeira em creme, a segunda em ametista recuada 0,5 em, a terceira em laranja dentro de um paralelogramo.
- As duas fontes são OFL (Google Fonts) e podem ser embarcadas em qualquer build.
- Não use Inter nem Space Grotesk: são a cara de interface genérica.

## 4. Formas

Todas são `clip-path` no CSS.

| Forma | Onde | Receita CSS |
|---|---|---|
| Chanfro duplo (cantos superior esquerdo e inferior direito) | Painéis (`.slab`), diálogos, cards | `polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)` |
| Paralelogramo | Botões, abas, chaves, toast | `polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%)` |
| Seta encadeada | Etapas do planejamento e rota da missão | `polygon(0 0,calc(100% - 14px) 0,100% 50%,calc(100% - 14px) 100%,0 100%,14px 50%)`, com margem negativa para encaixar |
| Hexágono | Números de etapa, botão fechar, ícones de local, pedestal | `polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)` |
| Losango | Pontos de status, estrelas | `polygon(50% 0,100% 50%,50% 100%,0 50%)` |
| Anel hexagonal | Retícula de seleção de planeta (gira devagar) | `polygon(evenodd, <hexágono externo>, <hexágono interno>)` |
| Tira de triângulos | Borda de cabeçalho e rodapé | `conic-gradient` repetido a cada 12 × 6 px |

- **Foco do teclado:** `clip-path` corta o `outline`. Em elementos recortados, o foco é `box-shadow: inset 0 0 0 2px var(--solar-amber)`.
- **Ícones:** desenhe com formas da tabela acima. Não use emoji nem fontes de ícone.

## 5. Superfícies

- **Painel (`.slab`):** gradiente de 112° com paradas duras, `--f3` 0–17 %, `--f2` 17–62 %, `#1a0e26` 62–100 %, mais uma aresta clara no topo (`inset 0 1px 0 #ffffff12`).
- **Botão:** gradiente de 165° com parada dura em 52 %. A faceta de cima é mais clara, como um bisel.
- **Fundo das telas:** dois `conic-gradient` com paradas duras e transparência sobrepostos ao `--bg-void`. Os leques se cruzam e formam polígonos grandes e quase invisíveis.
- **Janelas para o espaço:** `--bg-viewport` com uma malha triangular a 8 % de opacidade (três `repeating-linear-gradient` a 0°, 60° e 120°).
- **Medidores:** blocos de 9 px com vão de 3 px, inclinados a −24° (`skewX`). Em perigo viram coral e piscam em 2 passos.
- **Alertas:** fundo carmim com uma faixa de listras de perigo (âmbar e void, a 45°) na borda esquerda.

## 6. Arte gerada

Toda a arte é gerada por código a partir de semente fixa: o mesmo código desenha sempre a mesma imagem.

- **Planeta 2D** (`facetPolys`):
  - Anéis de vértices, por exemplo 6, 12 e 18, com pequeno desvio aleatório, ligados em triângulos.
  - Cada vértice sobe para a esfera e cada face calcula a própria normal.
  - A cor sai da rampa pelo produto da normal com a luz `(-0,55, -0,6, 0,58)`, que vem de cima e da esquerda.
  - Regiões trocam a rampa: calota polar, mares escuros de Marte, continentes da Terra, faixas de Júpiter.
- **Planeta 3D** (mapa orbital, three.js 0.186.1, o mesmo do visualizador):
  - Malha: `IcosahedronGeometry` com detalhe 1 (Sol) ou 2 (planetas) e uma cor por face (`vertexColors`).
  - Material: `MeshLambertMaterial` com `flatShading`.
  - Luz: `PointLight` creme no Sol, então o lado iluminado é sempre o virado para ele, mais `AmbientLight` lilás `#b48cf0` para o lado escuro.
  - Sistema completo: os 8 planetas (Saturno com anéis facetados), cinturão de asteroides (170 icosaedros) e transferência Terra→Marte.
  - Órbitas: `LineLoop` tracejado de 48 lados; a de Marte, o único destino aberto, em laranja sólido.
  - Aura de Marte: duas cascas de icosaedro vistas por dentro (laranja e âmbar, aditivas), girando e pulsando. É o único brilho permitido: serve para dizer "disponível".
  - Movimento: períodos orbitais reais em proporção (1 ano = 36 s) e inclinação axial real. Os raios são estilizados.
  - A órbita desacelera quando o mouse está sobre um planeta.
  - Os botões HTML seguem a projeção de cada planeta. Sem WebGL, o mapa 2D continua.
  - Todo planeta é clicável. Os indisponíveis ganham a retícula em cinza `--muted`, o rótulo "· unavailable", o status "UNAVAILABLE" no cartão e o botão de planejar desativado (esmaecido).
  - Fundo do planejamento (tripulação e montagem): a mesma cena vira uma camada fixa atrás da tela; a câmera faz zoom suave no planeta escolhido (lado iluminado, com terminador, à direita da tela) e o acompanha na órbita, com estrelas tênues e o cinturão passando. Nessas telas os painéis ficam translúcidos (72%) para o fundo aparecer.
- **Foguetes 3D** (GLBs gerados, carregados de `index.models.js`):
  - Luz: chave creme de cima e da esquerda, ambiente lilás, contraluz laranja-Marte e reflexo suave de sala (`RoomEnvironment`, intensidade 0,5) para o metal não ficar preto.
  - Menu: Saturn V inclinado em voo, girando no próprio eixo, com chama de 3 cones de 7 lados (laranja, âmbar e creme, aditivos, tremulando). No Play ele acelera para longe e a tela troca depois de cerca de 1 s.
  - Montagem: vista explodida, de baixo para cima: seção de empuxo do propulsor, estágios do meio (0 a 7) e cabine. As carcaças (`parts/structures/*.glb` e `rocket/cabin_cutaway.glb`) não têm motor nem tanque: as peças encaixam nos nós `Attach_*`. Motores no padrão real do cluster (1 + 8 do Falcon 9, 4 do SLS, 3 + 10 + 20 do Super Heavy); tanque sobre `Attach_Tank`, com a altura comprimida para caber; 1 equipamento por baia; até 4 módulos na cabine, em meia escala.
  - Pontos de fixação vazios: placa hexagonal âmbar com contorno creme, pulsando; clicar abre a aba certa do catálogo. Módulo selecionado: anéis âmbar de 12 lados. Nos vãos entre módulos, botões hexagonais "+" inserem um estágio.
  - A pilha balança ±43° sem esconder o lado aberto, e cada rótulo acompanha seu módulo.
  - Catálogo lateral (`.catalog` / `#parts-list`): cada peça exibe uma miniatura 3D chanfrada (`.part-thumb`) do seu modelo GLB sob a mesma iluminação de estúdio (com fallback SVG low poly quando WebGL estiver indisponível).
  - Lobby: o tripulante escolhido aparece em 3D (GLB do avatar, animação `idle_loop`; `wave` ao selecionar de novo) sobre um pedestal hexagonal na cor dele.
  - Locais de pouso (miniaturas e vista grande do lobby): foto real do HiRISE, 1,5 km em volta do ponto de pouso, norte para cima, com tinta de Marte leve (`sepia`, escolha de jogo); a miniatura selecionada ganha moldura chanfrada âmbar, faixa de título âmbar com texto escuro e marcador losango (as demais ficam levemente escurecidas); a vista grande marca em tracejado âmbar a área caminhável de 512 m e traz o crédito.
- **Cockpit** (painel do piloto no layout da Orion, `assets/models/rocket/cockpit_pilot.glb`):
  - Navball na tela esquerda: bola facetada com céu azul (`Pack`) e solo laranja (`Foam`), horizonte aceso (`Lamp`), linhas de arfagem a cada 20° e um meridiano, virada para os olhos do piloto. Na frente da bola, um alvo verde (anel e três marcas) que o piloto mantém no centro; fixos, o símbolo do avião âmbar e quatro cantos verdes que marcam a faixa.
  - Cartão do minigame: mira quadrada com a faixa em octógono verde e um losango creme (laranja fora da faixa), d-pad ao lado com as teclas (W/A/S/D e setas), tempo até o MECO, porcentagem na faixa e estrelas.
- **Superfície** (pouso, terreno real do HiRISE em `index.terrain.<sítio>.js`):
  - Primeira pessoa com o corpo à vista: o capacete some para a câmera, mas continua fazendo sombra; olhando para baixo aparecem peito, mãos, pernas e pés. `V` troca para a câmera atrás do personagem.
  - Céu: domo de icosaedro facetado, caramelo `#d8a07c` no horizonte e `#7a4c46` no alto. A névoa usa a cor do horizonte e cresce com o quadrado da distância: quase nada até ~10 km, 97% no fim do anel do horizonte, que some no céu (sem anel: 45 a 230 m).
  - Horizonte: anel até 100 km com o relevo real em volta do sítio (Monte Sharp em Gale, borda da cratera e delta em Jezero), com a curvatura de Marte. Textura em tons de cinza (fotos do HiRISE e do CTX; além delas, o relevo sombreado com o sol da foto) × tinta do sítio, iluminada como chão plano.
  - Chão: foto em tons de cinza sem a sombra do relevo (a luz do jogo sombreia a malha) × tinta do manifesto × ganho de jogo (`GROUND_GAIN`), mais um grão repetido a cada 3 m e pedras low poly (dodecaedros chapados, mesmas posições por sítio). Luz do sol na direção do sol da foto.
  - Sonda pousada no centro: hexágono dourado e branco com 4 pernas, feita de primitivas.
  - Experimento: plinto hexagonal escuro, cubo na cor do dono, gema creme girando e um feixe aditivo de 60 m visível de longe. Concluído: o feixe some e a gema fica verde `--safe`.
  - HUD: painéis chanfrados nos cantos (local com cronômetro da janela de retorno, RAD e áudio; lista de experimentos com distância e seta), barra da tripulação, aviso de interação em laranja (bloqueado em roxo, concluído em verde), "Board & depart" em laranja. No toque: joystick hexagonal e botão de pulo hexagonal.
  - Os 4 astronautas ficam em cena; o jogador controla um (teclas 1–4) e os outros esperam onde foram deixados.
  - Bússola: faixa no topo central com corte diagonal nas pontas, ±90° em volta da direção da vista, letras dos pontos cardeais (N em âmbar), marcas a cada 15°, uma agulha laranja-Marte e marcadores (hexágono na cor do dono para cada experimento, losango verde quando concluído, triângulo branco para a sonda).
  - Roda de emotes (Q ou botão 😀): octógono escuro com uma fatia hexagonal por animação dos avatares (👋 aceno, a ação própria do personagem, menos a da Helena, 🚶 andar, 🧍 parado); a fatia escolhida fica âmbar. Em primeira pessoa a câmera vai para trás enquanto o emote toca.
- **Terreno** (`facetTerrain`):
  - Linhas de vértices desde um perfil de silhueta (lista de pontos x, y) até a base, mais densas perto do horizonte.
  - Quads divididos em diagonais alternadas.
  - Tom pela distância (longe = mais claro) e pela orientação do triângulo.
- **Astronauta:**
  - Polígonos chapados com classes de tom: `s1–s3` traje, `c1–c2` cor do personagem, `v1–v3` visor, `d1` equipamento escuro.
  - Luz da esquerda: lado esquerdo do corpo em `s1`, direito em `s2/s3`.
  - Fica sobre um pedestal hexagonal com face de cima e face frontal.
- **Estrelas:** losangos pequenos em creme, rosa e lilás, piscando devagar.

## 7. Movimento

| O quê | Como |
|---|---|
| Troca de tela, abrir diálogo | Varredura diagonal com `clip-path`, 0,4 a 0,55 s, `cubic-bezier(.7,0,.2,1)` |
| Medidor mudando | Largura em degraus (`steps(10)`) |
| Perigo | Piscar em 2 passos, 1 s |
| Hover | Deslocar 2 a 4 px ou trocar de tom. Sem crescer sombra |
| Seleção de planeta | Retícula hexagonal girando (14 s por volta) |
| Ambiente | Marte do menu flutua 14 px; nave do reabastecimento orbita um octógono |

`prefers-reduced-motion: reduce` desliga todas as animações e para as órbitas. A tela continua completa e estática.

## 8. Checklist para uma tela nova

- [ ] Só cores da tabela da seção 2 (ou tons de faceta derivados delas).
- [ ] Nenhum `border-radius`, `blur`, `backdrop-filter`, `box-shadow` externo ou gradiente suave.
- [ ] Títulos em Chakra Petch caixa alta; texto em Barlow.
- [ ] Ação principal em laranja com texto escuro; seleção em âmbar.
- [ ] Foco visível em todos os controles recortados.
- [ ] Testada em 1440 px e 390 px de largura e com movimento reduzido.

## Menu da demo

O menu apresenta o título ASTRO ROMANA, os botões Play e Quit empilhados e a versão da demo no rodapé (atualmente v0.1.0).
