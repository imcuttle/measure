/**
 * @file webpack-module
 * @author Cuttle Cong
 * @date 2018/9/15
 *
 */

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins(/*loader*/) {
      return [
        require('autoprefixer')({ remove: false }),
        require('cssnano')({
          zindex: false,
          // https://github.com/ben-eb/cssnano/issues/361
          reduceIdents: false
        })
      ]
    }
  }
}

module.exports = {
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
      // include: ['node_modules/**'],
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
      // include: ['node_modules/**'],
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
}
