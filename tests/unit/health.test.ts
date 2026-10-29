import { describe, expect, it } from 'vitest';
import { applyDamage, createHealth, heal, isDead } from '../../src/systems/health';

describe('health', () => {
  it('dano não passa de 0 e cura não passa do máximo', () => {
    expect(applyDamage(createHealth(100), 150).current).toBe(0);
    expect(isDead(applyDamage(createHealth(100), 100))).toBe(true);
    expect(heal({ current: 90, max: 100 }, 40).current).toBe(100);
  });
  it('vivo com vida acima de 0', () => {
    expect(isDead(applyDamage(createHealth(100), 99))).toBe(false);
  });
});
