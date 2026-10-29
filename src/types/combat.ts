import type { Stamina } from '../systems/stamina';

export type AttackPhase = 'windup' | 'active' | 'recovery' | 'done';

export interface AttackSpec {
  id: string;
  windupMs: number;
  activeMs: number;
  recoveryMs: number;
  damage: number;
  staminaCost: number;
  reach: number;
}

export interface AttackState {
  spec: AttackSpec;
  elapsedMs: number;
  hitTargets: ReadonlySet<string>;
}

export interface DefenderState {
  blocking: boolean;
  invulnerable: boolean;
  stamina: Stamina;
}

export interface HitResult {
  hpDamage: number;
  stamina: Stamina;
  guardBroken: boolean;
  blocked: boolean;
}
