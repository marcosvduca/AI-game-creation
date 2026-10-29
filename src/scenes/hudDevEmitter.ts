import type Phaser from 'phaser';
import { TUNING } from '../config/tuning';
import { drinkFlask, createFlask } from '../systems/flask';
import { applyDamage, createHealth, heal } from '../systems/health';
import { clampDt } from '../systems/time';
import { createStamina, drain, tickStamina } from '../systems/stamina';
import { PLAYER_CHANGED, PLAYER_DIED, type PlayerChangedPayload } from '../types/events';

const DEV_DAMAGE = 15;

// Só em dev (import.meta.env.DEV) e só sem a arena: simula os eventos da Task 7 para testar o HUD isolado.
// Teclas: 1 dano · 2 gasta stamina · 3 cura · 4 morre · 0 reinicia.
export function attachHudDevEmitter(scene: Phaser.Scene): void {
  if (scene.game.scene.getScene('CombatTest')) return;

  let health = createHealth(TUNING.health.max);
  let stamina = createStamina(TUNING.stamina.max);
  let flask = createFlask(TUNING.flask.charges);

  const emit = () => {
    const payload: PlayerChangedPayload = {
      hp: health.current,
      hpMax: health.max,
      stamina: stamina.current,
      staminaMax: stamina.max,
      flask: flask.charges,
      flaskMax: flask.max,
    };
    window.__LAST_PLAYER__ = payload;
    scene.game.events.emit(PLAYER_CHANGED, payload);
  };

  const actions: Record<string, () => void> = {
    Digit1: () => {
      health = applyDamage(health, DEV_DAMAGE);
      emit();
      if (health.current <= 0) scene.game.events.emit(PLAYER_DIED);
    },
    Digit2: () => {
      stamina = drain(stamina, TUNING.costs.dodge);
      emit();
    },
    Digit3: () => {
      const r = drinkFlask(flask);
      if (!r.ok) return;
      flask = r.flask;
      health = heal(health, TUNING.flask.healFraction * health.max);
      emit();
    },
    Digit4: () => {
      health = applyDamage(health, health.current);
      emit();
      scene.game.events.emit(PLAYER_DIED);
    },
    Digit0: () => {
      health = createHealth(TUNING.health.max);
      stamina = createStamina(TUNING.stamina.max);
      flask = createFlask(TUNING.flask.charges);
      emit();
    },
  };
  // Via window pelo mesmo motivo do F1 no HudScene; auto-repeat ignorado (um aperto, um evento).
  const onKeyDown = (e: KeyboardEvent) => {
    if (!e.repeat) actions[e.code]?.();
  };
  window.addEventListener('keydown', onKeyDown);

  // Regeneração de stamina, como a arena fará a cada frame.
  const regen = (_t: number, delta: number) => {
    if (stamina.current >= stamina.max) return;
    stamina = tickStamina(stamina, clampDt(delta));
    emit();
  };
  scene.events.on('update', regen);
  scene.events.once('shutdown', () => {
    window.removeEventListener('keydown', onKeyDown);
    scene.events.off('update', regen);
  });

  emit();
}
