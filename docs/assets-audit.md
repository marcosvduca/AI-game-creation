# Auditoria de assets — v1 (Neon Ashes)

Data: 2026-10-28 · Responsável: Paleta · Spec: `docs/superpowers/specs/2026-10-28-souls-cyberpunk-design.md` (§5.1 e §6) · Plano: Fase 1, Task 0

Nada foi baixado para o repositório. Para medir os frames de verdade, os packs gratuitos do OpenGameArt (OGA) foram baixados **só numa pasta temporária fora do repo**. Os tamanhos e as contagens de frames abaixo vêm dos PNGs, não das descrições das páginas.

**Licenças aceitas:** CC0, CC-BY e OGA-BY. Nada com NC, ND ou SA. Com OGA-BY 3.0 o crédito é **obrigatório**. Com CC0 é opcional, mas vamos creditar tudo em `CREDITS.md` mesmo assim.

**Legenda da solução de lacuna (§5.1):** **1** misturar packs / recolorir · **2** editar ou desenhar (Paleta) · **3** gerar com IA (registrar em `CREDITS.md`)

---

## 1. Packs avaliados (verificados)

| # | Pack | Autor | Licença | Conteúdo útil | Tamanho medido | Download |
|---|---|---|---|---|---|---|
| A | [Warped City](https://opengameart.org/content/warped-city) ([itch](https://ansimuz.itch.io/warped-city)) | Luis Zuno (ansimuz) | **CC0** (arte). A música é de Pascal Belisle, "uso livre com crédito" | Tileset, parallax de 3 camadas, props neon animados, jogador atirador (10 animações), drone, torreta, VFX de tiro e explosão | Tiles 16×16 (`tileset.png` 384×256) · jogador 71×67/frame · drone 55×52 · torreta 25×23 · shot-hit 15×11 · camadas de fundo com 224 px de altura | ZIP direto no OGA, 4,3 MB, sem login |
| B | [Warped City 2](https://opengameart.org/content/warped-city-2) ([itch](https://ansimuz.itch.io/warped-city-2)) | ansimuz | **CC0** no OGA. O `public-license.txt` libera uso comercial, modificação e redistribuição | Tileset, parallax em loop, banners e luzes animadas, jogador, policial, "egg turret", explosão, 2 músicas (synthwave) | Tiles 16×16 (`tileset.png` 624×128) · jogador 80×80 · policial 61×64 (só idle 3f e run 10f) · egg turret 44×62 · explosion-a 48×48 ×8 · camadas de fundo com 160 px de altura | ZIP direto no OGA, 28,6 MB (2,8 MB de arte), sem login |
| C | [3 Cyberpunk Characters](https://opengameart.org/content/3-cyberpunk-characters) | CraftPix.net | **OGA-BY 3.0** | Biker, Punk e Cyborg com 12 animações cada | **48×48/frame** (personagem com ~32 px de altura) · 9 a 13 cores por sprite | ZIP direto no OGA, 57 KB, sem login |
| D | [Enemies for Platformer Pixel Art](https://opengameart.org/node/138409) | CraftPix.net | **OGA-BY 3.0** | 6 inimigos com idle, walk, attack, hurt e death | **48×48/frame** | ZIP direto no OGA, 42 KB, sem login |
| E | [Bosses Pixel Art Sprite Sheet](https://opengameart.org/content/bosses-pixel-art-sprite-sheet) | CraftPix.net | **OGA-BY 3.0** | 3 chefes com vários ataques, sneer, hurt e death | **72×72/frame** | ZIP direto no OGA, 54 KB, sem login |
| F | [Industrial Zone Tileset](https://opengameart.org/content/industrial-zone-tileset) | CraftPix.net | **OGA-BY 3.0** | Tiles industriais, objetos e **objetos animados** (terminal, dinheiro, cartão, porta) | Tiles 32×32 · terminal `Screen2` 32×42 ×4 · `Money` 24×24 ×6 · `Entry` 64×64 ×4 | ZIP direto no OGA, 146 KB, sem login |
| G | [Cyberpunk Backgrounds Pixel Art](https://opengameart.org/content/cyberpunk-backgrounds-pixel-art) | CraftPix.net | **OGA-BY 3.0** | 8 cenários (dia/noite) com 5 camadas | 576×324 | ZIP direto no OGA, 163 KB |
| H | [Unchained Destiny \[Rock\]](https://opengameart.org/node/138926) | nene | **CC0** | Rock instrumental: opening + loop | WAV (opening/loop) e MP3 | Direto no OGA |
| I | [JRPG Epic Rock Battle Theme #1](https://opengameart.org/content/jrpg-epic-rock-battle-theme-1) | HydroGene | **CC0** | Rock de batalha com intro + loop sem emenda | MP3 (intro, loop e full) | Direto no OGA |
| J | [512 Sound Effects (8-bit style)](https://opengameart.org/content/512-sound-effects-8-bit-style) | SubspaceAudio (Juhani Junkala) | **CC0** | 512 SFX: Weapons (77), Movement (114), General (230), Explosions (104), Death Screams (37) | WAV 44,1 kHz 16-bit mono | ZIP direto no OGA, 20,6 MB |
| K | [Impact Sounds](https://kenney.nl/assets/impact-sounds) | Kenney | **CC0** | 130 sons de impacto/foley | (formato confirmado só no download) | Site da Kenney (ver §5) |
| L | [RPG Audio](https://kenney.nl/assets/rpg-audio) | Kenney | **CC0** | 50 sons: passos, armas, foley | idem | idem |
| M | [Sci-fi Sounds](https://kenney.nl/assets/sci-fi-sounds) / [Interface Sounds](https://kenney.nl/assets/interface-sounds) | Kenney | **CC0** | 70 sci-fi (tiro, energia) / 100 UI (menus) | idem | idem |
| N | [Metallic Blades](https://muted.io/metallic-blades) | muted.io | **CC0** | 21 gravações de lâmina: whoosh, metal contra metal, "ding" | WAV 96 kHz/24-bit (converter para OGG) | Link direto, sem login |

**Reservas (verificadas, para trocar se necessário):**
- Música de exploração: [rocky musicloop](https://opengameart.org/content/rocky-musicloop) (johndekale, CC0) e [Cybershaman](https://opengameart.org/content/cybershaman) (Ruskerdax, CC0, cyberpunk com guitarra).
- Música do chefe: [Boss Battle #2 \[Symphonic Metal\]](https://opengameart.org/node/84428) (nene, CC0; os nomes dos arquivos no ZIP estão trocados) e [Decesive Frontier](https://opengameart.org/node/98778) (Centurion_of_war, CC-BY 4.0).

---

## 2. Necessidades × cobertura

### 2.1 Jogador (3 classes)

Base: pack **C**, recolorido para a paleta do Warped City. Mapeamento proposto:
- **Samurai** → Punk (silhueta ágil)
- **Pistoleiro** → Cyborg (o `attack3` dele já dispara um anel de energia pelo braço)
- **Brutamontes** → Biker (corpo largo; o `attack3` tem uma onda de energia nos punhos)

Frames do pack C (48×48): idle 4 · run 6 · jump 4 · doublejump 6 · climb 6 · attack1 6 · attack2 8 · attack3 8 · punch 6 · run_attack 6 · hurt 2 · death 6.

| Necessidade | Pack candidato | Autor | Licença | Frame | Cobre? | Solução da lacuna |
|---|---|---|---|---|---|---|
| Idle (3 classes) | C | CraftPix.net | OGA-BY 3.0 | 48×48, 4f | **sim** | 1 (recolorir) |
| Run | C | CraftPix.net | OGA-BY 3.0 | 48×48, 6f | **sim** | 1 |
| Jump/fall | C (`jump` + `doublejump`) | CraftPix.net | OGA-BY 3.0 | 48×48, 4f + 6f | **sim** | Fall = últimos frames do `jump` em loop |
| Ataque com wind-up: Brutamontes | C Biker (`attack1`/`attack3`/`punch`) | CraftPix.net | OGA-BY 3.0 | 48×48, 6–8f | **sim** | Os frames 1–3 já são wind-up. Arma = soco-inglês/manopla de energia |
| Ataque com wind-up: Pistoleiro | C Cyborg (`attack3` = tiro de energia; `punch` = arma curta) | CraftPix.net | OGA-BY 3.0 | 48×48, 8f + 6f | **parcial** | O tiro sai do braço (braço-canhão), não de uma pistola. **2** se for preciso pistola na mão: overlay nos 8f |
| Ataque com wind-up: Samurai | C Punk (os ataques são socos e chutes) | CraftPix.net | OGA-BY 3.0 | 48×48 | **parcial** | **2**: desenhar a katana sobre `attack1`/`attack2` (~14f) mais o arco do golpe. 3 só como último recurso |
| Roll/dash com i-frames | — | — | — | — | **não** | **2**: 6f por classe (18f). Base: frames de `doublejump` encolhidos. Fallback 3 |
| Block (segurar) | — | — | — | — | **não** | **2**: 2f por classe (entrada + guarda) + 1f de impacto (9f) |
| Guard break (atordoado) | C `hurt` | CraftPix.net | OGA-BY 3.0 | 2f | **parcial** | Reusar `hurt` em loop + estrelas/faíscas (VFX, 2) |
| Hurt | C | CraftPix.net | OGA-BY 3.0 | 48×48, 2f | **sim** | — |
| Death | C | CraftPix.net | OGA-BY 3.0 | 48×48, 6f | **sim** | — |
| Heal (estimulante) | — | — | — | — | **não** | **2**: 5f por classe (15f): aplicar injetor no pescoço + brilho verde |
| Customização de cor | C (9–13 cores por sprite) | — | — | — | **sim** | Troca de paleta indexada (cabelo, roupa, neon) em shader ou por textura gerada. Viável por causa das poucas cores |

Descartado como jogador: o atirador do Warped City (A/B). Ele tem ~48 px de altura, contra ~32 px do pack C, e não tem ataque corpo a corpo, roll, block nem death. Misturar os dois quebra a escala.

### 2.2 Inimigos comuns (idle, move, telegraph, attack, hurt, death)

| Necessidade | Pack candidato | Autor | Licença | Frame | Cobre? | Solução da lacuna |
|---|---|---|---|---|---|---|
| **Guarda corporativo** (corpo a corpo) | D inimigo 1 (homem com taco/cassetete) | CraftPix.net | OGA-BY 3.0 | 48×48 · idle 4, walk 6, attack 6, hurt 2, death 6 | **sim** (telegraph parcial) | 1: recolorir para uniforme corporativo. Telegraph = frames 1–2 do `attack` segurados + flash (tint no engine, ou 1f de brilho, 2) |
| **Drone que atira** | D inimigo 5 (drone com hélice; ataque elétrico) + projétil `Ball1` (D6) ou `shot` (A) | CraftPix.net / ansimuz | OGA-BY 3.0 / CC0 | 48×48 · idle 4, walk 4, attack 4, hurt 2, death 4 | **parcial** | 1: o ataque elétrico vira o disparo (projétil do D6 ou do A). Telegraph: 2f de carga (2). Morte alternativa: `explosion-a` 48×48 ×8 (B) |
| **Ciborgue pesado lento** | E chefe 3 (brutamontes de capacete, 72×72) | CraftPix.net | OGA-BY 3.0 | 72×72 · idle 4, walk 6, attack1–4 6f cada, sneer 6, hurt 2, death 6 | **parcial** | 2: recolorir e editar o visual (braço mecânico, visor) para virar ciborgue. Animação completa; telegraph = wind-up dos ataques + flash |
| Alternativa ao drone / torreta extra | D inimigo 6 (robô-torreta com esteira) | CraftPix.net | OGA-BY 3.0 | 48×48 · 4/4/4/2/4 + projéteis | sim | Reserva |

Descartados: o policial do Warped City 2 (só idle e run), o drone do Warped City (só 4f de idle, 55×52) e o atirador roxo D2 (bom, mas repete o papel do drone).

### 2.3 Chefe (2 fases, todo ataque com telegraph)

| Necessidade | Pack candidato | Autor | Licença | Frame | Cobre? | Solução da lacuna |
|---|---|---|---|---|---|---|
| Chefe: **mech corporativo** | E chefe 2 (mech quadrúpede com lança-mísseis) | CraftPix.net | OGA-BY 3.0 | 72×72 · idle 4, walk 6, attack1 8 (salva de mísseis), attack2 6 (salva curta), attack3 4 (laser), attack4 6 (pisão/salto), sneer 6, hurt 2, death 6 | **sim** (telegraph e fase 2 parciais) | Fase 1: laser + salva curta + pisão. Transição: `sneer`. Fase 2: salva de mísseis + combos mais rápidos e recolor "superaquecido" (1). Telegraph: 1–2f de carga por ataque (brilho no canhão, pernas agachando), **2** |
| Projéteis do chefe | E2 `Bullet` 12×6 · A `shot` 15×11 ×3 | CraftPix.net / ansimuz | OGA-BY 3.0 / CC0 | — | sim | 1 |
| Porta da arena ("névoa") | F `Entry` | CraftPix.net | OGA-BY 3.0 | 64×64 ×4 | sim | 1 (recolorir) |

Nota de escala: o chefe a 72 px tem pouco mais que o dobro da altura do jogador (~32 px). Funciona numa arena de 480×270. Ampliar 2× quebraria a densidade de pixels; se ele precisar parecer maior, a saída é redesenhar em 2× (2), não escalar.

### 2.4 Cenário, objetos e VFX

| Necessidade | Pack candidato | Autor | Licença | Frame | Cobre? | Solução da lacuna |
|---|---|---|---|---|---|---|
| Tileset cyberpunk (fase) | A `tileset.png` | ansimuz | CC0 | 16×16 (384×256) | **sim** | — (o personagem ocupa ~2 tiles de altura) |
| Tileset da arena do chefe | B `tileset.png` | ansimuz | CC0 | 16×16 (624×128) | **sim** | — |
| Parallax de fundo | A (skyline-a/b, buildings-bg, near-buildings-bg) · B (back/middle/front, em loop) | ansimuz | CC0 | A: 224 px de altura · B: 160 px de altura | **parcial** | 2: as camadas são mais baixas que 270 px. Estender o céu em cor sólida/gradiente no topo (A) ou repetir na vertical (B). Ampliar 2× só a camada mais distante, se preciso |
| Props neon animados | A (banners, monitor) · B (banners a–e, luzes) | ansimuz | CC0 | 13×47 a 90×60, 3–4f | **sim** | — |
| **Checkpoint** ("fogueira") | F `Screen2` (terminal num poste) | CraftPix.net | OGA-BY 3.0 | 32×42 ×4 | **parcial** | 1: recolorir para a paleta Warped. 2: estado "ativado" (tela verde + brilho, 2f) |
| **Souls no chão** | F `Money` (cédula girando) | CraftPix.net | OGA-BY 3.0 | 24×24 ×6 | **parcial** | 1+2: recolorir em ciano/magenta como "fragmento de dados" e somar pulso de brilho (VFX). Plano B: desenhar 16×16 ×6 (2) |
| VFX de golpe: impacto | A `shot-hit` 15×11 ×3 · efeitos embutidos nos `attack3` de C | ansimuz / CraftPix | CC0 / OGA-BY | — | **parcial** | 2: faísca de impacto 16×16 ×4 e arco de katana 32×32 ×4 |
| VFX de morte/explosão | B `explosion-a` 48×48 ×8 · A `enemy-explosion` 55×52 ×6 | ansimuz | CC0 | — | **sim** | — |
| VFX de cura / level-up | — | — | — | — | **não** | 2: partículas no Phaser (código) + 1 sprite de brilho 16×16 ×4 |

Descartados: o tileset do pack F (32×32, grande para personagens de ~32 px e paleta menos neon) e os fundos do pack G (cinza e roxo dessaturados, sem neon). Os VFX de hit da Sinestesia (CC0) também ficam de fora: são pintados em 512–1024 px, não são pixel art.

### 2.5 Música e SFX

| Necessidade | Pack candidato | Autor | Licença | Formato | Cobre? | Solução da lacuna |
|---|---|---|---|---|---|---|
| Rock de exploração | H Unchained Destiny | nene | CC0 | opening + loop WAV | **sim** | Converter para OGG/MP3. Reservas: rocky musicloop, Cybershaman |
| Rock do chefe | I JRPG Epic Rock Battle Theme #1 | HydroGene | CC0 | intro + loop MP3 | **sim** | Reserva: Boss Battle #2 (nene, CC0) |
| SFX de golpe (corpo a corpo) | K Impact Sounds + N Metallic Blades (katana) + J/Weapons | Kenney / muted.io / SubspaceAudio | CC0 | WAV/OGG | **sim** | — |
| SFX de tiro (Pistoleiro, drone, chefe) | J/Weapons + M Sci-fi Sounds | SubspaceAudio / Kenney | CC0 | — | **sim** | — |
| SFX de esquiva | J/Movement + N (whoosh) + L (foley) | vários | CC0 | — | **sim** | WebAudio como plano B |
| SFX de bloqueio | K (impacto metálico) + N ("ding") | Kenney / muted.io | CC0 | — | **sim** | — |
| SFX de cura | J/General (power-up) | SubspaceAudio | CC0 | — | **parcial** | Somar um "chiado de injetor" gerado em WebAudio (2) |
| SFX de morte | J/Death Screams | SubspaceAudio | CC0 | — | **sim** | — |
| SFX de level-up | J/General (jingles) | SubspaceAudio | CC0 | — | **sim** | — |
| SFX de UI (menus) | M Interface Sounds | Kenney | CC0 | — | **sim** | — |

Não recomendo a música do Warped City (Pascal Belisle): é synthwave, não rock, e o próprio autor do pack já mudou a licença dela uma vez, então os termos estão ambíguos. As faixas do Warped City 2 não declaram licença separada. Ficam só como reserva de ambiente.

---

## 3. Recomendação: conjunto coeso

**Atores CraftPix (packs C, D, E e F) num mundo ansimuz (packs A e B), tudo recolorido para uma paleta mestra.**

- **Por que esses:** os packs C, D e E são do mesmo autor e da mesma série "Cyberpunk Pixel Art Platformer". Por isso jogador, inimigos e chefe têm traço, contorno e escala iguais (48 px; chefes 72 px). Só eles trazem hurt, death e vários ataques para todos os atores. O mundo do Warped City é o que tem neon de verdade, em tiles 16×16 que combinam com personagens de ~32 px. Testei a composição numa cena de 480×270 e a escala bate.
- **Paleta mestra:** a do Warped City (roxo-noite, ciano, magenta e verde neon; ~12 cores no tileset). Os sprites CraftPix têm de 9 a 13 cores, então a recoloração é um mapeamento de cor para cor:
  - os verdes do mech e dos drones passam para ciano/roxo;
  - o guarda corporativo ganha azul-marinho com detalhe magenta.
  - Paleta e scripts de recolor ficam em `assets/palette/` (Fase 2).
- **Tamanho de frame:** jogador e inimigos comuns em 48×48, chefe e ciborgue pesado em 72×72, tiles 16×16, sem escala fracionária. Resolução interna 480×270, `pixelArt: true`.
- **Áudio:** rock CC0 (nene e HydroGene) e SFX CC0 (SubspaceAudio, Kenney, muted.io). Todo o áudio é CC0.
- **Créditos obrigatórios:** **CraftPix.net (OGA-BY 3.0)** em `CREDITS.md` e na tela de créditos. Os CC0 (ansimuz, nene, HydroGene, SubspaceAudio, Kenney, muted.io) também serão creditados. Não usar a fonte "Future Millennium" citada no `Font.txt` da CraftPix: ela não vem no pack e a licença não foi verificada.

### O que falta (produção da Paleta na Fase 2, solução 2; IA só se o prazo apertar)

| Item | Frames estimados |
|---|---|
| Roll/dash ×3 classes | 18 |
| Block (entrada, guarda, impacto) ×3 | 9 |
| Heal (injetor) ×3 | 15 |
| Katana do Samurai (overlay em 2 ataques + arco) | ~18 |
| Telegraph do chefe (carga por ataque, 4 ataques) e recolor da fase 2 | ~8 + recolor |
| Telegraph dos inimigos (drone; guarda e ciborgue no engine via tint) | ~2–4 |
| Ciborgue pesado: edição visual do chefe 3 (todos os frames, edição leve) | ~46 (edição) |
| Checkpoint ativado, souls como fragmento de dados, faísca de impacto, arco, brilho de cura | ~20 |
| Extensão vertical das camadas de parallax | 3–6 camadas |
| **Total de desenho novo** | **~90 frames** + recolor e edição leve |

Opcional, só se o usuário quiser: pistola na mão do Pistoleiro (overlay em ~8–14f). Sem ela, a classe usa braço-canhão de energia, que já está animado.

---

## 4. Riscos e observações

- **Coerência:** o traço CraftPix (contorno escuro, sombreamento chapado) e o traço ansimuz (mais detalhado, dithering no tileset) são diferentes. A paleta comum resolve a maior parte. Se o contraste incomodar no playtest, escurecer os tiles do primeiro plano ou acrescentar um contorno de 1 px nos props.
- **Telegraph:** nenhum pack traz frames dedicados de telegraph. A solução padrão é segurar o frame de wind-up + flash branco/vermelho (tint no Phaser), sem arte nova, mais 1–2f de carga desenhados para o chefe. Isso atende §4 do spec (nenhum dano sem aviso).
- **Hitboxes:** os frames de 48×48 têm muito espaço vazio (o corpo ocupa ~16×32). As hitboxes devem ser definidas por animação, não pelo tamanho do frame. Vou passar as medidas para o Forja na integração.

---

## 5. Ações do usuário

1. **Nenhum download exige login.** Todos os packs do OGA (A–J) e o Metallic Blades (N) têm link direto, e a Paleta baixa sozinha na Fase 2.
2. **Kenney (K, L, M):** o site bloqueia download automático (HTTP 403 para scripts). Se quiser esses sons, abra no navegador [Impact Sounds](https://kenney.nl/assets/impact-sounds), [RPG Audio](https://kenney.nl/assets/rpg-audio), [Sci-fi Sounds](https://kenney.nl/assets/sci-fi-sounds) e [Interface Sounds](https://kenney.nl/assets/interface-sounds). Clique em **Download** → "Continue without donating…" e deixe os ZIPs em `~/Downloads/`. É opcional: sem eles, o pack J (512 SFX) e WebAudio cobrem tudo, com sons de impacto menos encorpados.
3. **Decisões para revisar (chamadas nossas):**
   - mapeamento de classes: Samurai = Punk, Pistoleiro = Cyborg, Brutamontes = Biker;
   - Pistoleiro com **braço-canhão** em vez de pistola na mão;
   - chefe = **mech corporativo** (CraftPix chefe 2);
   - ciborgue pesado feito a partir do CraftPix chefe 3;
   - lacunas do jogador (~60 frames) **desenhadas pela Paleta (2)**, com IA (3) só como fallback.
