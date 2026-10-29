import { describe, expect, it } from 'vitest';
import { DeviceInput, snapshotPad } from '../../src/input/devices';
import type { PadSnapshot } from '../../src/input/resolveActions';

describe('DeviceInput', () => {
  it('tecla segurada aparece em held e só no primeiro poll em pressed', () => {
    const d = new DeviceInput(() => null);
    d.keyDown('KeyJ');
    expect(d.poll()).toEqual({ held: new Set(['attack']), pressed: new Set(['attack']) });
    expect(d.poll()).toEqual({ held: new Set(['attack']), pressed: new Set() });
  });
  it('toque mais curto que um frame (down + up entre polls) ainda conta como apertado', () => {
    const d = new DeviceInput(() => null);
    d.keyDown('KeyK'); d.keyUp('KeyK');
    expect(d.poll()).toEqual({ held: new Set(), pressed: new Set(['dodge']) });
    expect(d.poll().pressed.size).toBe(0);
  });
  it('gamepad desconectado no meio não quebra e o teclado segue funcionando', () => {
    let pad: PadSnapshot | null = { buttons: [false, false, false, false, false, true], axisX: 0 };
    const d = new DeviceInput(() => pad);
    expect(d.poll().pressed).toEqual(new Set(['attack']));
    pad = null;
    d.keyDown('KeyA');
    expect(d.poll()).toEqual({ held: new Set(['left']), pressed: new Set(['left']) });
  });
  it('perder o foco solta todas as teclas', () => {
    const d = new DeviceInput(() => null);
    d.keyDown('KeyL'); d.poll();
    d.releaseAll();
    expect(d.poll().held.size).toBe(0);
  });
});

describe('snapshotPad', () => {
  it('retorna null sem gamepad conectado', () => {
    expect(snapshotPad([null, null])).toBeNull();
    expect(snapshotPad([])).toBeNull();
  });
  it('lê botões e eixo X do primeiro pad conectado', () => {
    const pad = { connected: true, buttons: [{ pressed: true }, { pressed: false }], axes: [-0.5, 0] };
    expect(snapshotPad([null, pad])).toEqual({ buttons: [true, false], axisX: -0.5 });
  });
  it('pad sem eixos usa 0', () => {
    expect(snapshotPad([{ connected: true, buttons: [], axes: [] }])).toEqual({ buttons: [], axisX: 0 });
  });
});
