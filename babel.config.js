/* eslint-env node */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        exclude: [],
      },
    ],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    process.env.NODE_ENV === 'development' && 'react-refresh/babel',
    // ['@babel/plugin-transform-runtime'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      'module-resolver',
      {
        alias: {
          cypress: './cypress',
          src: './src',
          misc: './misc',
        },
      },
    ],
  ].filter(Boolean),
  env: {
    test: {
      plugins: [
        [
          '@babel/plugin-transform-modules-commonjs',
          {
            loose: true,
          },
        ],
        'istanbul',
      ],
    },
  },
}
