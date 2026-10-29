// Lógica pura das barras do HUD (sem Phaser), testada em tests/unit/hudBars.test.ts.

export interface GhostBar {
  value: number;
  drainPerMs: number;
}

// Largura preenchida em pixels inteiros. Valor > 0 nunca some da barra.
export function barFill(value: number, max: number, width: number): number {
  if (max <= 0 || value <= 0) return 0;
  return Math.min(width, Math.max(1, Math.round((value / max) * width)));
}

// Chamado quando o valor muda: dano faz a fantasma descer até o alvo em drainMs; cura a alinha na hora.
export function ghostOnChange(g: GhostBar, target: number, drainMs: number): GhostBar {
  if (target >= g.value) return { value: target, drainPerMs: 0 };
  return { value: g.value, drainPerMs: (g.value - target) / drainMs };
}

export function stepGhost(g: GhostBar, target: number, dtMs: number): GhostBar {
  const value = Math.max(target, g.value - g.drainPerMs * dtMs);
  return { value, drainPerMs: value === target ? 0 : g.drainPerMs };
}
