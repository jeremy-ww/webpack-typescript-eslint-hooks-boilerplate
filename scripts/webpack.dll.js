// @ts-check
const webpack = require('webpack')
const path = require('path')

const VENDOR_MANIFEST = path.resolve(__dirname, '../dist/vendor-manifest.json')
const package = require('../package.json')

delete package.dependencies['patch-package']
delete package.dependencies['postinstall-postinstall']

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  entry: {
    vendor: Object.keys(package.dependencies)
  },
  output: {
    filename: '[name].dll.js',
    library: 'dll_[fullhash]'
  },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'dll_[fullhash]',
      path: VENDOR_MANIFEST
    })
  ]
}
