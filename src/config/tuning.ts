// Todos os números de balanceamento do jogo. Tempos em ms, velocidades em px/s.
export const TUNING = {
  world: { gravity: 900 },
  stamina: { max: 100, regenPerSec: 45, regenDelayMs: 600 },
  health: { max: 100 },
  flask: { charges: 3, healFraction: 0.4, useMs: 900 },
  costs: { attack: 20, dodge: 25, jump: 0 },
  block: { damageReduction: 0.8, staminaPerDamage: 1.0, guardBreakStunMs: 1000 },
  dodge: { durationMs: 400, iframeStartMs: 60, iframeEndMs: 320, speed: 220 },
  inputBufferMs: 150,
  maxDtMs: 50,
  hitstopMs: 60,
  knockback: { player: 140, enemy: 120 },
  player: { runSpeed: 110, jumpVelocity: -330, hurtMs: 250 },
  attacks: {
    katanaLight: { id: 'katanaLight', windupMs: 220, activeMs: 100, recoveryMs: 320, damage: 22, staminaCost: 20, reach: 26 },
    // Ataque do guarda; o windup é o telegraph.
    guardSlash: { id: 'guardSlash', windupMs: 500, activeMs: 120, recoveryMs: 450, damage: 25, staminaCost: 0, reach: 24 },
  },
  guard: { hp: 60, aggroRange: 140, attackRange: 26, walkSpeed: 45, chaseSpeed: 70, recoverMs: 400, hurtMs: 220, attackCooldownMs: 900 },
} as const;
