import { recommended as canonicalRecommended } from 'eslint-config-canonical/canonical';

import { ERROR } from './constants.js';

const canonicalConfig = canonicalRecommended[0];

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  files: canonicalConfig.files,
  plugins: {
    canonical: canonicalConfig.plugins.canonical,
  },
  rules: {
    'canonical/filename-match-regex': [
      ERROR,
      {
        ignoreExporting: true,
        regex: '^[a-zA-Z0-9]+((\\.|-)[a-zA-Z0-9]+)*$',
      },
    ],
  },
};
