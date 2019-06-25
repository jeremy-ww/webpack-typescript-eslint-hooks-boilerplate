const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')

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
    new HtmlWebpackPlugin({
      template: './static/index.html'
    })
  ]
})
