import Phaser from 'phaser';
import { TUNING } from '../config/tuning';
import { attackPhase } from '../systems/attack';
import { attackBox, type Box } from '../systems/hitbox';
import { createPlayerCore, isInvulnerable, stepPlayer, type PlayerCore } from '../systems/playerState';
import type { Action } from '../types/input';

const WIDTH = 14;
const HEIGHT = 28;
const COLORS = {
  base: 0x00f0ff,
  windup: 0xffffff,
  block: 0xffd23f,
  heal: 0x66ff99,
  hurt: 0xff5577,
  stunned: 0x8a8aa8,
  dead: 0x335560,
  hitbox: 0x00f0ff,
};
const BLINK_MS = 60;
const IFRAME_ALPHA = 0.35;
const HITBOX_ALPHA = 0.5;

export class Player {
  readonly id = 'player';
  core: PlayerCore = createPlayerCore();
  readonly sprite: Phaser.GameObjects.Rectangle;
  readonly body: Phaser.Physics.Arcade.Body;
  private readonly hitboxGfx: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.rectangle(x, y, WIDTH, HEIGHT, COLORS.base);
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);
    this.hitboxGfx = scene.add.graphics();
  }

  update(pressed: ReadonlySet<Action>, held: ReadonlySet<Action>, dtMs: number): void {
    this.core = stepPlayer(this.core, pressed, held, dtMs);
    this.move(pressed, held);
    this.draw();
  }

  bounds(): Box {
    return { x: this.body.x, y: this.body.y, width: this.body.width, height: this.body.height };
  }

  // Hitbox do golpe, só na fase active.
  activeHitbox(): Box | null {
    const a = this.core.attack;
    if (!a || attackPhase(a) !== 'active') return null;
    return attackBox(this.bounds(), this.core.facing, a.spec.reach);
  }

  // Só empurra quando o golpe deixou o jogador em hurt; nos outros modos a velocidade é controlada.
  knockback(dir: 1 | -1): void {
    if (this.core.mode === 'hurt') this.body.setVelocityX(dir * TUNING.knockback.player);
  }

  private move(pressed: ReadonlySet<Action>, held: ReadonlySet<Action>): void {
    const b = this.body;
    const { mode, facing } = this.core;
    b.setDragX(mode === 'hurt' ? TUNING.feel.knockbackDrag : 0);

    switch (mode) {
      case 'free': {
        const dir = Number(held.has('right')) - Number(held.has('left'));
        b.setVelocityX(dir * TUNING.player.runSpeed);
        const onGround = b.blocked.down || b.touching.down;
        if (pressed.has('jump') && onGround) b.setVelocityY(TUNING.player.jumpVelocity);
        break;
      }
      case 'dodge':
        b.setVelocityX(facing * TUNING.dodge.speed);
        break;
      case 'hurt':
        break; // só gravidade e o knockback
      default:
        b.setVelocityX(0);
    }
  }

  private draw(): void {
    const { mode, modeMs, attack, blocking } = this.core;
    let color = COLORS.base;
    if (mode === 'attack' && attack && attackPhase(attack) === 'windup') {
      color = Math.floor(modeMs / BLINK_MS) % 2 === 0 ? COLORS.windup : COLORS.base;
    } else if (mode === 'heal') color = COLORS.heal;
    else if (mode === 'hurt') color = COLORS.hurt;
    else if (mode === 'stunned') color = COLORS.stunned;
    else if (mode === 'dead') color = COLORS.dead;
    else if (blocking) color = COLORS.block;

    this.sprite.setFillStyle(color);
    this.sprite.setAlpha(isInvulnerable(this.core) ? IFRAME_ALPHA : 1);

    this.hitboxGfx.clear();
    const box = this.activeHitbox();
    if (box) this.hitboxGfx.fillStyle(COLORS.hitbox, HITBOX_ALPHA).fillRect(box.x, box.y, box.width, box.height);
  }
}
