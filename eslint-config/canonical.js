import { recommended as canonicalRecommended } from 'eslint-config-canonical/configurations/canonical.js';

import { ERROR } from './constants.js';

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  files: canonicalRecommended.files,
  plugins: {
    canonical: canonicalRecommended.plugins.canonical,
  },
  rules: {
    'canonical/filename-match-regex': [
      ERROR,
      {
        ignoreExporting: true,
        regex: '^[a-z]+((\\.|-)[a-z]+)*$',
      },
    ],
  },
};
