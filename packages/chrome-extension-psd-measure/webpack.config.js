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
      path: __dirname,
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
  get({ entry: './src/localize.js', filename: './src/dist/localize.js' }),
  get({ entry: './src/options.js', filename: './src/dist/options.js' }),
  get({ entry: './src/background-script/index.js', filename: './src/dist/background.js' }),
  get({ entry: './src/view.js', filename: './src/dist/view.js' }),
]
