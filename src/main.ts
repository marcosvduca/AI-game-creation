import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config/game';
import { BootScene } from './scenes/BootScene';

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
    // Provisório: a Task 2 troca por TUNING.world.gravity.
    arcade: { gravity: { x: 0, y: 900 } },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    autoRound: true,
  },
  scene: [BootScene],
});

// Exposto para os testes e2e (Playwright).
window.__GAME__ = game;
