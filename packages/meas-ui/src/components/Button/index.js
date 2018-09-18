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
const c = p('hm-button__')

export default class Checkbox extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['primary'])
  }
  static defaultProps = {
    type: 'primary',
    size: 'normal'
  }

  render() {
    const { className, children, type, size, ...props } = this.props

    return (
      <button className={cn(c('container', `type-${type}`, `size-${size}`), className)} {...props}>
        {children}
      </button>
    )
  }
}
