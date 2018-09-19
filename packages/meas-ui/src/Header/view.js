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
import Button from '../components/Button'
import Checkbox from '../components/Checkbox'

import getPsdToHtml from '../getPsdToHtml'
import { upload } from '../utils'

import { i18n } from '../i18n'

import './style.less'

const cn = p('')
const c = p('hm-header__')

export default class Header extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }
  static defaultProps = {}

  handleKeyDown = evt => {
    if (evt.metaKey || evt.ctrlKey) {
      switch (evt.keyCode) {
        // +
        case 187:
          this.local.updateZoom(+0.1)
          evt.preventDefault()
          break
        // -
        case 189:
          this.local.updateZoom(-0.1)
          evt.preventDefault()
          break
      }
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

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
      logo,
      color,
      colorOptions,
      language,
      langOptions
    } = this.local

    return (
      <div className={cn(c('container'), className)}>
        <div className={c('left')}>
          {logo && <div className={c('logo')}>{logo}</div>}
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
            options={[
              {
                label: i18n('color.label.auto'),
                value: 'auto'
              },
              {
                label: i18n('color.label.hex.argb'),
                value: 'hex.argb'
              },
              {
                label: i18n('color.label.hex.rgb,a'),
                value: 'hex.rgb,a'
              },
              {
                label: i18n('color.label.rgb,a'),
                value: 'rgb,a'
              },
              {
                label: i18n('color.label.argb'),
                value: 'argb'
              }
            ]}
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
            options={[
              {
                label: i18n('number-fixed.label.integer'),
                value: 0
              },
              {
                label: i18n('number-fixed.label.one-pos-decimals'),
                value: 1
              },
              {
                label: i18n('number-fixed.label.two-pos-decimals'),
                value: 2
              },
              {
                label: i18n('number-fixed.label.three-pos-decimals'),
                value: 3
              }
            ]}
          />

          <div className={c('zoom', 'item')}>
            <span
              title={'Ctrl - / Cmd -'}
              className={c('zoom-out', 'zoom-btn', {
                'zoom-disabled': zoom <= 0.25
              })}
              onClick={zoom <= 0.25 ? null : () => this.local.updateZoom(-0.25)}
            />
            <span className={c('zoom-input-wrapper')}>
              <Input
                className={c('zoom-input')}
                value={(zoom * 100).toFixed(0)}
                onChange={evt => {
                  this.local.setValue('zoom', evt.target.value / 100)
                }}
              />
              <span className={c('zoom-suffix')}>%</span>
            </span>
            <span title={'Ctrl + / Cmd +'} className={c('zoom-in', 'zoom-btn')} onClick={() => this.local.updateZoom(0.25)} />
          </div>
        </div>
        <div className={c('right')}>
          <Button
            title={
              !!getPsdToHtml()
                ? i18n('header.btn.import.placeholder.psd')
                : i18n('header.btn.import.placeholder.no-psd')
            }
            onClick={() => {
              upload({
                onChange: evt => {
                  this.local.import(evt.target.files)
                },
                multiple: true,
                accept: '.psd,.PSD,.htm,.HTM,.html,.HTML,.svg,.SVG'
              })
            }}
            className={c('item')}
          >
            <input type="file" style={{ display: 'none' }} />
            {i18n('header.btn.import')}
          </Button>
          <Select
            name="language"
            className={c('language', 'item')}
            onChange={language => {
              this.local.setValue('language', language)
            }}
            placeholder={'Language/语言'}
            value={language}
            options={langOptions}
          />

          <a
            href={'https://github.com/imcuttle/measure'}
            title={'Github'}
            target={'_blank'}
            className={c('gh', 'item')}
          />
        </div>
      </div>
    )
  }
}
