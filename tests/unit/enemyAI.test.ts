import { describe, expect, it } from 'vitest';
import { createEnemyCore, onEnemyHit, stepEnemy } from '../../src/systems/enemyAI';
import { TUNING } from '../../src/config/tuning';

describe('enemyAI (guarda)', () => {
  it('fica idle fora do alcance de aggro e persegue dentro dele', () => {
    expect(stepEnemy(createEnemyCore('g1'), 200, false, 16).enemy.mode).toBe('idle');
    const r = stepEnemy(createEnemyCore('g1'), -100, false, 16);
    expect(r.enemy.mode).toBe('chase'); expect(r.intent.moveX).toBe(-1);
  });
  it('no alcance de ataque faz telegraph de 500 ms parado antes do golpe', () => {
    let r = stepEnemy(createEnemyCore('g1'), 20, false, 16);
    expect(r.enemy.mode).toBe('attack'); expect(r.intent.telegraph).toBe(true); expect(r.intent.moveX).toBe(0);
    r = stepEnemy(r.enemy, 20, false, 500); expect(r.intent.telegraph).toBe(false);
  });
  it('respeita o cooldown de 900 ms (contado do fim do ataque) entre ataques', () => {
    let e = createEnemyCore('g1');
    const run = (ms: number) => { for (let t = 0; t < ms; t += 10) e = stepEnemy(e, 20, false, 10).enemy; };
    run(1070 + 400 + 50);                                // ataque (500+120+450) + recover 400
    expect(e.mode).not.toBe('attack');                   // cooldown restante ~450 ms
    run(500);
    expect(e.mode).toBe('attack');
  });
  it('golpe no windup interrompe; morte ao zerar 60 de vida', () => {
    const e = stepEnemy(createEnemyCore('g1'), 20, false, 16).enemy;
    expect(onEnemyHit(e, 22).mode).toBe('hurt');
    expect(onEnemyHit(onEnemyHit(onEnemyHit(e, 22), 22), 22).mode).toBe('dead');
  });
  it('para de atacar quando o jogador morre', () => {
    expect(stepEnemy(createEnemyCore('g1'), 20, true, 16).enemy.mode).toBe('idle');
  });

  // Casos extras
  it('não é interrompido durante o active do próprio ataque, mas leva o dano', () => {
    let e = stepEnemy(createEnemyCore('g1'), 20, false, 16).enemy;
    e = stepEnemy(e, 20, false, 510).enemy;              // active
    const hit = onEnemyHit(e, 22);
    expect(hit.mode).toBe('attack'); expect(hit.health.current).toBe(TUNING.guard.hp - 22);
  });
  it('sai de hurt depois de hurtMs e volta a agir', () => {
    const e = onEnemyHit(createEnemyCore('g1'), 10);
    expect(stepEnemy(e, 100, false, TUNING.guard.hurtMs - 1).enemy.mode).toBe('hurt');
    expect(stepEnemy(e, 100, false, TUNING.guard.hurtMs).enemy.mode).toBe('chase');
  });
  it('não vira de lado durante o ataque (o jogador pode passar por trás)', () => {
    let e = stepEnemy(createEnemyCore('g1'), 20, false, 16).enemy;
    expect(e.facing).toBe(1);
    e = stepEnemy(e, -20, false, 100).enemy;
    expect(e.facing).toBe(1);
  });
  it('morto não age nem leva mais golpes', () => {
    const dead = onEnemyHit(createEnemyCore('g1'), 999);
    const r = stepEnemy(dead, 20, false, 16);
    expect(r.enemy.mode).toBe('dead'); expect(r.intent.moveX).toBe(0);
    expect(onEnemyHit(dead, 10).mode).toBe('dead');
  });
});
