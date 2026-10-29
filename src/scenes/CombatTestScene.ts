import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/game';
import { TUNING } from '../config/tuning';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import { clearHitstop, hitstop, isHitstopped, shake } from '../fx/feel';
import { DeviceInput } from '../input/devices';
import { registerHit } from '../systems/attack';
import { onEnemyHit } from '../systems/enemyAI';
import { overlaps } from '../systems/hitbox';
import { isInvulnerable, onHit } from '../systems/playerState';
import { clampDt } from '../systems/time';
import { PLAYER_CHANGED, PLAYER_DIED, type PlayerChangedPayload } from '../types/events';

// Chão e plataformas: [x, y, largura, altura] com x, y no centro.
const SOLIDS: [number, number, number, number][] = [
  [GAME_WIDTH / 2, GAME_HEIGHT - 10, GAME_WIDTH, 20],
  [130, 190, 80, 8],
  [350, 160, 80, 8],
];
const SOLID_COLOR = 0x3a3a4a;
const PLAYER_START = { x: 80, y: 220 };
const ENEMY_START = { x: 380, y: 220 };
const DEBUG_KEY = 'debugHitboxes';

export class CombatTestScene extends Phaser.Scene {
  private player!: Player;
  private enemy!: Enemy;
  private devices!: DeviceInput;
  private lastPayload: PlayerChangedPayload | null = null;
  private dead = false;

  constructor() {
    super('CombatTest');
  }

  create(): void {
    clearHitstop(this);
    this.lastPayload = null;
    this.dead = false;

    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const solids = SOLIDS.map(([x, y, w, h]) => {
      const rect = this.add.rectangle(x, y, w, h, SOLID_COLOR);
      this.physics.add.existing(rect, true);
      return rect;
    });

    this.player = new Player(this, PLAYER_START.x, PLAYER_START.y);
    this.enemy = new Enemy(this, 'guard-1', ENEMY_START.x, ENEMY_START.y);
    this.physics.add.collider(this.player.sprite, solids);
    this.physics.add.collider(this.enemy.sprite, solids);

    this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT).startFollow(this.player.sprite, true);
    this.setDebug(this.registry.get(DEBUG_KEY) === true);

    // Teclado via window: o KeyboardPlugin do Phaser reentrega keydowns quando vários chegam no mesmo frame.
    this.devices = new DeviceInput();
    const detachDevices = this.devices.attach();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === 'F2') {
        e.preventDefault();
        this.setDebug(!this.physics.world.drawDebug);
      } else if (e.code === 'KeyR') {
        this.scene.restart();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      detachDevices();
      window.removeEventListener('keydown', onKeyDown);
    });

    // O HUD lê __LAST_PLAYER__ no create: o payload inicial vem antes do launch.
    this.emitPlayer();
    this.scene.launch('Hud');
  }

  update(_time: number, delta: number): void {
    if (isHitstopped(this)) return;
    const dt = clampDt(delta);
    const { held, pressed } = this.devices.poll();

    this.player.update(pressed, held, dt);
    this.enemy.update(this.player.sprite.x - this.enemy.sprite.x, this.player.core.mode === 'dead', dt);
    this.resolveHits();
    this.emitPlayer();
    this.checkDeath();
  }

  private resolveHits(): void {
    const { player, enemy } = this;

    const playerBox = player.activeHitbox();
    if (playerBox && player.core.attack && enemy.core.mode !== 'dead' && overlaps(playerBox, enemy.bounds())) {
      const r = registerHit(player.core.attack, enemy.core.id);
      if (r.counted) {
        player.core = { ...player.core, attack: r.attack };
        enemy.core = onEnemyHit(enemy.core, r.attack.spec.damage);
        enemy.knockback(enemy.sprite.x >= player.sprite.x ? 1 : -1);
        this.impact(TUNING.feel.shakeOnEnemyHit);
      }
    }

    // Com i-frames o golpe não é consumido: se ainda estiver ativo quando eles acabarem, acerta.
    const enemyBox = enemy.activeHitbox();
    if (
      enemyBox &&
      enemy.core.attack &&
      player.core.mode !== 'dead' &&
      !isInvulnerable(player.core) &&
      overlaps(enemyBox, player.bounds())
    ) {
      const r = registerHit(enemy.core.attack, player.id);
      if (r.counted) {
        enemy.core = { ...enemy.core, attack: r.attack };
        player.core = onHit(player.core, r.attack.spec.damage);
        player.knockback(player.sprite.x >= enemy.sprite.x ? 1 : -1);
        this.impact(TUNING.feel.shakeOnPlayerHit);
      }
    }
  }

  private impact(shakeIntensity: number): void {
    hitstop(this, TUNING.hitstopMs);
    shake(this, shakeIntensity);
  }

  // Emite só quando algum valor mudou (inclui a regeneração de stamina, frame a frame).
  private emitPlayer(): void {
    const { health, stamina, flask } = this.player.core;
    const p: PlayerChangedPayload = {
      hp: health.current,
      hpMax: health.max,
      stamina: stamina.current,
      staminaMax: stamina.max,
      flask: flask.charges,
      flaskMax: flask.max,
    };
    const last = this.lastPayload;
    if (last && (Object.keys(p) as (keyof PlayerChangedPayload)[]).every((k) => p[k] === last[k])) return;
    this.lastPayload = p;
    window.__LAST_PLAYER__ = p;
    this.game.events.emit(PLAYER_CHANGED, p);
  }

  private checkDeath(): void {
    if (this.dead || this.player.core.mode !== 'dead') return;
    this.dead = true;
    this.game.events.emit(PLAYER_DIED);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'VOCÊ MORREU', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#d62839',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.time.delayedCall(TUNING.feel.deathRestartMs, () => this.scene.restart());
  }

  // F2: mostra os corpos de física (hurtboxes). As hitboxes de golpe sempre aparecem na fase active.
  private setDebug(on: boolean): void {
    const world = this.physics.world;
    if (on && !world.debugGraphic) world.createDebugGraphic();
    world.drawDebug = on;
    if (!on) world.debugGraphic?.clear();
    this.registry.set(DEBUG_KEY, on);
  }
}
