/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 * @jest-environment node
 */
const nps = require('path')

const { psdToHASTFromPath } = require('../')

describe('psd-to-hast', function() {
  it('should psd-to-hast', function(done) {
    jest.setTimeout(50000)
    psdToHASTFromPath(nps.join(__dirname, './fixtures/example16.psd'), { imageSplit: false })
      .then(hast => {
        expect(hast.properties.style).toContain('background-image: url')
      })
      .then(done)
  })

  it('should psd-to-hast with imageSplit', function(done) {
    jest.setTimeout(50000)
    psdToHASTFromPath(nps.join(__dirname, './fixtures/example16.psd'), { imageSplit: true })
      .then(hast => {
        expect(hast.properties.style).toMatchInlineSnapshot(`"position: relative; width: 900px; height: 600px"`)
      })
      .then(done)
  })

  it('should psd-to-hast no image', function(done) {
    jest.setTimeout(50000)
    psdToHASTFromPath(nps.join(__dirname, './fixtures/example.psd'), { imageSplit: false, injectImage: false })
      .then(hast => {
        expect(hast.properties.style).toMatchInlineSnapshot(`"position: relative; width: 900px; height: 600px"`)
      })
      .then(done)
  })

  it('should psd-to-hast with cover image', function(done) {
    jest.setTimeout(50000)
    psdToHASTFromPath(nps.join(__dirname, './fixtures/example.psd'))
      .then(hast => {
        expect(hast.properties.style).toContain('background-image: url(data:image/png;base64,')
      })
      .then(done)
  })
})
