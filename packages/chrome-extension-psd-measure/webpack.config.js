const nps = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isBuild = process.env.NODE_ENV === 'production'

function get({ entry, format, filename } = {}) {
  const NODE_ENV = isBuild ? 'production' : 'development'
  return {
    name: filename,
    entry: nps.resolve(entry),
    mode: NODE_ENV,
    target: 'web',
    node: {
      fs: 'empty'
    },
    devtool: 'source-map',
    externals: {
      '@moyuyc/psd-html': {
        commonjs: '@moyuyc/psd-html',
        commonjs2: '@moyuyc/psd-html',
        amd: '@moyuyc/psd-html',
        root: 'PsdToHtml'
      },
      'meas-ui': {
        commonjs: 'meas-ui',
        commonjs2: 'meas-ui',
        amd: 'meas-ui',
        root: 'MeasureUI'
      }
    },
    output: {
      path: nps.resolve(__dirname, 'dist'),
      filename
    },
    module: require('./webpack-module'),
    plugins: [
      new ExtractTextPlugin({
        filename: 'style.css',
        allChunks: true
      }),
      new webpack.DefinePlugin(
        Object.assign({
          'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
        })
      )
    ].filter(Boolean),

    watch: !isBuild
  }
}

module.exports = [
  get({ entry: './lib/localize.js', filename: 'localize.js' }),
  get({ entry: './lib/options.js', filename: 'options.js' }),
  get({ entry: './lib/background-script/index.js', filename: 'background.js' }),
  get({ entry: './lib/view.js', filename: 'view.js' }),
]
