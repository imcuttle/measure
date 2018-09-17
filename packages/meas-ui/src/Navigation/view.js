/**
 * @file index
 * @author imcuttle
 * @description
 */

import * as React from 'react'
import PropTypes from 'prop-types'
import p from 'prefix-classname'

import './style.less'

const cn = p('')
const c = p('hm-navigation__')

export default class Navigation extends React.Component {
  static propTypes = {
    className: PropTypes.string
    // pages: PropTypes.arrayOf(PropTypes.shape({
    //   title: PropTypes.node,
    //   cover: PropTypes.string,
    //   html: PropTypes.string,
    //   onClick: PropTypes.func
    // }))
  }
  static defaultProps = {}
  render() {
    const { className, ...props } = this.props
    const { pages = [], handlePageClick } = this.local

    return (
      <div className={cn(c('container'), className)}>
        <ul className={c('list')}>
          {pages.map((p, i) => {
            const onClick = handlePageClick(p, i)
            return (
              <li key={p.key || i}>
                <div
                  style={{
                    cursor: onClick ? 'pointer' : null
                  }}
                  onClick={onClick}
                  className={c('item')}
                >
                  {p.cover && <img src={p.cover} />}
                  {p.title && <span className={c('item-title')}>{p.title}</span>}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
