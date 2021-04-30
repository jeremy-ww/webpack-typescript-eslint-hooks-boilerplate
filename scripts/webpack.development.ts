import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { prepareUrls } from 'react-dev-utils/WebpackDevServerUtils'
import clearConsole from 'react-dev-utils/clearConsole'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { GenerateSW } from 'workbox-webpack-plugin'
import { merge } from 'webpack-merge'
import webpack from 'webpack'
import chalk from 'chalk'

// just in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server'

const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin

import base from './webpack.base'

function printInstructions(urls: { localUrlForTerminal: string; lanUrlForTerminal: string }) {
  console.log()
  console.log(chalk.bold(chalk.green(`You can now view it in the browser.`)))
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
      // @ts-ignore
      printInstructions(prepareUrls('http', '0.0.0.0', compiler.options.devServer.port))
    })
  }
}

const config: webpack.Configuration = {
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
  // @ts-ignore
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
  ].filter((v): v is any => Boolean(v)),
}

export default merge(base, config)
