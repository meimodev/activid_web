import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 20000,
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      // server-only throws outside RSC bundling; stub it so server modules
      // (which are still plain JS) can be unit-tested in node/jsdom.
      'server-only': path.resolve(__dirname, './test/stubs/server-only.ts'),
    },
  },
});
