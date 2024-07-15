import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  publicDir: 'public',
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        mix: resolve(__dirname, 'mix/index.html'),
        create: resolve(__dirname, 'create/index.html'),
      }
    }
  },
  server: {
    historyApiFallback: true
  }
});

