/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */

import { Root, bindView, action, observable, storageSync, autorun } from 'react-mobx-vm'
import View from './view'
import { i18n } from '../i18n'

@bindView(View)
export default class Header extends Root {
  @observable
  unitOptions = [
    {
      label: 'px',
      value: 'px'
    },
    {
      label: 'rem',
      value: 'rem'
    }
  ]
  @observable
  unit = 'rem'

  @observable
  remStandardPx = 16

  @observable
  colorOptions = [
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
  ]

  @storageSync
  @observable
  color = 'auto'

  @storageSync
  @observable
  isShowUnit = true

  @observable
  numberFixedOptions = [
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
  ]

  @storageSync
  @observable
  numberFixed = 1

  @observable
  zoom = 1

  @autorun
  detectZoom() {
    if (this.zoom <= 0) {
      this.zoom = 0.1
    }
  }

  @action
  updateZoom(delta = 0) {
    this.zoom += delta
  }
}
