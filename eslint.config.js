// @ts-check
const tseslint = require('typescript-eslint');
const angular = require('@angular-eslint/eslint-plugin');
const angularTemplateParser = require('@angular-eslint/template-parser');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended],
    plugins: { '@angular-eslint': angular },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
    },
  },
  {
    files: ['**/*.html'],
    plugins: { '@angular-eslint/template': angularTemplate },
    languageOptions: { parser: angularTemplateParser },
    rules: {
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
    },
  }
);
