/**
 * @file entry.js
 * @author Cuttle Cong
 * @date 2018/9/11
 *
 */

import Measure from '../src'

Measure.render(
  {
    navi: {
      pages: [
        {
          key: 'home',
          cover:
            'https://gss0.bdstatic.com/5bVWsj_p_tVS5dKfpU_Y_D3/res/r/image/2017-09-26/352f1d243122cf52462a2e6cdcb5ed6d.png',
          html: require('!raw-loader!./psd-test.html')
        },
        {
          title: 'xxxxxwwxxxxxwwxxxxxwwxxxxxwwxxxxxww',
          cover:
            'https://gss0.bdstatic.com/5bVWsj_p_tVS5dKfpU_Y_D3/res/r/image/2018-09-13/ecba312a72bf2dd4807bed73240b8596.jpg',
          html: () =>
            new Promise(rlv => {
              require.ensure([], () => {
                rlv(require('!raw-loader!./doc-test.html'))
              })
            })
        }
      ]
    }
  },
  window.root
)
