/**
 * @author Cuttle Cong
 * @date 2018/9/16
 *
 */
const me = require('measure-export')

function build(opts = {}) {
  return me(opts).build()
}

module.exports = build
