'use strict'

const globby = require('globby')
const nps = require('path')
const Handlebars = require('handlebars')
const MyHandlebars = Handlebars.create()

module.exports = measureExport

function measureExport(root = process.cwd(), { psdDisabled = false, template = '', glob = ['**/*.psd'] } = {}) {
  root = nps.resolve(root)

  const tpl = MyHandlebars.compile(template)

  return globby(glob, {
    cwd: root
  }).then(paths => tpl({ paths }))
}

measureExport(nps.join(__dirname, '../..'), {
  glob: ['**']
}).then(console.log)
