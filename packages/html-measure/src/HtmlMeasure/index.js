/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/11
 *
 */
import p from 'prefix-classname'
import * as React from 'react'
import PropTypes from 'prop-types'
import createMount from '@rcp/util.createmount'

import './style.less'

if (typeof document === 'undefined' || typeof $ === 'undefined') {
  console.error('Error: [html-measure] requires zepto or jquery and in browser environment')
}

const { PureComponent } = React
const cn = p('')
const c = p('html-measure__')

const attrExcludeSymbol = 'data-hm-exclude'

export function isNodeContains(node) {
  return !node.hasAttribute(attrExcludeSymbol)
}

function padding(node, parent) {
  const rect1 = node.getBoundingClientRect()
  const rect2 = parent.getBoundingClientRect()
  const overlap = !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  )

  if (overlap) {
    return {
      paddingTop: rect2.top - rect1.top,
      paddingBottom: rect1.bottom - rect2.bottom,
      paddingLeft: rect2.left - rect1.left,
      paddingRight: rect1.right - rect2.right
    }
  }
}

function sz(pixel, { unit, numberFixed, isShowUnit, remStandardPx } = {}) {
  if (isNaN(pixel) || pixel === '') {
    return null
  }
  pixel = Number(pixel)

  if (unit === 'rem') {
    pixel = pixel / remStandardPx
  }
  let decimal = Number(pixel).toFixed(numberFixed)
  // 10.2 -> 10.2;   10.0 -> 10
  decimal = decimal % 1 !== 0 ? decimal : Number(decimal).toFixed(0)
  return `${decimal}${isShowUnit ? unit : ''}`
}

