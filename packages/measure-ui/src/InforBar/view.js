/**
 * @file index
 * @author imcuttle
 * @description
 */

import * as React from 'react'
import PropTypes from 'prop-types'
import p from 'prefix-classname'
import createMount from '@rcp/util.createmount'
import some from 'lodash.some'
import Clr from 'color'
import 'prismjs'
import Highlight from 'react-prism'
import { toJS } from 'mobx'

import Select from '../components/Select'

import { i18n } from '../i18n'

import './style.less'

const cn = p('')
const c = p('hm-infor-bar__')

let copyInput
function getInput() {
  if (!copyInput) {
    copyInput = document.createElement('textarea')
    document.body.appendChild(copyInput)
  }

  return copyInput
}

function copyAndToast(text) {
  const input = getInput()
  input.style.opacity = 0
  input.style.display = 'inline'
  input.value = text

  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !global.MSStream) {
    input.contentEditable = true
    input.readOnly = false
    let range = document.createRange()
    range.selectNodeContents(input)
    let sel = global.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
    input.setSelectionRange(0, 99999999)
  } else {
    input.select()
  }
  try {
    let succ = document.execCommand('copy')
    const ct = createMount()
    let dom = ct.open({
      element: succ ? i18n('infor-bar.message.copy.succ') : i18n('infor-bar.message.copy.fail')
    })
    $(dom)
      .addClass(succ ? c('succ-tip', 'toast-tip') : c('fail-tip', 'toast-tip'))
      .css({
        position: 'absolute',
        top: 10,
        right: 20
      })

    setTimeout(() => {
      ct.close()
    }, 1000)
    return succ
  } catch (err) {
    // console.log('Oops, unable to copy')
    return false
  } finally {
    input.blur()
    input.style.display = 'none'
  }
}

class Section extends React.Component {
  cpText(item) {
    return item.cpText || item.content
  }
  handleCopy(item) {
    const text = this.cpText(item)
    return text
      ? evt => {
          copyAndToast(text)
        }
      : null
  }

