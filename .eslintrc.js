/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2019,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
