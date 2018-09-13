/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/13
 *
 */
const toHtml = require('hast-util-to-html')
const { psdToHAST, psdToHASTFormBuffer, psdToHASTFromPath } = require('./lib/psd-to-hast')

function psdToHtmlFromBuffer(buffer, { toHtmlOpts, ...opts } = {}) {
  return toHtml(psdToHASTFormBuffer(buffer, opts), toHtmlOpts)
}

function psdToHtml(buffer, { toHtmlOpts, ...opts } = {}) {
  return toHtml(psdToHAST(buffer, opts), toHtmlOpts)
}

function psdToHtmlFromPath(path, { toHtmlOpts, ...opts } = {}) {
  return toHtml(psdToHASTFromPath(path, opts), toHtmlOpts)
}

module.exports = {
  psdToHtml,
  psdToHtmlFromPath,
  psdToHtmlFromBuffer
}
