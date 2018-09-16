'use strict'

const globby = require('globby')
const nps = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const Handlebars = require('handlebars')
const inherits = require('inherits')
const pify = require('pify')
const md5 = require('md5')
const createLogger = require('@rcp/util.createlogger').default

const { generatePage } = require('./generate')
const RuntimeFileman = require('./RuntimeFileman')
const tplRender = require('./tplRender')
const getWebpackConfig = require('./getWebpackConfig')

// root/
//   index.html
//   resources/
//     psd
//     html
//     ...
//   assets/
//     measure-ui.js
//     measure-ui.css
//     ...
//

class MeasureExport {
  constructor(opts = {}) {
    this.opts = Object.assign({}, this.constructor.defaultOptions, opts)

    const name = require('../package').name
    if (this.opts.debug) {
      process.env.DEBUG = [process.env.DEBUG || '', name + '*'].join(',')
    }
    this.logger = createLogger(name)

    this.runtimeFm = new RuntimeFileman(name)
    Object.defineProperty(this.runtimeFm, 'hash', {
      get: () => {
        return this.hash
      }
    })

    this.tplMan = {}
  }

  get hash() {
    return md5(`${this.opts.context}-${this.opts.actionType}`).slice(0, 10)
  }

  async getWebpackConfig({ prod } = {}) {
    const paths = await globby(this.opts.glob, {
      cwd: this.opts.context
    })
    const content = generatePage(paths, { context: this.opts.context })
    const pagesFilename = await this.runtimeFm.write('pages.js', `module.exports = ${content}`)
    const entryPath = await this.runtimeFm.write('index.js', tplRender('entry.js', { pagesFilename }))

    let config = getWebpackConfig({
      entry: entryPath,
      dist: this.opts.distDir,
      debug: this.opts.debug,
      prod,
      context: this.opts.context
    })
    // paths
    if (typeof this.opts.webpackConfigUpdater === 'function') {
      const returned = this.opts.webpackConfigUpdater(config)
      if (returned) {
        config = returned
      }
    }
    this.logger.debug('webpack configuration: %O', config)
    return config
  }

  async build() {
    const config = await this.getWebpackConfig({ prod: true })
    const compiler = webpack(config)
    const state = await pify(compiler.run.bind(compiler))()
    console.log(state.errors)
  }

  async getMiddleware() {
    const config = await this.getWebpackConfig({ prod: false })
    const compiler = webpack(config)

    // middleware
    return webpackDevMiddleware(compiler, {
      logLevel: this.opts.debug ? 'info' : 'silent'
    })
  }
}

function MeasureExportFactory(opts) {
  if (!(this instanceof MeasureExportFactory)) {
    return new MeasureExport(opts)
  }
  return new MeasureExport(opts)
}
MeasureExport.defaultOptions = {
  context: process.cwd(),
  debug: false,
  distDir: nps.join(process.cwd(), 'dist'),
  glob: ['**/*.{psd,html,htm}'],
  webpackConfigUpdater: config => {
    return config
  }
}

inherits(MeasureExportFactory, MeasureExport)

module.exports = MeasureExportFactory
