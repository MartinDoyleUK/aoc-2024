import { recommended as canonicalRecommended } from 'eslint-config-canonical/configurations/canonical.js';

import { OFF } from './constants.js';

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  files: canonicalRecommended.files,
  plugins: {
    unicorn: canonicalRecommended.plugins.unicorn,
  },
  rules: {
    'unicorn/no-for-loop': OFF,
    'unicorn/prevent-abbreviations': OFF,
  },
};
