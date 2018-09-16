/**
 * @file getWebpackConfig
 * @author Cuttle Cong
 * @date 2018/9/15
 *
 */
const nps = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrors = require('friendly-errors-webpack-plugin')
const ProgressBar = require('progress-bar-webpack-plugin')

module.exports = function({
  htmlTemplatePath = nps.join(__dirname, 'index.html'),
  entry,
  debug,
  dist,
  prod = true,
  context
} = {}) {
  const mode = prod ? 'production' : 'development'

  return {
    entry,
    context: nps.join(__dirname, '../../../..') /*: nps.join(__dirname, '../..')*/,
    mode,
    devtool: prod ? false : 'source-map',
    output: { path: dist, chunkFilename: 'assets/[name].js', filename: 'assets/[name].js' },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: { styles: { name: 'styles', test: /\.css$/, chunks: 'all', enforce: true } }
      }
    },
    plugins: [
      !debug && new ProgressBar({}),
      !debug &&
        new FriendlyErrors({
          compilationSuccessInfo: {
            messages: ['You application is running here http://localhost:3000'],
            notes: ['Some additionnal notes to be displayed unpon successful compilation']
          }
        }),
      new FriendlyErrors({
        compilationSuccessInfo: {
          messages: ['You application is running here http://localhost:3000'],
          notes: ['Some additionnal notes to be displayed unpon successful compilation']
        }
      }),
      new MiniCssExtractPlugin({
        // disable: !prod,
        filename: 'assets/style.css',
        allChunks: true
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: htmlTemplatePath
      })
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [['env', { targets: { browsers: ['ie 11'] } }]],
                plugins: ['syntax-dynamic-import']
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: prod ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
              options: { sourceMap: true }
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                // url: false,
                minimize: true,
                sourceMap: true
              }
            }
          ]
        }
      ]
    }
  }
}
