// @ts-check
const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')
const Dotenv = require('dotenv-webpack')

dotenv.config()

// https://github.com/cypress-io/cypress/issues/15864#issuecomment-832378600

/** @type {import('webpack').Configuration} */
const config = {
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      cypress: path.resolve(__dirname, '.'),
      src: path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs|ts|tsx)$/,
        exclude: function (modulePath) {
          return (
            /node_modules/.test(modulePath) &&
            !/node_modules\/@eureka/.test(modulePath) &&
            !/node_modules\/@ui5/.test(modulePath) &&
            // NOTE: we need to mock react-redux in cypress
            !/node_modules\/react-redux/.test(modulePath)
          )
        },
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {},
          },
        ],
      },
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/static/[hash][ext][query]',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/static/[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      // seems that cypress-webpack will do this
      // NODE_ENV: 'test',
      REACT_APP_NAME: require('../package.json').name,
    }),
    new Dotenv(),
  ],
}

module.exports = config
