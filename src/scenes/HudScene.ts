import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/game';
import { TUNING } from '../config/tuning';
import { PLAYER_CHANGED, PLAYER_DIED, type PlayerChangedPayload } from '../types/events';
import { barFill, ghostOnChange, stepGhost, type GhostBar } from '../ui/hudBars';
import { attachHudDevEmitter } from './hudDevEmitter';

// Layout em pixels da resolução interna (480×270).
const MARGIN = 8;
const BAR_WIDTH = 100;
const HP_HEIGHT = 6;
const STAMINA_HEIGHT = 4;
const BAR_GAP = 2;
const GHOST_DRAIN_MS = 400;

const COLORS = {
  track: 0x1a1a24,
  border: 0x000000,
  hp: 0xd62839,
  ghost: 0xf2c94c,
  stamina: 0x2ecc71,
  flask: '#ffb347',
  legend: '#c8c8d8',
};

const LEGEND = 'J atacar · K esquivar · L bloquear · E curar · Espaço pular';
const DEAD_ALPHA = 0.4;

declare global {
  interface Window {
    __LAST_PLAYER__?: PlayerChangedPayload;
  }
}

// HUD grey-box sobre a arena: vida (com barra fantasma), stamina, curas e legenda de controles (F1).
export class HudScene extends Phaser.Scene {
  private state!: PlayerChangedPayload;
  private ghost!: GhostBar;
  private bars!: Phaser.GameObjects.Graphics;
  private flaskText!: Phaser.GameObjects.Text;
  private legend!: Phaser.GameObjects.Text;
  private hud!: Phaser.GameObjects.Container;

  constructor() {
    super('Hud');
  }

  create(): void {
    // Fica acima da arena, qualquer que seja a ordem de registro das cenas.
    this.scene.bringToTop();

    // O launch da arena chega um frame depois do primeiro emit; o último payload cobre esse intervalo.
    this.state = window.__LAST_PLAYER__ ?? {
      hp: TUNING.health.max,
      hpMax: TUNING.health.max,
      stamina: TUNING.stamina.max,
      staminaMax: TUNING.stamina.max,
      flask: TUNING.flask.charges,
      flaskMax: TUNING.flask.charges,
    };
    this.ghost = { value: this.state.hp, drainPerMs: 0 };

    this.bars = this.add.graphics();
    const flaskY = MARGIN + HP_HEIGHT + BAR_GAP + STAMINA_HEIGHT + 4;
    this.flaskText = this.add.text(MARGIN, flaskY, '', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: COLORS.flask,
    });
    this.hud = this.add.container(0, 0, [this.bars, this.flaskText]);

    this.legend = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 4, LEGEND, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: COLORS.legend,
      })
      .setOrigin(0.5, 1);

    // Teclado via window, como a arena: o KeyboardPlugin do Phaser reentrega keydowns quando
    // vários eventos chegam no mesmo frame, e o F1 alternaria duas vezes.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'F1') return;
      e.preventDefault(); // o navegador abriria a ajuda
      if (!e.repeat) this.legend.setVisible(!this.legend.visible);
    };
    window.addEventListener('keydown', onKeyDown);

    this.game.events.on(PLAYER_CHANGED, this.onPlayerChanged, this);
    this.game.events.on(PLAYER_DIED, this.onPlayerDied, this);
    // window e game.events sobrevivem às cenas: sem isso, cada restart da arena duplicaria os listeners.
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('keydown', onKeyDown);
      this.game.events.off(PLAYER_CHANGED, this.onPlayerChanged, this);
      this.game.events.off(PLAYER_DIED, this.onPlayerDied, this);
    });

    if (import.meta.env.DEV) attachHudDevEmitter(this);

    this.draw();
  }

  update(_time: number, delta: number): void {
    if (this.ghost.drainPerMs === 0) return;
    this.ghost = stepGhost(this.ghost, this.state.hp, delta);
    this.draw();
  }

  private onPlayerChanged(p: PlayerChangedPayload): void {
    this.ghost = ghostOnChange(this.ghost, p.hp, GHOST_DRAIN_MS);
    this.state = { ...p };
    if (p.hp > 0) this.hud.setAlpha(1);
    this.draw();
  }

  private onPlayerDied(): void {
    this.hud.setAlpha(DEAD_ALPHA);
  }

  private draw(): void {
    const s = this.state;
    const g = this.bars;
    g.clear();
    this.drawBar(MARGIN, HP_HEIGHT, [
      [COLORS.ghost, barFill(this.ghost.value, s.hpMax, BAR_WIDTH)],
      [COLORS.hp, barFill(s.hp, s.hpMax, BAR_WIDTH)],
    ]);
    this.drawBar(MARGIN + HP_HEIGHT + BAR_GAP, STAMINA_HEIGHT, [
      [COLORS.stamina, barFill(s.stamina, s.staminaMax, BAR_WIDTH)],
    ]);
    this.flaskText.setText(`◆ ${s.flask}`);
    this.flaskText.setAlpha(s.flask > 0 ? 1 : 0.4);
  }

  // Fundo com borda de 1 px e as camadas na ordem dada (a última fica por cima).
  private drawBar(y: number, height: number, layers: [number, number][]): void {
    const g = this.bars;
    g.fillStyle(COLORS.border).fillRect(MARGIN - 1, y - 1, BAR_WIDTH + 2, height + 2);
    g.fillStyle(COLORS.track).fillRect(MARGIN, y, BAR_WIDTH, height);
    for (const [color, width] of layers) {
      if (width > 0) g.fillStyle(color).fillRect(MARGIN, y, width, height);
    }
  }
}
