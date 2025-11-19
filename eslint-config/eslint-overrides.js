import { recommended as canonicalRecommended } from 'eslint-config-canonical/canonical';

import { OFF } from './constants.js';

const canonicalConfig = canonicalRecommended[0];

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  files: canonicalConfig.files,
  rules: {
    '@typescript-eslint/array-type': OFF,
    '@typescript-eslint/no-non-null-assertion': OFF,
    'id-length': OFF,
  },
};
