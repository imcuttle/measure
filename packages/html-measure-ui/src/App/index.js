/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */

import { Root, bindView, observable, symbolicLink, storageSync } from 'react-mobx-vm'
import { i18n } from '../i18n'
import View from './view'
import Header from '../Header'
import InforBar from '../InforBar'

import { sz } from 'html-measure'

@bindView(View)
export default class App extends Root {
  sz = pixel => {
    return sz(pixel, this.header)
  }

  clr = color => {
    // ;['auto', 'hex.argb', 'hex.rgb,a', 'rgb,a', 'argb']
    return color
  }

  header = Header.create()
  inforBar = InforBar.create({
    clr: this.clr,
    sz: this.sz,
    title: 'title',
    position: {
      x: 100,
      y: 200
    },
    size: {
      width: 100,
      height: 200
    },
    opacity: 1,
    radius: 4,
    color: '#fff',
    font: {
      family: 'MISSD',
      color: 'rgba(0,0,0,123)',
      size: 20,
      gap: 10,
      lineHeight: 20,
      content: '是撒多少'
    }
  })
}
