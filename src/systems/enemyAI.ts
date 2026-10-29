import { TUNING } from '../config/tuning';
import type { AttackState } from '../types/combat';
import { attackPhase, startAttack, tickAttack } from './attack';
import { applyDamage, createHealth, isDead, type Health } from './health';

// O telegraph é a fase `windup` do `attack`.
export type EnemyMode = 'idle' | 'chase' | 'attack' | 'recover' | 'hurt' | 'dead';

export interface EnemyCore {
  id: string;
  mode: EnemyMode;
  modeMs: number;
  facing: 1 | -1;
  health: Health;
  attack: AttackState | null;
  cooldownMs: number;
}

export interface EnemyIntent {
  moveX: -1 | 0 | 1;
  speed: number;
  telegraph: boolean;
}

const STILL: EnemyIntent = { moveX: 0, speed: 0, telegraph: false };

export function createEnemyCore(id: string): EnemyCore {
  return { id, mode: 'idle', modeMs: 0, facing: 1, health: createHealth(TUNING.guard.hp), attack: null, cooldownMs: 0 };
}

// Escolhe o que fazer quando o guarda está livre (idle/chase).
function decide(e: EnemyCore, dx: number, playerDead: boolean): { enemy: EnemyCore; intent: EnemyIntent } {
  const g = TUNING.guard;
  const dist = Math.abs(dx);
  const facing: 1 | -1 = dx > 0 ? 1 : dx < 0 ? -1 : e.facing;
  const idle = { enemy: { ...e, mode: 'idle' as const, facing }, intent: STILL };

  if (playerDead || dist > g.aggroRange) return idle;
  if (dist <= g.attackRange) {
    if (e.cooldownMs > 0) return idle;
    const enemy: EnemyCore = { ...e, mode: 'attack', modeMs: 0, facing, attack: startAttack(TUNING.attacks.guardSlash) };
    return { enemy, intent: { ...STILL, telegraph: true } };
  }
  const modeMs = e.mode === 'chase' ? e.modeMs : 0;
  return { enemy: { ...e, mode: 'chase', modeMs, facing }, intent: { moveX: facing, speed: g.chaseSpeed, telegraph: false } };
}

export function stepEnemy(
  e: EnemyCore,
  dxToPlayer: number,
  playerDead: boolean,
  dtMs: number,
): { enemy: EnemyCore; intent: EnemyIntent } {
  if (e.mode === 'dead') return { enemy: e, intent: STILL };

  const next: EnemyCore = { ...e, modeMs: e.modeMs + dtMs, cooldownMs: Math.max(0, e.cooldownMs - dtMs) };
  const free = { ...next, mode: 'idle' as const, modeMs: 0 };

  switch (next.mode) {
    case 'attack': {
      const attack = tickAttack(next.attack!, dtMs);
      if (attackPhase(attack) === 'done') {
        const enemy: EnemyCore = { ...next, mode: 'recover', modeMs: 0, attack: null, cooldownMs: TUNING.guard.attackCooldownMs };
        return { enemy, intent: STILL };
      }
      return { enemy: { ...next, attack }, intent: { ...STILL, telegraph: attackPhase(attack) === 'windup' } };
    }
    case 'recover':
      return next.modeMs >= TUNING.guard.recoverMs ? decide(free, dxToPlayer, playerDead) : { enemy: next, intent: STILL };
    case 'hurt':
      return next.modeMs >= TUNING.guard.hurtMs ? decide(free, dxToPlayer, playerDead) : { enemy: next, intent: STILL };
    default:
      return decide(next, dxToPlayer, playerDead);
  }
}

export function onEnemyHit(e: EnemyCore, damage: number): EnemyCore {
  if (e.mode === 'dead') return e;

  const health = applyDamage(e.health, damage);
  if (isDead(health)) return { ...e, health, mode: 'dead', modeMs: 0, attack: null };
  // Hiper-armadura só no golpe ativo do próprio ataque; no windup o guarda é interrompido.
  if (e.mode === 'attack' && e.attack && attackPhase(e.attack) === 'active') return { ...e, health };
  return { ...e, health, mode: 'hurt', modeMs: 0, attack: null };
}
