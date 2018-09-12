/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */

import { Root, bindView, observable } from 'react-mobx-vm'
import View from './view'

@bindView(View)
export default class InforBar extends Root {
  sz(n) {
    return n
  }

  clr(clr) {
    return clr
  }

  @observable
  title = ''

  // property
  @observable
  position = {
    x: 0,
    y: 0
  }
  @observable
  size = {
    width: 0,
    height: 0
  }
  @observable
  opacity = 1
  @observable
  radius = null

  @observable
  color = ''

  @observable
  font = {
    family: '',
    color: '',
    size: '',
    gap: '',
    lineHeight: '',
    content: ''
  }
  // @observable color = ''
}
