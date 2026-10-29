import { describe, expect, it } from 'vitest';
import { clampDt } from '../../src/systems/time';

describe('time', () => {
  it('limita dt a 50 ms', () => { expect(clampDt(2000)).toBe(50); expect(clampDt(16)).toBe(16); expect(clampDt(-5)).toBe(0); });
});
