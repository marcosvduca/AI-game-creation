export interface Health {
  current: number;
  max: number;
}

export function createHealth(max: number): Health {
  return { current: max, max };
}

export function applyDamage(h: Health, amount: number): Health {
  return { ...h, current: Math.max(0, h.current - amount) };
}

export function heal(h: Health, amount: number): Health {
  return { ...h, current: Math.min(h.max, h.current + amount) };
}

export function isDead(h: Health): boolean {
  return h.current <= 0;
}
