/**
 * @file update-notify
 * @author Cuttle Cong
 * @date 2018/9/17
 *
 */
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

module.exports = function () {
  return updateNotifier({ pkg }).notify()
}
