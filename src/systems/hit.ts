import { TUNING } from '../config/tuning';
import type { DefenderState, HitResult } from '../types/combat';
import { drain } from './stamina';

export function resolveHit(damage: number, d: DefenderState): HitResult {
  if (d.invulnerable) return { hpDamage: 0, stamina: { ...d.stamina }, guardBroken: false, blocked: false };
  if (!d.blocking) return { hpDamage: damage, stamina: { ...d.stamina }, guardBroken: false, blocked: false };

  const stamina = drain(d.stamina, damage * TUNING.block.staminaPerDamage);
  return {
    hpDamage: damage * (1 - TUNING.block.damageReduction),
    stamina,
    guardBroken: stamina.current <= 0,
    blocked: true,
  };
}
