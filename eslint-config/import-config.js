import { recommended as canonicalRecommended } from 'eslint-config-canonical/canonical';

import { ERROR, OFF } from './constants.js';

const canonicalConfig = canonicalRecommended[0];

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  files: canonicalConfig.files,
  plugins: {
    import: canonicalConfig.plugins.import,
  },
  rules: {
    'import/extensions': [
      ERROR,
      'always',
      {
        ignorePackages: true,
      },
    ],
    'import/no-deprecated': OFF,
    'import/no-useless-path-segments': [
      ERROR,
      {
        noUselessIndex: false,
      },
    ],
  },
};
