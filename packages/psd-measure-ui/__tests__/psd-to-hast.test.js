/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 * @jest-environment node
 */
const nps = require('path')
const toHtml = require('hast-util-to-html')
const fs = require('fs')
const { psdToHASTFromPath } = require('../lib/psd-to-hast')

describe('psd-to-hast', function() {
  it('should psd-to-hast', function(done) {
    jest.setTimeout(50000)
    psdToHASTFromPath(nps.join(__dirname, './fixtures/home.psd'))
      .then(hast => {
        fs.writeFileSync('./test.html', toHtml(hast, { entities: { escapeOnly: true } }))
      })
      .then(done)
  })
})
