/**
 * @file generatePages
 * @author Cuttle Cong
 * @date 2018/9/15
 *
 */
const nps = require('path')

const psdLoaderPath = require.resolve('./psdLoader')
const coverLoaderPath = require.resolve('./coverLoader')
const rawLoaderPath = require.resolve('raw-loader')
const fileLoaderPath = require.resolve('file-loader')
const double = JSON.stringify

function generatePage(paths = [], { context } = {}) {
  paths = paths.map(name => {
    return {
      filename: nps.join(context, name),
      basename: name
    }
  })

  const str =
    paths
      .map(({ filename, basename }) => {
        let loader = rawLoaderPath
        let cover = 'null'
        if (nps.extname(filename).toLowerCase() === '.psd') {
          loader = psdLoaderPath
          cover = coverRequire(filename)
        }
        const wrappedName = double(basename)
        // webpackPrefetch: true
        return `\n  {
    title: ${wrappedName},
    key: ${double('/' + basename)},
    cover: ${cover},
    html: function() {
      return import(/* webpackChunkName: ${wrappedName} */ ${double(
          `!${require.resolve('babel-loader')}!${loader}!${filename}`
        )}).then(({ default: _ })  => _)
    }
  }`
      })
      .join(',') + '\n'

  return `[${str}]`
}

function coverRequire(filename) {
  return `require(${double(`!${fileLoaderPath}?name=preview/[path][name].png!${coverLoaderPath}!${filename}`)})`
}

module.exports = {
  coverRequire,
  generatePage
}
