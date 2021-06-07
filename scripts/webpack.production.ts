import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { GenerateSW } from 'workbox-webpack-plugin'
import { merge } from 'webpack-merge'
import webpack from 'webpack'

import base from './webpack.base'

const report = process.env.WEBPACK_REPORT

const config: webpack.Configuration = {
  mode: 'production',
  bail: true,
  output: {
    clean: true,
    // TODO: If we changed the order of imports, contenthash is different
    filename: 'assets/js/[name].[contenthash:8].js',
    // NOTE: for non-initial chunk
    chunkFilename: 'assets/js/[name].[chunkhash:8].chunk.js',
  },
  devtool: 'hidden-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // https://github.com/webpack-contrib/mini-css-extract-plugin#hot-module-reloading-hmr
              hmr: false,
            },
          },
          { loader: 'css-loader', options: { sourceMap: false } },
        ],
      },
    ],
  },
  optimization: {
    // NOTE: use this two for debugging
    // chunkIds: 'named',
    // moduleIds: 'named',
    /**
     * @see https://github.com/webpack/webpack/blob/master/examples/common-chunk-and-vendor-chunk/webpack.config.js
     */
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial',
          enforce: true,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
    },
    mergeDuplicateChunks: true,
    runtimeChunk: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // turn off flags with small gains to speed up minification
            arrows: false,
            collapse_vars: false, // 0.3kb
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,

            // a few flags with noticeable gains/speed ratio
            // numbers based on out of the box vendor bundle
            booleans: true, // 0.7kb
            if_return: true, // 0.4kb
            sequences: true, // 0.7kb
            unused: true, // 2.3kb

            // required features to drop conditional branches
            conditionals: true,
            dead_code: true,
            evaluate: true,
          },
          mangle: {
            safari10: true,
          },
        },
        parallel: true,
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash:8].css',
      chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
    }) as any,
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    report && new BundleAnalyzerPlugin(),
    false &&
      new GenerateSW({
        inlineWorkboxRuntime: true,
        runtimeCaching: [
          {
            handler: 'CacheFirst',
            /**
             * @see https://developers.google.com/web/tools/workbox/modules/workbox-routing
             */
            urlPattern: new RegExp('https://unpkg\\.com/.*'),
          },
        ],
      }),
  ].filter((v): v is webpack.WebpackPluginInstance => Boolean(v)),
}

const mergedConfig = merge<import('webpack').Configuration>(base, config)

export default [
  mergedConfig,
  // merge(mergedConfig, {
  //   experiments: {
  //     outputModule: true,
  //   },

  //   output: {
  //     module: true,
  //   },
  // }),
]
