import type { AttackPhase, AttackSpec, AttackState } from '../types/combat';

export function startAttack(spec: AttackSpec): AttackState {
  return { spec, elapsedMs: 0, hitTargets: new Set() };
}

export function tickAttack(a: AttackState, dtMs: number): AttackState {
  return { ...a, elapsedMs: a.elapsedMs + dtMs };
}

export function attackPhase(a: AttackState): AttackPhase {
  const { windupMs, activeMs, recoveryMs } = a.spec;
  if (a.elapsedMs < windupMs) return 'windup';
  if (a.elapsedMs < windupMs + activeMs) return 'active';
  if (a.elapsedMs < windupMs + activeMs + recoveryMs) return 'recovery';
  return 'done';
}

// Cada ataque causa dano uma única vez por alvo, mesmo com a hitbox sobreposta por vários frames.
export function registerHit(a: AttackState, targetId: string): { counted: boolean; attack: AttackState } {
  if (attackPhase(a) !== 'active' || a.hitTargets.has(targetId)) return { counted: false, attack: a };
  return { counted: true, attack: { ...a, hitTargets: new Set([...a.hitTargets, targetId]) } };
}
