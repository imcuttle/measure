#!/usr/bin/env node
'use strict'

const prog = require('caporal')
const me = require('measure-export')

const any = a => a

function common(pro) {
  return pro
    .argument('[context]', 'Set the context(directory) for exporting', any, String(me.defaultOptions.context))
    .option('-g, --glob', "Matching file's pattern [glob]", prog.Array, me.defaultOptions.glob)
    .option('-l, --language', 'Set default Language', any, String(me.defaultOptions.language))
    .option('-t, --html-template-path', "Set html template's path", any, me.defaultOptions.htmlTemplatePath)
}

common(
  prog
    .version(require('../package').version)
    // the "order" command
    .help(`Make (psd/html) to be measurable`)
    .command('start', 'Start measure ui in development mode')
)
  // enable auto-completion for <from-store> argument using a sync function returning an array
  .option('-p, --port', "Set server's port", any, 8888)
  .option('--no-hot', "Don't use hot module replace", Boolean, !me.defaultOptions.hot)
  .action(function(args, options, logger) {
    logger.debug("Command 'run' called with:")
    logger.debug('arguments: %j', args)
    logger.debug('options: %j', options)

    return require('./start')(Object.assign({ logger }, args, options))
  })

// the "return" command

common(prog.command('build', 'Build the assets with measure ui in dist'))
  .option('-d, --dist-dir', 'Set output path', any, me.defaultOptions.distDir)
  .option('--source-map', 'Enable source map', Boolean, me.defaultOptions.sourceMap)
  .action(function(args, options, logger) {
    logger.debug("Command 'build' called with:")
    logger.debug('arguments: %j', args)
    logger.debug('options: %j', options)

    options.hot = !options.noHot
    delete options.noHot

    return require('./build')(Object.assign({ logger }, args, options)).then(() => {
      require('./update-notify')()
    })
  })

prog.parse(process.argv)
