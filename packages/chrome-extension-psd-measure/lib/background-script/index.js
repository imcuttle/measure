/**
 * @file bg
 * @author Cuttle Cong
 * @date 2018/9/20
 *
 */
import * as url from 'url'
import * as mm from 'micromatch'
import parse from './parsePattern'

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true /*, currentWindow: true*/ }, function(tabs) {
    console.log('tabs', tabs)
    chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
      if (callback) callback(response)
    })
  })
}

const allowedDownloadUrls = []

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.cmd === 'downMe') {
    if (!allowedDownloadUrls.includes(request.value)) {
      allowedDownloadUrls.push(request.value)
      chrome.downloads.download({
        url: request.value
      })
    }
    sendResponse('1')
  }
})

chrome.runtime.onInstalled.addListener(function() {
  // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  //   chrome.declarativeContent.onPageChanged.addRules([
  //     {
  //       conditions: [
  //         // 只有打开百度才显示pageAction
  //         new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: 'baidu.com' } })
  //       ],
  //       actions: []
  //     }
  //   ])
  // })
})

function detectEnabled() {
  if (!state.enable) {
    chrome.browserAction.disable()
    // chrome.browserAction.setBadgeText({ text: 'closed' })
    // chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] })
  } else {
    chrome.browserAction.enable()
  }
}

const defaultState = require('./defaultState')
const state = defaultState
detectEnabled()
function assignState(data) {
  Object.keys(data).forEach(name => {
    if (data[name] === undefined) {
      delete data[name]
    }
  })

  Object.assign(state, data)
  if (typeof state.excludes === 'string') {
    state.excludes = parse(state.excludes)
  }
  if (typeof state.includes === 'string') {
    state.includes = parse(state.includes)
  }

  console.log('Current state:', state)
  detectEnabled()
}
chrome.storage.sync.get(Object.keys(defaultState), assignState)
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (let key in changes) {
    const storageChange = changes[key]
    console.log(
      'Storage key "%s" in namespace "%s" changed. ' + 'Old value was "%s", new value is "%s".',
      key,
      namespace,
      storageChange.oldValue,
      storageChange.newValue
    )
    assignState({ [key]: storageChange.newValue })
  }
})

chrome.downloads.onCreated.addListener(function(item) {
  const { includes, excludes, smartInclude, enable } = state
  if (!state.enable) {
    return
  }
  const refObj = url.parse(item.referrer)
  const downloadUrl = item.finalUrl || item.url // Use finalUrl in v50, fallback to url in old version.
  const index = allowedDownloadUrls.indexOf(downloadUrl)
  if (index >= 0) {
    allowedDownloadUrls.splice(index, 1)
    return
  }

  const urlObj = url.parse(downloadUrl, true)
  console.log('Current download created item:', item)
  console.log('Current state:', state)

  const decodedUrl = decodeURIComponent(downloadUrl)
  // Fetch API in background script can't CORS (must to be 'http:' or 'https:')
  if (
    ['https:', 'http:'].includes(urlObj.protocol) &&
    ((mm.some(decodedUrl, includes, { matchBase: false }) && !mm.some(decodedUrl, excludes, { matchBase: false })) ||
      (smartInclude && 'image/vnd.adobe.photoshop' === item.mime))
  ) {
    const viewPath = chrome.extension.getURL(
      'page/view.html?downloadUrl=' + encodeURIComponent(downloadUrl) + '&title=' + encodeURIComponent(item.filename)
    )
    window.open(viewPath)
    chrome.downloads.erase({ id: item.id }, function(erasedIds) {
      console.log(`chrome.downloads erasedIds:`, erasedIds)
    })
  }
})

// function () {
//   chrome.browserAction.setBadgeText({text: 'new'});
//   chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
// }

if (process.env.NODE_ENV !== 'production') {
  const LIVERELOAD_HOST = 'localhost:'
  const LIVERELOAD_PORT = 35729
  const connection = new WebSocket('ws://' + LIVERELOAD_HOST + LIVERELOAD_PORT + '/livereload')

  connection.onerror = function(error) {
    console.log('reload connection got error:', error)
  }

  connection.onmessage = function(e) {
    if (e.data) {
      const data = JSON.parse(e.data)
      if (data && data.command === 'reload') {
        chrome.runtime.reload()
      }
    }
  }
}
