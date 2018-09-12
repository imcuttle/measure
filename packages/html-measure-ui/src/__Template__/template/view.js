/**
 * @file index
 * @author {{{_.git.name}}}
 * @description
 */

import * as React from 'react'
import PropTypes from 'prop-types'
import p from 'prefix-classname'

import './style.less'

const cn = p('')
const c = p('hm-{{{classname}}}__')

export default class {{{name}}} extends React.Component {
    static propTypes = {
        className: PropTypes.string
    }
    static defaultProps = {}
    render() {
        const { className, ...props } = this.props

        return <div className={cn(c('container'), className)}>
            {props.children}
        </div>
    }
}