export default class Scene extends PureComponent {
  static sz = sz

  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    html: PropTypes.string,
    unit: PropTypes.oneOf(['px', 'rem']),
    remStandardPx: PropTypes.number,
    scaleGapPx: PropTypes.number,
    numberFixed: PropTypes.number,
    isShowUnit: PropTypes.bool,
    isCalcContainerWidth: PropTypes.bool,
    onClickMeasureAbleNode: PropTypes.func
  }

  static defaultProps = {
    unit: 'px',
    remStandardPx: 16,
    scaleGapPx: 10,
    numberFixed: 0,
    isShowUnit: true,
    isCalcContainerWidth: true
  }

  componentDidUpdate() {
    this.update()
  }

  sz(pixel = 0) {
    return sz(pixel, this.props)
  }

  scaleWidth = createMount()
  scaleHeight = createMount()

  scaleLeft = createMount()
  scaleRight = createMount()
  scaleTop = createMount()
  scaleBottom = createMount()
  dotRound = createMount()

  vRule = createMount()
  hRule = createMount()
  ruleBox = createMount()

  componentWillUnmount() {
    this.scaleWidth.close()
    this.scaleHeight.close()
    this.scaleTop.close()
    this.scaleLeft.close()
    this.scaleRight.close()
    this.scaleBottom.close()
    this.dotRound.close()
    this.ruleBox.close()
    this.vRule.close()
    this.hRule.close()
  }

  pos(node) {
    const offset = $(node).offset()
    const pOffset = $(this.layerRef).offset()
    return {
      ...offset,
      left: offset.left - pOffset.left,
      top: offset.top - pOffset.top
    }
  }

  renderPixelSize() {
    const { scaleGapPx } = this.props
    const $node = $(this.runtime.selectedNode)
    const { left, top } = this.pos($node)
    $(this.scaleWidth.dom).hide()
    $(this.scaleHeight.dom).hide()

    let dom = this.scaleWidth.open({
      element: <div className={c('scale-label')}>{this.sz($node.width())}</div>,
      attributes: {},
      mountNode: this.containerRef
    })
    this.scaleWidth.dom = dom
    $(dom)
      .css({
        position: 'absolute',
        top: `${top - scaleGapPx}px`,
        left: `${left + $node.width() / 2}px`,
        transform: `translate(-50%, -100%)`
      })
      .show()

    dom = this.scaleHeight.open({
      element: <div className={c('scale-label')}>{this.sz($node.height())}</div>,
      attributes: {},
      mountNode: this.containerRef
    })
    this.scaleHeight.dom = dom
    $(dom)
      .css({
        position: 'absolute',
        top: `${top + $node.height() / 2}px`,
        left: `${left + $node.width() + scaleGapPx}px`,
        transform: `translate(0%, -50%)`
      })
      .show()
  }

  renderPixelDist() {
    const { selectedNode, ruleNode } = this.runtime
    if (selectedNode && ruleNode && selectedNode !== ruleNode) {
      const $selectedNode = $(selectedNode)
      const $ruleNode = $(ruleNode)

      $(this.scaleHeight.dom).hide()
      $(this.scaleWidth.dom).hide()

      $(this.scaleLeft.dom).hide()
      $(this.scaleBottom.dom).hide()
      $(this.scaleTop.dom).hide()
      $(this.scaleRight.dom).hide()

      const { paddingLeft, paddingRight, paddingTop, paddingBottom } = padding(ruleNode, selectedNode) || {}

      const selPos = this.pos($selectedNode)
      const rulePos = this.pos($ruleNode)

      const leftDist = paddingLeft > 0 ? paddingLeft - 1 : selPos.left - rulePos.left - $ruleNode.width() + 1
      const rightDist = paddingRight > 0 ? paddingRight - 1 : rulePos.left - selPos.left - $selectedNode.width()
      const topDist = paddingTop > 0 ? paddingTop - 1 : selPos.top - rulePos.top - $ruleNode.height() + 1
      const bottomDist = paddingBottom > 0 ? paddingBottom - 1 : rulePos.top - selPos.top - $selectedNode.height()

      let dom
      if (leftDist > 0) {
        dom = this.scaleLeft.open({
          element: (
            <div
              style={{
                transform: 'translateY(-100%)',
                position: 'relative',
                bottom: this.props.scaleGapPx
              }}
              className={c('scale-label')}
            >
              {this.sz(leftDist - 1)}
            </div>
          ),
          attributes: {
            className: c('scale-line', 'scale-line-v')
          },
          mountNode: this.containerRef
        })
        this.scaleLeft.dom = dom

        $(dom)
          .css({
            top: selPos.top + $selectedNode.height() / 2,
            height: 1,
            left: selPos.left - leftDist,
            width: leftDist - 1
          })
          .show()
      }

      if (rightDist > 0) {
        dom = this.scaleRight.open({
          element: (
            <div
              style={{
                transform: 'translateY(-100%)',
                position: 'relative',
                bottom: this.props.scaleGapPx
              }}
              className={c('scale-label')}
            >
              {this.sz(rightDist)}
            </div>
          ),
          attributes: {
            className: c('scale-line', 'scale-line-v')
          },
          mountNode: this.containerRef
        })
        this.scaleRight.dom = dom

        $(dom)
          .css({
            top: selPos.top + $selectedNode.height() / 2,
            height: 1,
            left: selPos.left + $selectedNode.width() + 1,
            width: rightDist
          })
          .show()
      }

      if (topDist > 0) {
        dom = this.scaleTop.open({
          element: (
            <div
              style={{
                position: 'relative',
                left: this.props.scaleGapPx,
                top: topDist / 2,
                transform: `translateY(-50%)`
              }}
              className={c('scale-label')}
            >
              {this.sz(topDist - 1)}
            </div>
          ),
          attributes: {
            className: c('scale-line', 'scale-line-h')
          },
          mountNode: this.containerRef
        })
        this.scaleTop.dom = dom

        $(dom)
          .css({
            top: selPos.top - topDist,
            height: topDist - 1,
            left: selPos.left + $selectedNode.width() / 2,
            width: 1
          })
          .show()
      }

      if (bottomDist > 0) {
        dom = this.scaleBottom.open({
          element: (
            <div
              style={{
                position: 'relative',
                left: this.props.scaleGapPx,
                top: bottomDist / 2,
                transform: `translateY(-50%)`
              }}
              className={c('scale-label')}
            >
              {this.sz(bottomDist)}
            </div>
          ),
          attributes: {
            className: c('scale-line', 'scale-line-h')
          },
          mountNode: this.containerRef
        })
        this.scaleBottom.dom = dom

        $(dom)
          .css({
            top: selPos.top + $selectedNode.height() + 1,
            height: bottomDist,
            left: selPos.left + $selectedNode.width() / 2,
            width: 1
          })
          .show()
      }
    }
  }

  runtime = {
    ruleNode: null,
    selectedNode: null
  }

  handleLayerMouseOver = evt => {
    const { target } = evt
    if (isNodeContains(target)) {
      if (this.runtime.selectedNode === target) {
        this.renderPixelSize()
        return
      }

      this.renderPixelDist()

      const { left, top } = this.pos(target)

      let dom = this.hRule.open({
        element: null,
        mountNode: this.layerRef,
        attributes: {
          className: c('rule-h', 'rule')
        }
      })
      this.hRule.dom = dom
      $(dom)
        .css({ left, width: $(target).width() })
        .show()

      dom = this.vRule.open({
        element: null,
        mountNode: this.layerRef,
        attributes: {
          className: c('rule-v', 'rule')
        }
      })
      this.vRule.dom = dom
      $(dom)
        .css({ top, height: $(target).height() })
        .show()

      dom = this.ruleBox.open({
        element: null,
        mountNode: this.layerRef,
        attributes: {
          className: c('rule-box', 'rule')
        }
      })
      this.ruleBox.dom = dom
      $(dom)
        .css({ top, left, height: $(target).height(), width: $(target).width() })
        .show()

      this.runtime.ruleNode = target
    }
  }

  handleLayerMouseOut = ({ target }) => {
    if (isNodeContains(target)) {
      if (this.runtime.ruleNode === target) {
        $(this.hRule.dom).hide()
        $(this.vRule.dom).hide()
        $(this.ruleBox.dom).hide()
        this.runtime.ruleNode = null
      }
    }
  }

  handleLayerClick = evt => {
    const { target } = evt
    if (isNodeContains(target)) {
      const selectedClassName = c('selected')
      if (this.runtime.selectedNode) {
        $(this.runtime.selectedNode).removeClass(selectedClassName)
      }

      $(target).addClass(selectedClassName)
      this.runtime.selectedNode = target
      $(this.scaleLeft.dom).hide()
      $(this.scaleBottom.dom).hide()
      $(this.scaleTop.dom).hide()
      $(this.scaleRight.dom).hide()

      this.renderPixelSize()

      if (this.runtime.selectedNode === this.runtime.ruleNode) {
        $(this.vRule.dom).hide()
        $(this.hRule.dom).hide()
        $(this.ruleBox.dom).hide()
      }

      // render dot around
      const dom = this.dotRound.open({
        element: (
          <div className={c('dots')}>
            <div className={c('dot-lt', 'dot')} />
            <div className={c('dot-rt', 'dot')} />
            <div className={c('dot-rb', 'dot')} />
            <div className={c('dot-lb', 'dot')} />
          </div>
        ),
        mountNode: this.containerRef
      })
      this.dotRound.dom = dom
      const $t = $(target)
      $(dom)
        .css({
          position: 'absolute',
          pointerEvents: 'none',
          ...this.pos($t),
          width: $t.width(),
          height: $t.height()
        })
        .show()

      if (typeof this.props.onClickMeasureAbleNode === 'function') {
        this.props.onClickMeasureAbleNode(target)
      }
    }
  }

  update() {
    this.runtime.selectedNode && this.handleLayerClick({ target: this.runtime.selectedNode })
    this.runtime.ruleNode && this.handleLayerMouseOver({ target: this.runtime.ruleNode })
  }

  render() {
    let { html, getCalcContainerWidth, children, style, isCalcContainerWidth, className } = this.props

    const props = {}
    if (typeof html === 'string') {
      props.dangerouslySetInnerHTML = {
        __html: html
      }
      children = undefined
    }
    return (
      <div
        ref={r => (this.containerRef = r)}
        className={cn(c('container'), className)}
        style={{
          width: isCalcContainerWidth && this.layerRef ? this.layerRef.clientWidth : null,
          ...style
        }}
      >
        <div
          onMouseMove={this.handleLayerMouseOver}
          onMouseOut={this.handleLayerMouseOut}
          onClick={this.handleLayerClick}
          ref={r => (this.layerRef = r)}
          className={c('layer')}
          {...props}
        >
          {children}
        </div>
      </div>
    )
  }
}
