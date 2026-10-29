// Contrato dos eventos emitidos em this.game.events (Task 7 emite, HudScene consome).
export interface PlayerChangedPayload {
  hp: number;
  hpMax: number;
  stamina: number;
  staminaMax: number;
  flask: number;
  flaskMax: number;
}

export const PLAYER_CHANGED = 'player-changed';
export const PLAYER_DIED = 'player-died';
