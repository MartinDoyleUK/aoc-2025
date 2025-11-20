// @ts-check

import { defineConfig } from 'vitest/config';

/** @type {import('vitest/config').ViteUserConfigExport} */
export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'src/puzzles/**',
        '**/types.ts',
        '**/constants.ts',
        '**/index.ts',
        '**/*-types.ts',
        '**/*-constants.ts',
      ],
      include: ['src/**/*.ts'],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    include: ['src/**/*.test.ts'],
  },
});
