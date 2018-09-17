/**
 * @file run
 * @author Cuttle Cong
 * @date 2018/9/16
 *
 */
const Me = require('measure-export')
const app = require('express')()

function start({ port = 8888, ...opts } = {}) {
  const me = Me({
    ...opts,
    compilationSuccessInfo: {
      messages: [`Measure UI is running here http://localhost:${port}`]
      // notes: ['Some additionnal notes to be displayed unpon successful compilation']
    }
  })
  process.on('SIGINT', () => {
    me.quit()
    process.exit()
  })
  return me.getMiddlewares().then(({ dev, hot }) => {
    dev && app.use(dev)
    hot && app.use(hot)
    app.listen(port)
    return app
  })
}

module.exports = start
