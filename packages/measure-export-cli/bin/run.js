/**
 * @file run
 * @author Cuttle Cong
 * @date 2018/9/16
 *
 */
const Me = require('measure-export')
const app = require('express')()

function build({ port = 8888, ...opts } = {}) {
  const me = Me({ ...opts, debug: false })
  me.getMiddleware().then(middleware => {
    app.use('/', middleware)
    app.listen(port, function() {
      me.logger.log(port)
    })
    return app
  })
}

module.exports = build
