/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */

import { Root, bindView, observable, reaction, Symbolic, symbolicLink, storageSync } from 'react-mobx-vm'
import { i18n, setLanguage } from '../i18n'
import View from './view'
import Header from '../Header'
import InforBar from '../InforBar'
import Navigation from '../Navigation'
import getPsdToHtml from '../getPsdToHtml'

import * as nps from 'path'
import HM from 'html-measure'
import * as ReactDOM from 'react-dom'
import { toJS } from 'mobx'
import Clr from 'color'

@bindView(View)
export default class App extends Root {
  static i18n = require('../i18n')

  static isSupportPsd = () => !!getPsdToHtml()

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
  playgroundRef = null
  naviRef = null

  init() {
    this.scrollIntoView()
  }

  @reaction('html')
  scrollIntoView() {
    setTimeout(() => {
      // Scroll to center
      const node = ReactDOM.findDOMNode(this.hmRef)
      node && node.scrollIntoView()
      if (this.playgroundRef) {
        this.playgroundRef.scrollLeft = (this.canvasRef.scrollWidth - this.playgroundRef.clientWidth) >> 1
      }
    })
  }

  @observable
  isImporting = false

  import = files => {
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

      const toHtml = getPsdToHtml()
      if (toHtml && ['.psd'].includes(ext)) {
        tasks.push(() => {
          return new Promise((resolve, reject) => {
            const { psdToHtmlFromBuffer } = toHtml
            let fr = new FileReader()
            fr.readAsArrayBuffer(file)
            fr.onload = evt => {
              psdToHtmlFromBuffer(new Uint8Array(fr.result))
                .then(html => {
                  const img = $(html).css('background-image')
                  const stripedImage = img.replace(/url\((["'])?(.+)\1\)/, '$2')

                  this.navi.pages.push({
                    title: file.name,
                    cover: stripedImage,
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

    if (!tasks.length) {
      return Promise.resolve()
    }

    this.setValue('isImporting', true)
    return Promise.all(tasks.map(execable => execable()))
      .then((list) => {
        this.setValue('isImporting', false)
        $(ReactDOM.findDOMNode(this.naviRef)).scrollTop(9999999999)
      })
      .catch(err => {
        this.setValue('isImporting', false)
        $(ReactDOM.findDOMNode(this.naviRef)).scrollTop(9999999999)
        throw err
      })
  }

  constructor(props) {
    super(props)
    symbolicLink(this, {
      // language: Symbolic(this.header, 'language'),
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

  @storageSync
  @observable
  naviVisible = true

  @storageSync
  @observable
  headerVisible = true

  navi = Navigation.create()
  header = Header.create({
    import: this.import
  })
  inforBar = InforBar.create({
    clr: this.clr,
    sz: this.sz
  })
}
