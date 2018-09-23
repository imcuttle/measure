/**
 * @file post-version
 * @author Cuttle Cong
 * @date 2018/9/23
 *
 */

const fs = require('fs')

require('./src/manifest').version = require('./package').version
fs.readFileSync(require.resolve('./src/manifest'), JSON.stringify(require('./src/manifest'), null, 2))
