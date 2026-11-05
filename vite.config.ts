import { defineConfig } from 'vitest/config'; // CHANGED: was 'vite'
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // CHANGED: added test block so UI tests get a browser-like environment
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
});