// @ts-check
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const merge = require('webpack-merge')

const report = process.argv.includes('--report')
const base = require('./webpack.base')

/** @type {import('webpack').Configuration} */
module.exports = merge(base, {
  mode: 'production',
  bail: true,
  output: {
    filename: 'assets/js/[name].[contenthash:8].js',
    chunkFilename: 'assets/js/[name].[chunkhash:8].chunk.js'
  },
  devtool: 'hidden-source-map',
  externals: {
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'fast-sass-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/fonts/[path][name].[hash:8].[ext]'
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/images/[path][name].[hash:8].[ext]',
              limit: 5000
            }
          }
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[path][name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
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
          enforce: true
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      },
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity
    },
    mergeDuplicateChunks: true,
    runtimeChunk: true,
    minimizer: [
      new TerserPlugin(),
      new OptimizeCssnanoPlugin({
        sourceMap: false,
        cssnanoOptions: {
          safe: true,
          autoprefixer: {
            disable: true
          },
          mergeLonghand: false
        }
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash:8].css',
      chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css'
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
        minifyURLs: true
      }
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
          urlPattern: new RegExp('https://unpkg\\.com/.*')
        }
      ]
    })
  ].filter(Boolean)
})
