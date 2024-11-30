import { recommended as canonicalRecommended } from 'eslint-config-canonical/configurations/canonical.js';

import { ERROR } from './constants.js';

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  files: canonicalRecommended.files,
  plugins: {
    import: canonicalRecommended.plugins.import,
  },
  rules: {
    'import/extensions': [ERROR, 'always'],
    'import/no-useless-path-segments': [
      ERROR,
      {
        noUselessIndex: false,
      },
    ],
  },
};
