/**
 * @file localize
 * @author Cuttle Cong
 * @date 2018/9/21
 *
 */

;(function() {
  function walk(node, run) {
    if (node && node.children) {
      for (let i = 0; i < node.children.length; i++) {
        walk(node.children[i], run)
      }
    }
    node && run(node)
  }

  function localizeHtmlPage() {
    walk(document.documentElement, function(node) {
      //Localize by replacing __MSG_***__ meta tags

      var valStrH = node.innerHTML.toString()
      var valNewH = valStrH.replace(/__MSG_([\w.]+)__/g, function(match, v1) {
        return v1 ? chrome.i18n.getMessage(v1) : ''
      })

      if (valNewH != valStrH) {
        node.innerHTML = valNewH
      }
    })
  }

  localizeHtmlPage()
})()
