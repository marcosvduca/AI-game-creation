import { TUNING } from '../config/tuning';

export interface Stamina {
  current: number;
  max: number;
  delayLeftMs: number;
}

export function createStamina(max: number): Stamina {
  return { current: max, max, delayLeftMs: 0 };
}

// Estilo souls: com qualquer stamina > 0 a ação é permitida, mesmo custando mais.
export function trySpend(s: Stamina, cost: number): { ok: boolean; stamina: Stamina } {
  if (cost <= 0) return { ok: true, stamina: { ...s } };
  if (s.current <= 0) return { ok: false, stamina: { ...s } };
  return { ok: true, stamina: drain(s, cost) };
}

export function drain(s: Stamina, amount: number): Stamina {
  return {
    ...s,
    current: Math.max(0, s.current - amount),
    delayLeftMs: TUNING.stamina.regenDelayMs,
  };
}

// Consome o atraso primeiro; o tempo que sobra no mesmo tick já regenera.
export function tickStamina(s: Stamina, dtMs: number): Stamina {
  const delayUsed = Math.min(s.delayLeftMs, dtMs);
  const regenMs = dtMs - delayUsed;
  return {
    ...s,
    delayLeftMs: s.delayLeftMs - delayUsed,
    current: Math.min(s.max, s.current + (TUNING.stamina.regenPerSec * regenMs) / 1000),
  };
}
