/* eslint-disable @typescript-eslint/no-var-requires */
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { ESBuildPlugin: ESBuildPluginDev } = require('esbuild-loader')
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
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2015',
              tsconfigRaw: require('../tsconfig.json')
            }
          }
        ]
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/static/[hash][ext][query]'
        }
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
        generator: {
          filename: 'assets/static/[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static',
          globOptions: {
            ignore: ['**/index.html']
          },
          to: '.'
        }
      ]
    }),
    new ESBuildPluginDev(),
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