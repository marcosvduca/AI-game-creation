export interface Flask {
  charges: number;
  max: number;
}

export function createFlask(max: number): Flask {
  return { charges: max, max };
}

export function drinkFlask(f: Flask): { ok: boolean; flask: Flask } {
  if (f.charges <= 0) return { ok: false, flask: { ...f } };
  return { ok: true, flask: { ...f, charges: f.charges - 1 } };
}

export function refillFlask(f: Flask): Flask {
  return { ...f, charges: f.max };
}
