module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
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
        style: 'css'
      },
      'antd'
    ]
  ]
}
