import Phaser from 'phaser';
import { TUNING } from '../config/tuning';

const frozenUntil = new WeakMap<Phaser.Scene, number>();

// Congela a física por `ms`; a cena consulta isHitstopped() para não avançar os sistemas.
export function hitstop(scene: Phaser.Scene, ms: number): void {
  frozenUntil.set(scene, Math.max(frozenUntil.get(scene) ?? 0, scene.time.now + ms));
  scene.physics.world.pause();
}

export function isHitstopped(scene: Phaser.Scene): boolean {
  if (scene.time.now < (frozenUntil.get(scene) ?? 0)) return true;
  if (scene.physics.world.isPaused) scene.physics.world.resume();
  return false;
}

// Chamado no create: um restart no meio do hitstop não pode deixar a física pausada.
export function clearHitstop(scene: Phaser.Scene): void {
  frozenUntil.delete(scene);
  scene.physics.world.resume();
}

export function shake(scene: Phaser.Scene, intensity: number): void {
  scene.cameras.main.shake(TUNING.feel.shakeMs, intensity);
}
