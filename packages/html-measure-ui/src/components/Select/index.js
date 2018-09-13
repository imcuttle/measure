/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import p from 'prefix-classname'
import RSelect, { createFilter } from 'react-select'

import './style.less'

export * from 'react-select'

const cn = p('')
const c = p('hm-select__')

export default class Select extends React.PureComponent {
  static propTypes = {
    ...RSelect.propTypes
  }
  static defaultProps = {}

  render() {
    const { className, value, options, onChange, ...props } = this.props
    const matchedVal = (options || []).find(x => x.value === value)
    return (
      <RSelect
        isSearchable
        onChange={(ent, type) => {
          return onChange && onChange(ent.value, type)
        }}
        value={matchedVal}
        options={options}
        filterOption={createFilter({
          ignoreCase: true,
          ignoreAccents: true,
          trim: true,
          matchFromStart: true
        })}
        className={cn(className, c('container'))}
        classNamePrefix={'hm-select'}
        {...props}
      />
    )
  }
}
