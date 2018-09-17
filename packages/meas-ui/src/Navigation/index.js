/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */

import { Root, bindView, observable, List } from 'react-mobx-vm'
import View from './view'

export class Page extends Root {
  @observable
  title
  @observable
  key
  @observable
  cover
  @observable
  html

  @observable
  isActive = false
  onClick() {}

  get id() {
    return this.key || this.title
  }
}

class Pages extends List {
  matched(key) {
    let f = this.find(x => x.hasOwnProperty('key') && x.key === key)
    if (!f) {
      f = this.find(x => x.hasOwnProperty('title') && x.title === key)
    }
    if (!f) {
      f = this.find((x, i) => i === key)
    }

    return f
  }
  getKey(i) {
    const d = this[i]
    if (d) {
      return d.id || i
    }
    return d
  }
}

@bindView(View)
export default class Navigation extends Root {
  @observable pages = Pages.create([], Page)

  handlePageClick = (p, i) => null
}
