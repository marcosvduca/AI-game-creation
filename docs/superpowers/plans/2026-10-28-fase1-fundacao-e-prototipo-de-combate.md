# Fase 1 — Fundação e Protótipo de Combate (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Neste projeto a execução é pela equipe Maestri.** O Orquestrador delega cada task ao agente indicado em **Dono**. Os agentes nunca fazem commit: o passo "Commit" é um pedido ao **Cofre** com a mensagem indicada, feito pelo agente com `maestri ask "Cofre" "..."` ou pelo Orquestrador.

**Goal:** Projeto Phaser rodando com um protótipo *grey-box* de combate souls-like (personagem contra 1 inimigo), pronto para o **playtest de aprovação** do usuário (spec §5.2), e com a auditoria de assets (spec §5.1) feita em paralelo.

**Architecture:** As regras de jogo (stamina, vida, cura, ataque, resolução de golpe, máquina de estados do jogador, IA do inimigo e mapeamento de input) são **funções TypeScript puras** em `src/systems/` e `src/input/`, sem import de Phaser, testadas com Vitest. As entidades Phaser em `src/entities/` só leem input, chamam essas funções e desenham retângulos. Todos os números de balanceamento ficam em um único arquivo, `src/config/tuning.ts`.

**Tech Stack:** Phaser 3.90.0, TypeScript ^7.0.2 (`strict`), Vite ^8.3.5, Vitest ^5.0.5, @playwright/test ^1.64.1, Node 24.

**Spec:** `docs/superpowers/specs/2026-10-28-souls-cyberpunk-design.md`

**Escopo desta fase:** termina no portão de playtest. Fica para planos seguintes, escritos depois da aprovação do combate: souls e perda na morte, checkpoint, level-up, save, customização e classes, fase completa, os 3 inimigos, chefe, arte, música e menus finais.

## Global Constraints

- Phaser **3.x** (spec §6). Não usar Phaser 4.
- `pixelArt: true` e resolução interna **480×270**, escalada em inteiro (`Phaser.Scale.FIT` + `zoom` inteiro ou `autoRound`).
- Todo texto visível em **português**.
- Lógica em `src/systems/` e `src/input/` **sem importar `phaser`**. Os testes Vitest rodam sem navegador.
- Os números de balanceamento vêm só de `src/config/tuning.ts`; nenhum número mágico nas entidades.
- Controles padrão do teclado: **A/D** mover, **Espaço** pular, **J** atacar, **K** esquivar, **L** bloquear (segurar), **E** curar, **F** interagir, **Esc** pausar.
- Controles padrão do gamepad (Standard Gamepad mapping): **A=0** pular, **B=1** esquivar, **X=2** curar, **Y=3** interagir, **LB=4** bloquear, **RB=5** atacar, **Start=9** pausar, eixo 0 ou d-pad 14/15 para mover.
- Cura: **3 cargas**.
- Vite `base` = `'/AI-game-creation/'` só no `build`; `'/'` no `dev`.
- Os agentes **não fazem commit nem push**: o Cofre commita e o usuário faz o push.

## Review Focus

1. **Spike de `dt`** (aba em segundo plano, travada, frame lento): o jogador espera que nada "pule". As **entidades** (Task 7) passam `clampDt(delta)`, limitado a **50 ms**, para os sistemas. Os sistemas aceitam qualquer `dt`, o que permite testes com passos longos. Teste do `clampDt` na Task 2, e o e2e da aba oculta na Task 9.
2. **Apertar botões ao mesmo tempo ou freneticamente** (ataque + esquiva no mesmo frame, spam de ataque): o esperado é executar **uma** ação e guardar **no máximo uma** no buffer (150 ms), sem empilhar. Teste na Task 4.
3. **Stamina em 0 com input de ação**: a ação é recusada e a stamina nunca fica negativa. Com stamina > 0 a ação é permitida mesmo custando mais (estilo Dark Souls) e a stamina zera. Teste na Task 2.
4. **Um golpe acertando várias vezes**: o mesmo ataque causa dano **uma única vez por alvo**, mesmo com sobreposição de hitbox por vários frames. Também cobre ataque durante os i-frames da esquiva (0 de dano). Teste na Task 3.
5. **Gamepad conectado ou desconectado no meio do jogo**: nada quebra, e o teclado continua funcionando. Teste na Task 5 (`resolveActions` com `pad = null`).

---

### Task 0: Auditoria de assets (paralela)

**Dono:** Paleta · **Depende de:** nada · **Não bloqueia** esta fase (bloqueia o plano da fase 2).

**Files:**
- Create: `docs/assets-audit.md`

- [ ] **Step 1:** Listar as necessidades de arte do spec inteiro:
  - Jogador: idle, run, jump/fall, ataque com wind-up, roll/dash, block, hurt, death e heal, para Samurai, Pistoleiro e Brutamontes.
  - 3 inimigos comuns, cada um com idle, move, telegraph, attack, hurt e death.
  - Chefe com 2 fases de ataque, cada ataque com telegraph.
  - Tileset cyberpunk, parallax de fundo, checkpoint, item de souls no chão, VFX de golpe.
  - 1 faixa de rock de exploração, 1 faixa de rock do chefe, e SFX de golpe, esquiva, cura, morte e level-up.
