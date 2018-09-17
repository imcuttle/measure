'use strict'

const measureExport = require('..')
const nps = require('path')
const fs = require('fs')

const fixturePath = nps.join(__dirname, 'fixtures')

describe('measure-export', () => {
  // measureExport
  it('getMiddlewares', function() {
    measureExport()
      .getMiddlewares()
      .then(({ dev, hot }) => {
        expect(dev).not.toBeNull()
        expect(hot).not.toBeNull()
      })
  })

  it('getMiddlewares when no hot', function() {
    measureExport({ hot: false })
      .getMiddlewares()
      .then(({ dev, hot }) => {
        expect(dev).not.toBeNull()
        expect(hot).toBeNull()
      })
  })

  it('hash', function () {
    const ms = measureExport({ context: fixturePath })
    const oldHash = ms.hash
    expect(oldHash).toEqual(ms.runtimeFm.hash)
    ms.actionType = 'abc'
    expect(ms.hash).not.toEqual(oldHash)
    expect(ms.hash).toEqual(ms.runtimeFm.hash)
  })

  it('_generatePages', function (done) {
    const ms = measureExport({ context: fixturePath })

    ms._generatePages().then(filename => {
      expect(filename).toBe(ms.runtimeFm.filename('pages.js'))
      expect(fs.existsSync(filename)).toBeTruthy()
      ms.quit()
      expect(fs.existsSync(filename)).toBeFalsy()
      done()
    })
  })
})
