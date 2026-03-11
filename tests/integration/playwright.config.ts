/**
 * Playwright Integration Test Configuration for ResidentCement Platform
 */

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './integration',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: [
    ['html', { outputFolder: 'test-results/integration-html' }],
    ['json', { outputFile: 'test-results/integration-results.json' }],
    ['list'],
  ],
  
  use: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10000,
  },

  projects: [
    {
      name: 'api-integration',
      testMatch: '**/*.api.spec.ts',
    },
    {
      name: 'service-integration',
      testMatch: '**/*.service.spec.ts',
    },
  ],

  outputDir: 'test-results/',
});
