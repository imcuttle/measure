#!/usr/bin/env node
'use strict'

const prog = require('caporal')
const run = require('./run')
const build = require('./build')
const createlogger = require('@rcp/util.createlogger').default
const me = require('measure-export')

const any = a => a

function common(pro) {
  return pro
    .option('-g, --glob', 'pattern', prog.Array, me.defaultOptions.glob)
    .option('-l, --language', 'language', any, String(me.defaultOptions.language))
    .option('-t, --html-template-path', 'Html template path', any, me.defaultOptions.htmlTemplatePath)
}

common(
  prog
    .version(require('../package').version)
    // .logger(createlogger('measure-export'))
    // the "order" command
    .help(`My Custom help !!`)
    .command('run', 'Order a pizza')
    .help(`My Custom help about the order command !!`)
    // <kind> will be auto-magicaly autocompleted by providing the user with 3 choices
    .argument('[context]', 'Kind of pizza', any, String(me.defaultOptions.context))
)
  // enable auto-completion for <from-store> argument using a sync function returning an array
  .complete(function() {
    return ['store-1', 'store-2', 'store-3', 'store-4', 'store-5']
  })
  .option('--hot', 'hot', Boolean, me.defaultOptions.hot)
  .action(function(args, options, logger) {
    logger.debug("Command 'run' called with:")
    logger.debug('arguments: %j', args)
    logger.debug('options: %j', options)
    return run(Object.assign({ logger }, args, options))
  })

// the "return" command

common(prog.command('build', 'Return an order').argument('[dist-dir]', 'dist path', any, me.defaultOptions.distDir))
  .option('--source-map', 'sourcemap', Boolean, me.defaultOptions.sourceMap)
  .action(function(args, options, logger) {
    logger.debug("Command 'build' called with:")
    logger.debug('arguments: %j', args)
    logger.debug('options: %j', options)
    return build(Object.assign({ logger }, args, options))
  })

prog.parse(process.argv)
