/* eslint-env node */
module.exports = {
  presets: [
    ['@babel/preset-react', { runtime: 'automatic' }],
    [
      '@babel/preset-env',
      {
        modules: process.env.NODE_ENV === 'test' ? 'cjs' : false,
        /**
         * @see https://github.com/cypress-io/cypress/tree/develop/npm/react/cypress/component/advanced/mocking-imports
         */
        loose: Boolean(process.env.BY_CYPRESS),
        useBuiltIns: 'usage',
        corejs: 3,
        exclude: ['@babel/plugin-transform-regenerator'],
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    process.env.NODE_ENV === 'development' && 'react-refresh/babel',
    // NOTE: We don't need it anymore, since @babel/preset-env already include these.
    // '@babel/plugin-proposal-nullish-coalescing-operator',
    // '@babel/plugin-proposal-optional-chaining',
    ['@babel/plugin-transform-runtime'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          src: './src',
          misc: './misc',
        },
      },
    ],
  ].filter(Boolean),
  env: {
    test: {
      plugins: ['istanbul'],
    },
  },
}
