import { ERROR, OFF } from './constants.js';

/** @type {import('eslint').Linter.Config} */
export const overrides = {
  files: ['eslint-config/**/*.{js,jsx,cjs,mjs,ts,tsx}', 'eslint.config.js'],
  rules: {
    'import/extensions': [ERROR, 'always'],
    'import/no-deprecated': OFF,
    'import/no-useless-path-segments': OFF,
  },
};
