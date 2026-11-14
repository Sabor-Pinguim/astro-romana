# Space Mission Game — transcrição organizada

> A fala foi reordenada por fluxo de jogo e por sistema, sem eliminar ideias, decisões, exemplos, dúvidas ou limitações verbalizadas. Quando a gravação apresenta uma decisão ainda em aberto, ela é mantida como pendência — não como requisito já resolvido.

## 1. Contexto e proposta

O projeto participa do **NASA Space Apps Hackathon** e se chama **Space Mission Game**. A proposta é um jogo **3D**, integralmente em **inglês**, no qual os jogadores montam e operam uma missão espacial com destino a Marte.

A ideia foi pensada como uma experiência dividida em **sete fases**. A gravação não enumera essas fases de maneira rígida do início ao fim; por isso, este documento consolida o fluxo descrito em sete etapas operacionais, mantendo as transições e as exceções citadas.

O jogo deve permitir uma partida individual ou cooperativa. No menu inicial, foram mencionadas as opções **Single Player**, **Multiplayer** e **Quit**.

## 2. Fluxo completo da partida em sete fases

| Fase | Momento da experiência | Resultado esperado |
| --- | --- | --- |
| 1 | Menu principal | O jogador escolhe Single Player, Multiplayer ou Quit. |
| 2 | Seleção de papéis | São escolhidos os personagens/classes da tripulação. Há quatro personagens no total, descritos em `characters.md`. |
| 3 | Construção principal do foguete | A tripulação monta a nave, controla recursos e toma decisões que afetarão o restante da missão. |
| 4 | Planejamento complementar antes da partida | O fluxo apresenta a necessidade de reabastecimento orbital e libera uma segunda personalização voltada à chegada em Marte. |
| 5 | Lançamento e entrada em órbita | Em primeira pessoa, os jogadores vivenciam as primeiras consequências das escolhas feitas na construção. |
| 6 | Reabastecimento, viagem e preparação para o pouso | Há reabastecimento, possíveis eventos/minijogos, tarefas internas da tripulação e a ativação do pouso. |
| 7 | Exploração de Marte, retorno e resultado | A tripulação realiza missões no planeta, retorna à nave dentro do prazo e recebe a pontuação/ranking final. |

## 3. Fase 1 — menu principal

O jogo começa em uma tela de menu. As opções verbalizadas para ela são:

- **Single Player**;
- **Multiplayer**;
- **Quit**.

Essa tela deve ser a porta de entrada para uma experiência 3D. A modalidade escolhida define se a missão será conduzida por uma pessoa ou por uma equipe.

## 4. Fase 2 — seleção da tripulação e dos papéis

Depois de escolher o modo, o jogador entra na seleção de papéis. Há **quatro personagens** no total, já documentados em `characters.md`.

Na exploração de Marte, a fala usa como exemplos de especialidades o **geólogo**, o **físico**, o **piloto** e o personagem especializado em **medicina**. Cada personagem deve ter missões próprias, e essa diferenciação de função é parte importante do modo cooperativo.

Não se deve transformar todos os membros em jogadores genéricos: a intenção é que cada especialidade tenha uma contribuição diferente tanto no voo quanto na superfície marciana.

## 5. Fase 3 — construção principal do foguete

### 5.1. Objetivo da montagem

Após selecionar a tripulação, o jogador constrói o foguete. Esta é a parte mais completa da personalização e deve afetar o restante da missão: a saída da Terra, a entrada em órbita, o pouso, a interação durante a jornada e as consequências enfrentadas mais adiante.

O jogador recebe um valor total definido e precisa administrar a relação entre **Delta-V**, energia e os demais recursos relevantes. A fala associa a montagem a uma visão acumulada de:

- custo total;
- peso/massa do foguete;
- orçamento disponível;
- gasto de energia;
- Delta-V.

Esses elementos não devem ser apenas decorativos. As peças instaladas precisam modificar, de fato, as condições da missão.

