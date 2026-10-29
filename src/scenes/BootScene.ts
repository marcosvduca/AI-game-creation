import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/game';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Neon Ashes — carregando…', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#00f0ff',
      })
      .setOrigin(0.5);
    this.scene.start('CombatTest');
  }
}
