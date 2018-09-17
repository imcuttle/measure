/**
 * @file psd-to-base64.browser
 * @author Cuttle Cong
 * @date 2018/9/14
 *
 */

const isBrowser = process.env.RUN_ENV === 'browser'

// Rollup tree shake treats some simple case, the case with dependent recursively failed
if (!isBrowser) {
  const { Writable, Transform } = require('stream')
  class Base64Transform extends Transform {
    constructor(options) {
      super(options)
    }

    _transform(chunk, encoding, callback) {
      callback(null, Buffer.from(chunk).toString('base64'))
    }
  }

  class CollectWritable extends Writable {
    constructor(collector, opts) {
      super({})
      this.body = []
      if (collector)
        this.on('finish', function() {
          const buf = Buffer.concat(this.body)
          if (opts.encoding) {
            return collector(buf.toString(opts.encoding))
          }
          collector(buf)
        })
    }

    _write(chunk, encoding, callback) {
      this.body.push(chunk)
      callback()
    }
  }

  module.exports = function toBase64(psd) {
    return new Promise((resolve, reject) => {
      psd.image
        .toPng()
        .pack()
        .pipe(new CollectWritable(b64 => resolve(`data:image/png;base64,${b64}`), { encoding: 'base64' }))
        .on('error', reject)
    })
  }
}