### 5.2. Estrutura obrigatória e estágios opcionais

Dois módulos principais são obrigatórios:

1. **Base**;
2. **Cabine**.

O primeiro estágio corresponde obrigatoriamente à base/propulsor. É nele que fica a parte de combustível necessária para sair da Terra.

Além desse estágio inicial, o foguete pode receber estágios adicionais:

- **Estágio 2:** opcional;
- **Estágio 3:** opcional.

Nesses estágios extras, o jogador pode adicionar os itens disponíveis no menu lateral. A cabine permanece como componente essencial da composição final.

### 5.3. Tela de construção e informações visíveis

A tela de construção deve mostrar, pelo menos, os seguintes elementos:

- no canto superior esquerdo, o **nome da missão** — no exemplo narrado, uma missão para Marte;
- o **orçamento total** (*total budget*);
- o nome da missão no topo;
- ícones e indicadores abaixo ou em uma área lateral;
- o modelo do foguete, um pouco mais à direita;
- uma barra lateral direita com todas as opções de *upgrades* e peças adicionáveis aos módulos.

Cada upgrade/peça deve informar ou carregar consigo:

- um custo;
- um peso/massa;
- o quanto consome de energia.

Assim, adicionar componentes deixa de ser uma escolha visual: muda o orçamento, a massa, o consumo energético e a viabilidade das ações seguintes.

### 5.4. Consequências esperadas das escolhas

A montagem precisa influenciar diretamente:

- a capacidade de sair da Terra;
- a entrada em órbita;
- a possibilidade ou a qualidade do pouso;
- as interações e eventos durante o voo;
- os problemas que podem aparecer quando a nave estiver em operação.

Um exemplo explícito da gravação é o de um foguete excessivamente pesado: algo pode quebrar durante o lançamento. O elemento exato que falha ainda não foi definido; essa é uma pendência de design que precisa ser estruturada. O ponto central, porém, já está decidido: a construção do foguete deve produzir consequências observáveis no gameplay.

## 6. Fase 4 — planejamento complementar antes de sair da Terra

Quando a construção principal termina, o jogador avança na mesma tela por meio de **Next**. A interface deve apresentar um *stepper*, deixando claro que ainda existem etapas entre a preparação da missão em órbita e a chegada a Marte.

### 6.1. Reabastecimento orbital

Para a missão a Marte usada no MVP, o reabastecimento é **obrigatório** depois que a nave entra em órbita. A etapa serve também para explicar ao jogador por que uma viagem a Marte exige reabastecer.

Há três nuances importantes na ideia verbalizada:

- em uma missão para Marte, o reabastecimento deve acontecer obrigatoriamente;
- em uma missão para a Lua, ele poderia não ser necessário;
- como mecânica geral, o reabastecimento pode ser uma funcionalidade opcional, dependente do cenário de missão escolhido.

No fluxo atual do MVP marciano, essa primeira aparição do reabastecimento é sobretudo informativa: ela mostra que o reabastecimento será necessário, mas **não exige personalização** nessa tela.

### 6.2. Segunda personalização: preparação para Marte e pouso

Depois da indicação de reabastecimento, o jogador entra em uma segunda parte de personalização, ainda dentro do planejamento da missão. Nela, devem ser considerados recursos para a chegada e o pouso em Marte, como:

- **frenagem atmosférica**;
- paraquedas;
- outros componentes equivalentes de preparação para o pouso.

Essa separação é intencional: a primeira construção é a montagem mais ampla do foguete; a segunda personalização trata de escolhas específicas para a aproximação e o pouso no destino.

## 7. Fase 5 — lançamento e entrada em órbita

Quando a nave, o planejamento e a preparação antes da saída da Terra terminam, inicia-se o lançamento.

### 7.1. Perspectiva e painéis da tripulação

O lançamento deve mudar para uma visão em **primeira pessoa**. A ideia é que os personagens tenham visões de painéis, cada qual relacionada à sua função. O piloto/comandante, por exemplo, teria a visão do seu painel de controle.

