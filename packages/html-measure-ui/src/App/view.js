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
  render() {
    const { className, onClickMeasureAbleNode } = this.props

    return (
      <div className={cn(c('container'), className)}>
        {h(this.local.header, { className: c('header') })}
        <div className={c('stage')}>
          <div className={c('playground')}>
            <HtmlMeasure
              onClickMeasureAbleNode={onClickMeasureAbleNode}
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
