/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */

import React from 'react'
import PropTypes from 'prop-types'

import p from 'prefix-classname'

import './style.less'

const cn = p('')
const c = p('hm-input__')

export default class Input extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }
  static defaultProps = {}

  render() {
    const { className, ...props } = this.props

    return <input className={cn(c('container'), className)} {...props} />
  }
}