Essa perspectiva deve tornar perceptíveis as primeiras consequências da nave montada pela equipe.

### 7.2. Consequências da construção durante a decolagem

A saída da Terra é tratada como a parte mais difícil da missão e como a que consome mais combustível. É nesse momento que aparecem as primeiras consequências das decisões anteriores.

Por exemplo, se o foguete estiver pesado demais, alguma falha pode ocorrer. A gravação ainda não determina qual sistema quebraria nem como a falha seria apresentada; apenas estabelece que é desejável estruturar essa relação de causa e efeito.

Ao sobreviver ao lançamento, a nave entra em órbita e avança para a etapa de reabastecimento.

## 8. Fase 6 — reabastecimento, viagem e preparação para o pouso

### 8.1. Reabastecimento em órbita como momento jogável

Depois de entrar em órbita, ocorre a etapa efetiva de reabastecimento. Ela pode conter:

- pequenos eventos;
- minijogos ligados ao reabastecimento.

Essa etapa é diferente da tela explicativa do planejamento: agora ela acontece dentro do fluxo operacional da missão.

### 8.2. Jornada até Marte e tarefas dentro da nave

Depois do reabastecimento, a viagem começa de fato. Durante o trajeto, os outros tripulantes/astronautas podem realizar pequenas missões dentro da nave.

Quando essas tarefas são completadas, elas podem ativar o evento de preparação para o pouso. Esse momento pode incluir uma pequena animação e deve refletir as escolhas feitas anteriormente, especialmente as decisões da segunda personalização.

Em seguida, a nave pousa em Marte.

## 9. Fase 7 — exploração de Marte

### 9.1. Chegada à superfície

Ao pousar em Marte, os personagens podem finalmente realizar os experimentos. Eles soltam os cintos da nave e passam a poder caminhar pelo planeta.

O planeta deve ser apresentado como um espaço explorável, não apenas uma tela estática. É necessário ter um modelo/mapa de Marte pelo qual os tripulantes possam andar.

### 9.2. Uso de dados da NASA

Existe a intenção explícita de encaixar dados reais da NASA na solução do hackathon. Se possível, Marte deve ser gerado ou caracterizado a partir de APIs/bases de dados da NASA.

Um exemplo verbalizado é que até a cor do planeta poderia vir de dados reais. A forma exata de incorporar essa API ainda precisa ser decidida, mas o uso de dados da NASA deve aparecer de maneira concreta no projeto, e não apenas como referência externa.

### 9.3. Interface na superfície

A interface da exploração de Marte deve incluir:

- no topo, uma espécie de bússola com coordenadas;
- a bússola deve funcionar como referências de navegação vistas em jogos como PUBG e Fortnite;
- à esquerda, um menu com as missões disponíveis naquele planeta;
- na parte inferior, o inventário do jogador.

Ao clicar em uma missão exibida no menu lateral esquerdo, o jogador deve poder visualizar onde ela fica no planeta, em uma referência comparada na fala ao comportamento de tarefas em *Among Us*.

### 9.4. Missões por personagem

Cada especialidade deve receber missões diferentes. Entre os exemplos mencionados estão geologia, física, pilotagem e medicina. A intenção é distribuir objetivos de acordo com a função de cada tripulante, em vez de repetir a mesma tarefa para todos.

## 10. Tempo, retorno e escopo do MVP

Os jogadores recebem um tempo limitado para completar as missões na superfície.

- Se não concluírem tudo a tempo, precisarão voltar mesmo assim.
- O retorno à nave é obrigatório mesmo quando a missão de superfície falha ou fica incompleta.
- Há a possibilidade de que algum personagem não retorne ou fique para trás.
- Também pode haver distribuição desigual de tarefas: um personagem pode precisar completar todas as missões, enquanto outro completa apenas uma.

Essas possibilidades foram mencionadas como ideias, não como regras já fechadas.