- [ ] **Step 2:** Pesquisar packs (itch.io, OpenGameArt, Kenney, Freesound para SFX, e música CC0/CC-BY). Aceitar só **CC0, CC-BY ou OGA-BY**, sem NC ou ND.
- [ ] **Step 3:** Escrever `docs/assets-audit.md` com uma tabela `Necessidade | Pack candidato (link) | Autor | Licença | Resolução/tamanho do frame | Cobre? (sim/parcial/não) | Solução da lacuna (§5.1: 1 misturar · 2 editar/desenhar · 3 IA)`. No fim, uma recomendação de **um conjunto coeso** (paleta e tamanho de frame compatíveis).
  - Se algum download exigir login ou clique manual, listar na seção "Ações do usuário".
- [ ] **Step 4:** Pedir ao Cofre o commit `docs: auditoria de assets da v1` e responder ao Orquestrador com o resumo (o que tem e o que falta).

---

### Task 1: Scaffold do projeto + deploy

**Dono:** Forja

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `index.html`, `.gitignore`, `src/main.ts`, `src/scenes/BootScene.ts`, `src/config/game.ts`, `.github/workflows/deploy.yml`, `tests/unit/sanity.test.ts`
- Modify: `README.md` (como rodar: `npm install`, `npm run dev`, `npm test`, `npm run test:e2e`)

**Interfaces:**
- Produces:
  - Os scripts npm `dev`, `build`, `preview`, `test` (vitest run), `test:e2e` (playwright) e `typecheck` (`tsc --noEmit`).
  - `GAME_WIDTH = 480` e `GAME_HEIGHT = 270` exportados de `src/config/game.ts`.
  - `window.__GAME__: Phaser.Game`, exposto em `src/main.ts` para os testes e2e.

- [ ] **Step 1:** Criar o `package.json` com `"type": "module"` e as dependências fixadas no Tech Stack. Rodar `npm install`.
- [ ] **Step 2:** Configurar:
  - `tsconfig.json`: `strict`, `moduleResolution: "bundler"`, `noEmit`.
  - `vite.config.ts`: `base` condicional (Global Constraints).
  - `vitest.config.ts`: `include: ['tests/unit/**/*.test.ts']`, `environment: 'node'`.
  - `.gitignore`: `node_modules`, `dist`, `test-results`, `playwright-report`.
- [ ] **Step 3:** Escrever `src/main.ts`, que cria `Phaser.Game` com `type: AUTO`, `width/height` de `config/game.ts`, `pixelArt: true`, `physics: arcade` (gravity y = `TUNING.world.gravity`; usar 900 até a Task 2 criar o tuning), `scale: { mode: FIT, autoCenter: CENTER_BOTH }` e `scene: [BootScene]`. O `BootScene` desenha o texto "Neon Ashes — carregando…".
- [ ] **Step 4:** Escrever `tests/unit/sanity.test.ts` com `expect(GAME_WIDTH / GAME_HEIGHT).toBeCloseTo(16 / 9)`.
- [ ] **Step 5:** Rodar `npm run typecheck && npm test && npm run build`. Esperado: sem erros, 1 teste passando e `dist/index.html` com `/AI-game-creation/` nos caminhos dos assets.
- [ ] **Step 6:** Escrever `.github/workflows/deploy.yml`: em push na `main`, rodar `actions/checkout`, `actions/setup-node` (node 24, cache npm), `npm ci`, `npm test` e `npm run build`, depois `actions/upload-pages-artifact` (path `dist`) e `actions/deploy-pages`, com `permissions: pages: write, id-token: write`.
- [ ] **Step 7:** Rodar `npm run dev` no terminal **Dev Server** (`maestri ask "Dev Server" "npm run dev"` ou pelo Orquestrador) e confirmar que a página carrega o texto do BootScene.
- [ ] **Step 8:** Pedir ao Cofre o commit `chore: scaffold Phaser 3 + TypeScript + Vite + Vitest + Playwright e deploy no Pages`.

---

### Task 2: Tuning, tempo, stamina, vida e cura

**Dono:** Forja · **Depende de:** Task 1

**Files:**
- Create: `src/config/tuning.ts`, `src/systems/time.ts`, `src/systems/stamina.ts`, `src/systems/health.ts`, `src/systems/flask.ts`
- Test: `tests/unit/stamina.test.ts`, `tests/unit/health.test.ts`, `tests/unit/flask.test.ts`, `tests/unit/time.test.ts`

