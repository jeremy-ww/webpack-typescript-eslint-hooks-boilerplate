// @ts-check
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'assets/js/[name].js',
    publicPath: '/',
    crossOriginLoading: 'anonymous',
    chunkFilename: 'assets/js/[name].chunk.js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  externals: {
    react: 'React',
    // 之所以不在 base 部分添加 react-dom 的 external，是因为 react-hot-loader 需要使用 alias 的方式替代 react-dom。示例：
    // ```js
    // resolve: {
    //   alias: { 'react-dom': '@hot-loader/react-dom' }
    // }
    // ```
    // 而 webpack 似乎 externals 的优先级要比 alias 高，因为 react-dom 的 externals 只能在 webpack.production.js 中设置
    // 'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader'
          },
          {
            loader: 'eslint-loader',
            options: {
              cache: true
            }
          }
        ]
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader'
          },
          {
            loader: 'babel-loader',
            options: {
              cache: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'static',
        to: '.'
      }
    ]),
    new webpack.EnvironmentPlugin({}),
    new ScriptExtHtmlWebpackPlugin({
      custom: {
        test: /\.js$/,
        attribute: 'crossorigin',
        value: 'anonymous'
      }
    })
  ]
}
