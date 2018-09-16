const MeasureUI = require('measure-ui')
require('measure-ui/dist/style.css')

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
