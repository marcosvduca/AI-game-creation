import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config/game';
import { TUNING } from './config/tuning';
import { BootScene } from './scenes/BootScene';
import { CombatTestScene } from './scenes/CombatTestScene';
import { HudScene } from './scenes/HudScene';

declare global {
  interface Window {
    __GAME__: Phaser.Game;
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true,
  backgroundColor: '#0a0a12',
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: TUNING.world.gravity } },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    autoRound: true,
  },
  scene: [BootScene, CombatTestScene, HudScene],
});

// Exposto para os testes e2e (Playwright).
window.__GAME__ = game;
