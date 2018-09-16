const MeasureUI = require('measure-ui')
require('measure-ui/dist/style.css')

const pages = require('{{{ pagesFilename }}}')

// pages.map(x => {})

MeasureUI.render(
  {
    navi: {
      pages: pages
    }
  },
  window['__root']
)
