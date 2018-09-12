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

if (typeof document !== 'undefined') {
  require('zepto/src/zepto')
} else {
  console.error('HTML measure')
}

const { Component } = React
const cn = p('')
const c = p('html-measure__')

const attrExcludeSymbol = 'data-html-measurable-exclude'

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
  if (unit === 'rem') {
    pixel = pixel / remStandardPx
  }
  return `${Number(pixel).toFixed(numberFixed)}${isShowUnit ? unit : ''}`
}

export default class Scene extends Component {
  static sz = sz

  static propTypes = {
    className: PropTypes.string,
    unit: PropTypes.oneOf(['px', 'rem']),
    remStandardPx: PropTypes.number,
    scaleGapPx: PropTypes.number,
    numberFixed: PropTypes.number,
    isShowUnit: PropTypes.bool
  }

  static defaultProps = {
    unit: 'px',
    remStandardPx: 16,
    scaleGapPx: 10,
    numberFixed: 0,
    isShowUnit: true
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

  pos(node) {
    const offset = $(node).offset()
    const pOffset = $(this.containerRef).offset()
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
    this.scaleWidth.close()
    this.scaleHeight.close()

    let dom = this.scaleWidth.open({
      element: <div className={c('scale-label')}>{this.sz($node.width())}</div>,
      attributes: {},
      mountNode: this.containerRef
    })
    $(dom).css({
      position: 'absolute',
      top: `${top - scaleGapPx}px`,
      left: `${left + $node.width() / 2}px`,
      transform: `translate(-50%, -100%)`
    })

    dom = this.scaleHeight.open({
      element: <div className={c('scale-label')}>{this.sz($node.height())}</div>,
      attributes: {},
      mountNode: this.containerRef
    })
    $(dom).css({
      position: 'absolute',
      top: `${top + $node.height() / 2}px`,
      left: `${left + $node.width() + scaleGapPx}px`,
      transform: `translate(0%, -50%)`
    })
  }

  renderPixelDist() {
    const { selectedNode, ruleNode } = this.runtime
    if (selectedNode && ruleNode && selectedNode !== ruleNode) {
      const $selectedNode = $(selectedNode)
      const $ruleNode = $(ruleNode)

      this.scaleHeight.close()
      this.scaleWidth.close()

      this.scaleLeft.close()
      this.scaleBottom.close()
      this.scaleTop.close()
      this.scaleRight.close()

      const { paddingLeft, paddingRight, paddingTop, paddingBottom } = padding(ruleNode, selectedNode) || {}

      const selPos = this.pos($selectedNode)
      const rulePos = this.pos($ruleNode)

      const leftDist = paddingLeft > 0 ? paddingLeft : selPos.left - rulePos.left - $ruleNode.width() - 1
      const rightDist = paddingRight > 0 ? paddingRight : rulePos.left - selPos.left - $selectedNode.width() - 1
      const topDist = paddingTop > 0 ? paddingTop : selPos.top - rulePos.top - $ruleNode.height() - 1
      const bottomDist = paddingBottom > 0 ? paddingBottom : rulePos.top - selPos.top - $selectedNode.height() - 1

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

        $(dom).css({
          top: selPos.top + $selectedNode.height() / 2,
          height: 1,
          left: selPos.left - leftDist,
          width: leftDist - 1
        })
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
              {this.sz(rightDist - 1)}
            </div>
          ),
          attributes: {
            className: c('scale-line', 'scale-line-v')
          },
          mountNode: this.containerRef
        })

        $(dom).css({
          top: selPos.top + $selectedNode.height() / 2,
          height: 1,
          left: selPos.left + $selectedNode.width() + 1,
          width: rightDist
        })
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

        $(dom).css({
          top: selPos.top - topDist,
          height: topDist - 1,
          left: selPos.left + $selectedNode.width() / 2,
          width: 1
        })
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
              {this.sz(bottomDist - 1)}
            </div>
          ),
          attributes: {
            className: c('scale-line', 'scale-line-h')
          },
          mountNode: this.containerRef
        })

        $(dom).css({
          top: selPos.top + $selectedNode.height() + 1,
          height: bottomDist,
          left: selPos.left + $selectedNode.width() / 2,
          width: 1
        })
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
      $(this.rulesRef).show()
      $(this.lRuleRef).css({
        left
      })

      // todo ??
      $(this.rRuleRef).css({
        left: left + $(target).width()
      })
      $(this.tRuleRef).css({
        top
      })
      $(this.bRuleRef).css({
        top: top + $(target).height()
      })

      $(this.boxRuleRef).css({
        left,
        width: $(target).width() - 1,
        top,
        height: $(target).height() - 1
      })

      this.runtime.ruleNode = target
    }
  }

  handleLayerMouseOut = ({ target }) => {
    if (isNodeContains(target)) {
      if (this.runtime.ruleNode === target) {
        $(this.rulesRef).hide()
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
      this.scaleLeft.close()
      this.scaleBottom.close()
      this.scaleTop.close()
      this.scaleRight.close()

      this.renderPixelSize()

      if (this.runtime.selectedNode === this.runtime.ruleNode) {
        $(this.rulesRef).hide()
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
      const $t = $(target)
      $(dom).css({
        position: 'absolute',
        pointerEvents: 'none',
        ...this.pos($t),
        width: $t.width(),
        height: $t.height()
      })
    }
  }

  update() {}

  render() {
    let { html, children, className } = this.props

    const props = {}
    if (typeof html === 'string') {
      props.dangerouslySetInnerHTML = {
        __html: html
      }
      children = undefined
    }
    return (
      <div ref={r => (this.containerRef = r)} className={cn(c('container'), className)}>
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
        <div ref={r => (this.rulesRef = r)} className={c('rules')}>
          <div ref={r => (this.lRuleRef = r)} className={c('rule-l', 'rule')} />
          <div ref={r => (this.rRuleRef = r)} className={c('rule-r', 'rule')} />
          <div ref={r => (this.tRuleRef = r)} className={c('rule-t', 'rule')} />
          <div ref={r => (this.bRuleRef = r)} className={c('rule-b', 'rule')} />
          <div ref={r => (this.boxRuleRef = r)} className={c('rule-box')} />
        </div>
      </div>
    )
  }
}
