module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        modules: process.env.NODE_ENV === 'test' ? 'cjs' : false,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    process.env.NODE_ENV === 'development' && 'react-refresh/babel',
    /**
     * @see https://github.com/babel/babel/issues/10690#issuecomment-552979676
     */
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-syntax-dynamic-import'],
    [
      'import',
      {
        libraryName: 'antd',
        style: 'css',
      },
      'antd',
    ],
    ['babel-plugin-styled-components', { pure: true }],
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
};
