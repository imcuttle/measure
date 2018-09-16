/**
 * @file utils
 * @author Cuttle Cong
 * @date 2018/9/17
 *
 */
const os = require('os')
const { single } = require('quote-it')

export const isWin = os.platform() === 'win32'

export const toUriPath = isWin ? path => path.replace(/\\/g, '/') : p => p

export function safeSingle(str = '') {
  const wrapped = single(String(str))
  return wrapped.slice(1, wrapped.length - 1)
}
