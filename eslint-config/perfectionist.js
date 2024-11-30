import { recommended as canonicalRecommended } from 'eslint-config-canonical/configurations/canonical.js';

import { ERROR } from './constants.js';

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  files: canonicalRecommended.files,
  plugins: {
    perfectionist: canonicalRecommended.plugins.perfectionist,
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
  },
};
