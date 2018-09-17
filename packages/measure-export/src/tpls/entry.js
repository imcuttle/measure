const MeasureUI = require('meas-ui')
require('meas-ui/dist/style.css')

// pages.map(x => {})

function run() {
  MeasureUI.render(
    {
      language: '{{{ language }}}',
      navi: {
        pages: require('{{{ pagesFilename }}}')
      }
    },
    window['__root']
  )
}
run()

if (module.hot) {
  module.hot.accept(['{{{ pagesFilename }}}'], function() {
    run()
  })
}
