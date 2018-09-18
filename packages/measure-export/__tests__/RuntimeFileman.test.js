'use strict'

const RuntimeFileman = require('../src/RuntimeFileman')
const nps = require('path')
const fs = require('fs')

const runtimePath = nps.join(__dirname, '../runtime')

describe('measure-export#RuntimeFileman', () => {
  let rt
  beforeEach(function() {
    rt = new RuntimeFileman('chunk')
  })
  afterEach(function() {
    return rt.clear()
  })
  // measureExport
  it('filename', function() {
    expect(rt.filename()).toBe(nps.join(runtimePath, 'chunk'))
  })

  it('mkdir', function(done) {
    rt.mkdir('lala/ww').then(function() {
      expect(fs.existsSync(nps.join(runtimePath, 'chunk/lala/ww'))).toBeTruthy()
      done()
    })
  })

  it('write', function(done) {
    rt.write('lala/ww', 'qiaonima').then(function(filename) {
      expect(filename).toBe(nps.join(runtimePath, 'chunk/lala/ww'))
      expect(fs.readFileSync(nps.join(runtimePath, 'chunk/lala/ww'))).toEqual(new Buffer('qiaonima'))
      done()
    })
  })

  it('clear', function(done) {
    rt.write('lala/ww', 'qiaonima').then(function(filename) {
      expect(filename).toBe(nps.join(runtimePath, 'chunk/lala/ww'))
      rt.clear()
      expect(fs.existsSync(nps.join(runtimePath, 'chunk/lala/ww'))).toBeFalsy()
      done()
    })
  })

})
