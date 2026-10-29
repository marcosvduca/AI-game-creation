import { describe, expect, it } from 'vitest';
import { blocksBodies, createPlayerCore, isInvulnerable, onHit, stepPlayer } from '../../src/systems/playerState';
import type { Action } from '../../src/types/input';

const S = (...a: Action[]) => new Set(a);

describe('playerState', () => {
  it('atacar gasta 20 de stamina e entra em attack', () => {
    const p = stepPlayer(createPlayerCore(), S('attack'), S(), 16);
    expect(p.mode).toBe('attack'); expect(p.stamina.current).toBe(80);
  });
  it('ataque + esquiva no mesmo frame executa só a esquiva', () => {
    const p = stepPlayer(createPlayerCore(), S('attack', 'dodge'), S(), 16);
    expect(p.mode).toBe('dodge'); expect(p.stamina.current).toBe(75);
  });
  it('esquiva apertada durante o ataque fica no buffer e executa após a recuperação', () => {
    let p = stepPlayer(createPlayerCore(), S('attack'), S(), 0);
    p = stepPlayer(p, S('dodge'), S(), 500);                // ainda em attack
    expect(p.mode).toBe('attack'); expect(p.buffered?.action).toBe('dodge');
    p = stepPlayer(p, S(), S(), 140);                        // 640 ms: termina o ataque; buffer com 140 ms
    expect(p.mode).toBe('dodge');
  });
  it('spam de ataque não empilha: buffer guarda no máximo uma ação e expira em 150 ms', () => {
    let p = stepPlayer(createPlayerCore(), S('attack'), S(), 0);
    p = stepPlayer(p, S('attack'), S(), 10); p = stepPlayer(p, S('attack'), S(), 10);
    expect(p.buffered?.action).toBe('attack');
    p = stepPlayer(p, S(), S(), 160); expect(p.buffered).toBeNull();
  });
  it('i-frames só na janela 60–320 ms da esquiva', () => {
    let p = stepPlayer(createPlayerCore(), S('dodge'), S(), 0);
    expect(isInvulnerable(stepPlayer(p, S(), S(), 30))).toBe(false);
    expect(isInvulnerable(stepPlayer(p, S(), S(), 100))).toBe(true);
  });
  it('cura com 3 cargas cura 40% ao fim e é perdida se interrompida', () => {
    let p = { ...createPlayerCore(), health: { current: 30, max: 100 } };
    p = stepPlayer(p, S('heal'), S(), 0); p = stepPlayer(p, S(), S(), 900);
    expect(p.health.current).toBe(70); expect(p.flask.charges).toBe(2);
    p = stepPlayer(p, S('heal'), S(), 0); p = onHit(p, 10);
    p = stepPlayer(p, S(), S(), 900);
    expect(p.flask.charges).toBe(1); expect(p.health.current).toBe(60);
  });
  it('guarda quebrada atordoa por 1000 ms', () => {
    let p = { ...createPlayerCore(), stamina: { current: 10, max: 100, delayLeftMs: 0 } };
    p = stepPlayer(p, S(), S('block'), 16);
    p = onHit(p, 25); expect(p.mode).toBe('stunned');
    p = stepPlayer(p, S('attack'), S(), 999); expect(p.mode).toBe('stunned');
  });
  it('vida zero leva a dead e ignora input', () => {
    let p = onHit(createPlayerCore(), 999); expect(p.mode).toBe('dead');
    expect(stepPlayer(p, S('attack'), S(), 16).mode).toBe('dead');
  });

  // Casos extras
  it('com stamina 0 o ataque é recusado e a stamina não fica negativa', () => {
    const p = stepPlayer({ ...createPlayerCore(), stamina: { current: 0, max: 100, delayLeftMs: 600 } }, S('attack'), S(), 16);
    expect(p.mode).toBe('free'); expect(p.stamina.current).toBe(0);
  });
  it('sem cargas a cura é recusada', () => {
    const p = stepPlayer({ ...createPlayerCore(), flask: { charges: 0, max: 3 } }, S('heal'), S(), 16);
    expect(p.mode).toBe('free');
  });
  it('bloqueia só em free, segurando bloqueio e com stamina > 0', () => {
    expect(stepPlayer(createPlayerCore(), S(), S('block'), 16).blocking).toBe(true);
    const zero = { ...createPlayerCore(), stamina: { current: 0, max: 100, delayLeftMs: 600 } };
    expect(stepPlayer(zero, S(), S('block'), 16).blocking).toBe(false);
    const attacking = stepPlayer(createPlayerCore(), S('attack'), S(), 16);
    expect(stepPlayer(attacking, S(), S('block'), 16).blocking).toBe(false);
  });
  it('golpe bloqueado sem quebrar a guarda mantém o bloqueio', () => {
    let p = stepPlayer(createPlayerCore(), S(), S('block'), 16);
    p = onHit(p, 25);
    expect(p.mode).toBe('free'); expect(p.blocking).toBe(true); expect(p.health.current).toBeCloseTo(95);
  });
  it('golpe sem bloqueio interrompe o ataque e leva a hurt por 250 ms', () => {
    let p = stepPlayer(createPlayerCore(), S('attack'), S(), 16);
    p = onHit(p, 10);
    expect(p.mode).toBe('hurt'); expect(p.attack).toBeNull(); expect(p.health.current).toBe(90);
    expect(stepPlayer(p, S(), S(), 249).mode).toBe('hurt');
    expect(stepPlayer(p, S(), S(), 250).mode).toBe('free');
  });
  it('golpe durante o atordoamento não encurta o atordoamento', () => {
    let p = { ...createPlayerCore(), stamina: { current: 10, max: 100, delayLeftMs: 0 } };
    p = stepPlayer(p, S(), S('block'), 16);
    p = onHit(p, 25); p = stepPlayer(p, S(), S(), 500);
    p = onHit(p, 10);
    expect(p.mode).toBe('stunned'); expect(p.modeMs).toBe(500);
  });
  it('golpe nos i-frames não causa dano', () => {
    let p = stepPlayer(createPlayerCore(), S('dodge'), S(), 0);
    p = stepPlayer(p, S(), S(), 100);
    p = onHit(p, 25);
    expect(p.mode).toBe('dodge'); expect(p.health.current).toBe(100);
  });
  it('vira para o lado segurado em free', () => {
    expect(stepPlayer(createPlayerCore(), S(), S('left'), 16).facing).toBe(-1);
  });
  it('corpo bloqueia o inimigo, exceto na esquiva e morto', () => {
    expect(blocksBodies(createPlayerCore())).toBe(true);
    expect(blocksBodies(stepPlayer(createPlayerCore(), S('attack'), S(), 16))).toBe(true);
    expect(blocksBodies(stepPlayer(createPlayerCore(), S('dodge'), S(), 16))).toBe(false);
    expect(blocksBodies(onHit(createPlayerCore(), 999))).toBe(false);
  });
});
