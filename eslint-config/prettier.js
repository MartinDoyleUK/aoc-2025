import { recommended } from 'eslint-config-canonical/prettier';

import { ERROR } from './constants.js';

const prettierConfig = recommended[0];
const [, canonicalPrettierRules] = prettierConfig.rules['prettier/prettier'];

/** @type {import('prettier').Options} */
const prettierOverrides = {
  printWidth: 120,
};

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  ...prettierConfig,
  rules: {
    'prettier/prettier': [
      ERROR,
      {
        ...canonicalPrettierRules,
        ...prettierOverrides,
      },
      {
        usePrettierrc: false,
      },
    ],
  },
};
