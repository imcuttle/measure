/**
 * @file getPsdToHtml
 * @author Cuttle Cong
 * @date 2018/9/15
 *
 */

function check(toHtml) {
  return toHtml && typeof toHtml.psdToHtmlFromBuffer === 'function'
}

module.exports = () => {
  let toHtml = null
  try {
    let toHtml = require('psd-html')
  } catch (e) {}
  if (check(toHtml)) {
    return toHtml
  }
  if (check(global.PsdToHtml)) {
    return global.PsdToHtml
  }
  return null
}
