/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import RCheckbox from 'rc-checkbox'

import p from 'prefix-classname'

import './style.less'

const cn = p('')
const c = p('hm-checkbox__')

export default class Checkbox extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    ...RCheckbox.propTypes
  }
  static defaultProps = {}

  render() {
    const { className, ...props } = this.props

    return <RCheckbox className={cn(c('container'), className)} {...props} />
  }
}
