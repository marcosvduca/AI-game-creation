import { describe, expect, it } from 'vitest';
import { resolveHit } from '../../src/systems/hit';

const st = (c: number) => ({ current: c, max: 100, delayLeftMs: 0 });

describe('resolveHit', () => {
  it('i-frames anulam o golpe', () => {
    expect(resolveHit(25, { blocking: false, invulnerable: true, stamina: st(50) }).hpDamage).toBe(0);
  });
  it('i-frames também anulam o gasto de stamina do bloqueio', () => {
    const r = resolveHit(25, { blocking: true, invulnerable: true, stamina: st(50) });
    expect(r.stamina.current).toBe(50); expect(r.blocked).toBe(false); expect(r.guardBroken).toBe(false);
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
});
