const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const minimist = require('minimist')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const VENDOR_MANIFEST = path.resolve(__dirname, '../dist/vendor-manifest.json')
const VENDOR_FILE = path.resolve(__dirname, '../dist/vendor.dll.js')
const argv = minimist(process.argv.slice(2))
const isDLLLibraryAvailable = argv['disable-dll']
  ? false
  : fs.existsSync(VENDOR_MANIFEST)
const base = require('./webpack.base')

/** @type {import('webpack').Configuration} */
module.exports = merge(base, {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: 'style-loader',
            options: {}
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'sass-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/fonts/[path][name].[ext]'
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/images/[path][name].[ext]',
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
              name: 'assets/images/[path][name].[ext]'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    hot: true,
    port: 4000,
    progress: true,
    clientLogLevel: 'warn',
    disableHostCheck: true,
    historyApiFallback: {
      disableDotRule: true
    },
    overlay: {
      errors: true
    },
    watchOptions: {
      ignored: ['../node_modules/']
    }
  },
  optimization: {
    usedExports: true
  },
  plugins: [
    isDLLLibraryAvailable &&
      new webpack.DllReferencePlugin({
        manifest: require(VENDOR_MANIFEST)
      }),
    new HtmlWebpackPlugin({
      template: './static/index.html'
    }),
    isDLLLibraryAvailable &&
      new AddAssetHtmlPlugin({
        filepath: VENDOR_FILE
      })
  ].filter(Boolean)
})
