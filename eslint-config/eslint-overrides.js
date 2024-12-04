import { recommended as canonicalRecommended } from 'eslint-config-canonical/configurations/canonical.js';

import { OFF } from './constants.js';

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  files: canonicalRecommended.files,
  rules: {
    '@typescript-eslint/array-type': OFF,
    '@typescript-eslint/no-non-null-assertion': OFF,
    'id-length': OFF,
  },
};
