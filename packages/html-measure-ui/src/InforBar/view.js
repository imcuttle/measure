/**
 * @file index
 * @author imcuttle
 * @description
 */

import * as React from 'react'
import PropTypes from 'prop-types'
import p from 'prefix-classname'

import { i18n } from '../i18n'

import './style.less'

const cn = p('')
const c = p('hm-infor-bar__')

const Section = ({ title, table, className }) => (
  <div className={cn(c('sec'), className)}>
    <div className={c('sec-title')}>{title}</div>
    <table>
      <tbody>
        {table.map((row, rowID) => {
          return (
            <tr key={rowID} className={c('sec-row')}>
              {row.map((item, itemID) => {
                return (
                  <td key={item.key || itemID} className={c('sec-item')}>
                    <span className={c('sec-item-wrapper', !!item.type && `sec-type-${item.type}-wrapper`)}>
                      {item.label && <span className={c('sec-item-label')}>{item.label}</span>}
                      {item.type && <span style={item.typeStyle} className={c(`sec-type-${item.type}`)} />}
                      <span className={c('sec-item-content')}>{item.content}</span>
                    </span>
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

export default class InforBar extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }
  static defaultProps = {}
  render() {
    const { className, ...props } = this.props
    const { clr, sz, title, position, size, opacity, radius, color, font } = this.local

    return (
      <div className={cn(c('container'), className)}>
        <Section
          className={c('sec-basic')}
          title={title}
          table={[
            [{ label: 'X', content: sz(position.x) }, { label: 'Y', content: sz(position.y) }],
            [
              { label: i18n('infor-bar.width.label'), content: sz(size.width) },
              { label: i18n('infor-bar.height.label'), content: sz(size.height) }
            ]
          ]}
        />

        {font && (
          <Section
            className={c('sec-font')}
            title={i18n('infor-bar.font.title')}
            table={[
              [{ label: i18n('infor-bar.font.family.label'), content: font.family }],
              [
                { label: i18n('infor-bar.font.size.label'), content: sz(font.size) },
                { label: i18n('infor-bar.font.size.label'), content: sz(font.size) }
              ],
              [
                { label: i18n('infor-bar.font.line-height'), content: sz(font.lineHeight) },
                { label: i18n('infor-bar.font.gap'), content: sz(font.gap) }
              ],
              [
                {
                  content: clr(font.color),
                  type: 'color',
                  typeStyle: {
                    backgroundColor: font.color
                  }
                }
              ]
            ]}
          />
        )}
      </div>
    )
  }
}
