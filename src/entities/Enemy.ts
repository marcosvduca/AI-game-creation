import Phaser from 'phaser';
import { TUNING } from '../config/tuning';
import { attackPhase } from '../systems/attack';
import { createEnemyCore, stepEnemy, type EnemyCore } from '../systems/enemyAI';
import { attackBox, type Box } from '../systems/hitbox';

const WIDTH = 16;
const HEIGHT = 28;
const COLORS = {
  base: 0xff2bd6,
  telegraph: 0xff2020,
  hurt: 0xffffff,
  dead: 0x4a2044,
  hitbox: 0xff2020,
};
const BLINK_MS = 80;
const HITBOX_ALPHA = 0.5;
const BANG_OFFSET_Y = 6;

export class Enemy {
  core: EnemyCore;
  readonly sprite: Phaser.GameObjects.Rectangle;
  readonly body: Phaser.Physics.Arcade.Body;
  private readonly hitboxGfx: Phaser.GameObjects.Graphics;
  private readonly bang: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    this.core = createEnemyCore(id);
    this.sprite = scene.add.rectangle(x, y, WIDTH, HEIGHT, COLORS.base);
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);
    this.hitboxGfx = scene.add.graphics();
    this.bang = scene.add
      .text(x, y, '!', { fontFamily: 'monospace', fontSize: '14px', color: '#ff2020' })
      .setOrigin(0.5, 1)
      .setVisible(false);
  }

  update(dxToPlayer: number, playerDead: boolean, dtMs: number): void {
    const { enemy, intent } = stepEnemy(this.core, dxToPlayer, playerDead, dtMs);
    this.core = enemy;

    this.body.setDragX(enemy.mode === 'hurt' ? TUNING.feel.knockbackDrag : 0);
    if (enemy.mode !== 'hurt') this.body.setVelocityX(intent.moveX * intent.speed);

    this.draw(intent.telegraph);
  }

  bounds(): Box {
    return { x: this.body.x, y: this.body.y, width: this.body.width, height: this.body.height };
  }

  activeHitbox(): Box | null {
    const a = this.core.attack;
    if (!a || attackPhase(a) !== 'active') return null;
    return attackBox(this.bounds(), this.core.facing, a.spec.reach);
  }

  knockback(dir: 1 | -1): void {
    if (this.core.mode === 'hurt') this.body.setVelocityX(dir * TUNING.knockback.enemy);
  }

  private draw(telegraph: boolean): void {
    const { mode, modeMs } = this.core;
    let color = COLORS.base;
    if (telegraph) color = Math.floor(modeMs / BLINK_MS) % 2 === 0 ? COLORS.telegraph : COLORS.base;
    else if (mode === 'hurt') color = COLORS.hurt;
    else if (mode === 'dead') color = COLORS.dead;
    this.sprite.setFillStyle(color);

    this.bang.setVisible(telegraph).setPosition(this.sprite.x, this.body.y - BANG_OFFSET_Y);

    this.hitboxGfx.clear();
    const box = this.activeHitbox();
    if (box) this.hitboxGfx.fillStyle(COLORS.hitbox, HITBOX_ALPHA).fillRect(box.x, box.y, box.width, box.height);
  }
}
