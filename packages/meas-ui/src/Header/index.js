/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */

import { Root, bindView, action, observable, storageSync, reaction, autorun } from 'react-mobx-vm'
import View from './view'
import { i18n, setLanguage, getCurrentLanguage } from '../i18n'

@bindView(View)
export default class Header extends Root {
  import(files) {}

  @observable
  langOptions = [
    {
      label: 'English',
      value: 'en-us'
    },
    {
      label: '中文',
      value: 'zh-cn'
    }
  ]

  @storageSync
  @observable language = getCurrentLanguage()

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

  @storageSync
  @observable
  unit = 'rem'

  @storageSync
  @observable
  remStandardPx = 16

  @storageSync
  @observable
  color = 'auto'

  @storageSync
  @observable
  isShowUnit = true

  @observable
  logo = 'Measure UI'

  @storageSync
  @observable
  numberFixed = 1

  // todo fit?
  @storageSync
  @observable
  zoom = 0.5

  @action
  updateZoom(delta = 0) {
    this.zoom += delta
  }
}
