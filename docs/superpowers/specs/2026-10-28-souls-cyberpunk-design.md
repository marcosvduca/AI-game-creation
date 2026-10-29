# Souls-like Cyberpunk 2D — Design

Data: 2026-10-28 · Repositório: `marcosvduca/AI-game-creation` · Título provisório: **Neon Ashes** *(chamada nossa; o usuário pode trocar)*

## 1. Intenção

Um jogo web curto, no estilo souls-like, ambientado num futuro cyberpunk em 2D, com trilha de rock. O usuário pediu algo "não muito elaborado". A meta é uma primeira versão **jogável do início ao fim**: criar o personagem, atravessar uma fase, morrer, aprender e derrotar um chefe. Ela será publicada online e servirá de base para crescer depois.

O que faz o jogo valer a pena é a sensação souls aplicada ao combate: cada ação custa stamina, a morte tem consequência (os souls ficam no chão), o checkpoint funciona como "fogueira" e o chefe exige que o jogador aprenda os padrões dele.

## 2. Objetivos

- Side-scroller 2D em pixel art com tema cyberpunk (neon, chuva, becos, megacorporações).
- Uma fase curta (**~10–15 min** para quem a joga pela primeira vez) que termina numa arena de chefe. *(Duração estimada por nós.)*
- Mecânicas souls, todas obrigatórias na v1:
  - **Stamina:** atacar, esquivar (roll/dash com i-frames) e bloquear gastam stamina, que regenera quando o jogador não está agindo.
  - **Cura limitada:** um item no estilo Estus com poucas cargas (3, *chamada nossa*), recarregado no checkpoint.
  - **Perda de souls na morte:** ao morrer, o jogador deixa no chão toda a moeda que carregava. Se voltar até ela sem morrer, recupera tudo; se morrer antes, perde para sempre.
  - **Checkpoint:** descansar restaura vida e curas, revive os inimigos comuns (chefe derrotado não volta) e define o ponto de respawn.
- **Progressão:** os souls são gastos no checkpoint para subir de nível, aumentando atributos (Vida, Stamina, Força, *chamada nossa*). O custo do nível cresce a cada nível.
- **Customização básica do personagem** numa tela de criação antes do jogo:
  - **Visual/cores:** troca de paleta (por exemplo cabelo, roupa e cor do neon dos implantes) e, se o pack permitir, variação de cabeça ou corpo.
  - **Classe com atributos iniciais:** 3 classes. *(Sugestão nossa: Samurai, Pistoleiro e Brutamontes.)*
  - **Arma inicial:** vinculada à classe ou escolhida à parte (ver §6).
  - Não há campo de nome; o usuário não pediu.
- **Trilha sonora de rock** com faixas de licença livre: uma para a exploração e uma para o chefe, mais efeitos sonoros.
- **Controles:** teclado e gamepad (Xbox/PlayStation via Gamepad API), com remapeamento opcional (não obrigatório na v1).
- **Textos em português** (menus, HUD, tutoriais e mensagens como "VOCÊ MORREU").
- **Save local:** personagem, nível, souls, checkpoint atual e chefe derrotado ficam no `localStorage`.
- **Publicação** no GitHub Pages.

## 3. Fora do escopo (v1)

- Mais de uma fase ou mais de um chefe.
- Loja, vendedor, inventário e equipamento além da arma inicial.
- Multiplayer, mensagens de outros jogadores, NPCs com diálogos longos.
- Suporte a celular ou controles na tela.
- Outros idiomas.
- Backend ou conta de usuário (o save é só local).

## 4. Anti-objetivos (o que faria a v1 fracassar mesmo funcionando)

- Combate "flutuante", sem peso: ataques sem wind-up nem recuperação, esquiva sem custo, inimigos que não punem o spam de botão. Se o combate não parecer souls, o resto não importa.
- Morte sem consequência ou injusta: hitboxes que não batem com o sprite, dano sem telegraph, morte por bug de colisão.
- Assets sem licença clara ou sem crédito.
- Escopo que cresce: a v1 tem **uma** fase e **um** chefe.

## 5. Decisões já tomadas pelo usuário

