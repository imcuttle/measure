/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/10
 *
 */
const fs = require('fs')
const nps = require('path')
const toHtml = require('../../')

console.log(toHtml(fs.readFileSync(nps.join(__dirname, '../home.psd'))))
