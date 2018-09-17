'use strict'
const cli = require('gentle-cli')
const nps = require('path')
const fs = require('fs')

const cmd = require.resolve('..')
const fixturePath = nps.join(__dirname, 'fixtures')

const c = cli({ cwd: fixturePath, redirect: true })

describe('measure-export-cli', () => {
  it('build', function(done) {
    jest.setTimeout(60000)
    c.use(`node ${cmd} build -v`)
      .end(function (err, stdout, stderr) {
        console.log(stdout, stderr)
        done()
      })
  })
})
