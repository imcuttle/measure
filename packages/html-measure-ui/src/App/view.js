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

const cn = p('')
const c = p('hm-app__')

export default class App extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }
  static defaultProps = {}
  render() {
    const { className, ...props } = this.props

    return (
      <div className={cn(c('container'), className)}>
        {h(this.local.header, { className: c('header') })}

        <div className={c('stage')}>{h(this.local.inforBar, c('infor-bar'))}</div>
      </div>
    )
  }
}
