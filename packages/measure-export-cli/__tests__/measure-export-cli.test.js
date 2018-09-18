'use strict'
const cli = require('gentle-cli')
const nps = require('path')
const fs = require('fs')
const globby = require('globby')
const os = require('os')
const rimraf = require('rimraf')

const cmd = require.resolve('..')
const fixturePath = nps.join(__dirname, 'fixtures')

const c = cli({ cwd: fixturePath, redirect: true })

describe('measure-export-cli', () => {
  it('build', function(done) {
    const tmp = nps.join(os.tmpdir(), String(Date.now()))
    jest.setTimeout(600000)
    console.log('cmd', cmd)
    console.log('tmp', tmp)
    c.use(`node ${cmd} build -d ${tmp}`).end(function(err, stdout, stderr) {
      expect(
        globby.sync(['**/*'], {
          cwd: tmp
        })
      ).toEqual(
        expect.arrayContaining([
          'index.html',
          'assets/7.style.css',
          'assets/example-cmyk.psd.js',
          'assets/example-greyscale.psd.js',
          'assets/example.psd.js',
          'assets/example16.psd.js',
          'assets/main.js',
          'assets/styles.js',
          'assets/vendors~main.js',
          'preview/example-cmyk.png',
          'preview/example-greyscale.png',
          'preview/example.png',
          'preview/example16.png',
          'assets/htmls/a.html.js',
          'assets/htmls/b.html.js'
        ])
      )
      rimraf.sync(tmp)
      done(err)
    })
  })
})
