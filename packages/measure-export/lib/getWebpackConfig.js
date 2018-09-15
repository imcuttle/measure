/**
 * @file getWebpackConfig
 * @author Cuttle Cong
 * @date 2018/9/15
 *
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = function({ entry, prod = true } = {}) {
  const mode = prod ? 'production' : 'development'

  return {
    entry,
    mode,
    devtool: prod ? null : 'source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'assets/style.css',
        allChunks: true
      })
    ],
    module: {
      rules: [
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
              }
            ]
          })
        }
      ]
    }
  }
}
