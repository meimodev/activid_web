import { defineConfig, devices } from '@playwright/test';

// ponytail: build + start (not `next dev`) — the dev lock is per-project, so a
// second `next dev` can't run alongside a developer's local one. `next start`
// coexists and is prod-parity. Dedicated port so nothing collides with :3000.
const PORT = 3100;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000, // dev compiles each route on first hit
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm build && pnpm exec next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
    timeout: 300_000, // includes a production build
  },
});
