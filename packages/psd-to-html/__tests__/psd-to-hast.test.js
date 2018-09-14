/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 * @jest-environment node
 */
const nps = require('path')

const { psdToHtmlFromPath } = require('../dist/psd-to-html.browser.cjs')

describe('psd-to-hast', function() {
  it('should psd-to-hast', function(done) {
    jest.setTimeout(50000)
    psdToHtmlFromPath(nps.join(__dirname, './fixtures/home.psd'), { imageSplit: false })
      .then(html => {
        console.log(html)
        // fs.writeFileSync('../../../psd-test.html', toHtml(hast, { entities: { escapeOnly: true } }))
      })
      .then(done)
  })
})
