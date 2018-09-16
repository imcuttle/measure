/**
 * @author Cuttle Cong
 * @date 2018/9/16
 *
 */
const Me = require('measure-export')

function build(opts = {}) {
  const me = Me({
    ...opts,
  })

  process.on('SIGINT', () => {
    me.quit()
    process.exit()
  })
  return me.build()
}

module.exports = build
