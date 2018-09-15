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
import Navigation from '../Navigation'
import { PSD_DISABLED } from '../const'

import { psdToHtmlFromURL, psdToHtmlFromBuffer } from 'psd-to-html'
import * as nps from 'path'
import HM from 'html-measure'
import * as ReactDOM from 'react-dom'
import { toJS } from 'mobx'
import Clr from 'color'

@bindView(View)
export default class App extends Root {
  sz = (pixel, opt) => {
    return HM.sz(toJS(pixel), { ...this.toJSON(), ...opt })
  }

  clr = (color, clrType = this.color) => {
    const c = Clr(toJS(color))
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

  init() {
    this.scrollIntoView()
  }

  @reaction('html')
  scrollIntoView() {
    setTimeout(() => {
      const node = ReactDOM.findDOMNode(this.hmRef)
      node && node.scrollIntoView()
    })
  }

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

  @observable
  html = ''
  @observable
  isLoading = false
  @observable
  error = ''

  navi = Navigation.create()
  header = Header.create()
  inforBar = InforBar.create({
    clr: this.clr,
    sz: this.sz
  })

  import(files) {
    let tasks = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = nps.extname(file.name).toLowerCase()
      if (['.html', '.htm', '.svg'].includes(ext)) {
        tasks.push(() => {
          return new Promise((resolve, reject) => {
            let fr = new FileReader()
            fr.readAsText(file, 'utf8')
            fr.onload = evt => {
              this.navi.pages.push({
                title: file.name,
                html: fr.result
              })
              resolve()
            }
            fr.onerror = reject
          })
        })
      }

      if (!PSD_DISABLED && ['.psd'].includes(ext)) {
        tasks.push(() => {
          return new Promise((resolve, reject) => {
            let fr = new FileReader()
            fr.readAsArrayBuffer(file)
            fr.onload = evt => {
              psdToHtmlFromBuffer(new Uint8Array(fr.result))
                .then(html => {
                  this.navi.pages.push({
                    title: file.name,
                    html
                  })
                })
                .then(resolve)
                .catch(reject)
            }
            fr.onerror = reject
          })
        })
      }
    }

    return Promise.all(tasks.map(execable => execable()))
  }
}
