# AI-game-creation
A game creation using Claude Code to put in practical the knowledges adquired.

## Neon Ashes

Souls-like 2D cyberpunk para navegador, feito com Phaser 3 + TypeScript + Vite.

### Como rodar

Requer Node 24.

```bash
npm install        # instala as dependências
npm run dev        # servidor local em http://localhost:5173
npm test           # testes de lógica (Vitest)
npm run test:e2e   # teste de fumaça no navegador (Playwright)
```

Na primeira vez, o Playwright precisa do navegador: `npx playwright install chromium`.

Outros scripts: `npm run typecheck`, `npm run build` (gera `dist/`) e `npm run preview`.

### Deploy

Cada push na `main` roda os testes, faz o build e publica no GitHub Pages
(`.github/workflows/deploy.yml`). É preciso ativar o Pages no repositório com a fonte **GitHub Actions**.
