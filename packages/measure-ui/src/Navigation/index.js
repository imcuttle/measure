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
  onClick() {}
}

@bindView(View)
export default class Navigation extends Root {
  @observable
  pages = List.create([], Page)
}
