import { defineConfig } from 'vite';

// GitHub Pages serve o jogo em /AI-game-creation/; só o dev fica na raiz.
// O preview serve o dist/ do build, então usa o mesmo base dele.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/AI-game-creation/' : '/',
  // O bundle do Phaser sozinho passa de 1 MB.
  build: { chunkSizeWarningLimit: 1500 },
}));
