import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { prepareUrls } from 'react-dev-utils/WebpackDevServerUtils'
import clearConsole from 'react-dev-utils/clearConsole'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { GenerateSW } from 'workbox-webpack-plugin'
import { merge } from 'webpack-merge'
import webpack from 'webpack'
import chalk from 'chalk'

// just in case you run into any typescript error when configuring `devServer`
import type devServer from 'webpack-dev-server'

const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin

import base from './webpack.base'

function printInstructions(urls: { localUrlForTerminal: string; lanUrlForTerminal?: string }) {
  console.log()
  console.log(
    chalk.bold(chalk.green(`You can now view ${require('../package.json').name} in the browser.`)),
  )
  console.log()

  console.log(`  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`)
  console.log(`  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`)
  console.log()
}

class ClearWebpackDevServerMessagePlugin {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.done.tapAsync('ClearWebpackDevServerMessagePlugin', async (params, callback) => {
      clearConsole()
      await callback()
      printInstructions(prepareUrls('http', '0.0.0.0', compiler.options.devServer?.port))
    })
  }
}

const config: webpack.Configuration & { devServer: devServer.Configuration } = {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', { loader: 'css-loader', options: { sourceMap: false } }],
      },
    ],
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  experiments: {
    lazyCompilation: true,
  },
  devServer: {
    hot: true,
    port: 4000,
    disableHostCheck: true,
    transportMode: 'ws',
    injectClient: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    // NOTE: use this for debugging
    // stats: 'verbose',
    overlay: {
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  plugins: [
    new ClearWebpackDevServerMessagePlugin(),
    new HtmlWebpackPlugin({
      title: require('../package.json').name,
      template: './public/index.html',
    }),
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
    false && new GenerateSW(),
  ].filter((v): v is webpack.WebpackPluginInstance => Boolean(v)),
}

export default merge(base, config)
