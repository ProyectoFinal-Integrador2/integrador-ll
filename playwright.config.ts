import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: false, workers: 1, retries: 0, timeout: 45_000,
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'docs/calidad/evidencias/00-reportes-generales/e2e.json' }]],
  use: { baseURL: 'http://127.0.0.1:5174', viewport: { width: 1366, height: 768 },
    trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: ['chromium', 'firefox', 'webkit'].map(browserName => ({ name: browserName,
    use: { browserName: browserName as 'chromium' | 'firefox' | 'webkit',
      ...(browserName === 'chromium' ? { channel: 'chromium' } : {}) } })),
  webServer: [
    { command: 'node --import tsx proyecto-integrador-back/src/server.ts', port: 3100, reuseExistingServer: false },
    { command: 'node node_modules/vite/bin/vite.js --config tests/vite.qa.config.mts', port: 5174, reuseExistingServer: false },
  ],
});
