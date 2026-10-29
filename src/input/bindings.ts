import type { Action } from '../types/input';

// Códigos de KeyboardEvent.code.
export const KEYBOARD_BINDINGS: Record<Action, string[]> = {
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  jump: ['Space'],
  attack: ['KeyJ'],
  dodge: ['KeyK'],
  block: ['KeyL'],
  heal: ['KeyE'],
  interact: ['KeyF'],
  pause: ['Escape'],
};

// Índices de botão do Standard Gamepad mapping.
export const GAMEPAD_BINDINGS: Partial<Record<Action, number[]>> = {
  jump: [0],
  dodge: [1],
  heal: [2],
  interact: [3],
  block: [4],
  attack: [5],
  pause: [9],
  left: [14],
  right: [15],
};

export const AXIS_DEADZONE = 0.35;
