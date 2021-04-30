import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import webpack from 'webpack'
import path from 'path'

const config: webpack.Configuration = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'assets/js/[name].js',
    publicPath: '/',
    crossOriginLoading: 'anonymous',
    // NOTE: for non-initial chunk
    chunkFilename: 'assets/js/[name].chunk.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      src: path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [
          // TODO: esbuild with hot reload
          // {
          //   use: "esbuild-loader",
          //   options: {
          //     loader: "tsx",
          //     target: "es2015",
          //     tsconfigRaw: require("../tsconfig.json"),
          //   },
          // },
          {
            loader: require.resolve('babel-loader'),
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
    new CleanWebpackPlugin(),
    // @ts-ignore
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static',
          globOptions: {
            ignore: ['**/index.html'],
          },
          to: '.',
        },
      ],
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    // @ts-ignore
    new DuplicatePackageCheckerPlugin({
      exclude(instance: { name: string }) {
        return ['webpack', 'querystring'].includes(instance.name)
      },
    }),
    // @ts-ignore
    new Dotenv(),
    // @ts-ignore
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
