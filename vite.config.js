import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
      }
    }
  },
  server: {
    historyApiFallback: true  // Use true to redirect all not explicitly handled paths to index.html
  }
});
