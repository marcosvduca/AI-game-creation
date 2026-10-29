import { describe, expect, it } from 'vitest';
import { createFlask, drinkFlask, refillFlask } from '../../src/systems/flask';
import { TUNING } from '../../src/config/tuning';

describe('flask', () => {
  it('tem 3 cargas, recusa a 4ª e recarrega', () => {
    let f = createFlask(3);
    for (let i = 0; i < 3; i++) { const r = drinkFlask(f); expect(r.ok).toBe(true); f = r.flask; }
    expect(drinkFlask(f).ok).toBe(false);
    expect(refillFlask(f).charges).toBe(3);
  });
  it('o tuning define 3 cargas', () => {
    expect(TUNING.flask.charges).toBe(3);
  });
});
