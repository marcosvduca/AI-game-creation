import { describe, expect, it } from 'vitest';
import { attackPhase, registerHit, startAttack, tickAttack } from '../../src/systems/attack';
import { TUNING } from '../../src/config/tuning';

const spec = TUNING.attacks.katanaLight;

describe('attack', () => {
  it('percorre windup → active → recovery → done pelos tempos do spec', () => {
    let a = startAttack(spec);
    expect(attackPhase(a)).toBe('windup');
    a = tickAttack(a, 220); expect(attackPhase(a)).toBe('active');
    a = tickAttack(a, 100); expect(attackPhase(a)).toBe('recovery');
    a = tickAttack(a, 320); expect(attackPhase(a)).toBe('done');
  });
  it('conta o golpe uma vez por alvo e só na fase active', () => {
    let a = startAttack(spec);
    expect(registerHit(a, 'e1').counted).toBe(false);          // windup
    a = tickAttack(a, 230);
    const r1 = registerHit(a, 'e1'); expect(r1.counted).toBe(true);
    expect(registerHit(r1.attack, 'e1').counted).toBe(false);  // sobreposição em frames seguintes
    expect(registerHit(r1.attack, 'e2').counted).toBe(true);
  });
  it('não conta golpe na recuperação', () => {
    const a = tickAttack(startAttack(spec), 330);
    expect(registerHit(a, 'e1').counted).toBe(false);
  });
  it('registerHit não altera o ataque original', () => {
    const a = tickAttack(startAttack(spec), 230);
    registerHit(a, 'e1');
    expect(a.hitTargets.size).toBe(0);
  });
});
