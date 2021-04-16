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
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['prettier', 'react'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
        semi: false,
        trailingComma: 'none',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/no-explicit-any': 0,
  },
};
