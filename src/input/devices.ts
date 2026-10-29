import type { Action } from '../types/input';
import { KEYBOARD_BINDINGS } from './bindings';
import { edgePressed, resolveActions, type PadSnapshot } from './resolveActions';

interface GamepadLike {
  connected: boolean;
  buttons: readonly { pressed: boolean }[];
  axes: readonly number[];
}

// Primeiro gamepad conectado, ou null (nenhum ou desconectado).
export function snapshotPad(pads: ArrayLike<GamepadLike | null>): PadSnapshot | null {
  const pad = Array.from(pads).find((p) => p?.connected);
  if (!pad) return null;
  return { buttons: pad.buttons.map((b) => b.pressed), axisX: pad.axes[0] ?? 0 };
}

function readNavigatorPad(): PadSnapshot | null {
  try {
    return snapshotPad(navigator.getGamepads?.() ?? []);
  } catch {
    return null; // Gamepad API indisponível
  }
}

const BOUND_CODES = new Set(Object.values(KEYBOARD_BINDINGS).flat());

// Junta teclado (window, event.code) e gamepad em ações seguradas e apertadas por frame.
export class DeviceInput {
  private readonly keysDown = new Set<string>();
  // Teclas apertadas desde o último poll: um toque mais curto que um frame não se perde.
  private readonly tapped = new Set<string>();
  private prev: ReadonlySet<Action> = new Set();

  constructor(private readonly readPad: () => PadSnapshot | null = readNavigatorPad) {}

  keyDown(code: string): void {
    this.keysDown.add(code);
    this.tapped.add(code);
  }

  keyUp(code: string): void {
    this.keysDown.delete(code);
  }

  releaseAll(): void {
    this.keysDown.clear();
  }

  poll(): { held: Set<Action>; pressed: Set<Action> } {
    const held = resolveActions(this.keysDown, this.readPad());
    const pressed = edgePressed(held, this.prev);
    for (const action of resolveActions(this.tapped, null)) pressed.add(action);
    this.tapped.clear();
    this.prev = held;
    return { held, pressed };
  }

  // Liga aos eventos da janela; retorna a função que desliga.
  attach(target: Window = window): () => void {
    const onDown = (e: KeyboardEvent) => {
      if (BOUND_CODES.has(e.code)) e.preventDefault(); // Espaço e setas rolariam a página
      if (!e.repeat) this.keyDown(e.code);
    };
    const onUp = (e: KeyboardEvent) => this.keyUp(e.code);
    const onBlur = () => this.releaseAll();
    target.addEventListener('keydown', onDown);
    target.addEventListener('keyup', onUp);
    target.addEventListener('blur', onBlur);
    return () => {
      target.removeEventListener('keydown', onDown);
      target.removeEventListener('keyup', onUp);
      target.removeEventListener('blur', onBlur);
    };
  }
}
