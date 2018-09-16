/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */

export * from './App/index'
import App from './App/index'

import * as ReactDOM from 'react-dom'
import { h, action } from 'react-mobx-vm'
import * as React from 'react'
import { createHashHistory } from 'history'

require('./_style/index.less')

class Measure extends App {
  static render({ basename, language, ...data } = {}, node, callback) {
    const i18n = App.i18n
    if (typeof language === 'string') {
      i18n.setLanguage(language)
    }

    const hashHistory = createHashHistory({
      basename,
      hashType: 'slash'
    })
    let app = data
    if (!(data instanceof Measure)) {
      app = Measure.create(data)
    }

    app.navi.handlePageClick = function(p, i) {
      return () => hashHistory.push(app.navi.pages.getKey(i))
    }
    const getHtml = action(html => {
      if (typeof html === 'function') {
        app.assign({
          isLoading: true
        })
        return Promise.resolve(html())
          .then(html => {
            app.assign({
              isLoading: false
            })
            return html
          })
          .catch(err => {
            console.error(err)
            app.assign({
              error: err.message,
              isLoading: false
            })
          })
      }
      return Promise.resolve(html)
    })

    let prevPage
    const loadPage = action(page => {
      if (page && page.html) {
        return getHtml(page.html).then(html => {
          if (html) {
            prevPage && prevPage.assign({ isActive: false })
            prevPage = page
            page.assign({ isActive: true })
            app.assign({
              html
            })
            app.inforBar.clear()
            const title = page.title || page.key
            if (typeof document !== 'undefined') {
              document.title = `${title} - ${app.header.logo || 'Measure UI'}`
            }
            app.inforBar.assign({
              title,
              position: {
                x: 0,
                y: 0
              },
              size: {
                width: app.hmRef && app.hmRef.layerRef ? app.hmRef.layerRef.clientWidth : null,
                height: app.hmRef && app.hmRef.layerRef ? app.hmRef.layerRef.clientHeight : null
              }
            })
          }
        })
      }
    })

    hashHistory.listen(
      action((loc, action) => {
        const matched = app.navi.pages.matched(loc.pathname.replace(/^\/+/, ''))
        if (!matched || app.isLoading) {
          return
        }
        loadPage(matched)
      })
    )

    if (app.navi.pages) {
      const m = app.navi.pages.matched(hashHistory.location.pathname.replace(/^\/+/, ''))
      if (m) {
        loadPage(m)
      }

      let k = app.navi.pages.getKey(0)
      if (k) {
        hashHistory.replace(k)
      }
    }
    ReactDOM.render(h(app), node)
    return app
  }
}

module.exports = Measure