**Interfaces:**
- Produces:
  - `TUNING` (objeto `as const`) com:
    - `world.gravity = 900`
    - `stamina = { max: 100, regenPerSec: 45, regenDelayMs: 600 }`
    - `health = { max: 100 }`
    - `flask = { charges: 3, healFraction: 0.4, useMs: 900 }`
    - `costs = { attack: 20, dodge: 25, jump: 0 }`
    - `block = { damageReduction: 0.8, staminaPerDamage: 1.0, guardBreakStunMs: 1000 }`
    - `dodge = { durationMs: 400, iframeStartMs: 60, iframeEndMs: 320, speed: 220 }`
    - `inputBufferMs = 150`
    - `maxDtMs = 50`
    - `hitstopMs = 60`
    - `knockback = { player: 140, enemy: 120 }`
    - `player = { runSpeed: 110, jumpVelocity: -330 }`
  - `clampDt(dtMs: number): number`
  - `interface Stamina { current: number; max: number; delayLeftMs: number }`
  - `createStamina(max: number): Stamina`
  - `trySpend(s: Stamina, cost: number): { ok: boolean; stamina: Stamina }`
  - `drain(s: Stamina, amount: number): Stamina` (gasto forçado, usado pelo bloqueio; pode zerar)
  - `tickStamina(s: Stamina, dtMs: number): Stamina`
  - `interface Health { current: number; max: number }`
  - `createHealth(max: number): Health`, `applyDamage(h: Health, amount: number): Health`, `heal(h: Health, amount: number): Health`, `isDead(h: Health): boolean`
  - `interface Flask { charges: number; max: number }`
  - `createFlask(max: number): Flask`, `drinkFlask(f: Flask): { ok: boolean; flask: Flask }`, `refillFlask(f: Flask): Flask`
  - Todas as funções são imutáveis (retornam um objeto novo).

- [ ] **Step 1: Escrever os testes que falham**

```ts
// stamina.test.ts
it('gasta e inicia o atraso de regeneração', () => {
  const r = trySpend(createStamina(100), 20);
  expect(r.ok).toBe(true); expect(r.stamina.current).toBe(80); expect(r.stamina.delayLeftMs).toBe(600);
});
it('com stamina > 0 permite ação mais cara e zera (estilo souls)', () => {
  const r = trySpend({ current: 10, max: 100, delayLeftMs: 0 }, 25);
  expect(r.ok).toBe(true); expect(r.stamina.current).toBe(0);
});
it('com stamina 0 recusa a ação e nunca fica negativa', () => {
  const r = trySpend({ current: 0, max: 100, delayLeftMs: 0 }, 20);
  expect(r.ok).toBe(false); expect(r.stamina.current).toBe(0);
});
it('não regenera durante o atraso e depois regenera 45/s até o máximo', () => {
  let s = trySpend(createStamina(100), 50).stamina;          // 50, atraso 600
  s = tickStamina(s, 500); expect(s.current).toBe(50);
  s = tickStamina(s, 100); s = tickStamina(s, 1000); expect(s.current).toBeCloseTo(95);
  s = tickStamina(s, 1000); expect(s.current).toBe(100);
});
// time.test.ts
it('limita dt a 50 ms', () => { expect(clampDt(2000)).toBe(50); expect(clampDt(16)).toBe(16); expect(clampDt(-5)).toBe(0); });
// health.test.ts
it('dano não passa de 0 e cura não passa do máximo', () => {
  expect(applyDamage(createHealth(100), 150).current).toBe(0);
  expect(isDead(applyDamage(createHealth(100), 100))).toBe(true);
  expect(heal({ current: 90, max: 100 }, 40).current).toBe(100);
});
// flask.test.ts
it('tem 3 cargas, recusa a 4ª e recarrega', () => {
  let f = createFlask(3);
  for (let i = 0; i < 3; i++) { const r = drinkFlask(f); expect(r.ok).toBe(true); f = r.flask; }
  expect(drinkFlask(f).ok).toBe(false);
  expect(refillFlask(f).charges).toBe(3);
});
```

- [ ] **Step 2:** Rodar `npm test`. Esperado: FAIL (módulos não existem).
- [ ] **Step 3:** Implementar os módulos com as assinaturas acima. O `tickStamina` primeiro consome o atraso e usa o tempo que sobrar no mesmo tick para regenerar (por isso `500 + 100 + 1000` dá 95).
- [ ] **Step 4:** Rodar `npm test`. Esperado: PASS.
- [ ] **Step 5:** Pedir ao Cofre o commit `feat(systems): stamina, vida, cura e tuning`.

---

### Task 3: Ataques e resolução de golpe

**Dono:** Forja · **Depende de:** Task 2

**Files:**
- Create: `src/types/combat.ts`, `src/systems/attack.ts`, `src/systems/hit.ts`
- Modify: `src/config/tuning.ts` (adicionar `attacks`)
- Test: `tests/unit/attack.test.ts`, `tests/unit/hit.test.ts`

