/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/13
 *
 */
const toHtml = require('hast-util-to-html')
const PSD = require('@moyuyc/psd')
const { psdToHAST, psdToHASTFormBuffer, psdToHASTFromPath } = require('./psd-to-hast')

function psdToHtmlFromBuffer(buffer, { toHtmlOpts, ...opts } = {}) {
  return psdToHASTFormBuffer(buffer, opts).then(html => toHtml(html, toHtmlOpts))
}

function psdToHtml(psd, { toHtmlOpts, ...opts } = {}) {
  return psdToHAST(psd, opts).then(html => toHtml(html, toHtmlOpts))
}

function psdToHtmlFromPath(path, { toHtmlOpts, ...opts } = {}) {
  return psdToHASTFromPath(path, opts).then(html => toHtml(html, toHtmlOpts))
}

function psdToHtmlFromURL(url, opts) {
  return PSD.fromURL(url).then(psd => psdToHtml(psd, opts))
}

module.exports =
  process.env.RUN_ENV === 'browser'
    ? {
        psdToHtml,
        psdToHtmlFromBuffer,
        psdToHtmlFromURL
      }
    : {
        psdToHtml,
        psdToHtmlFromPath,
        psdToHtmlFromBuffer
      }
