import { expect, test, type Page } from '@playwright/test';

// Estado lido da cena pelo navegador. `player` é privado no TS, mas existe em runtime.
interface PlayerProbe {
  x: number;
  y: number;
  mode: string;
  hp: number;
  stamina: number;
  frame: number;
}

function probe(page: Page): Promise<PlayerProbe> {
  return page.evaluate(() => {
    const scene = window.__GAME__.scene.getScene('CombatTest') as unknown as {
      player: { sprite: { x: number; y: number }; core: { mode: string; health: { current: number }; stamina: { current: number } } };
    };
    const { sprite, core } = scene.player;
    return {
      x: sprite.x,
      y: sprite.y,
      mode: core.mode,
      hp: core.health.current,
      stamina: core.stamina.current,
      frame: window.__GAME__.loop.frame,
    };
  });
}

// Espera alguns frames reais do loop (não tempo fixo).
async function waitFrames(page: Page, n: number): Promise<void> {
  const start = await page.evaluate(() => window.__GAME__.loop.frame);
  await page.waitForFunction((target) => window.__GAME__.loop.frame >= target, start + n);
}

async function openArena(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.waitForFunction(
    () => window.__GAME__?.scene.isActive('CombatTest') === true && window.__GAME__.scene.isActive('Hud') === true,
  );
  // O jogador cai do ponto inicial até o chão antes de qualquer input.
  await page.waitForFunction(() => {
    const scene = window.__GAME__.scene.getScene('CombatTest') as unknown as {
      player: { body: { blocked: { down: boolean }; touching: { down: boolean } } };
    };
    const b = scene.player.body;
    return b.blocked.down || b.touching.down;
  });
  return errors;
}

test('carrega a arena', async ({ page }) => {
  const errors = await openArena(page);
  await waitFrames(page, 30);
  const p = await page.evaluate(() => window.__LAST_PLAYER__);
  expect(p).toMatchObject({ hp: 100, hpMax: 100, stamina: 100, staminaMax: 100, flask: 3, flaskMax: 3 });
  expect(errors).toEqual([]);
});

test('ataque gasta stamina', async ({ page }) => {
  const errors = await openArena(page);
  await page.keyboard.down('KeyJ');
  await page.waitForFunction(() => (window.__LAST_PLAYER__?.stamina ?? 100) < 100);
  await page.keyboard.up('KeyJ');
  expect((await page.evaluate(() => window.__LAST_PLAYER__))!.stamina).toBeLessThan(100);
  expect(errors).toEqual([]);
});

test('aba oculta não mata o jogador', async ({ page }) => {
  const errors = await openArena(page);
  const before = await probe(page);

  // Emula a aba em segundo plano: o visibilitychange aciona o pause/resume do Phaser, e o
  // sleep/wake para o requestAnimationFrame, como o navegador faz numa aba oculta.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    window.__GAME__.loop.sleep();
  });
  const sleptAt = await page.evaluate(() => window.__GAME__.loop.frame);
  await page.waitForTimeout(3000); // a duração da ausência é o próprio teste
  expect(await page.evaluate(() => window.__GAME__.loop.frame)).toBe(sleptAt);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
    window.__GAME__.loop.wake();
  });
  await waitFrames(page, 30);

  const after = await probe(page);
  expect(after.frame).toBeGreaterThan(before.frame); // o loop voltou
  expect(after.hp).toBe(before.hp);
  expect(after.mode).not.toBe('dead');
  expect(Math.abs(after.y - before.y)).toBeLessThan(2); // não atravessou o chão
  expect(errors).toEqual([]);
});

test('frame travado de 2 s não faz o jogador pular nem cair do chão', async ({ page }) => {
  const errors = await openArena(page);
  const before = await probe(page);

  // Trava a thread principal com o loop rodando. O rawDelta chega com ~2000 ms; o smoothStep do
  // Phaser já suaviza o delta e o clampDt (50 ms) é a segunda defesa.
  await page.evaluate(() => {
    const end = performance.now() + 2000;
    while (performance.now() < end) {
      /* frame lento */
    }
  });
  await waitFrames(page, 30);

  const after = await probe(page);
  expect(after.hp).toBe(before.hp);
  expect(Math.abs(after.x - before.x)).toBeLessThan(2);
  expect(Math.abs(after.y - before.y)).toBeLessThan(2);
  expect(errors).toEqual([]);
});

test('desconectar o gamepad no meio de uma ação não gera erro', async ({ page }) => {
  // Gamepad falso controlado pelo teste; o formato imita o do Chrome (4 slots, null nos vazios).
  await page.addInitScript(() => {
    const pad = {
      id: 'fake-pad',
      index: 0,
      connected: true,
      mapping: 'standard',
      timestamp: 0,
      buttons: Array.from({ length: 17 }, () => ({ pressed: false, touched: false, value: 0 })),
      axes: [0, 0, 0, 0],
    };
    const w = window as unknown as { __PAD__: typeof pad };
    w.__PAD__ = pad;
    Object.defineProperty(navigator, 'getGamepads', {
      configurable: true,
      value: () => [pad.connected ? pad : null, null, null, null],
    });
  });
  const errors = await openArena(page);
  const setButton = (i: number, pressed: boolean) =>
    page.evaluate(
      ([i, pressed]) => {
        (window as unknown as { __PAD__: { buttons: { pressed: boolean }[] } }).__PAD__.buttons[i as number].pressed =
          pressed as boolean;
      },
      [i, pressed] as const,
    );

  // Gamepad move o jogador (direcional direito = botão 15).
  const start = await probe(page);
  await setButton(15, true);
  await page.waitForFunction((x0) => {
    const s = window.__GAME__.scene.getScene('CombatTest') as unknown as { player: { sprite: { x: number } } };
    return s.player.sprite.x > x0 + 5;
  }, start.x);
  await setButton(15, false);

  // Ataque pelo gamepad (botão 5) e desconexão durante o ataque.
  await setButton(5, true);
  await page.waitForFunction(() => {
    const s = window.__GAME__.scene.getScene('CombatTest') as unknown as { player: { core: { mode: string } } };
    return s.player.core.mode === 'attack';
  });
  await page.evaluate(() => {
    const pad = (window as unknown as { __PAD__: { connected: boolean } }).__PAD__;
    pad.connected = false;
    window.dispatchEvent(new Event('gamepaddisconnected'));
  });
  await page.waitForFunction(() => {
    const s = window.__GAME__.scene.getScene('CombatTest') as unknown as { player: { core: { mode: string } } };
    return s.player.core.mode === 'free';
  });
  await waitFrames(page, 10);
  const mid = await probe(page);
  expect(mid.mode).toBe('free'); // o botão "preso" do pad desconectado não reinicia o ataque

  // O teclado continua funcionando.
  await page.keyboard.down('KeyD');
  await page.waitForFunction((x0) => {
    const s = window.__GAME__.scene.getScene('CombatTest') as unknown as { player: { sprite: { x: number } } };
    return s.player.sprite.x > x0 + 5;
  }, mid.x);
  await page.keyboard.up('KeyD');
  expect(errors).toEqual([]);
});
