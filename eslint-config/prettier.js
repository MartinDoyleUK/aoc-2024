import { recommended } from 'eslint-config-canonical/configurations/prettier.js';

import { ERROR } from './constants.js';

const [, canonicalPrettierRules] = recommended.rules['prettier/prettier'];

/** @type {import('prettier').Options} */
const prettierOverrides = {
  printWidth: 120,
};

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  ...recommended,
  rules: {
    'prettier/prettier': [
      ERROR,
      {
        ...canonicalPrettierRules,
        ...prettierOverrides,
      },
      {
        usePrettierrc: false,
      },
    ],
  },
};
