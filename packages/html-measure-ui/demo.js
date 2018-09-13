/**
 * @file entry.js
 * @author Cuttle Cong
 * @date 2018/9/11
 *
 */

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './src'

import { h } from 'react-mobx-vm'

const app = App.create()

function toArray(item) {
  if (!Array.isArray(item)) {
    return [item]
  }
  return item
}

function last(items) {
  const list = toArray(items)
  return list[list.length - 1]
}

ReactDOM.render(
  h(app, {
    onClickMeasureAbleNode(node) {
      const pos = app.hmRef.pos(node)
      const $n = $(node)

      const content = $n.data('content')
      const solidColor = $n.data('solidColor')
      const LengthArray = $n.data('fontLengthArray') || []
      const leadings = $n.data('fontLeading') || []
      const names = $n.data('fontFamily') || []
      const colors = $n.data('fontColors') || []
      const aligns = $n.data('textAlign') || []
      const sizes = $n.data('fontSizes') || []
      const textDecorations = $n.data('textDecoration') || []
      const weights = $n.data('fontWeights') || []

      let fonts = []

      if (LengthArray && LengthArray.length) {
        let pos = 0
        fonts = LengthArray.map((len, i) => {
          const get = arr => arr[i] || last(arr)
          const item = {
            family: toArray(names || []).join(', '),
            lineHeight: get(leadings),
            color: get(colors),
            align: get(aligns),
            size: get(sizes),
            textDecoration: get(textDecorations),
            weight: get(weights),
            content: content.substr(pos, len)
          }
          pos += len
          return item
        })
      }

      const shadow = {
        outer: {
          offsetX: $n.data('box-shadow-offset-x'),
          offsetY: $n.data('box-shadow-offset-y'),
          blurRadius: $n.data('box-shadow-blur-radius'),
          spreadRadius: $n.data('box-shadow-spread-radius'),
          color: $n.data('box-shadow-color')
        }
      }

      const radius = {
        bottomLeft: $n.data('radiusBottomLeft'),
        bottomRight: $n.data('radiusBottomRight'),
        topLeft: $n.data('radiusTopLeft'),
        topRight: $n.data('radiusTopRight')
      }

      const data = {
        // exportImage: $n.css('background-image'),
        title: $n.data('title'),
        position: {
          x: pos.left,
          y: pos.top
        },
        opacity: $n.css('opacity'),
        shadow,
        radius,
        size: {
          width: $n.width(),
          height: $n.height()
        },
        color: solidColor,
        fonts,
        content
      }
      app.inforBar.clear()
      app.inforBar.assign(data)
    }
  }),
  window.root
)