| Tema | Decisão |
|---|---|
| Câmera | Side-scroller (vista lateral, com pulo e plataformas) |
| Escopo v1 | 1 fase + 1 chefe |
| Customização | Cores/visual, classe/atributos e arma inicial |
| Mecânicas | Stamina + esquiva, cura limitada, perda de souls na morte, checkpoint que revive inimigos |
| Progressão | Souls compram nível (atributos) no checkpoint |
| Arte | Pixel art de **packs livres** (itch.io, OpenGameArt etc.), creditados |
| Música | Rock com **licença livre**, creditada |
| Plataforma | Navegador no PC, teclado + gamepad |
| Idioma | Português |
| Save/deploy | `localStorage` + GitHub Pages |
| Stack | **Phaser 3 + TypeScript + Vite** |

### 5.1 Quando faltar arte (decisão do usuário)

Se os packs livres não cobrirem alguma necessidade (chefe, animação de bloqueio, um dos inimigos, variações de classe), estas soluções são **permitidas**, nesta ordem de preferência:

1. **Misturar packs** de autores diferentes, buscando a coesão possível: paleta e resolução próximas, recoloração para unificar.
2. **Editar ou desenhar sprites** (o agente Paleta recolore, edita frames ou desenha pixel art própria).
3. **Arte gerada por IA** para o que ainda faltar, registrada em `CREDITS.md` como gerada por IA.

Também é decisão do usuário que **não se simplifica uma mecânica obrigatória nem se redesenha inimigo ou chefe só para caber na arte existente**. A arte se adapta ao design, não o contrário.

Por isso, o plano começa com uma **auditoria de assets**: um mapa do que cada animação ou personagem precisa contra o que os packs escolhidos oferecem, com a solução (1, 2 ou 3) para cada lacuna. Essa auditoria é feita antes da produção do chefe, dos inimigos e das classes.

### 5.1.1 Arte escolhida (aprovada pelo usuário em 2026-10-28)

Resultado da auditoria (`docs/assets-audit.md`), aprovado pelo usuário:

- **Classes:** Samurai = Punk, Pistoleiro = Cyborg (com **braço-canhão** que dispara energia, em vez de pistola), Brutamontes = Biker.
- **Chefe:** o **mech quadrúpede** do pack "Bosses Pixel Art"; o ciborgue pesado (inimigo comum) deriva de outro chefe do mesmo pack, editado.
- **Lacunas** (esquiva, bloqueio e cura das 3 classes, katana do Samurai, efeitos): **desenhadas à mão** pela Paleta; arte gerada por IA só como último recurso.

### 5.2 Playtest com aprovação (decisão do usuário)

O usuário vai testar a sensação do combate durante o desenvolvimento. Existe um **portão obrigatório**:

- Primeiro sai um **protótipo grey-box**: o personagem contra 1 inimigo, com formas simples ou arte provisória, mas com stamina, ataque com wind-up e recuperação, esquiva com i-frames, bloqueio, cura, hitstop e knockback.
- O usuário joga localmente (`npm run dev`) e **aprova o peso do combate**.
- Só depois disso a equipe constrói a fase, o chefe e o acabamento da interface em cima dele.
- Novos playtests do usuário são feitos ao fim da fase completa e ao fim do chefe, para balanceamento.

## 6. Chamadas nossas (o usuário pode revisar)

- **Depois do chefe:** tela de vitória ("ALVO ELIMINADO" ou similar), depois créditos e volta ao menu. O save marca a vitória, e o jogador pode continuar explorando a fase ou começar de novo.
- **Save:** um único slot. O save automático acontece ao descansar no checkpoint, ao subir de nível, ao morrer e ao derrotar o chefe. "Novo jogo" sobrescreve o slot, com confirmação.
- **Morte:** ao morrer, os inimigos comuns também revivem (como em Dark Souls) e o jogador volta ao último checkpoint.
- **Classes:** o Pistoleiro é uma classe à distância (tiro com custo de stamina e munição infinita), com uma arma branca curta como secundária para o corpo a corpo. Samurai e Brutamontes são corpo a corpo.
- **Bloqueio:** reduz o dano recebido e gasta stamina por golpe bloqueado; se a stamina zerar, a guarda é quebrada (o jogador fica atordoado). **Parry fica fora da v1.**

