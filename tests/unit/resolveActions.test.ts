import { describe, expect, it } from 'vitest';
import { edgePressed, resolveActions } from '../../src/input/resolveActions';

describe('resolveActions', () => {
  it('teclado: J ataca, setas e WASD movem', () => {
    expect(resolveActions(new Set(['KeyJ', 'ArrowLeft']), null)).toEqual(new Set(['attack', 'left']));
  });

  it('gamepad: RB ataca, B esquiva, eixo além da deadzone move', () => {
    const buttons = Array(17).fill(false); buttons[5] = true; buttons[1] = true;
    expect(resolveActions(new Set(), { buttons, axisX: -0.6 })).toEqual(new Set(['attack', 'dodge', 'left']));
    expect(resolveActions(new Set(), { buttons: Array(17).fill(false), axisX: 0.2 }).size).toBe(0);
  });

  it('pad null (desconectado) não quebra e teclado segue funcionando', () => {
    expect(resolveActions(new Set(['KeyK']), null)).toEqual(new Set(['dodge']));
  });

  it('pad com array de botões curto não quebra', () => {
    expect(() => resolveActions(new Set(), { buttons: [true], axisX: 0 })).not.toThrow();
  });
});

describe('edgePressed', () => {
  it('edgePressed só retorna ações novas', () => {
    expect(edgePressed(new Set(['attack', 'left']), new Set(['left']))).toEqual(new Set(['attack']));
  });
});
