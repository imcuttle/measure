/**
 * @file to-html
 * @author Cuttle Cong
 * @date 2018/9/10
 *
 */
const h = require('hastscript')
const PSD = require('@moyuyc/psd')
const get = require('lodash.get')
const visit = require('@moyuyc/walk-tree')

const psdUtils = require('./psd-utils')

function assert(check, ...argv) {
  if (!check) {
    console.error(`Error: [psd-html](psd-to-hast):`, ...argv)
  }
}

const isBrowser = process.env.RUN_ENV === 'browser'

const toBase64P = isBrowser ? psd => Promise.resolve(psd.image.toBase64()) : require('./psd-to-base64.node')

class Sep {
  constructor() {
    this.list = []
  }
  push(task) {
    this.list.push(task)
  }
  run() {
    let p = Promise.resolve()
    this.list.forEach(task => {
      p = p.then(task)
    })
    return p
  }
}

function psdToHAST(psd, { unit = 'px', remStandard = 16, imageSplit = false, injectImage = true } = {}) {
  psd.parse()

  const size = px => {
    if (unit === 'rem') {
      px = px / remStandard
    }
    return `${px}${unit}`
  }

  const tree = psd.tree()
  const state = {
    hasts: []
  }

  const tasks = new Sep()
  visit(
    tree,
    (node, ctx) => {
      const { hasts } = ctx.state
      if (node === tree) {
        return
      }
      // Skip the hidden node
      if (!node.visible()) {
        return ctx.skip()
      }

      if (node.type === 'layer') {
        // Get radius https://github.com/layervault/psd.rb/issues/60
        // https://github.com/meltingice/psd.js/issues/83
        // https://github.com/meltingice/psd.js/issues/107
        // Spec https://www.tonton-pixel.com/Photoshop%20Additional%20File%20Formats/styles-file-format.html
        const data = {}
        const overwriteStyle = {}

        const vectorOrigination = node.get('vectorOrigination')
        const vectorStrokeContent = node.get('vectorStrokeContent')
        const vectorStroke = node.get('vectorStroke')
        const objectEffects = node.get('objectEffects')
        const solidColor = node.get('solidColor')

        // Drop Shadow
        if (objectEffects && objectEffects.data && objectEffects.data.DrSh && objectEffects.data.DrSh.enab) {
          const DrSh = objectEffects.data.DrSh
          const d = psdUtils.dropShadowToStyle({
            dist: DrSh['Dstn'],
            color: DrSh['Clr'],
            spread: DrSh['Ckmt'],
            size: DrSh['blur'],
            angle: DrSh['lagl'],
            opct: DrSh['Opct']
          })
          Object.assign(data, {
            'data-box-shadow-offset-x': d.offsetX,
            'data-box-shadow-offset-y': d.offsetY,
            'data-box-shadow-blur-radius': d.blurRadius,
            'data-box-shadow-spread-radius': d.spreadRadius,
            'data-box-shadow-color': d.color
          })
        }

        const keyDescriptorList = get(vectorOrigination, 'data.keyDescriptorList')
        if (keyDescriptorList && keyDescriptorList[0]) {
          const { keyOriginRRectRadii, keyOriginShapeBBox, keyShapeInvalidated } = keyDescriptorList[0]
          if (keyOriginRRectRadii) {
            Object.assign(data, {
              'data-radius-bottom-left': keyOriginRRectRadii.bottomLeft && keyOriginRRectRadii.bottomLeft.value,
              'data-radius-bottom-right': keyOriginRRectRadii.bottomRight && keyOriginRRectRadii.bottomRight.value,
              'data-radius-top-left': keyOriginRRectRadii.topLeft && keyOriginRRectRadii.topLeft.value,
              'data-radius-top-right': keyOriginRRectRadii.topRight && keyOriginRRectRadii.topRight.value
            })
          }

          // Fix size and position
          if (keyOriginShapeBBox && !keyShapeInvalidated) {
            Object.assign(overwriteStyle, {
              left: size(psdUtils.val(keyOriginShapeBBox['Left'])),
              top: size(psdUtils.val(keyOriginShapeBBox['Top '])),
              width: size(psdUtils.val(keyOriginShapeBBox['Rght']) - psdUtils.val(keyOriginShapeBBox['Left'])),
              height: size(psdUtils.val(keyOriginShapeBBox['Btom']) - psdUtils.val(keyOriginShapeBBox['Top ']))
            })
          }
        }

        const bgColor = solidColor
          ? JSON.stringify(solidColor.color())
          : vectorStrokeContent && psdUtils.clr(vectorStrokeContent.data['Clr '])
        Object.assign(data, {
          'data-solid-color': bgColor
        })

        if (vectorStroke && vectorStroke.data && vectorStroke.data.strokeEnabled) {
          const {
            strokeStyleContent,
            strokeStyleLineDashOffset,
            strokeStyleOpacity,
            strokeStyleLineWidth,
            strokeStyleLineAlignment,
            strokeStyleLineDashSet
          } = vectorStroke.data

          const borderColor =
            strokeStyleContent && psdUtils.clr(strokeStyleContent['Clr '], psdUtils.val(strokeStyleOpacity))
          const dashOffset = psdUtils.val(strokeStyleLineDashOffset)
          const lineWidth = psdUtils.val(strokeStyleLineWidth)
          const lineAlign = psdUtils.val(strokeStyleLineAlignment)

          Object.assign(data, {
            'data-stroke-dash-offset': dashOffset,
            'data-stroke-color': borderColor,
            'data-stroke-line-width': lineWidth,
            'data-stroke-line-align': lineAlign
          })
        }

        const exported = node.export()
        if (exported.text) {
          const text = exported.text
          Object.assign(data, {
            'data-content': text.value
          })
          if (text.font) {
            let {
              sizes = [],
              names,
              leading = [],
              alignment = [],
              styles = [],
              colors = [],
              lengthArray = [],
              weights = [],
              textDecoration = []
            } = text.font

            // TODO: Fix font size by default temporarily
            if (lengthArray.length > sizes.length && sizes.length === 0) {
              const StyleSheetData = get(
                node.get('typeTool'),
                'obj.engineData.ResourceDict.StyleSheetSet.StyleSheetData'
              )
              if (StyleSheetData && StyleSheetData[0]) {
                sizes = new Array(lengthArray.length).fill(StyleSheetData[0].FontSize)
              }
            }

            Object.assign(data, {
              'data-font-length-array': names ? JSON.stringify(lengthArray) : null,
              'data-font-family': names ? JSON.stringify(names) : null,
              'data-text-align': JSON.stringify(alignment),
              'data-font-colors': JSON.stringify(colors),
              'data-font-leading': JSON.stringify(leading),
              'data-font-sizes': JSON.stringify(sizes),
              'data-text-decoration': JSON.stringify(textDecoration),
              'data-font-weights': JSON.stringify(weights)
            })
          }
        }

        tasks.push(function() {
          const p = injectImage
            ? imageSplit
              ? toBase64P(node.layer).then(b64encoded => `url(${b64encoded})`)
              : Promise.resolve(null)
            : Promise.resolve(null)
          return p.then(img => {
            const style = {
              opacity: exported.opacity,
              width: size(exported.width),
              height: size(exported.height),
              left: size(exported.left),
              top: size(exported.top),
              position: 'absolute',
              ...overwriteStyle
            }
            if (img) {
              style['background-image'] = img
            }
            hasts.unshift(
              h(
                `div.psd-layer`,
                Object.assign(
                  {
                    'data-psd-index': hasts.length,
                    'data-title': exported.name,
                    style
                  },
                  data
                )
              )
            )
          })
        })
      }
    },
    {
      path: '_children',
      order: 'pre',
      skipVisited: false,
      // hast
      state
    }
  )

  return tasks.run().then(() => {
    let b64encodedPromise = injectImage
      ? imageSplit
        ? Promise.resolve(null)
        : toBase64P(psd).then(b64encoded => `url(${b64encoded})`)
      : Promise.resolve(null)
    return b64encodedPromise.then(b64encoded => {
      const style = {
        position: 'relative',
        width: size(tree.width),
        height: size(tree.height)
      }
      if (b64encoded) {
        style['background-image'] = b64encoded
      }
      return h(
        'div#psd-root',
        {
          'data-hm-exclude': true,
          style
        },
        state.hasts
      )
    })
  })
}

function psdToHASTFromBuffer(buffer, opts) {
  const psd = new PSD(buffer)
  return psdToHAST(psd, opts)
}

function psdToHASTFromPath(psdPath, opts) {
  return psdToHASTFromBuffer(require('fs').readFileSync(require('path').resolve(psdPath)), opts)
}

function psdToHASTFromURL(url, opts) {
  return PSD.fromURL(url).then(psd => psdToHAST(psd, opts))
}

module.exports =
  process.env.RUN_ENV === 'browser'
    ? {
        psdToHAST,
        psdToHASTFromBuffer,
        psdToHASTFromURL
      }
    : {
        psdToHAST,
        psdToHASTFromBuffer,
        psdToHASTFromPath
      }
