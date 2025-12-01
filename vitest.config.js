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
      include: ['src/utils/**/*.ts'],
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    include: ['src/**/*.test.ts'],
    pool: 'threads',
  },
});