**Interfaces:**
- Consumes: `Stamina`, `drain` e `TUNING` (Task 2).
- Produces:
  - `type AttackPhase = 'windup' | 'active' | 'recovery' | 'done'`
  - `interface AttackSpec { id: string; windupMs: number; activeMs: number; recoveryMs: number; damage: number; staminaCost: number; reach: number }`
  - `TUNING.attacks`:
    - `katanaLight = { id: 'katanaLight', windupMs: 220, activeMs: 100, recoveryMs: 320, damage: 22, staminaCost: 20, reach: 26 }`
    - `guardSlash = { id: 'guardSlash', windupMs: 500, activeMs: 120, recoveryMs: 450, damage: 25, staminaCost: 0, reach: 24 }` (ataque do inimigo; o windup é o telegraph)
  - `interface AttackState { spec: AttackSpec; elapsedMs: number; hitTargets: ReadonlySet<string> }`
  - `startAttack(spec: AttackSpec): AttackState`
  - `tickAttack(a: AttackState, dtMs: number): AttackState`
  - `attackPhase(a: AttackState): AttackPhase`
  - `registerHit(a: AttackState, targetId: string): { counted: boolean; attack: AttackState }` (`counted` é false se o alvo já levou dano deste ataque ou se a fase não é `active`)
  - `interface DefenderState { blocking: boolean; invulnerable: boolean; stamina: Stamina }`
  - `interface HitResult { hpDamage: number; stamina: Stamina; guardBroken: boolean; blocked: boolean }`
  - `resolveHit(damage: number, d: DefenderState): HitResult`

- [ ] **Step 1: Escrever os testes que falham**

```ts
// attack.test.ts
const spec = TUNING.attacks.katanaLight;
it('percorre windup → active → recovery → done pelos tempos do spec', () => {
  let a = startAttack(spec);
  expect(attackPhase(a)).toBe('windup');
  a = tickAttack(a, 220); expect(attackPhase(a)).toBe('active');
  a = tickAttack(a, 100); expect(attackPhase(a)).toBe('recovery');
  a = tickAttack(a, 320); expect(attackPhase(a)).toBe('done');
});
it('conta o golpe uma vez por alvo e só na fase active', () => {
  let a = startAttack(spec);
  expect(registerHit(a, 'e1').counted).toBe(false);          // windup
  a = tickAttack(a, 230);
  const r1 = registerHit(a, 'e1'); expect(r1.counted).toBe(true);
  expect(registerHit(r1.attack, 'e1').counted).toBe(false);  // sobreposição em frames seguintes
  expect(registerHit(r1.attack, 'e2').counted).toBe(true);
});
// hit.test.ts
const st = (c: number) => ({ current: c, max: 100, delayLeftMs: 0 });
it('i-frames anulam o golpe', () => {
  expect(resolveHit(25, { blocking: false, invulnerable: true, stamina: st(50) }).hpDamage).toBe(0);
});
it('sem bloqueio recebe dano cheio', () => {
  expect(resolveHit(25, { blocking: false, invulnerable: false, stamina: st(50) }).hpDamage).toBe(25);
});
it('bloqueio reduz 80% e gasta stamina = dano', () => {
  const r = resolveHit(25, { blocking: true, invulnerable: false, stamina: st(50) });
  expect(r.blocked).toBe(true); expect(r.hpDamage).toBeCloseTo(5); expect(r.stamina.current).toBe(25); expect(r.guardBroken).toBe(false);
});
it('bloqueio que zera a stamina quebra a guarda', () => {
  const r = resolveHit(25, { blocking: true, invulnerable: false, stamina: st(10) });
  expect(r.guardBroken).toBe(true); expect(r.stamina.current).toBe(0); expect(r.hpDamage).toBeCloseTo(5);
});
```

- [ ] **Step 2:** Rodar `npm test`. Esperado: FAIL.
- [ ] **Step 3:** Implementar. O `hitTargets` é copiado (novo `Set`) a cada `registerHit`.
- [ ] **Step 4:** Rodar `npm test`. Esperado: PASS.
- [ ] **Step 5:** Pedir ao Cofre o commit `feat(systems): fases de ataque e resolução de golpe com bloqueio e i-frames`.

---

### Task 4: Máquina de estados do jogador

**Dono:** Forja · **Depende de:** Task 3 (e dos nomes de `Action` da Task 5; o tipo `Action` fica em `src/types/input.ts`, criado nesta task se a Task 5 ainda não o tiver criado)

**Files:**
- Create: `src/types/input.ts`, `src/systems/playerState.ts`
- Test: `tests/unit/playerState.test.ts`

**Interfaces:**
- Consumes: `startAttack`, `tickAttack`, `attackPhase`, `trySpend`, `drinkFlask`, `heal` e `TUNING`.
- Produces:
  - `type Action = 'left' | 'right' | 'jump' | 'attack' | 'dodge' | 'block' | 'heal' | 'interact' | 'pause'` (em `src/types/input.ts`)
  - `type PlayerMode = 'free' | 'attack' | 'dodge' | 'heal' | 'stunned' | 'hurt' | 'dead'` (`free` cobre idle, run, jump e block; o bloqueio é `blocking: true` em `free`)
  - `interface PlayerCore { mode: PlayerMode; modeMs: number; facing: 1 | -1; stamina: Stamina; health: Health; flask: Flask; attack: AttackState | null; blocking: boolean; buffered: { action: 'attack' | 'dodge' | 'heal'; ageMs: number } | null }`
  - `createPlayerCore(): PlayerCore`
  - `stepPlayer(p: PlayerCore, pressed: ReadonlySet<Action>, held: ReadonlySet<Action>, dtMs: number): PlayerCore` (`pressed` = apertado neste frame; `held` = segurado)
  - `isInvulnerable(p: PlayerCore): boolean` (true entre `iframeStartMs` e `iframeEndMs` da esquiva)
  - `onHit(p: PlayerCore, damage: number): PlayerCore` (usa `resolveHit`; dano > 0 leva a `hurt` por 250 ms; guarda quebrada leva a `stunned` por 1000 ms; vida 0 leva a `dead`)
