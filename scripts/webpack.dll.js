const webpack = require('webpack')
const path = require('path')

const VENDOR_MANIFEST = path.resolve(__dirname, '../dist/vendor-manifest.json')
const package = require('../package.json')

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  entry: {
    vendor: Object.keys(package.dependencies)
  },
  output: {
    filename: '[name].dll.js',
    library: 'dll_[hash]'
  },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'dll_[hash]',
      path: VENDOR_MANIFEST
    })
  ]
}
