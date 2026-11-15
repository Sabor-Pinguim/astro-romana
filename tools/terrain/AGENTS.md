# AGENTS.md: terrenos reais de Marte (`tools/terrain/`)

Regras só desta pasta. Elas **somam** às do [AGENTS.md da raiz](../../AGENTS.md), que continua valendo (ficaram aqui porque o da raiz chegou ao limite de tamanho).

## O que é
- **Fonte da verdade:** `sites.mjs` (sítios fixos). Os arquivos em `assets/terrain/` são gerados: nunca edite à mão.
- **Dados:** o DTM estéreo do HiRISE (~1 m) dá o relevo, e a ortoimagem do mesmo par dá a textura. Vêm do catálogo STAC do USGS (CC0) em COG; o build baixa só os bytes do recorte, por *range request*. Fontes e ressalvas: [references/terrain/terrain-sources.md](../../references/terrain/terrain-sources.md).
- **Horizonte** (sítios com `horizonKm`): segundo nó `Horizon` no mesmo GLB, um anel polar até 100 km com a curvatura de Marte e uma textura polar (u = azimute, v = distância em escala log). Três fontes, a mais fina por cima: o próprio HiRISE até ~1,8 km; DTMs e ortoimagens do CTX (`ctx` em `sites.mjs`, ~20 m / ~6 m, mesmo catálogo STAC) até ~45 km; o DEM global HRSC–MOLA de 200 m até o fim (GeoTIFF de 11 GB sem COG: `lib/global-dem.mjs` lê uma linha por *range request*), com o sombreamento do relevo calculado com o sol da foto.
- **Sítios atuais:**
  - `jezero`: pouso do Perseverance, recorte de 512 × 512 m (área para andar), desnível de 9 m;
  - `gale`: pouso do Curiosity (Bradbury Landing), 512 × 512 m, desnível de 9 m;
  - `north_polar_scarp`: escarpa da calota norte, 2 × 2 km, desnível de 685 m.

  `jezero` e `gale` são os locais de pouso do `index.html` (tela da superfície).
- **Dependência:** `geotiff` fixado em **3.0.5**.

## Regras
- **Sol da foto:** vem do rótulo PDS do HiRISE, **não** dos campos `view:sun_*` do STAC, que estão errados (o `sun_elevation` guarda a hora local). Use `sun` do manifesto na luz do sol do jogo.
- **Textura sem sombra do relevo** (`lib/deshade.mjs`): a foto é dividida por `k + luz direta` (normal do DTM e sombra projetada, com o sol da foto; `k` ajustado na própria foto). A luz do jogo sombreia a malha, sem dobrar. O manifesto guarda a correlação antes e depois (`deshading`); o detalhe menor que o DTM fica na textura.
- **Horizonte:** CTX e DEM global são deslocados em altura para bater com o HiRISE na faixa de 0,3 a 1,8 km, e o brilho de cada foto do CTX é ajustado (média e espalhamento) à foto do HiRISE ali. A textura carrega o sombreamento: o jogo ilumina o anel como chão plano. Contraste: o do terreno perto do pouso e o da região a partir de 4 km (`textureStretch`). A parte HRSC do DEM é CC BY-SA 3.0 IGO: cite a fonte (manifesto e referências).
- **Texturas em JPEG** (`lib/jpeg.mjs`, DCT inteira: mesmos bytes em qualquer máquina) e UV em `unsigned short`, para caber no limite de 5 MB.
- **Convenções:** metros; +X leste, +Y para cima, −Z norte verdadeiro. A origem fica no centro do sítio, com y = 0 na elevação do centro (`elevation.centerM`).
- **Chão no jogo:** o `index.html` tira a altura da própria grade da malha (linha 0 no norte, coluna 0 no oeste), sem física. Os nós do GLB se chamam `Terrain` e `Horizon`, e o jogo os acha pelo nome.
- **Orçamento:**
  - 255 × 255 vértices, o máximo com índices de 16 bits (o 65535 é o valor de reinício de primitiva);
  - textura de 1024 px (JPEG q90);
  - horizonte de 128 anéis × 385 vértices (97 mil triângulos) e textura de 2048 × 1024 (JPEG q85);
  - GLB ≤ 5 MB.
- **Checagem de alinhamento:** o build compara a foto com o relevo sombreado pelo sol da foto. Se a correlação não for maior que com o sol invertido, DTM e textura estão desalinhados.
- **Números reais:** as elevações e o desnível do manifesto são medidos no DTM, com a fonte (URL e ETag) em `source`. A cor (`tint`) é de jogo.
- **Rede com inspeção de HTTPS** (erro `SELF_SIGNED_CERT_IN_CHAIN`): rode com `NODE_OPTIONS=--use-system-ca`.

## Fluxo ao mudar um terreno
1. `npm run terrain`: baixa o recorte, gera e valida. O build é determinístico: os mesmos dados geram os mesmos bytes. Para um sítio novo, rode `npm run terrain:build -- <id> --preview` e confira `tools/terrain/preview/` (ignorada pelo git).
2. `npm run web:models`: regenera `index.terrain.<id>.js` dos locais de pouso.
3. Faça commit junto do código, dos GLBs (a textura vai dentro deles), do `manifest.json` e dos `index.terrain.*.js`.

## Pendências conhecidas
- **Horizonte:** as fotos do CTX são de outros dias, com sol parecido mas não igual ao da foto do HiRISE (a de Jezero `J03_045994…` é da mesma órbita). Fora das faixas do CTX (~11% do anel até 45 km) e além de 45 km o relevo é o do DEM de 200 m, mais suave. A silhueta segue a malha (~1° entre vértices).
- **`k` no limite:** em Jezero o ajuste dá `k` abaixo de 0,25 e fica no mínimo; a correlação cai de 0,23 para 0,03 mesmo assim.
- **Detalhe:** a malha tem um vértice a cada 2 m nos locais de pouso (8 m na escarpa), mas o DTM tem 1 m. Um normal map recuperaria esse detalhe. De perto, a página soma um grão repetido e pedras (arte de jogo).
- **Encostas íngremes:** a textura fica esticada, porque é projetada de cima.
- **Datum vertical:** não foi confirmado (veja as fontes). O desnível não depende dele.
