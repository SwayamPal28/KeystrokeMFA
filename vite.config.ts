import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Ensure Vite looks in the current directory for `index.html`
  build: {
    outDir: 'dist', // Output directory
    rollupOptions: {
      input: './index.html', // Specify entry point
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
