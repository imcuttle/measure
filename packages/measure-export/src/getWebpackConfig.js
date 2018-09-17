/**
 * @file getWebpackConfig
 * @author Cuttle Cong
 * @date 2018/9/15
 *
 */
const nps = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SimpleProgressPlugin = require('simple-progress-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrors = require('friendly-errors-webpack-plugin')
const ProgressBar = require('progress-bar-webpack-plugin')

module.exports = function({
  htmlTemplatePath,
  entry,
  debug,
  dist,
  sourceMap,
  prod = true,
  compilationSuccessInfo,
  context,
  hot
} = {}) {
  const mode = prod ? 'production' : 'development'
  return {
    entry: [hot && !prod && `${require.resolve('webpack-hot-middleware/client')}?reload=true`, entry].filter(Boolean),
    context /*: nps.join(__dirname, '../..')*/,
    mode,
    devtool: !prod || sourceMap ? 'source-map' : false,
    output: { path: dist, chunkFilename: 'assets/[name].js', filename: 'assets/[name].js' },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: { styles: { name: 'styles', test: /\.css$/, chunks: 'all', enforce: true } }
      }
    },
    plugins: [
      !debug && !prod && new ProgressBar({}),
      !debug &&
        !prod &&
        new FriendlyErrors({
          compilationSuccessInfo
        }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: mode
        }
      }),
      !debug &&
        prod &&
        new SimpleProgressPlugin({
          format: prod ? 'compact' : 'minimal'
        }),
      !prod && hot && new webpack.HotModuleReplacementPlugin(),
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
