/* eslint-disable perfectionist/sort-imports */
import { overrides as canonical } from './canonical.js';
import { overrides as packageJson } from './package-json.js';
import { overrides as prettier } from './prettier.js';
import { overrides as importConfig } from './import-config.js';
import { overrides as perfectionist } from './perfectionist.js';
import { overrides as eslintConfig } from './eslint-config-overrides.js';

/** @type {import('eslint').Linter.Config[]} */
export const projectConfig = [canonical, packageJson, prettier, importConfig, perfectionist, eslintConfig];
