/**
 * @file abc.js
 * @author Cuttle Cong
 * @date 2018/9/20
 *
 */

export default function injectJs(jsPath) {
  // jsPath = jsPath || 'js/inject.js'
  const temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  temp.src = chrome.extension.getURL(jsPath)
  document.head.appendChild(temp)
  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  return new Promise(function(resolve, reject) {
    temp.onload = function() {
      // 放在页面不好看，执行完后移除掉
      this.parentNode.removeChild(this)
      resolve()
    }
    temp.onerror = function (err) {
      this.parentNode.removeChild(this)
      reject(err)
    }
  })
}

MeasureUI.render(
  {
    navi: {
      pages: []
    },
    html: document.documentElement.outerHTML
  },
  document.body
)
