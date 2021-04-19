/* eslint-disable @typescript-eslint/no-var-requires */
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { prepareUrls } = require('react-dev-utils/WebpackDevServerUtils')
const clearConsole = require('react-dev-utils/clearConsole')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')
const { merge } = require('webpack-merge')
const chalk = require('chalk')

const HotModuleReplacementPlugin = require('webpack').HotModuleReplacementPlugin

type Compiler = import('webpack').Compiler

const base = require('./webpack.base')

function printInstructions(urls: { localUrlForTerminal: string; lanUrlForTerminal: string }) {
  console.log()
  console.log(chalk.bold(chalk.green(`You can now view it in the browser.`)))
  console.log()

  console.log(`  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`)
  console.log(`  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`)
  console.log()
}

class ClearWebpackDevServerMessagePlugin {
  apply(compiler: Compiler) {
    compiler.hooks.done.tapAsync('ClearWebpackDevServerMessagePlugin', async (params, callback) => {
      clearConsole()
      await callback()
      // @ts-ignore
      printInstructions(prepareUrls('http', '0.0.0.0', compiler.options.devServer.port))
    })
  }
}

// @ts-ignore
module.exports = merge<import('webpack').Configuration>(base, {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
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
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  devServer: {
    hot: true,
    port: 4000,
    clientLogLevel: 'warning',
    disableHostCheck: true,
    transportMode: 'ws',
    injectClient: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    overlay: {
      errors: true,
    },
    watchOptions: {
      ignored: ['../node_modules/'],
    },
  },
  plugins: [
    new ClearWebpackDevServerMessagePlugin(),
    new HtmlWebpackPlugin({
      title: require('../package.json').name,
      template: './static/index.html',
    }),
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    false && new GenerateSW(),
  ].filter(Boolean),
})