- Regras:
  - **Comprometimento:** em `attack`, `dodge`, `heal`, `hurt` e `stunned`, nenhum input inicia nova ação.
  - Ações apertadas nesses modos vão para o **buffer** (só a última, até 150 ms) e executam ao voltar a `free`.
  - Em `free`, a prioridade no mesmo frame é `dodge > attack > heal`.
  - A cura aplica `healFraction * max` ao **terminar** os 900 ms (é interrompida por `hurt` sem curar, mas gasta a carga).
  - Bloquear só é possível em `free` com `held.has('block')` e stamina > 0.

- [ ] **Step 1: Escrever os testes que falham**

```ts
const S = (...a: Action[]) => new Set(a);
it('atacar gasta 20 de stamina e entra em attack', () => {
  const p = stepPlayer(createPlayerCore(), S('attack'), S(), 16);
  expect(p.mode).toBe('attack'); expect(p.stamina.current).toBe(80);
});
it('ataque + esquiva no mesmo frame executa só a esquiva', () => {
  const p = stepPlayer(createPlayerCore(), S('attack', 'dodge'), S(), 16);
  expect(p.mode).toBe('dodge'); expect(p.stamina.current).toBe(75);
});
it('esquiva apertada durante o ataque fica no buffer e executa após a recuperação', () => {
  let p = stepPlayer(createPlayerCore(), S('attack'), S(), 0);
  p = stepPlayer(p, S('dodge'), S(), 500);                // ainda em attack
  expect(p.mode).toBe('attack'); expect(p.buffered?.action).toBe('dodge');
  p = stepPlayer(p, S(), S(), 140);                        // 640 ms: termina o ataque; buffer com 140 ms
  expect(p.mode).toBe('dodge');
});
it('spam de ataque não empilha: buffer guarda no máximo uma ação e expira em 150 ms', () => {
  let p = stepPlayer(createPlayerCore(), S('attack'), S(), 0);
  p = stepPlayer(p, S('attack'), S(), 10); p = stepPlayer(p, S('attack'), S(), 10);
  expect(p.buffered?.action).toBe('attack');
  p = stepPlayer(p, S(), S(), 160); expect(p.buffered).toBeNull();
});
it('i-frames só na janela 60–320 ms da esquiva', () => {
  let p = stepPlayer(createPlayerCore(), S('dodge'), S(), 0);
  expect(isInvulnerable(stepPlayer(p, S(), S(), 30))).toBe(false);
  expect(isInvulnerable(stepPlayer(p, S(), S(), 100))).toBe(true);
});
it('cura com 3 cargas cura 40% ao fim e é perdida se interrompida', () => {
  let p = { ...createPlayerCore(), health: { current: 30, max: 100 } };
  p = stepPlayer(p, S('heal'), S(), 0); p = stepPlayer(p, S(), S(), 900);
  expect(p.health.current).toBe(70); expect(p.flask.charges).toBe(2);
  p = stepPlayer(p, S('heal'), S(), 0); p = onHit(p, 10);
  p = stepPlayer(p, S(), S(), 900);
  expect(p.flask.charges).toBe(1); expect(p.health.current).toBe(60);
});
it('guarda quebrada atordoa por 1000 ms', () => {
  let p = { ...createPlayerCore(), stamina: { current: 10, max: 100, delayLeftMs: 0 } };
  p = stepPlayer(p, S(), S('block'), 16);
  p = onHit(p, 25); expect(p.mode).toBe('stunned');
  p = stepPlayer(p, S('attack'), S(), 999); expect(p.mode).toBe('stunned');
});
it('vida zero leva a dead e ignora input', () => {
  let p = onHit(createPlayerCore(), 999); expect(p.mode).toBe('dead');
  expect(stepPlayer(p, S('attack'), S(), 16).mode).toBe('dead');
});
```

- [ ] **Step 2:** Rodar `npm test`. Esperado: FAIL.
- [ ] **Step 3:** Implementar `stepPlayer`. Em `onHit`, guarda quebrada tem prioridade sobre `hurt`. A ordem dentro do passo: envelhecer o buffer, avançar o modo atual (`modeMs`, `tickAttack`), sair do modo se o tempo acabou, consumir o buffer ou o `pressed` se estiver em `free`, e por fim `tickStamina`. Posição e velocidade **não** ficam aqui; ficam na entidade (Task 6).
- [ ] **Step 4:** Rodar `npm test`. Esperado: PASS.
- [ ] **Step 5:** Pedir ao Cofre o commit `feat(systems): máquina de estados do jogador com comprometimento e buffer de input`.

