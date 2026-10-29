import { TUNING } from '../config/tuning';
import type { AttackState } from '../types/combat';
import type { Action } from '../types/input';
import { attackPhase, startAttack, tickAttack } from './attack';
import { createFlask, drinkFlask, type Flask } from './flask';
import { applyDamage, createHealth, heal, isDead, type Health } from './health';
import { resolveHit } from './hit';
import { createStamina, tickStamina, trySpend, type Stamina } from './stamina';

// `free` cobre idle, run, jump e block (bloqueio = `blocking: true` em `free`).
export type PlayerMode = 'free' | 'attack' | 'dodge' | 'heal' | 'stunned' | 'hurt' | 'dead';

type BufferedAction = 'attack' | 'dodge' | 'heal';

export interface PlayerCore {
  mode: PlayerMode;
  modeMs: number;
  facing: 1 | -1;
  stamina: Stamina;
  health: Health;
  flask: Flask;
  attack: AttackState | null;
  blocking: boolean;
  buffered: { action: BufferedAction; ageMs: number } | null;
}

// Prioridade quando várias ações chegam no mesmo frame.
const ACTION_PRIORITY: readonly BufferedAction[] = ['dodge', 'attack', 'heal'];

export function createPlayerCore(): PlayerCore {
  return {
    mode: 'free',
    modeMs: 0,
    facing: 1,
    stamina: createStamina(TUNING.stamina.max),
    health: createHealth(TUNING.health.max),
    flask: createFlask(TUNING.flask.charges),
    attack: null,
    blocking: false,
    buffered: null,
  };
}

function pickAction(pressed: ReadonlySet<Action>): BufferedAction | null {
  return ACTION_PRIORITY.find((a) => pressed.has(a)) ?? null;
}

// Avança o modo atual e volta a `free` quando o tempo dele acaba.
function advanceMode(p: PlayerCore, dtMs: number): PlayerCore {
  const modeMs = p.modeMs + dtMs;
  const toFree = (extra: Partial<PlayerCore> = {}): PlayerCore => ({ ...p, ...extra, mode: 'free', modeMs: 0 });

  switch (p.mode) {
    case 'attack': {
      const attack = tickAttack(p.attack!, dtMs);
      return attackPhase(attack) === 'done' ? toFree({ attack: null }) : { ...p, modeMs, attack };
    }
    case 'dodge':
      return modeMs >= TUNING.dodge.durationMs ? toFree() : { ...p, modeMs };
    case 'heal':
      return modeMs >= TUNING.flask.useMs
        ? toFree({ health: heal(p.health, TUNING.flask.healFraction * p.health.max) })
        : { ...p, modeMs };
    case 'hurt':
      return modeMs >= TUNING.player.hurtMs ? toFree() : { ...p, modeMs };
    case 'stunned':
      return modeMs >= TUNING.block.guardBreakStunMs ? toFree() : { ...p, modeMs };
    default:
      return { ...p, modeMs };
  }
}

function startAction(p: PlayerCore, action: BufferedAction): PlayerCore {
  const committed = { ...p, modeMs: 0, blocking: false };
  if (action === 'dodge') {
    const r = trySpend(p.stamina, TUNING.costs.dodge);
    return r.ok ? { ...committed, mode: 'dodge', stamina: r.stamina } : p;
  }
  if (action === 'attack') {
    const spec = TUNING.attacks.katanaLight;
    const r = trySpend(p.stamina, spec.staminaCost);
    return r.ok ? { ...committed, mode: 'attack', stamina: r.stamina, attack: startAttack(spec) } : p;
  }
  // A carga é gasta ao começar a beber; a cura só entra ao terminar.
  const r = drinkFlask(p.flask);
  return r.ok ? { ...committed, mode: 'heal', flask: r.flask } : p;
}

export function stepPlayer(
  p: PlayerCore,
  pressed: ReadonlySet<Action>,
  held: ReadonlySet<Action>,
  dtMs: number,
): PlayerCore {
  if (p.mode === 'dead') return p;

  let next: PlayerCore = { ...p };
  if (next.buffered) {
    const ageMs = next.buffered.ageMs + dtMs;
    next.buffered = ageMs <= TUNING.inputBufferMs ? { ...next.buffered, ageMs } : null;
  }

  next = advanceMode(next, dtMs);
  const action = pickAction(pressed);

  if (next.mode === 'free') {
    if (held.has('right') && !held.has('left')) next.facing = 1;
    if (held.has('left') && !held.has('right')) next.facing = -1;

    // O input deste frame tem prioridade sobre o buffer; o buffer é consumido de qualquer forma.
    const chosen = action ?? next.buffered?.action ?? null;
    next.buffered = null;
    next.blocking = held.has('block') && next.stamina.current > 0;
    if (chosen) next = startAction(next, chosen);
  } else if (action) {
    // Comprometido: guarda só a última ação apertada.
    next.buffered = { action, ageMs: 0 };
  }

  return { ...next, stamina: tickStamina(next.stamina, dtMs) };
}

export function isInvulnerable(p: PlayerCore): boolean {
  return p.mode === 'dodge' && p.modeMs >= TUNING.dodge.iframeStartMs && p.modeMs < TUNING.dodge.iframeEndMs;
}

// A esquiva atravessa o inimigo; andando, o corpo do jogador bloqueia o dele.
export function blocksBodies(p: PlayerCore): boolean {
  return p.mode !== 'dodge' && p.mode !== 'dead';
}

export function onHit(p: PlayerCore, damage: number): PlayerCore {
  if (p.mode === 'dead') return p;

  const r = resolveHit(damage, {
    blocking: p.mode === 'free' && p.blocking,
    invulnerable: isInvulnerable(p),
    stamina: p.stamina,
  });
  const hit: PlayerCore = { ...p, health: applyDamage(p.health, r.hpDamage), stamina: r.stamina };
  const interrupted = { attack: null, blocking: false, buffered: null, modeMs: 0 };

  if (isDead(hit.health)) return { ...hit, ...interrupted, mode: 'dead' };
  if (r.guardBroken) return { ...hit, ...interrupted, mode: 'stunned' };
  // Bloqueio bem-sucedido segura a guarda; atordoado continua atordoado (o golpe não encurta o stun).
  if (r.blocked || p.mode === 'stunned' || r.hpDamage <= 0) return hit;
  return { ...hit, ...interrupted, mode: 'hurt' };
}