O escopo inicial precisa ser deliberadamente pequeno. Para o MVP, a intenção é não estruturar muitas missões: algo como **três missões** distribuídas para **um ou dois personagens** já é suficiente.

## 11. Encerramento da missão e placar

Se a tripulação completar as missões antes do prazo, todos recebem uma mensagem na tela informando que estão autorizados a voltar à nave.

Depois do retorno:

1. há uma pequena animação do foguete construído voltando;
2. o jogo é encerrado;
3. aparece um placar final.

O placar deve combinar ranking, pontuação e avaliação individual. A fala propõe:

- ranking com primeiro, segundo e terceiro lugares;
- um pódio posterior com primeiro, segundo, terceiro e quarto lugares, acompanhado de uma animação dos quatro personagens;
- para cada participante, exibir nome, especialidade, quantidade de pontos e nota;
- notas em formato semelhante ao de *Resident Evil*, como **S+**, **A** e **B**.

Ao clicar em prosseguir, o jogador vê o pódio animado com os quatro personagens.

## 12. Relações de causa e efeito que não podem se perder

Estas são as relações centrais entre decisão e consequência explicitadas na gravação:

| Decisão do jogador | Efeito que precisa aparecer no jogo |
| --- | --- |
| Adicionar uma peça/upgrade | Altera custo, peso e consumo de energia. |
| Montar um foguete pesado demais | Pode causar falhas no lançamento; o tipo de falha ainda deve ser definido. |
| Escolher componentes de construção | Afeta saída da Terra, entrada em órbita, pouso e interações posteriores. |
| Escolher missão para Marte | Torna obrigatório o reabastecimento após a entrada em órbita. |
| Escolher outro destino, como a Lua | Pode dispensar o reabastecimento. |
| Completar tarefas durante a viagem | Pode ativar o evento de preparação para pouso. |
| Definir componentes para pouso | Deve afetar a animação e/ou a preparação de aterrissagem. |
| Cumprir missões em Marte dentro do prazo | Autoriza o retorno e leva ao encerramento bem-sucedido. |
| Não cumprir missões a tempo | Obriga o retorno mesmo assim e pode gerar consequências para a tripulação. |

## 13. Pontos ainda abertos na fala

Os tópicos abaixo foram levantados, mas não tiveram uma solução definitiva no áudio:

- qual sistema ou componente quebra quando o foguete está pesado demais;
- como estruturar exatamente as primeiras consequências da montagem durante o lançamento;
- quais eventos e minijogos existirão no reabastecimento;
- quais tarefas internas os astronautas realizarão durante a viagem;
- como as escolhas de preparação para o pouso alterarão a animação e a experiência de aterrissagem;
- de que forma específica os dados e APIs da NASA serão incorporados ao planeta e à solução do hackathon;
- em que condições um personagem pode ficar para trás ou não retornar;
- como distribuir as três missões do MVP entre um ou dois personagens;
- como conciliar o ranking de três posições com o pódio animado de quatro posições.

## 14. Síntese fiel da experiência desejada

O Space Mission Game deve fazer o jogador sentir que projetar uma missão espacial é uma cadeia de decisões conectadas. Primeiro, a equipe escolhe os papéis; depois constrói uma nave sob limites de orçamento, massa, energia e Delta-V; em seguida lida com requisitos específicos do destino, como o reabastecimento obrigatório para Marte e a preparação de pouso. Na operação, a montagem deixa de ser abstrata: ela determina o que acontece no lançamento, em órbita, na viagem e na chegada.

Em Marte, os personagens exploram um planeta que se pretende vincular a dados reais da NASA, realizam missões específicas de suas especialidades, trabalham contra o tempo e retornam para receber uma avaliação de desempenho. O MVP deve preservar esse ciclo completo, mesmo que comece pequeno: uma missão a Marte, poucos personagens com objetivos ativos, cerca de três missões de superfície e um resultado final claro com pontos, notas, ranking e pódio.
