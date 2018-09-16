/**
 * @file getPsdToHtml
 * @author Cuttle Cong
 * @date 2018/9/15
 *
 */

module.exports = () => {
  let toHtml = null
  try {
    toHtml = global.PsdToHtml || require('psd-to-html')
  } catch (e) {}
  if (toHtml && typeof toHtml.psdToHtml === 'function') {
    return toHtml
  }
  return null
}
