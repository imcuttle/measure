/**
 * @file index
 * @author imcuttle
 * @description
 */

import * as React from 'react'
import PropTypes from 'prop-types'
import p from 'prefix-classname'
import { findDOMNode } from 'react-dom'
import { h } from 'react-mobx-vm'
import 'zepto/src/zepto'

import HtmlMeasure from 'html-measure'

import './style.less'

const cn = p('')
const c = p('hm-app__')

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

export default class App extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onClickMeasureAbleNode: PropTypes.func
  }
  static defaultProps = {}

  componentDidMount() {
    const node = findDOMNode(this.local.hmRef)
    node.scrollIntoView()
  }

  defaultClickMeasureAbleNode = node => {
    const app = this.local
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

    if (typeof this.props.onClickMeasureAbleNode === 'function') {
      this.props.onClickMeasureAbleNode(node)
    }
  }

  render() {
    const { className, onClickMeasureAbleNode } = this.props

    return (
      <div className={cn(c('container'), className)}>
        {h(this.local.header, { className: c('header') })}
        <div className={c('stage')}>
          {h(this.local.navi, c('navi'))}
          <div className={c('playground')}>
            <HtmlMeasure
              onClickMeasureAbleNode={this.defaultClickMeasureAbleNode}
              style={{ zoom: this.local.zoom }}
              className={c('hm-core')}
              ref={r => r && (this.local.hmRef = r)}
              html={require('!raw-loader!../../../../psd-test.html')}
              scaleGapPx={10}
              remStandardPx={Number(this.local.remStandardPx)}
              unit={this.local.unit}
              isShowUnit={this.local.isShowUnit}
              numberFixed={Number(this.local.numberFixed)}
            />
          </div>
          {h(this.local.inforBar, c('infor-bar'))}
        </div>
      </div>
    )
  }
}
