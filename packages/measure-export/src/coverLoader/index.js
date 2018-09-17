/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/15
 *
 */
const nps = require('path')
const concat = require('concat-stream')
const PSD = require('@moyuyc/psd')
// psd-html

function loader(buffer) {
  const psd = new PSD(buffer)
  psd.parse()
  return new Promise((resolve, reject) => {
    psd.image
      .toPng()
      .pack()
      .pipe(
        concat(function(buffer) {
          resolve(buffer)
        })
      )
      .on('error', reject)
  })
}

module.exports = loader
module.exports.raw = true
