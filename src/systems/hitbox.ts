export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Margem vertical para a hitbox do golpe não pegar quem está só encostando no topo ou nos pés.
const VERTICAL_INSET = 4;

// Retângulo do golpe à frente do corpo (x, y = canto superior esquerdo).
export function attackBox(body: Box, facing: 1 | -1, reach: number): Box {
  return {
    x: facing === 1 ? body.x + body.width : body.x - reach,
    y: body.y + VERTICAL_INSET,
    width: reach,
    height: body.height - VERTICAL_INSET * 2,
  };
}

export function overlaps(a: Box, b: Box): boolean {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}
