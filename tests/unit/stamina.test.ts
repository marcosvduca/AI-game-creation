import { describe, expect, it } from 'vitest';
import { createStamina, drain, tickStamina, trySpend } from '../../src/systems/stamina';

describe('stamina', () => {
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
  it('drain força o gasto, pode zerar mas nunca fica negativa', () => {
    const s = drain({ current: 10, max: 100, delayLeftMs: 0 }, 25);
    expect(s.current).toBe(0); expect(s.delayLeftMs).toBe(600);
  });
  it('é imutável', () => {
    const s = createStamina(100);
    trySpend(s, 20); tickStamina(s, 100); drain(s, 10);
    expect(s).toEqual({ current: 100, max: 100, delayLeftMs: 0 });
  });
});
