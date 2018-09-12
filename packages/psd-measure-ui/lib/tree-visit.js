/**
 * @file psd-tree-visitor
 * @author Cuttle Cong
 * @date 2018/9/10
 *
 */

const crawl = require('tree-crawl')
const get = require('lodash.get')
const set = require('lodash.set')
const unset = require('lodash.unset')

function toArray(data) {
  if (!Array.isArray(data)) {
    return [data]
  }
  return data
}

function proxy(ctx, path, getNewDescriptor) {
  const old = ctx[path]

  const host = ctx.hasOwnProperty(path) ? ctx : Object.getPrototypeOf(ctx)

  Object.defineProperty(host, path, {
    ...Object.getOwnPropertyDescriptor(host, path),
    ...getNewDescriptor(old)
  })
  return ctx
}

const symbol = typeof Symbol === 'function' ? Symbol('override') : '__override__'
const childrenIsNotArraySymbol =
  typeof Symbol === 'function' ? Symbol('childrenIsNotArraySymbol') : '__childrenIsNotArraySymbol__'

function visit(tree, visitor = () => {}, opts = {}) {
  const { path = 'children', skipVisited = true, uniquePath = null, state } = opts

  const getUniq = typeof uniquePath === 'string' ? get(uniquePath, uniquePath) : v => v
  const childrenIsNotArrayMap = new Map()

  crawl(
    tree,
    function(node, ctx) {
      if (!ctx[symbol]) {
        ctx.state = state
        proxy(ctx.cursor, 'track', () => {
          return {
            value: new Map()
          }
        })
        proxy(ctx, 'remove', oldRemove => {
          return {
            value: function remove() {
              const children = get(this.parent, path)
              if (!Array.isArray(children)) {
                unset(this.parent, path)
              } else {
                children.splice(this.index, 1)
              }
              return oldRemove.apply(this, arguments)
            }
          }
        })

        proxy(ctx, 'replace', oldReplace => {
          return {
            value: function replace(node) {
              const children = get(this.parent, path)
              if (!Array.isArray(children)) {
                set(this.parent, path, node)
              } else {
                children[this.index] = node
              }
              return oldReplace.apply(this, arguments)
            }
          }
        })

        Object.defineProperty(ctx, symbol, {
          enumerable: false,
          value: true
        })
      }

      const { track } = ctx.cursor

      const uniqKey = getUniq(node)
      const visitedStatus = track.get(uniqKey)
      if (skipVisited && visitedStatus === 'visited') {
        ctx.skip()
        return
      }
      track.set(uniqKey, 'visiting')
      const rlt = visitor(node, ctx)
      track.set(uniqKey, 'visited')
      return rlt
    },
    {
      getChildren: node => {
        const children = get(node, path)
        return children != null ? toArray(children) : children
      },
      order: opts.order
    }
  )
}

module.exports = visit
