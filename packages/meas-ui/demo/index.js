/**
 * @file entry.js
 * @author Cuttle Cong
 * @date 2018/9/11
 *
 */

import Measure from '../src'

window.app = Measure.render(
  {
    language: 'zh-cn',
    navi: {
      pages: [
        {
          key: 'source',
          title: 'From Source',
          cover:
            'http://img.wxcha.com/file/201603/07/7ec4c7c1f7.jpg',
          html: require('!raw-loader!./psd-test.html')
        },
        {
          key: 'html',
          title: 'From Html',
          cover: 'http://t2.hddhhn.com/uploads/tu/201612/98/st94.png',
          html: () =>
            new Promise(rlv => {
              require.ensure([], () => {
                rlv(require('!raw-loader!./doc-test.html'))
              })
            })
        },
        {
          key: 'svg',
          title: 'From Svg',
          html: () =>
            new Promise(rlv => {
              require.ensure([], () => {
                rlv(require('!raw-loader!../../../psd-measure.zh.svg'))
              })
            })
        }
      ]
    }
  },
  window.root
)
