/**
 * @file RuntimeFileman
 * @author Cuttle Cong
 * @date 2018/9/16
 *
 */
const nps = require('path')
const fs = require('fs')
const mkdir = require('mkdirp')
const pify = require('pify')
const rimraf = require('rimraf')

const runtimePath = nps.join(__dirname, '../runtime')

class RuntimeFileman {
  constructor(hash) {
    this.hash = hash
  }

  filename(name = '') {
    return nps.join(runtimePath, this.hash, name)
  }

  mkdir(name) {
    return pify(mkdir)(this.filename(name))
  }

  clear() {
    return pify(rimraf)(this.filename())
  }

  write(name, content) {
    return this.mkdir(nps.dirname(name)).then(() => {
      const filename = this.filename(name)
      return pify(fs.writeFile)(filename, content).then(() => filename)
    })
  }
}

module.exports = RuntimeFileman
