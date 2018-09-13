/**
 * @file psd-utils
 * @author Cuttle Cong
 * @date 2018/9/13
 *
 */

import Clr from 'color'

// Spec https://www.tonton-pixel.com/Photoshop%20Additional%20File%20Formats/styles-file-format.html

export function clr(color, opacity) {
  let c
  if (color && color.class && typeof color.class.id === 'string') {
    switch (color.class.id.toLowerCase()) {
      case 'rgbc':
        c = Clr({ r: color['Rd  '], g: color['Grn '], b: color['Bl  '] })
        break
      case 'hsbc':
        c = Clr.hsl([color['H   '], color['Strt'], color['Brgh']])
        break
      case 'cmyc': // cmyk
        c = Clr.cmyk([color['Cyn '], color['Mgnt'], color['Ylw '], color['Blck']])
        break
      default:
        c = Clr(color)
    }
  } else {
    c = Clr(color)
  }

  if (opacity != null) {
    c = c.alpha(opacity / 100)
  }

  return c.string()
}

export function pxl(data) {
  if (data && data.hasOwnProperty('value')) {
    return data.value
  }
  return data
}

// http://www.melanieceraso.com/psd-to-css3/
// https://github.com/finanzcheck/drop-shadow-converter/blob/master/less/drop-shadow-converter.less
export function dropShadowToStyle({ dist, color, spread /* ckmt */, size /*blur*/, angle, opct } = {}) {
  angle = pxl(angle)
  dist = pxl(dist)
  spread = pxl(spread)
  size = pxl(size)
  opct = pxl(opct)

  angle = ((180 - angle) * Math.PI) / 180
  let offsetY = Math.round(Math.sin(angle) * dist)
  let offsetX = Math.round(Math.cos(angle) * dist)

  let spreadRadius = (size * spread) / 100
  let blurRadius = size - spreadRadius

  return {
    offsetX,
    offsetY,
    blurRadius,
    spreadRadius,
    color: clr(color, opct)
  }
}
