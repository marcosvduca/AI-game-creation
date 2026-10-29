import { TUNING } from '../config/tuning';

// Evita que um frame longo (aba em segundo plano, travada) faça tudo "pular".
export function clampDt(dtMs: number): number {
  return Math.min(Math.max(dtMs, 0), TUNING.maxDtMs);
}
