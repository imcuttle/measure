const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

let analyzerPort = 8888
function conf({ define, isBuild, watch, externals, mini, suffix = '', format } = {}) {
  const NODE_ENV = isBuild ? 'production' : 'development'
  const filename = `measure-ui${suffix}.${format}${mini ? '.min' : ''}.js`
  return {
    // context: path.join(__dirname, '../..'),
    name: filename,
    mode: NODE_ENV,
    entry: './src/index.js',
    target: format === 'commonjs2' ? 'node' : 'web',
    externals:
      format === 'commonjs2'
        ? [
            function(context, request, callback) {
              const dep = Object.keys(require('./package').dependencies).concat(
                Object.keys(require('./package').peerDependencies)
              )
              const f = dep.find(name => request.startsWith(name))
              if (f) {
                return callback(null, 'commonjs ' + request)
              }
              callback()
            }
          ].concat(externals)
        : externals,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename,
      library: {
        root: 'MeasureUI',
        amd: 'measure-ui',
        commonjs: 'measure-ui'
      },
      // 导出库(exported library)的名称
      libraryTarget: format // 通用模块定义    // 导出库(exported library)的类型
      /* 高级输出配置（点击显示） */
    },
    devtool: 'source-map',
    module: require('./webpack-module'),
    plugins: [
      new ExtractTextPlugin({
        filename: 'style.css',
        allChunks: true
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        ...define
      }),
      !isBuild && watch && new webpack.HotModuleReplacementPlugin(),
      isBuild &&
        process.env.BUNDLE_ANALYZER &&
        new BundleAnalyzerPlugin({
          analyzerPort: analyzerPort++
        })
    ].filter(Boolean)
  }
}

module.exports = [
  conf({
    watch: false,
    isBuild: false,
    format: 'commonjs2',
    externals: ['psd-to-html']
  }),

  conf({
    isBuild: true,
    format: 'umd',
    externals: {
      'psd-to-html': {
        commonjs: 'psd-to-html',
        commonjs2: 'psd-to-html',
        amd: 'psd-to-html',
        root: 'PsdToHtml'
      }
      // react: {
      //   commonjs: 'react',
      //   commonjs2: 'react',
      //   amd: 'react',
      //   root: 'React'
      // },
      // 'react-dom': {
      //   commonjs: 'react-dom',
      //   commonjs2: 'react-dom',
      //   amd: 'react-dom',
      //   root: 'ReactDOM'
      // }
    }
  })
]
