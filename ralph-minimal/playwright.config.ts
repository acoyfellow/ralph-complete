import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'test-prod.ts',
  timeout: 60000, // 60s timeout for container operations
  use: {
    baseURL: 'https://ralph-complete.coy.workers.dev',
  },
});
