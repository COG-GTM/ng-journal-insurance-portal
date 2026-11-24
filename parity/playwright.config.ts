import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  fullyParallel: false,
  workers: 1,
  retries: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['json', { outputFile: 'report/results.json' }]],
  use: {
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'baseline', use: { baseURL: process.env.BASELINE_URL ?? 'http://localhost:4000' } },
    { name: 'upgraded', use: { baseURL: process.env.UPGRADED_URL ?? 'http://localhost:4200' } },
  ],
});
