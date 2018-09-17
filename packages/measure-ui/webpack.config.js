const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

let analyzerPort = 8888
const watch = !!process.env.WATCH

function conf({ define, isBuild, globalObject, watch, externals, mini, suffix = '', format } = {}) {
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
              if (['.less', '.css', '.sass'].includes(path.extname(request))) {
                return callback()
              }
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
      globalObject,
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
      // !isBuild && watch && new webpack.HotModuleReplacementPlugin(),
      isBuild &&
        process.env.BUNDLE_ANALYZER &&
        new BundleAnalyzerPlugin({
          analyzerPort: analyzerPort++
        })
    ].filter(Boolean),

    watch
  }
}

module.exports = [
  conf({
    watch: watch,
    isBuild: false,
    format: 'commonjs2',
    externals: ['psd-to-html']
  }),

  // !watch &&
  //   conf({
  //     isBuild: true,
  //     format: 'umd',
  //     // externals: ['psd-to-html'],
  //     suffix: '.web-worker',
  //     define: {
  //       'process.env.WEB_WORKER': '"on"',
  //     },
  //     globalObject: 'this'
  //   }),

  !watch &&
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
      }
    })
].filter(Boolean)
