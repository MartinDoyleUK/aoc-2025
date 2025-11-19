import { recommended as canonicalRecommended } from 'eslint-config-canonical/canonical';

import { ERROR, OFF } from './constants.js';

const canonicalConfig = canonicalRecommended[0];

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  files: canonicalConfig.files,
  plugins: {
    perfectionist: canonicalConfig.plugins.perfectionist,
  },
  rules: {
    'perfectionist/sort-imports': [
      ERROR,
      {
        customGroups: {
          value: {
            martindoyle: ['@martindoyle/.*'],
          },
        },
        groups: [
          'type',
          'builtin',
          'external',
          'martindoyle',
          'internal',
          'parent',
          'sibling',
          'unknown',
          ['side-effect', 'side-effect-style'],
          'style',
        ],
        internalPattern: ['@/.*'],
        type: 'natural',
      },
    ],
    'perfectionist/sort-switch-case': OFF,
  },
};
