/**
 * @file index
 * @author imcuttle
 * @description
 */

import * as React from 'react'
import PropTypes from 'prop-types'
import p from 'prefix-classname'
import { h } from 'react-mobx-vm'

import './style.less'
import { i18n } from '../i18n'

import getPsdToHtml from '../getPsdToHtml'

let HtmlMeasure = () => <h1>{i18n('error.not-in-browser')}</h1>
if (typeof document !== 'undefined') {
  require('zepto/src/zepto')
  HtmlMeasure = require('html-measure').default
  require('html-measure/style.less')
}

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

  handleClickMeasureAbleNode = node => {
    const app = this.local
    const pos = app.hmRef.pos(node)
    const $n = $(node)

    let content = ''
    let solidColor = ''
    let LengthArray = [content.length]
    let leadings = []
    let names = []
    let colors = []
    let aligns = []
    let sizes = []
    let textDecorations = []
    let weights = []

    let snippetIndex = app.inforBar.snippets.findIndex(x => x.value === 'outerHtml')
    if (node.hasAttribute('data-psd-index')) {
      content = $n.data('content') || ''
      solidColor = $n.data('solidColor')
      LengthArray = $n.data('fontLengthArray') || []
      leadings = $n.data('fontLeading') || []
      names = $n.data('fontFamily') || []
      colors = $n.data('fontColors') || []
      aligns = $n.data('textAlign') || []
      sizes = $n.data('fontSizes') || []
      textDecorations = $n.data('textDecoration') || []
      weights = $n.data('fontWeights') || []

      if (snippetIndex >= 0) {
        app.inforBar.snippets.splice(snippetIndex, 1)
      }
    } else {
      if (snippetIndex < 0) {
        app.inforBar.snippets.push({
          value: 'outerHtml',
          label: 'Outer HTML',
          lang: 'html',
          process: () => {
            return node.outerHTML
          }
        })
      }

      if (typeof getComputedStyle === 'function') {
        const map = getComputedStyle(node)
        const getSty = name => {
          const v = map.getPropertyValue(name)
          return v && v.hasOwnProperty('value') ? v.value : v
        }
        content = $n.text() || ''
        solidColor = getSty('background-color')
        LengthArray = [content.length]
        leadings = [parseFloat(getSty('line-height'))]
        names = [getSty('font-family')]
        colors = [getSty('color')]
        aligns = [getSty('text-align')]
        sizes = [parseFloat(getSty('font-size'))]
        textDecorations = [getSty('text-decoration')]
        weights = [getSty('font-weight')]
      }
    }

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
          content: (content || '').substr(pos, len)
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

  state = {
    isWaitingForUpload: false,
    isImporting: false
  }

  handleDrop = evt => {
    const files = evt.dataTransfer.files
    this.preventAndStop(evt)

    this.setState({
      isImporting: true,
      isWaitingForUpload: false
    })
    this.local
      .import(files)
      .then(() => {
        this.setState({
          isImporting: false
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          error: err.message,
          isImporting: false
        })
      })
  }

  preventAndStop = evt => {
    evt.stopPropagation()
    evt.preventDefault()
  }

  handleDragEnter = evt => {
    this.setState({
      isWaitingForUpload: true
    })
    this.preventAndStop(evt)
  }

  handleDragLeave = evt => {
    this.setState({
      isWaitingForUpload: false
    })
    this.preventAndStop(evt)
  }

  render() {
    const { className } = this.props
    const { html } = this.local
    const { isWaitingForUpload, isImporting } = this.state

    const isSupportPsd = getPsdToHtml()

    return (
      <div
        onDragEnter={this.handleDragEnter}
        onMouseLeave={this.handleDragLeave}
        onDragLeave={this.preventAndStop}
        onDragOver={this.preventAndStop}
        onDrag={this.preventAndStop}
        onDragExit={this.preventAndStop}
        onDrop={this.handleDrop}
        className={cn(c('container', (isWaitingForUpload || isImporting) && 'mask'), className)}
      >
        {isWaitingForUpload && (
          <div className={c('mask-wrapper')}>
            <div className={c('upload-tip')}>
              {isSupportPsd ? i18n('app.upload.tip.psd') : i18n('app.upload.tip.no-psd')}
            </div>
          </div>
        )}
        {isImporting && <div className={c('mask-wrapper')}>{i18n('app.importing')}</div>}

        {h(this.local.header, { className: c('header') })}
        <div className={c('stage')}>
          {h(this.local.navi, c('navi'))}
          <div className={c('playground')}>
            <HtmlMeasure
              onClickMeasureAbleNode={this.handleClickMeasureAbleNode}
              style={{ zoom: this.local.zoom }}
              className={c('hm-core')}
              ref={r => r && (this.local.hmRef = r)}
              html={html}
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
