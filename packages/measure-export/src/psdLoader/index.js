/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/15
 *
 */
const nps = require('path')
const concat = require('concat-stream')
const PSD = require('@moyuyc/psd')
const { psdToHASTFromBuffer } = require('psd-html')
const hastToHtml = require('hast-util-to-html')

const { coverRequire } = require('../generate')
// psd-html

function loader(buffer) {
  return psdToHASTFromBuffer(buffer, {
    injectImage: false
  }).then(hast => {
    const style = hast.properties.style = hast.properties.style || ''
    hast.properties.style = `background-image: url(\${imgPath.trim()});${style}`

    return `
var imgPath = ${coverRequire(this.resourcePath)};
module.exports=\`${hastToHtml(hast)}\`
`
  })
}

module.exports = loader
module.exports.raw = true
