import { describe, expect, it } from 'vitest';
import { attackBox, overlaps } from '../../src/systems/hitbox';

const body = { x: 100, y: 50, width: 14, height: 28 };

describe('hitbox', () => {
  it('fica à frente do corpo, com largura = alcance', () => {
    expect(attackBox(body, 1, 26)).toMatchObject({ x: 114, width: 26 });
    expect(attackBox(body, -1, 26)).toMatchObject({ x: 74, width: 26 });
  });
  it('fica dentro da altura do corpo', () => {
    const box = attackBox(body, 1, 26);
    expect(box.y).toBeGreaterThanOrEqual(body.y);
    expect(box.y + box.height).toBeLessThanOrEqual(body.y + body.height);
  });
  it('detecta sobreposição e ignora retângulos só encostados', () => {
    expect(overlaps({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
    expect(overlaps({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 })).toBe(false);
  });
});
