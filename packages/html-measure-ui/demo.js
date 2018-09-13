/**
 * @file entry.js
 * @author Cuttle Cong
 * @date 2018/9/11
 *
 */

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './src'

import { h } from 'react-mobx-vm'

const app = App.create()

ReactDOM.render(h(app, {}), window.root)
