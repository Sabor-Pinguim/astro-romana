# AGENTS.md: terrenos reais de Marte (`tools/terrain/`)

Regras só desta pasta. Elas **somam** às do [AGENTS.md da raiz](../../AGENTS.md), que continua valendo (ficaram aqui porque o da raiz chegou ao limite de tamanho).

## O que é
- **Fonte da verdade:** `sites.mjs` (sítios fixos). Os arquivos em `godot/assets/terrain/` são gerados: nunca edite à mão.
- **Dados:** o DTM estéreo do HiRISE (~1 m) dá o relevo, e a ortoimagem do mesmo par dá a textura. Vêm do catálogo STAC do USGS (CC0) em COG; o build baixa só os bytes do recorte, por *range request*. Fontes e ressalvas: [references/terrain/terrain-sources.md](../../references/terrain/terrain-sources.md).
- **Sítios atuais:**
  - `jezero`: pouso do Perseverance, recorte de 512 × 512 m (área para andar), desnível de 9 m;
  - `gale`: pouso do Curiosity (Bradbury Landing), 512 × 512 m, desnível de 9 m;
  - `north_polar_scarp`: escarpa da calota norte, 2 × 2 km, desnível de 685 m.

  `jezero` e `gale` são os locais de pouso do `index.html` (tela da superfície).
- **Dependência:** `geotiff` fixado em **3.0.5**.

## Regras
- **Sol da foto:** vem do rótulo PDS do HiRISE, **não** dos campos `view:sun_*` do STAC, que estão errados (o `sun_elevation` guarda a hora local). Use `sun` do manifesto na luz do sol do jogo para ela bater com as sombras da textura.
- **Convenções:** metros; +X leste, +Y para cima, −Z norte verdadeiro. A origem fica no centro do sítio, com y = 0 na elevação do centro (`elevation.centerM`).
- **Chão no jogo:** o `index.html` tira a altura da própria grade da malha (linha 0 no norte, coluna 0 no oeste), sem física. O nó `Terrain-col` só servia ao Godot.
- **Orçamento:**
  - 255 × 255 vértices, o máximo com índices de 16 bits (o 65535 é o valor de reinício de primitiva);
  - textura de 1024 px;
  - GLB ≤ 5 MB.
- **Checagem de alinhamento:** o build compara a foto com o relevo sombreado pelo sol da foto. Se a correlação não for maior que com o sol invertido, DTM e textura estão desalinhados.
- **Números reais:** as elevações e o desnível do manifesto são medidos no DTM, com a fonte (URL e ETag) em `source`. A cor (`tint`) é de jogo.
- **Rede com inspeção de HTTPS** (erro `SELF_SIGNED_CERT_IN_CHAIN`): rode com `NODE_OPTIONS=--use-system-ca`.

## Fluxo ao mudar um terreno
1. `npm run terrain`: baixa o recorte, gera e valida. O build é determinístico: os mesmos dados geram os mesmos bytes. Para um sítio novo, rode `npm run terrain:build -- <id> --preview` e confira `tools/terrain/preview/` (ignorada pelo git).
2. `npm run web:models`: regenera `index.terrain.<id>.js` dos locais de pouso. *(Legado, opcional: `check_terrain.gd` no Godot.)*
3. Faça commit junto do código, dos GLBs, das texturas extraídas (`<id>_albedo.png`), do `manifest.json`, dos `index.terrain.*.js` e dos `.import`.

## Pendências conhecidas
- **Sombra em dobro:** a textura já traz as sombras da foto, e a luz do jogo soma outra por cima. Na escarpa polar, a face fica estourada. Próximo passo: tirar a sombra da textura usando o DTM.
- **Detalhe:** a malha tem um vértice a cada 2 m nos locais de pouso (8 m na escarpa), mas o DTM tem 1 m. Um normal map recuperaria esse detalhe. De perto, a página soma um grão repetido e pedras (arte de jogo).
- **Encostas íngremes:** a textura fica esticada, porque é projetada de cima.
- **Datum vertical:** não foi confirmado (veja as fontes). O desnível não depende dele.
