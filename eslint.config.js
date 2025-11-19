import canonicalAuto from 'eslint-config-canonical/auto';

import { projectConfig } from './eslint-config/index.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
    },
  },
  {
    ignores: ['node_modules/', 'dist/', 'tmp/', 'pnpm-lock.yaml'],
  },
  ...canonicalAuto,
  ...projectConfig,
];
