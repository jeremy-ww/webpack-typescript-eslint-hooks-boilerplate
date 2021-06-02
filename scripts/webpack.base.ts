import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import webpack from 'webpack'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const config: webpack.Configuration = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'assets/js/[name].js',
    publicPath: '/',
    crossOriginLoading: 'anonymous',
    // NOTE: for non-initial chunk
    chunkFilename: 'assets/js/[name].chunk.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      src: path.resolve(__dirname, '../src'),
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: function (modulePath) {
          return (
            /node_modules/.test(modulePath) &&
            !/node_modules\/@eureka/.test(modulePath) &&
            !/node_modules\/@ui5/.test(modulePath)
          )
        },
        use: [
          'thread-loader',
          // TODO: I don't know how to integrate esbuild with hot reload.
          // {
          //   use: "esbuild-loader",
          //   options: {
          //     loader: "tsx",
          //     target: "es2015",
          //     tsconfigRaw: require("../tsconfig.json"),
          //   },
          // },
          {
            loader: 'babel-loader',
            options: {},
          },
        ],
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index.html'],
          },
          to: '.',
        },
      ],
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      REACT_APP_NAME: require('../package.json').name,
    }),
    new DuplicatePackageCheckerPlugin({
      exclude(instance: { name: string }) {
        return ['webpack', 'querystring'].includes(instance.name)
      },
    }) as any,
    new Dotenv(),
    new ScriptExtHtmlWebpackPlugin({
      custom: {
        test: /\.js$/,
        attribute: 'crossorigin',
        value: 'anonymous',
      },
    }),
  ],
}

export default config