  static defaultProps = {
    table: null
  }
  render() {
    const { title, table, className, children } = this.props
    return (
      <div ref={r => (this.containerRef = r)} className={cn(c('sec'), className)}>
        <div className={c('sec-title')}>{title}</div>
        {table && (
          <table>
            <tbody>
              {table.filter(Boolean).map((row, rowID) => {
                return (
                  <tr key={rowID} className={c('sec-row')}>
                    {row.filter(Boolean).map((item, itemID) => {
                      return (
                        <td
                          key={item.key || itemID}
                          colSpan={item.colSpan}
                          className={c('sec-item', item.key && `sec-item-key-${item.key}`)}
                        >
                          <span
                            className={c(
                              'sec-item-wrapper',
                              !!item.type && `sec-type-${item.type}-wrapper`,
                              item.label && 'sec-with-label-wrapper'
                            )}
                          >
                            {item.label && <span className={c('sec-item-label')}>{item.label}</span>}
                            {item.type && <span style={item.typeStyle} className={c(`sec-type-${item.type}`)} />}
                            <span
                              className={c('sec-item-content')}
                              title={this.cpText(item) ? i18n('infor-bar.tip.copy') : null}
                              style={{
                                cursor: this.cpText(item) ? 'pointer' : null
                              }}
                              onClick={this.handleCopy(item)}
                            >
                              {item.content || '-'}
                            </span>
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        {children}
      </div>
    )
  }
}

export function isEmpty(data) {
  if (data === '' || data == null) {
    return true
  }

  if (typeof data === 'object') {
    return !some(data, val => {
      return !isEmpty(val)
    })
  }
  return false
}

function v(val) {
  if (val == null) {
    return ''
  }
  return String(val)
}

export default class InforBar extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }
  static defaultProps = {}
  render() {
    const { className, ...props } = this.props
    const {
      clr,
      sz,
      /*exportImage, */ title,
      position,
      size,
      opacity,
      radius,
      shadow,
      color,
      stroke,
      fonts,
      content
    } = this.local

    const code = this.local.processSnippet()
    return (
      <div className={cn(c('container'), className)}>
        {/*{exportImage && <div style={{ backgroundImage: exportImage }} />}*/}
        <Section
          className={c('sec-basic')}
          title={title}
          table={[
            [{ label: 'X', content: sz(position.x) }, { label: 'Y', content: sz(position.y) }],
            [
              { label: i18n('infor-bar.width.label'), content: sz(size.width) },
              { label: i18n('infor-bar.height.label'), content: sz(size.height) }
            ],
            !isEmpty(radius) && [
              {
                label: i18n('infor-bar.radius.label'),
                colSpan: 2,
                content: `${sz(radius.topLeft)} ${sz(radius.topRight)} ${sz(radius.bottomRight)} ${sz(
                  radius.bottomLeft
                )}`
              }
            ]
          ]}
        />

        {color && (
          <Section
            title={i18n('infor-bar.color.title')}
            className={c('sec-color')}
            table={[
              [
                {
                  colSpan: 2,
                  content: clr(color),
                  type: 'color',
                  typeStyle: {
                    backgroundColor: Clr(color).string()
                  }
                }
              ]
            ]}
          />
        )}

        {!isEmpty(stroke) && (
          <Section
            title={i18n('infor-bar.stroke.title')}
            className={c('sec-stroke')}
            table={[
              [
                {
                  colSpan: 2,
                  label: i18n('infor-bar.stroke.style.label'),
                  content: `${stroke.lineAlign ? i18n('infor-bar.stroke.style.' + stroke.lineAlign) : ''} ${v(
                     sz(stroke.lineWidth)
                  )}`
                }
              ],
              stroke.color && [
                {
                  colSpan: 2,
                  type: 'color',
                  content: clr(stroke.color),
                  typeStyle: {
                    backgroundColor: Clr(stroke.color).string()
                  }
                }
              ]
            ]}
          />
        )}

        {fonts &&
          !!fonts.length && (
            <Section
              className={c('sec-font')}
              title={i18n('infor-bar.font.title')}
              table={fonts.reduce((list, font, i) => {
                return list.concat(
                  font.content
                    ? [
                        font.content && [
                          {
                            key: 'font-content',
                            colSpan: 2,
                            content: JSON.stringify(font.content),
                            cpText: font.content
                          }
                        ],
                        [{ label: i18n('infor-bar.font.family.label'), content: font.family, colSpan: 2 }],
                        [
                          { label: i18n('infor-bar.font.size.label'), content: sz(font.size) },
                          { label: i18n('infor-bar.font.align.label'), content: font.align }
                        ],
                        [
                          { label: i18n('infor-bar.font.line-height'), content: sz(font.lineHeight) },
                          { label: i18n('infor-bar.font.gap'), content: sz(font.gap) }
                        ],
                        font.color && [
                          {
                            colSpan: 2,
                            content: clr(font.color),
                            type: 'color',
                            typeStyle: {
                              backgroundColor: Clr(font.color).string()
                            }
                          }
                        ]
                      ]
                    : []
                )
              }, [])}
            />
          )}

        {!isEmpty(shadow) && (
          <Section
            title={i18n('infor-bar.box-shadow.title')}
            table={[].concat(
              !isEmpty(shadow.outer) &&
                [].slice.call([
                  [{ label: i18n('infor-bar.box-shadow.label'), type: 'pure-label' }],
                  [
                    { label: i18n('infor-bar.box-shadow.x'), content: sz(shadow.outer.offsetX) },
                    { label: i18n('infor-bar.box-shadow.y'), content: sz(shadow.outer.offsetY) }
                  ],
                  [
                    { label: i18n('infor-bar.box-shadow.blur'), content: sz(shadow.outer.blurRadius) },
                    { label: i18n('infor-bar.box-shadow.spread'), content: sz(shadow.outer.spreadRadius) }
                  ],
                  shadow.outer.color && [
                    {
                      colSpan: 2,
                      content: clr(shadow.outer.color),
                      type: 'color',
                      typeStyle: {
                        backgroundColor: Clr(shadow.outer.color).string()
                      }
                    }
                  ]
                ])
            )}
          />
        )}

        {content && (
          <Section
            className={c('sec-font-content')}
            title={i18n('infor-bar.font.content')}
            table={[
              [
                {
                  key: 'content',
                  colSpan: 2,
                  content
                }
              ]
            ]}
          />
        )}

        {code && (
          <Section
            className={c('sec-snippets')}
            title={
              <div className={c('snippet-title')}>
                <Select
                  className={c('snippet-select')}
                  isSearchable={false}
                  value={this.local.snippetType}
                  onChange={val => this.local.setValue('snippetType', val)}
                  options={toJS(this.local.snippets)}
                />
                <span className={c('btn')} onClick={() => copyAndToast(code)}>
                  {i18n('infor-bar.copy.btn')}
                </span>
              </div>
            }
          >
            <Highlight
              component={'pre'}
              className={cn(
                c('highlight'),
                this.local.matchedSnippet &&
                  this.local.matchedSnippet.lang &&
                  'language-' + this.local.matchedSnippet.lang
              )}
              language={this.local.matchedSnippet ? this.local.matchedSnippet.lang : null}
            >
              {code}
            </Highlight>
          </Section>
        )}
      </div>
    )
  }
}