---

### Task 5: Mapeamento de input (teclado + gamepad)

**Dono:** Prisma · **Depende de:** Task 1 · **Paralela** às Tasks 2–4

**Files:**
- Create: `src/input/bindings.ts`, `src/input/resolveActions.ts` (usa `Action` de `src/types/input.ts`; cria o arquivo com a definição da Task 4 se ainda não existir)
- Test: `tests/unit/resolveActions.test.ts`

**Interfaces:**
- Produces:
  - `KEYBOARD_BINDINGS: Record<Action, string[]>` com códigos `KeyboardEvent.code`: `left: ['KeyA','ArrowLeft']`, `right: ['KeyD','ArrowRight']`, `jump: ['Space']`, `attack: ['KeyJ']`, `dodge: ['KeyK']`, `block: ['KeyL']`, `heal: ['KeyE']`, `interact: ['KeyF']`, `pause: ['Escape']`
  - `GAMEPAD_BINDINGS: Partial<Record<Action, number[]>>`: `jump: [0]`, `dodge: [1]`, `heal: [2]`, `interact: [3]`, `block: [4]`, `attack: [5]`, `pause: [9]`, `left: [14]`, `right: [15]`
  - `AXIS_DEADZONE = 0.35`
  - `interface PadSnapshot { buttons: readonly boolean[]; axisX: number }`
  - `resolveActions(keysDown: ReadonlySet<string>, pad: PadSnapshot | null): Set<Action>` (o que está **segurado** agora)
  - `edgePressed(now: ReadonlySet<Action>, prev: ReadonlySet<Action>): Set<Action>` (o que foi apertado neste frame)

- [ ] **Step 1: Escrever os testes que falham**

```ts
it('teclado: J ataca, setas e WASD movem', () => {
  expect(resolveActions(new Set(['KeyJ', 'ArrowLeft']), null)).toEqual(new Set(['attack', 'left']));
});
it('gamepad: RB ataca, B esquiva, eixo além da deadzone move', () => {
  const buttons = Array(17).fill(false); buttons[5] = true; buttons[1] = true;
  expect(resolveActions(new Set(), { buttons, axisX: -0.6 })).toEqual(new Set(['attack', 'dodge', 'left']));
  expect(resolveActions(new Set(), { buttons: Array(17).fill(false), axisX: 0.2 }).size).toBe(0);
});
it('pad null (desconectado) não quebra e teclado segue funcionando', () => {
  expect(resolveActions(new Set(['KeyK']), null)).toEqual(new Set(['dodge']));
});
it('pad com array de botões curto não quebra', () => {
  expect(() => resolveActions(new Set(), { buttons: [true], axisX: 0 })).not.toThrow();
});
it('edgePressed só retorna ações novas', () => {
  expect(edgePressed(new Set(['attack', 'left']), new Set(['left']))).toEqual(new Set(['attack']));
});
```

- [ ] **Step 2:** Rodar `npm test`. Esperado: FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar `npm test`. Esperado: PASS.
- [ ] **Step 5:** Pedir ao Cofre o commit `feat(input): mapeamento de teclado e gamepad`.

---

### Task 6: IA do inimigo (guarda corpo a corpo)

**Dono:** Forja · **Depende de:** Task 3

**Files:**
- Create: `src/systems/enemyAI.ts`
- Modify: `src/config/tuning.ts` (adicionar `guard`)
- Test: `tests/unit/enemyAI.test.ts`

**Interfaces:**
- Consumes: `AttackState`, `startAttack`, `tickAttack`, `attackPhase`, `Health`, `applyDamage` e `TUNING.attacks.guardSlash`.
- Produces:
  - `TUNING.guard = { hp: 60, aggroRange: 140, attackRange: 26, walkSpeed: 45, chaseSpeed: 70, recoverMs: 400, hurtMs: 220, attackCooldownMs: 900 }`
  - `type EnemyMode = 'idle' | 'chase' | 'attack' | 'recover' | 'hurt' | 'dead'` (o telegraph é a fase `windup` do `attack`)
  - `interface EnemyCore { id: string; mode: EnemyMode; modeMs: number; facing: 1 | -1; health: Health; attack: AttackState | null; cooldownMs: number }`
  - `createEnemyCore(id: string): EnemyCore`
  - `interface EnemyIntent { moveX: -1 | 0 | 1; speed: number; telegraph: boolean }`
  - `stepEnemy(e: EnemyCore, dxToPlayer: number, playerDead: boolean, dtMs: number): { enemy: EnemyCore; intent: EnemyIntent }`
  - `onEnemyHit(e: EnemyCore, damage: number): EnemyCore` (o guarda **não** é interrompido durante o `active` do próprio ataque; no `windup` é interrompido e vai para `hurt`)

