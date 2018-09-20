/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/13
 *
 */
const toHtml = require('hast-util-to-html')
const PSD = require('@moyuyc/psd')
const { psdToHAST, psdToHASTFromBuffer, psdToHASTFromPath, psdToHASTFromURL } = require('./psd-to-hast')

function psdToHtmlFromBuffer(buffer, { toHtmlOpts, ...opts } = {}) {
  return psdToHASTFromBuffer(buffer, opts).then(hast => toHtml(hast, toHtmlOpts))
}

function psdToHtml(psd, { toHtmlOpts, ...opts } = {}) {
  return psdToHAST(psd, opts).then(hast => toHtml(hast, toHtmlOpts))
}

function psdToHtmlFromPath(path, { toHtmlOpts, ...opts } = {}) {
  return psdToHASTFromPath(path, opts).then(hast => toHtml(hast, toHtmlOpts))
}

function psdToHtmlFromURL(url, { toHtmlOpts, ...opts } = {}) {
  return psdToHASTFromURL(url, opts).then(hast => toHtml(hast, toHtmlOpts))
}

module.exports =
  process.env.RUN_ENV === 'browser'
    ? {
        psdToHtml,
        psdToHtmlFromBuffer,
        psdToHtmlFromURL,
        psdToHASTFromURL,
        psdToHAST,
        psdToHASTFromBuffer
      }
    : {
        psdToHtml,
        psdToHtmlFromPath,
        psdToHtmlFromBuffer,
        psdToHAST,
        psdToHASTFromBuffer,
        psdToHASTFromPath
      }
