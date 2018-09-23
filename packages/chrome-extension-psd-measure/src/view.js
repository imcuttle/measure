/**
 * @file view
 * @author Cuttle Cong
 * @date 2018/9/21
 *
 */
import { parse } from 'querystring'
import prettyBytes from 'pretty-bytes'

const query = parse(location.search.slice(1))

function mergeTypedArraysUnsafe(a, b) {
  const c = new a.constructor(a.length + b.length)
  c.set(a)
  c.set(b, a.length)

  return c
}

function progress(response, callback) {
  // response.headers.forEach(console.log)
  let totalLength = response.headers.get('content-length')
  totalLength = totalLength && parseFloat(totalLength)
  const reader = response.body.getReader()
  let bytesReceived = 0
  let array = new Uint8Array()
  // read() returns a promise that resolves
  // when a value has been received
  return reader
    .read()
    .then(function processResult(result) {
      // Result objects contain two properties:
      // done  - true if the stream has already given
      //         you all its data.
      // value - some data. Always undefined when
      //         done is true.
      if (result.done) {
        if (totalLength !== bytesReceived) {
          callback(bytesReceived, bytesReceived)
        }
        return
      }
      // result.value for fetch streams is a Uint8Array
      array = mergeTypedArraysUnsafe(array, result.value)
      bytesReceived += result.value.length
      callback(bytesReceived, totalLength)

      // Read some more, and call this function again
      return reader.read().then(processResult)
    })
    .then(() => array)
}

const loadTextNode = document.querySelector('.loading-text')

if (query.downloadUrl) {
  const lang = chrome.i18n.getUILanguage().startsWith('zh') ? 'zh-cn' : 'en-us'
  fetch(query.downloadUrl)
    .then(res =>
      progress(res, function(received, total) {
        if (loadTextNode) {
          loadTextNode.innerHTML =
            '<div style="margin-bottom: 6px;">' + chrome.i18n.getMessage('view_fetcing') + '</div>' +
            (!total ? prettyBytes(received) : parseInt((received / total) * 100) + '%')
        }

        if (received === total) {
          if (loadTextNode) {
            loadTextNode.innerHTML = chrome.i18n.getMessage('view_converting')
          }
        }
      })
    )
    // .then(res => res.body)
    .then(data => {
      PsdToHtml.psdToHtmlFromBuffer(data).then(html => {
        const img = $(html).css('background-image')
        const stripedImage = img.replace(/url\((["'])?(.+)\1\)/, '$2')
        MeasureUI.render(
          {
            language: lang,
            naviVisible: false,
            header: {
              buttons: [
                {
                  content: chrome.i18n.getMessage('view_download'),
                  onClick: () => {
                    chrome.runtime.sendMessage({ cmd: 'downMe', value: query.downloadUrl }, function(response) {})
                  }
                }
              ]
            },
            navi: {
              pages: [
                {
                  key: query.title || 'main',
                  title: query.title || query.downloadUrl,
                  cover: stripedImage,
                  html
                }
              ]
            }
          },
          document.body
        )
      })
    })
}
