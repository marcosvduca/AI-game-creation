import { describe, expect, it } from 'vitest';
import { GAME_WIDTH, GAME_HEIGHT } from '../../src/config/game';

describe('config do jogo', () => {
  it('usa proporção 16:9', () => {
    expect(GAME_WIDTH / GAME_HEIGHT).toBeCloseTo(16 / 9);
  });
});
