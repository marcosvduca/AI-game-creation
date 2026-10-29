import { describe, expect, it } from 'vitest';
import { barFill, ghostOnChange, stepGhost } from '../../src/ui/hudBars';

describe('barFill', () => {
  it('converte o valor em pixels inteiros da barra', () => {
    expect(barFill(50, 100, 100)).toBe(50);
    expect(barFill(33.4, 100, 100)).toBe(33);
  });

  it('limita entre 0 e a largura e trata max 0 sem dividir por zero', () => {
    expect(barFill(-5, 100, 100)).toBe(0);
    expect(barFill(150, 100, 100)).toBe(100);
    expect(barFill(10, 0, 100)).toBe(0);
  });

  it('qualquer valor acima de 0 mostra ao menos 1 px', () => {
    expect(barFill(0.2, 100, 100)).toBe(1);
  });
});

describe('barra fantasma', () => {
  it('ao levar dano fica no valor antigo e desce até o novo em 400 ms', () => {
    let g = ghostOnChange({ value: 100, drainPerMs: 0 }, 60, 400);
    expect(g.value).toBe(100);
    g = stepGhost(g, 60, 200);
    expect(g.value).toBeCloseTo(80);
    g = stepGhost(g, 60, 200);
    expect(g.value).toBe(60);
    expect(g.drainPerMs).toBe(0);
  });

  it('não desce abaixo do valor atual com passo longo', () => {
    const g = stepGhost(ghostOnChange({ value: 100, drainPerMs: 0 }, 60, 400), 60, 5000);
    expect(g.value).toBe(60);
  });

  it('dano novo durante a descida recalcula para chegar ao alvo em 400 ms', () => {
    let g = ghostOnChange({ value: 100, drainPerMs: 0 }, 60, 400);
    g = stepGhost(g, 60, 200);                      // 80
    g = ghostOnChange(g, 40, 400);
    expect(g.value).toBeCloseTo(80);
    g = stepGhost(g, 40, 400);
    expect(g.value).toBe(40);
  });

  it('cura faz a fantasma acompanhar o valor na hora', () => {
    const g = ghostOnChange({ value: 40, drainPerMs: 0 }, 80, 400);
    expect(g).toEqual({ value: 80, drainPerMs: 0 });
  });
});
