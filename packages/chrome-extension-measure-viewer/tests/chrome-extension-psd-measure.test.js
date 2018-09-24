'use strict'
const mm = require('micromatch')

describe('chrome-extension-psd-measure', () => {
  it('url match include', function () {
    expect(mm.some('www.baidu.com', ['www.baidu.com'], { matchBase: true })).toBeTruthy()

    expect(mm.some('www.baidu.com', ['www.baidu.com*'], { matchBase: true })).toBeTruthy()
    expect(mm.some('http://www.baidu.com/', ['*://www.baidu.com'], { matchBase: false })).toBeTruthy()
  })
})
