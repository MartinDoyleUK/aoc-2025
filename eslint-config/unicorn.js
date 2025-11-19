import { recommended as canonicalRecommended } from 'eslint-config-canonical/canonical';

import { OFF } from './constants.js';

const canonicalConfig = canonicalRecommended[0];

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  files: canonicalConfig.files,
  plugins: {
    unicorn: canonicalConfig.plugins.unicorn,
  },
  rules: {
    'unicorn/no-for-loop': OFF,
    'unicorn/prevent-abbreviations': OFF,
  },
};
