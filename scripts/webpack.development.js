// @ts-check
const { prepareUrls } = require('react-dev-utils/WebpackDevServerUtils')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const clearConsole = require('react-dev-utils/clearConsole')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const chalk = require('chalk').default
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

function printInstructions(urls) {
  console.log()
  console.log(chalk.bold(chalk.green(`You can now view it in the browser.`)))
  console.log()

  console.log(
    `  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`
  )
  console.log(`  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`)
  console.log()
}

class ClearWebpackDevServerMessagePlugin {
  /** @param {import('webpack').Compiler} compiler */
  apply(compiler) {
    compiler.hooks.done.tapAsync(
      'ClearWebpackDevServerMessagePlugin',
      async (params, callback) => {
        clearConsole()
        await callback()
        printInstructions(
          // @ts-ignore
          prepareUrls('http', '0.0.0.0', compiler.options.devServer.port)
        )
      }
    )
  }
}

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
  resolve: {
    alias: { 'react-dom': '@hot-loader/react-dom' }
  },
  devServer: {
    hot: true,
    port: 4000,
    clientLogLevel: 'warning',
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
    new ClearWebpackDevServerMessagePlugin(),
    isDLLLibraryAvailable &&
      new webpack.DllReferencePlugin({
        context: path.join(__dirname, '..'),
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
