import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8080',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx --yes http-server -p 8080 -c-1',
    url: 'http://127.0.0.1:8080/briefings/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
