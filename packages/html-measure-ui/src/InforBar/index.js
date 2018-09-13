/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */

import { Root, bindView, observable, storageSync, action, List } from 'react-mobx-vm'
import View, { isEmpty } from './view'
import kebabcase from 'lodash.kebabcase'
import slug from 'slug'

export class Font extends Root {
  @observable
  family = ''
  @observable
  color = ''
  @observable
  size = ''
  @observable
  gap = ''
  @observable
  lineHeight = ''
  @observable
  content = ''
  @observable
  textDecoration = ''
  @observable
  weight = ''
  @observable
  align = ''
}

export class Size extends Root {
  @observable
  width = ''
  @observable
  height = ''
}

export class BoxShadow extends Root {
  @observable
  offsetX
  @observable
  offsetY
  @observable
  blurRadius
  @observable
  spreadRadius
  @observable
  color
}

export class Shadow extends Root {
  @observable
  outer = BoxShadow.create()
  @observable
  inner = BoxShadow.create()
}

export class Radius extends Root {
  @observable
  topLeft
  @observable
  topRight
  @observable
  bottomRight
  @observable
  bottomLeft
}

export class Position extends Root {
  @observable
  x = ''
  @observable
  y = ''
}

function cssText(obj) {
  let str = ''
  Object.keys(obj).forEach(name => {
    if (!isEmpty(obj[name]) && !!obj[name]) {
      str += `  ${name}: ${obj[name]};\n`
    }
  })
  return str
}

@bindView(View)
export default class InformationBar extends Root {
  sz(n) {
    return n
  }

  clr(clr) {
    return clr
  }

  @observable
  title = ''

  // property
  @observable
  position = Position.create()
  @observable
  size = Size.create()
  @observable
  opacity = 1
  @observable
  radius = Radius.create()

  @observable
  color = ''
  @observable
  content = ''

  // TODO: inner shadow
  @observable
  shadow = Shadow.create()

  @observable
  fonts = List.create([], Font)

  @observable
  exportImage

  @observable
  snippets = [
    {
      label: 'CSS',
      value: 'css',
      process: ({ title, opacity, size, shadow, fonts, radius, color, clr, sz }) => {
        let id = 1
        let _cr = c => clr(c, 'auto')
        let _sz = c => sz(c, { isShowUnit: true })

        let fontObjs = []
        if (fonts && fonts.length) {
          fontObjs = fonts.map(f => ({
            color: _cr(f.color),
            'font-family': f.family,
            'font-size': _sz(f.size),
            'font-weight': _sz(f.weight),
            'line-height': _sz(f.lineHeight),
            'text-decoration': f.textDecoration,
            'text-align': f.align
          }))
        }

        const radiusCss = radius => {
          if (isEmpty(radius)) {
            return ''
          }
          if (
            radius.topLeft === radius.topRight &&
            radius.topRight === radius.bottomRight &&
            radius.bottomRight === radius.bottomLeft
          ) {
            return _sz(radius.topLeft)
          }

          if (radius.topLeft === radius.bottomRight && radius.topRight === radius.bottomLeft) {
            return `${_sz(radius.topLeft)} ${_sz(radius.topRight)}`
          }

          if (radius.topRight === radius.bottomLeft) {
            return `${_sz(radius.topLeft)} ${_sz(radius.topRight)} ${_sz(radius.bottomRight)}`
          }

          return `${_sz(radius.topLeft)} ${_sz(radius.topRight)} ${_sz(radius.bottomRight)} ${_sz(radius.bottomLeft)}`
        }

        const obj = {
          width: size && size.width && _sz(size.width),
          height: size && size.height && _sz(size.height),
          'border-radius': radiusCss(radius),
          'box-shadow':
            shadow &&
            !isEmpty(shadow.outer) &&
            `${_sz(shadow.outer.offsetX)} ${_sz(shadow.outer.offsetY)} ${_sz(shadow.outer.blurRadius)} ${_sz(
              shadow.outer.spreadRadius
            )} ${_cr(shadow.outer.color) || ''}`,
          'background-color': _cr(color),
          opacity: opacity != 1 ? opacity : null
        }
        if (fontObjs[0]) {
          Object.assign(obj, fontObjs[0])
          fontObjs.splice(0, 1)
        }
        let baseCls = `.${kebabcase(slug(title)) || id++}`
        return (
          `${baseCls} {\n${cssText(obj)}}` +
          (fontObjs.length ? fontObjs.map(obj => `\n.${id++} {\n${cssText(obj)}}`).join('') : '')
        )
      }
    }
  ]

  @storageSync
  @observable
  snippetType = 'css'

  processSnippet() {
    const v = this.snippets.find(x => x.value === this.snippetType)
    if (v && v.process) {
      return v.process(this)
    }
    return ''
  }

  @action
  clear() {
    this.title = ''
    this.position = ''
    this.size = ''
    this.opacity = ''
    this.color = ''
    this.content = ''
    this.fonts = List.create([], Font)
    this.size = Size.create()
    this.position = Position.create()
    this.shadow = Shadow.create()
    this.radius = Radius.create()
  }
  // @observable color = ''
}
