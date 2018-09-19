const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './demo/index.js',
  output: {
    path: path.resolve(__dirname, 'demo-dist')
    /* 高级输出配置（点击显示） */
  },
  devtool: 'source-map',
  module: require('./webpack-module'),
  plugins: [
    new ExtractTextPlugin({
      filename: 'style.min.css',
      allChunks: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './demo/index.html'
    })
  ].filter(Boolean)
}
