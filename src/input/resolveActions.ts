import type { Action } from '../types/input';
import { AXIS_DEADZONE, GAMEPAD_BINDINGS, KEYBOARD_BINDINGS } from './bindings';

export interface PadSnapshot {
  buttons: readonly boolean[];
  axisX: number;
}

// Ações seguradas agora. pad = null (desconectado) usa só o teclado.
export function resolveActions(keysDown: ReadonlySet<string>, pad: PadSnapshot | null): Set<Action> {
  const actions = new Set<Action>();
  for (const [action, codes] of Object.entries(KEYBOARD_BINDINGS) as [Action, string[]][]) {
    if (codes.some((code) => keysDown.has(code))) actions.add(action);
  }
  if (!pad) return actions;

  for (const [action, indices] of Object.entries(GAMEPAD_BINDINGS) as [Action, number[]][]) {
    // Índice fora do array (pad com menos botões) conta como solto.
    if (indices.some((i) => pad.buttons[i] === true)) actions.add(action);
  }
  if (pad.axisX <= -AXIS_DEADZONE) actions.add('left');
  if (pad.axisX >= AXIS_DEADZONE) actions.add('right');
  return actions;
}

// Ações apertadas neste frame (seguradas agora e soltas no frame anterior).
export function edgePressed(now: ReadonlySet<Action>, prev: ReadonlySet<Action>): Set<Action> {
  return new Set([...now].filter((action) => !prev.has(action)));
}
