'use strict'

const globby = require('globby')
const nps = require('path')
const Handlebars = require('handlebars')
const fs = require('fs')

const MyHandlebars = Handlebars.create()
const measureUIPath = require.resolve('measure-ui/dist/measure-ui.umd.js')
const measureUICssPath = require.resolve('measure-ui/dist/style.css')

// root/
//   index.html
//   resources/
//     psd
//     html
//     ...
//   assets/
//     measure-ui.js
//     measure-ui.css
//     ...
//

class MeasureExport {
  constructor(opts = {}) {
    this.opts = opts
  }

  initialize() {
    if (this.opts.actionType === 'build') {
    }
  }
}

function measureExport(
  root = process.cwd(),
  { psdDisabled = false, template = fs.readFileSync(nps.join(__dirname, '../template.hbs')), glob = ['**/*.psd'] } = {}
) {
  root = nps.resolve(root)

  const tpl = MyHandlebars.compile(template)

  return globby(glob, {
    cwd: root
  }).then(paths => tpl({ paths }))
}

measureExport(nps.join(__dirname, '../..'), {
  glob: ['**']
}).then(console.log)

module.exports = measureExport
