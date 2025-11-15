/*
 * This program and the accompanying materials are made available and may be used, at your option, under either:
 * - Eclipse Public License v2.0, available at https://www.eclipse.org/legal/epl-v20.html, OR
 * - Apache License, version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const jestPlugin = require('eslint-plugin-jest');
const mochaPlugin = require('eslint-plugin-mocha');
const unusedImports = require('eslint-plugin-unused-imports');
const maxLines = 150;

module.exports = [
  // Global ignores
  {
    ignores: [
      '**/*.d.ts',
      '**/.eslintrc.js',
      'client-event-handling/**',
      '**/node_modules/**',
      '**/out/**',
      '**/env_scripts/lib/**',
    ],
  },
  // Base config for all files
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 12,
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'jest': jestPlugin,
      'mocha': mochaPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'max-len': ['warn', maxLines],
      'no-console': 'off',
      'no-multiple-empty-lines': 'warn',
      'no-trailing-spaces': 'warn',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-magic-numbers': ['warn', {
        ignore: [-1, 0, 1, 2],
        ignoreDefaultValues: true,
        ignoreReadonlyClassProperties: true,
      }],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': ['warn', {
        args: 'none',
      }],
    },
  },
  // Jest test files override
  {
    files: ['**/__tests__/**/*.ts'],
    languageOptions: {
      globals: {
        ...jestPlugin.environments.globals.globals,
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      '@typescript-eslint/no-magic-numbers': 'off',
      'jest/expect-expect': ['warn', {
        assertFunctionNames: ['expect*', '**.*expect*'],
      }],
      'jest/no-conditional-expect': 'off',
      'jest/no-standalone-expect': 'off',
      'jest/no-try-expect': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
  // Mocha test files
  {
    files: ['**/test/**/*.js', '**/tests/**/*.js', '**/*_test.js', '**/*.test.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];

