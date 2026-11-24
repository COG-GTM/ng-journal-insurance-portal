import { defineConfig } from '@playwright/test';

const baselineURL = process.env.BASELINE_URL ?? 'http://localhost:4000';
const upgradedURL = process.env.UPGRADED_URL ?? 'http://localhost:4200';
const screens = ['baseline-screens', 'upgraded-screens'];

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
  // Both apps share one API, so both screenshot passes run before any flow that writes data.
  projects: [
    { name: 'baseline-screens', testMatch: /screens\.spec\.ts/, use: { baseURL: baselineURL } },
    { name: 'upgraded-screens', testMatch: /screens\.spec\.ts/, use: { baseURL: upgradedURL } },
    { name: 'baseline', testIgnore: /screens\.spec\.ts/, dependencies: screens, use: { baseURL: baselineURL } },
    { name: 'upgraded', testIgnore: /screens\.spec\.ts/, dependencies: screens, use: { baseURL: upgradedURL } },
  ],
});
