/**
 * @file to-html
 * @author Cuttle Cong
 * @date 2018/9/10
 *
 */
const h = require('hastscript')
const PSD = require('psd')
const fs = require('fs')
const { Writable, Transform } = require('stream')
const nps = require('path')

const isBrowser = !(
  typeof process === 'object' &&
  typeof process.versions === 'object' &&
  typeof process.versions.node !== 'undefined'
)

const visit = require('./tree-visit')

class Base64Transform extends Transform {
  constructor(options) {
    super(options)
  }

  _transform(chunk, encoding, callback) {
    callback(null, Buffer.from(chunk).toString('base64'))
  }
}

class CollectWritable extends Writable {
  constructor(collector, opts) {
    super({})
    this.body = []
    if (collector)
      this.on('finish', function() {
        const buf = Buffer.concat(this.body)
        if (opts.encoding) {
          return collector(buf.toString(opts.encoding))
        }
        collector(buf)
      })
  }

  _write(chunk, encoding, callback) {
    this.body.push(chunk)
    callback()
  }
}

function psdToHAST(psd, { unit = 'px', remStandard = 16 } = {}) {
  if (!psd.parsed) {
    psd.parse()
  }

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

  const root = tree.export()
  visit(
    root,
    (node, ctx) => {
      const { hasts } = ctx.state
      if (node === root) {
        return
      }
      // Skip the hidden node
      if (!node.visible) {
        return ctx.skip()
      }

      if (node.type === 'layer') {
        hasts.unshift(
          h(`div#${'psd-layer-' + hasts.length}.psd-layer`, {
            'data-psd-index': hasts.length,
            // 'data-psd-depth': ctx.depth,
            // 'data-psd-child-index': ctx.index,
            // 'data-psd-text': node.text ? JSON.stringify(node.text) : null,
            style: {
              opacity: node.opacity,
              width: size(node.width),
              height: size(node.height),
              left: size(node.left),
              top: size(node.top),
              position: 'absolute'
            }
          })
        )
      }
    },
    {
      path: 'children',
      order: 'pre',
      skipVisited: false,
      // hast
      state
    }
  )

  let b64encodedPromise
  if (!isBrowser) {
    b64encodedPromise = new Promise((resolve, reject) => {
      psd.image
        .toPng()
        .pack()
        .pipe(new CollectWritable(b64 => resolve(`data:image/png;base64,${b64}`), { encoding: 'base64' }))
        .on('error', reject)
    })
  } else {
    b64encodedPromise = Promise.resolve(psd.image.toBase64())
  }

  return b64encodedPromise.then(b64encoded => {
    return h(
      'div#psd-root',
      {
        'data-html-measurable-exclude': true,
        style: {
          'background-image': `url(${b64encoded})`,
          position: 'relative',
          width: size(root.document.width),
          height: size(root.document.height)
        }
      },
      state.hasts
    )
  })
}

function psdToHASTFormBuffer(buffer, opts) {
  const psd = new PSD(buffer)
  return psdToHAST(psd, opts)
}

function psdToHASTFromPath(psdPath, opts) {
  return psdToHASTFormBuffer(fs.readFileSync(nps.resolve(psdPath)), opts)
}

module.exports = {
  psdToHAST,
  psdToHASTFormBuffer,
  psdToHASTFromPath
}
