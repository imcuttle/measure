/**
 * @file index
 * @author imcuttle
 * @description
 */

import * as React from 'react'
import PropTypes from 'prop-types'
import p from 'prefix-classname'
import Select, { createFilter } from '../components/Select'
import Input from '../components/Input'
import Checkbox from '../components/Checkbox'

import { i18n } from '../i18n'

import './style.less'

const cn = p('')
const c = p('hm-header__')

export default class Header extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }
  static defaultProps = {}
  render() {
    const { className, ...props } = this.props
    const {
      zoom,
      numberFixedOptions,
      numberFixed,
      unitOptions,
      isShowUnit,
      unit,
      remStandardPx,
      color,
      colorOptions
    } = this.local

    return (
      <div className={cn(c('container'), className)}>
        <Select
          className={c('unit', 'item')}
          isSearchAble={false}
          options={unitOptions}
          value={unit}
          placeholder={i18n('unit.placeholder')}
          onChange={v => this.local.setValue('unit', v)}
        />
        {unit === 'rem' && (
          <Input
            onChange={evt => this.local.setValue('remStandardPx', evt.target.value)}
            className={c('rem-standard', 'item')}
            type={'number'}
            value={remStandardPx}
          />
        )}
        <Select
          name="color"
          className={c('color', 'item')}
          onChange={color => {
            this.local.setValue('color', color)
          }}
          placeholder={i18n('color.placeholder')}
          value={color}
          options={colorOptions}
        />

        <label className={c('item', 'checkbox-wrapper')}>
          <Checkbox
            checked={isShowUnit}
            onChange={e => {
              this.local.setValue('isShowUnit', e.target.checked)
            }}
          />
          <span>{' ' + i18n('unit.label')}</span>
        </label>

        <Select
          name="number-fixed"
          className={c('number-fixed', 'item')}
          onChange={fixed => {
            this.local.setValue('numberFixed', fixed)
          }}
          placeholder={i18n('number-fixed.placeholder')}
          value={numberFixed}
          options={numberFixedOptions}
        />

        <div className={c('zoom', 'item')}>
          <span
            className={c('zoom-out', 'zoom-btn', {
              'zoom-disabled': zoom <= 0.25
            })}
            onClick={zoom <= 0.25 ? null : () => this.local.updateZoom(-0.25)}
          />
          <span className={c('zoom-input-wrapper')}>
            <Input
              className={c('zoom-input')}
              value={(zoom * 100).toFixed(0)}
              onChange={evt => this.local.setValue('zoom', evt.target.value / 100)}
            />
            <span className={c('zoom-suffix')}>%</span>
          </span>
          <span className={c('zoom-in', 'zoom-btn')} onClick={() => this.local.updateZoom(0.25)} />
        </div>
      </div>
    )
  }
}
