# Paisagem sonora da radiação

O som de fundo do jogo é gerado a partir de **medições reais de radiação** feitas pelo detector RAD do rover Curiosity, na superfície de Marte. O que o jogador ouve acompanha o que o instrumento mediu.

- **Dados e fontes:** [references/datasets/msl-rad/](../references/datasets/msl-rad/README.md)
- **Gerador:** `tools/audio/` (regras em [AGENTS.md](../AGENTS.md), seção 7)
- **Arquivos gerados:** `assets/audio/`, com o `manifest.json`

O áudio é gerado **antes**, fora do jogo. No jogo só tocamos os arquivos e ajustamos volume. Assim tudo funciona igual na versão web.

---

## Os sons

### Fundo da superfície: `rad_surface_bed.wav` (loop de 40 s)

São 4 sóis calmos (1 a 5 de maio de 2024) comprimidos em 40 s, ou seja, 1 sol a cada 10 s.

| Dado | Som |
|---|---|
| Dose suavizada do detector B (tendência lenta) | Brilho do drone e quantas notas do acorde soam: mais dose, acorde mais aberto |
| A mesma curva | Abertura e volume do chiado de fundo. Dá para ouvir o ciclo de cada sol, porque a dose varia com a pressão do ar ao longo do dia |
| Cada medida bem acima da tendência (> 1,25 desvio) | Uma nota tipo sino. Quanto maior o desvio, mais aguda. Detector B (silício) toca agudo, à esquerda; detector E (plástico) mais grave, à direita |

### Tempestade solar: `rad_storm_2024_05_20.wav` (32 s, toca uma vez)

São 48 horas reais (20 e 21 de maio de 2024) em 32 s, ou seja, 1 s = 1,5 h. É o maior evento de radiação que o Curiosity registrou: a dose subiu ~79 vezes em menos de uma hora.

| Dado | Som |
|---|---|
| Dose medida (linear entre medidas) | Taxa de estalos (um contador Geiger embutido, discreto): 0,4 por segundo antes do evento, proporcional à dose depois (~31 por segundo no pico) |
| Dose em escala logarítmica | Volume e brilho do ruído, dissonância e tremor do drone |
| O maior salto entre duas medidas | O impacto grave, em ~3,7 s |

Toca por cima do fundo, no mesmo tom (Ré).

### Contador Geiger: `geiger_click_1…4.wav`

Os cliques são disparados pelo jogo:

- **Taxa:** `clicksPerSecondAtQuiet × dose / quietDoseRateUgyPerDay`, limitada a `maxClicksPerSecond`. Os números estão no `manifest.json`: a dose calma é real, e a taxa de cliques é `game-balance`.
- **Intervalos:** aleatórios (sorteio exponencial), como num contador de verdade.
- **Variedade:** sorteie um dos 4 cliques a cada disparo.

---

## Como o jogo deve usar

- **Superfície de Marte:** `rad_surface_bed` em loop. O loop já vem marcado no WAV, sem configuração de importação.
- **Evento de tempestade** (por exemplo, o minigame M-S5 "Abrigo!"):
  - toque `rad_storm_2024_05_20` por cima do fundo;
  - se quiser, baixe o fundo ~6 dB enquanto ela toca;
  - para sincronizar o medidor de dose e os cliques com o som, use `stems[1].envelope`: a dose (µGy/dia) a cada `stepS` segundos do arquivo.
- **Multiplayer:** a dose é estado do jogo e quem decide é o servidor. O som é local: cada cliente toca o seu a partir do estado recebido.
- **Web:** o jogo só toca os WAV prontos e ajusta o volume; nada de síntese ou efeitos em tempo real.

---

## Card "Fato real" (pronto para usar)

> "Em 20 de maio de 2024, uma tempestade solar fez a radiação medida pelo rover Curiosity, na superfície de Marte, subir cerca de 79 vezes em menos de uma hora."

**Fonte:** detector RAD, dados `MSL_RAD_OBS-L2` (NASA SPDF). Calculado em [references/datasets/msl-rad/](../references/datasets/msl-rad/README.md): de 92,8 para 7.295,7 µGy/dia; última medida normal às 05:22 UTC e pico às 06:15 UTC.

Os números de imprensa ("8.100 microgray") não batem com os dados. Veja os ⚠ no README antes de usá-los.

---

## O que falta

- **Integração no jogo:** o `index.html` toca o fundo e os cliques na superfície (`radAudio`); a tempestade ainda não entra.
- **Viagem até Marte:** o CDAWeb não tem os dados do RAD do cruzeiro (2011–2012). Se o jogo quiser um som de viagem, os dados vêm do arquivo PDS.
- **Ouvir e ajustar:** a validação confere formato, volume e emenda do loop, não se o som ficou bom. Os volumes e o tom são `game-balance` e podem mudar à vontade.
