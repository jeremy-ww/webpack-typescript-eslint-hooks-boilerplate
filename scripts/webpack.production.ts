import OptimizeCssnanoPlugin from '@intervolga/optimize-cssnano-plugin'
import TerserPlugin from 'terser-webpack-plugin'
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
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
    // TODO: If we changed the order of imports, contenthash is different
    filename: 'assets/js/[name].[contenthash:8].js',
    // NOTE: for non-initial chunk
    chunkFilename: 'assets/js/[name].[chunkhash:8].chunk.js',
  },
  devtool: 'hidden-source-map',
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    /**
     * @see https://github.com/webpack/webpack/blob/master/examples/common-chunk-and-vendor-chunk/webpack.config.js
     */
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /node_modules/,
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
    // mergeDuplicateChunks: true,
    runtimeChunk: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            // ecma: 'ECMA',
          },
          compress: {
            ecma: 5,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          // Added for profiling in devtools
          // keep_classnames: true,
          // keep_fnames: true,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
      }),
      new OptimizeCssnanoPlugin({
        sourceMap: false,
        cssnanoOptions: {
          safe: true,
          autoprefixer: {
            disable: true,
          },
          mergeLonghand: false,
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash:8].css',
      chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
    }),
    new HtmlWebpackPlugin({
      template: './static/index.html',
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
  ].filter(Boolean),
}

export default merge<import('webpack').Configuration>(base, config)