- [ ] **Step 1: Escrever os testes que falham**

```ts
it('fica idle fora do alcance de aggro e persegue dentro dele', () => {
  expect(stepEnemy(createEnemyCore('g1'), 200, false, 16).enemy.mode).toBe('idle');
  const r = stepEnemy(createEnemyCore('g1'), -100, false, 16);
  expect(r.enemy.mode).toBe('chase'); expect(r.intent.moveX).toBe(-1);
});
it('no alcance de ataque faz telegraph de 500 ms parado antes do golpe', () => {
  let r = stepEnemy(createEnemyCore('g1'), 20, false, 16);
  expect(r.enemy.mode).toBe('attack'); expect(r.intent.telegraph).toBe(true); expect(r.intent.moveX).toBe(0);
  r = stepEnemy(r.enemy, 20, false, 500); expect(r.intent.telegraph).toBe(false);
});
it('respeita o cooldown de 900 ms (contado do fim do ataque) entre ataques', () => {
  let e = createEnemyCore('g1');
  const run = (ms: number) => { for (let t = 0; t < ms; t += 10) e = stepEnemy(e, 20, false, 10).enemy; };
  run(1070 + 400 + 50);                                // ataque (500+120+450) + recover 400
  expect(e.mode).not.toBe('attack');                   // cooldown restante ~450 ms
  run(500);
  expect(e.mode).toBe('attack');
});
it('golpe no windup interrompe; morte ao zerar 60 de vida', () => {
  const e = stepEnemy(createEnemyCore('g1'), 20, false, 16).enemy;
  expect(onEnemyHit(e, 22).mode).toBe('hurt');
  expect(onEnemyHit(onEnemyHit(onEnemyHit(e, 22), 22), 22).mode).toBe('dead');
});
it('para de atacar quando o jogador morre', () => {
  expect(stepEnemy(createEnemyCore('g1'), 20, true, 16).enemy.mode).toBe('idle');
});
```

- [ ] **Step 2:** Rodar `npm test`. Esperado: FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar `npm test`. Esperado: PASS.
- [ ] **Step 5:** Pedir ao Cofre o commit `feat(systems): IA do guarda com telegraph e cooldown`.

---

### Task 7: Arena grey-box jogável (entidades Phaser + sensação)

**Dono:** Forja · **Depende de:** Tasks 4, 5 e 6

**Files:**
- Create: `src/entities/Player.ts`, `src/entities/Enemy.ts`, `src/fx/feel.ts`, `src/scenes/CombatTestScene.ts`
- Modify: `src/main.ts` (registrar a cena), `src/scenes/BootScene.ts` (iniciar `CombatTestScene`)

**Interfaces:**
- Consumes: `stepPlayer`, `onHit`, `isInvulnerable`, `stepEnemy`, `onEnemyHit`, `registerHit`, `attackPhase`, `resolveActions`, `edgePressed` e `TUNING`.
- Produces:
  - Chave de cena `'CombatTest'`.
  - O `CombatTestScene` emite no `this.game.events`:
    - `'player-changed'` com payload `{ hp: number; hpMax: number; stamina: number; staminaMax: number; flask: number; flaskMax: number }`
    - `'player-died'`
  - O último payload de `'player-changed'` também fica em `window.__LAST_PLAYER__`, para os testes e2e.
  - Todo `update` passa `clampDt(delta)` aos sistemas.
  - `hitstop(scene: Phaser.Scene, ms: number): void`, `shake(scene: Phaser.Scene, intensity: number): void`
  - Teclado e gamepad são lidos via `window` keydown/keyup (`event.code`) e `navigator.getGamepads()`, alimentando `resolveActions`.

- [ ] **Step 1:** Montar a cena `CombatTest`: chão estático em 480 de largura, 2 plataformas, o jogador como retângulo 14×28 ciano e o guarda como retângulo 16×28 magenta, câmera seguindo o jogador, `F2` alterna o debug das hitboxes e **R** reinicia a arena.
- [ ] **Step 2:** Implementar `Player`.
  - Lê o input a cada `update` e chama `stepPlayer` com `clampDt(delta)`.
  - Aplica a velocidade: `runSpeed` em `free`, `dodge.speed` na direção `facing` em `dodge`, zero em `attack`, `heal` e `stunned`, e só gravidade em `hurt`.
  - Pulo só em `free` e no chão.
  - Desenha a hitbox do golpe (retângulo `reach` à frente) só na fase `active`.
  - Feedback de estado: fica branco ao piscar no windup, translúcido com i-frames e amarelo com bloqueio.
- [ ] **Step 3:** Implementar `Enemy`.
  - Chama `stepEnemy` com `dx` até o jogador.
  - Aplica `intent`. Com `telegraph`, pisca em vermelho e mostra um "!" acima.
  - Desenha a hitbox do golpe só na fase `active`.
