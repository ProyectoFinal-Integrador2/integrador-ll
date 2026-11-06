import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['proyecto-integrador-back/tests/**/*.vitest.ts', 'proyecto-integrador-back/tests/**/*.test.ts'],
    environment: 'node',
    env: { DATABASE_URL: 'postgresql://localhost/unit_tests', JWT_SECRET: 'secreto-solo-para-pruebas-unitarias' },
    reporters: ['default', 'json'],
    outputFile: { json: 'docs/calidad/evidencias/01-02-pruebas-unitarias/unitarias.json' },
  },
});
