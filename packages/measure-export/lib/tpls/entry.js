import MeasureUI from 'measure-ui'

let pages = JSON.parse('{{{ paths }}}')

pages.map(x => {})

MeasureUI.render(
  {
    navi: {
      pages: '[]'
    }
  },
  window['__root']
)
