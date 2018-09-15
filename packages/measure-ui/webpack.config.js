const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins(/*loader*/) {
      return [
        require('autoprefixer')(),
        require('cssnano')({
          zindex: false,
          // https://github.com/ben-eb/cssnano/issues/361
          reduceIdents: false
        })
      ]
    }
  }
}

function conf({ define, isBuild, watch, mini, format } = {}) {
  const NODE_ENV = isBuild ? 'production' : 'development'

  return {
    mode: NODE_ENV,
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'), // string
      // 所有输出文件的目标路径
      // 必须是绝对路径（使用 Node.js 的 path 模块）
      filename: `measure-ui.${format}${mini ? '.min' : ''}.js`, // string    // 「入口分块(entry chunk)」的文件名模板
      library: 'MeasureUI', // string,
      // 导出库(exported library)的名称
      libraryTarget: format // 通用模块定义    // 导出库(exported library)的类型
      /* 高级输出配置（点击显示） */
    },
    module: {
      // noParse: //,
      // 关于模块配置
      rules: [
        {
          test: /\.jsx?$/,
          include: [__dirname],
          exclude: ['node_modules/**'],
          loader: 'babel-loader',
          options: {}
          // loader 的可选项
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  // url: false,
                  minimize: true,
                  sourceMap: true
                }
              },
              postcssLoader,
              {
                loader: 'less-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
          })
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  // url: false,
                  minimize: true,
                  sourceMap: true
                }
              },
              postcssLoader
            ]
          })
        }
        // 条件不匹配时匹配
      ]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'build.min.css',
        allChunks: true
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        ...define
      }),
      !isBuild && watch && new webpack.HotModuleReplacementPlugin(),
      isBuild &&
        mini &&
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
            warnings: false,
            drop_console: false
          }
        })
    ].filter(Boolean)
  }
}

module.exports = [
  conf({
    watch: false,
    isBuild: false,
    mini: false,
    format: 'commonjs'
  }),

  conf({
    isBuild: true,
    mini: false,
    format: 'umd'
  }),
  conf({
    isBuild: true,
    mini: false,
    format: 'umd'
  })
]
