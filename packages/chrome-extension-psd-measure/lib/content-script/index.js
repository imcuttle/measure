chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
  console.log('Receive:', request)
  if (request.cmd === 'renderPSDBuffer') {
    console.log('Receive:', request.value)
  }
  // sendResponse('我收到了你的消息！')
})

console.log('loaded')

// MeasureUI.render(
//   {
//     navi: {
//       pages: []
//     },
//     html: document.documentElement.outerHTML
//   },
//   document.body
// )