- [ ] **Step 4:** Ligar os acertos.
  - A cada `update`, se a hitbox ativa de um sobrepõe o corpo do outro, chama `registerHit`. Se `counted`, chama `onHit`/`onEnemyHit`, `hitstop(scene, TUNING.hitstopMs)`, um `shake` leve e aplica o knockback (`TUNING.knockback`).
  - Emite `'player-changed'` quando os valores mudam.
  - Na morte do jogador, emite `'player-died'`, mostra "VOCÊ MORREU" centralizado em vermelho e, após 2 s, reinicia a arena.
- [ ] **Step 5:** Rodar `npm run typecheck && npm test`. Esperado: sem erros e todos os testes passando.
- [ ] **Step 6:** Testar manualmente com `npm run dev` (no Dev Server). Checar:
  - Ataque com pausa visível antes do golpe.
  - Esquiva atravessa o golpe do guarda.
  - Bloqueio reduz o dano e quebra a guarda sem stamina.
  - Cura deixa vulnerável.
  - Spam de J não empilha ataques.
  - Gamepad funciona. Desconectar o gamepad no meio não quebra o jogo.
- [ ] **Step 7:** Pedir ao Cofre o commit `feat(prototype): arena grey-box de combate com hitstop e knockback`.

---

### Task 8: HUD grey-box

**Dono:** Prisma · **Depende de:** Task 7 (eventos) · Pode começar com eventos simulados assim que a Task 7 fixar o payload

**Files:**
- Create: `src/scenes/HudScene.ts`
- Modify: `src/scenes/CombatTestScene.ts` (`this.scene.launch('Hud')`), `src/main.ts`

**Interfaces:**
- Consumes: os eventos `'player-changed'` e `'player-died'` (Task 7).
- Produces: a chave de cena `'Hud'`.

- [ ] **Step 1:** Desenhar no canto superior esquerdo, em pixels inteiros:
  - Barra de vida vermelha de 100×6.
  - Barra de stamina verde de 100×4, abaixo da vida.
  - Ícone e contador de curas ("◆ 3").
  - Uma barra "fantasma" amarela que mostra o dano recente e desce em ~400 ms (feedback clássico souls).
- [ ] **Step 2:** Mostrar em fonte pequena no canto inferior uma legenda de controles em português, alternável com F1: "J atacar · K esquivar · L bloquear · E curar · Espaço pular".
- [ ] **Step 3:** Rodar `npm run typecheck` e checar no Dev Server que as barras acompanham o dano, o gasto e a regeneração de stamina e o uso de curas.
- [ ] **Step 4:** Pedir ao Cofre o commit `feat(ui): HUD grey-box de vida, stamina e curas`.

---

### Task 9: Teste de fumaça e2e

**Dono:** Sentinela · **Depende de:** Tasks 7 e 8

**Files:**
- Create: `tests/e2e/smoke.spec.ts`
- Modify: `playwright.config.ts` (`webServer: { command: 'npm run dev -- --port 5173', url: 'http://localhost:5173', reuseExistingServer: true }`)

**Interfaces:**
- Consumes: `window.__GAME__` (Task 1) e as chaves de cena `'CombatTest'` e `'Hud'`.

- [ ] **Step 1:** Escrever os testes:
  - `carrega a arena`: depois do `goto('/')`, esperar `window.__GAME__.scene.isActive('CombatTest')` e `isActive('Hud')` serem true, e conferir que nenhum `pageerror` ocorreu.
  - `ataque gasta stamina`: pressionar `KeyJ` e, via `page.evaluate`, ler a stamina exposta pelo último payload de `'player-changed'`. A Task 7 guarda esse payload em `window.__LAST_PLAYER__`; adicionar isso se faltar. Conferir que fica < 100.
  - `aba oculta não mata o jogador`: emular `visibilitychange` (ou parar o loop por 3 s com `__GAME__.loop.sleep()` / `wake()`) e conferir que a vida não caiu sem dano real.
- [ ] **Step 2:** Rodar `npx playwright install chromium` (uma vez) e depois `npm run test:e2e`. Esperado: 3 passed.
- [ ] **Step 3:** Fazer o playtest manual com o checklist da Task 7, Step 6, e reportar os bugs ao Orquestrador com os passos para reproduzir.
- [ ] **Step 4:** Pedir ao Cofre o commit `test(e2e): fumaça da arena de combate`.

---

### Task 10: Portão de playtest do usuário

**Dono:** Orquestrador

- [ ] **Step 1:** Garantir `npm test` e `npm run test:e2e` verdes e o Dev Server rodando. Pedir ao Cofre a lista de commits pendentes de push.
- [ ] **Step 2:** Pedir ao usuário que jogue em `http://localhost:5173` e, opcionalmente, que faça o push para ver no GitHub Pages depois de ativar o Pages (fonte: GitHub Actions).
- [ ] **Step 3:** Recolher o feedback sobre a sensação do combate. Ajustar só `src/config/tuning.ts` quando possível (Forja) e repetir até o usuário **aprovar**.
- [ ] **Step 4:** Com o combate aprovado e a auditoria de assets (Task 0) pronta, escrever o plano da Fase 2.
