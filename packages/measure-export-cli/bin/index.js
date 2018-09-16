#!/usr/bin/env node
'use strict'

const prog = require('caporal')
const run = require('./run')
const build = require('./build')

prog
  .version(require('../package').version)
  // the "order" command
  .help(`My Custom help !!`)

  .command('run', 'Order a pizza')
  .help(`My Custom help about the order command !!`)
  // <kind> will be auto-magicaly autocompleted by providing the user with 3 choices
  .argument('<path>', 'Kind of pizza')
  .option('-n, --number <num>', 'Number of pizza', prog.INT, 1)
  .option('-d, --discount <amount>', 'Discount offer', prog.FLOAT)
  .option('-p, --pay-by <mean>', 'Pay by option')
  // enable auto-completion for <from-store> argument using a sync function returning an array
  .complete(function() {
    return ['store-1', 'store-2', 'store-3', 'store-4', 'store-5']
  })

  .action(function(args, options, logger) {
    logger.info("Command 'order' called with:")
    logger.info('arguments: %j', args)
    logger.info('options: %j', options)

    run()
  })

  // the "return" command
  .command('build', 'Return an order')
  // <kind> will be auto-magicaly autocompleted by providing the user with 3 choices
  // .argument('<order-id>', 'Order id')
  // // enable auto-completion for <from-store> argument using a Promise
  // .complete(function() {
  //   return Promise.resolve(['#82792', '#71727', '#526Z52'])
  // })
  // .argument('<to-store>', 'Store id')
  // .option('--ask-change <other-kind-pizza>', 'Ask for other kind of pizza')
  // .complete(function() {
  //   return Promise.resolve(['margherita', 'hawaiian', 'fredo'])
  // })
  // .option('--say-something <something>', 'Say something to the manager')
  .action(function(args, options, logger) {
    return Promise.resolve('wooooo').then(function(ret) {
      logger.info("Command 'return' called with:")
      logger.info('arguments: %j', args)
      logger.info('options: %j', options)
      logger.info('promise succeed with: %s', ret)
      build()
    })
  })

prog.parse(process.argv)
