/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */

import { Root, bindView, observable, reaction, Symbolic, symbolicLink, storageSync } from 'react-mobx-vm'
import { i18n } from '../i18n'
import View from './view'
import Header from '../Header'
import InforBar from '../InforBar'

import { sz } from 'html-measure'
import Clr from 'color'

@bindView(View)
export default class App extends Root {
  sz = (pixel, opt) => {
    return sz(pixel, { ...this.toJSON(), ...opt })
  }

  clr = (color, clrType = this.color) => {
    const c = Clr(color)
    switch (clrType) {
      case 'auto': {
        if (c.alpha() !== 1) {
          return c.string().toLowerCase()
        }
        return c.hex().toLowerCase()
      }
      case 'hex.argb':
        return `#${Number(c.alpha() * 255)
          .toString(16)
          .padStart(2, 'f')}${c.hex().slice(1)}`.toLowerCase()
      case 'hex.rgb,a':
        return `${c.hex()}, ${c.alpha()}`.toLowerCase()
      case 'rgb,a':
        return c.string().toLowerCase()
      case 'argb':
        const o = c.object()
        if (!('alpha' in o)) {
          o.alpha = 1
        }
        return `argb(${o.alpha * 255}, ${o.r}, ${o.g}, ${o.b}})`
      default:
        return color
    }
    // ;['auto', 'hex.argb', 'hex.rgb,a', 'rgb,a', 'argb']
  }

  hmRef = null

  constructor(props) {
    super(props)
    symbolicLink(this, {
      unit: Symbolic(this.header, 'unit'),
      remStandardPx: Symbolic(this.header, 'remStandardPx'),
      zoom: Symbolic(this.header, 'zoom'),
      numberFixed: Symbolic(this.header, 'numberFixed'),
      isShowUnit: Symbolic(this.header, 'isShowUnit'),
      color: Symbolic(this.header, 'color')
    })
  }

  header = Header.create()
  inforBar = InforBar.create({
    clr: this.clr,
    sz: this.sz
  })
}
