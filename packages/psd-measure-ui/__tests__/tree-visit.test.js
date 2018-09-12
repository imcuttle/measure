/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
const visit = require('../lib/tree-visit')

describe('tree-visit', function() {
  it('should visit', function() {
    visit(require('./fixtures/tree'), console.log)
  })
})