- **Ferramentas:** Phaser 3 (última versão 3.x estável), TypeScript em modo `strict`, Vite como bundler, Vitest para testes de lógica e Playwright para um teste de fumaça (o jogo carrega, a criação de personagem funciona e a cena da fase inicia). Node 24, que já está instalado.
- **Arquitetura:** a lógica de jogo (stamina, dano, souls, níveis e save) fica em **módulos TypeScript puros, sem Phaser**, em `src/systems/`, para poder ser testada com Vitest e trabalhada em paralelo. As cenas do Phaser só orquestram.
  - Cenas: `Boot` → `Preload` → `MainMenu` → `CharacterCreation` → `Game` (fase + chefe), com `HUD` como cena sobreposta e `Pause` e `LevelUp` (no checkpoint) como sobreposições.
  - A fase é um tilemap em formato JSON compatível com o Tiled (pode ser feita no Tiled ou escrita à mão).
- **Arma e classe:** como packs livres raramente têm o mesmo personagem com 3 armas animadas, a v1 **vincula a arma à classe** e usa o melhor pack de personagem disponível.
  - Se não houver sprites distintos para cada arma, a diferença entre as armas fica em alcance, velocidade, dano, custo de stamina e efeito visual do golpe.
  - A cor é feita por **troca de paleta** (shader ou tint por camada, se o pack vier em camadas).
- **Licenças aceitas:** CC0, CC-BY e OGA-BY (e equivalentes "uso livre com crédito"). Evitar NC/ND. Todo asset é registrado em `CREDITS.md` com autor, link e licença, e os créditos aparecem numa tela do jogo.
- **Inimigos:** 3 tipos comuns *(sugestão: guarda corporativo corpo a corpo, drone que atira e ciborgue pesado lento)* e 1 chefe com pelo menos 2 fases de padrão de ataque, cada ataque com telegraph visual.
- **Controles padrão:**
  - Teclado: A/D para mover, Espaço para pular, J para atacar, K para esquivar, L para bloquear (segurar), E para curar, F para interagir/descansar e Esc para pausar.
  - Gamepad: no layout padrão souls (RB/R1 ataque, B/Círculo esquiva, LB/L1 bloqueio, X/Quadrado cura, A/Cruz pulo).
- **Resolução:** base interna de pixel art (por exemplo 480×270), escalada em inteiro para caber na tela, com `pixelArt: true`.
- **Deploy:** GitHub Actions faz o build e publica no Pages a cada push na `main`. O `base` do Vite é `/AI-game-creation/`. O usuário precisa ativar o Pages (fonte: GitHub Actions) nas configurações do repositório.

## 7. Restrições do processo (equipe no Maestri)

Workspace **AI Game Creation** (`~/Documents/AI-game-creation`). O Orquestrador coordena e delega, e os agentes não fazem commit.

| Agente | Responsável por |
|---|---|
| **Forja** (Gameplay) | `src/systems/`, física, combate, inimigos, chefe, cena `Game` |
| **Prisma** (UI/UX) | Menus, criação de personagem, HUD, pause, level-up, telas de morte e créditos |
| **Paleta** (Arte/Assets) | Auditoria de assets; busca, curadoria e integração de packs de sprites, tilesets, música e SFX; edição/desenho de sprites e integração de arte por IA para lacunas (§5.1); `assets/`, `CREDITS.md`, paletas de customização |
| **Sentinela** (QA) | Vitest e Playwright, testes manuais, reporte de bugs |
| **Cofre** (Git) | Único que faz commits locais (Conventional Commits). **Não faz push.** |
| **Dev Server** | Terminal para rodar `npm run dev` |

- **O usuário faz o `git push` manualmente.** O `gh` não está autenticado nesta máquina.
- Os contratos entre módulos (tipos compartilhados em `src/types/`) são definidos antes da implementação paralela, para Forja e Prisma não colidirem.

## 8. Deixado ao construtor

- Escolha dos packs específicos de arte e música, respeitando o tema, as licenças e o pixel art coeso.
- Layout exato da fase, posição do checkpoint (pelo menos 1 no meio da fase e 1 antes do chefe) e posicionamento dos inimigos.
- Valores numéricos de balanceamento (vida, dano, custo de stamina, curva de nível), ajustados por playtest.
- Padrões de ataque do chefe e design dos inimigos, desde que respeitem o telegraph e o peso do combate.
- Estrutura de pastas além do que foi dito acima.
