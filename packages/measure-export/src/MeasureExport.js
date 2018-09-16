'use strict'

const globby = require('globby')
const nps = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const Handlebars = require('handlebars')
const inherits = require('inherits')
const pify = require('pify')
const mm = require('micromatch')
const md5 = require('md5')
const chokidar = require('chokidar')
const hotMiddleware = require('webpack-hot-middleware')
const createLogger = require('@rcp/util.createlogger').default

const { toUriPath, safeSingle } = require('./utils')
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
    this.opts.debug = this.opts.debug || !!process.env.MEASURE_EXPORT_DEBUG
    const name = require('../package').name
    if (this.opts.debug) {
      process.env.DEBUG = [process.env.DEBUG || '', name + '*'].join(',')
    }
    this.opts.logger = this.opts.logger || createLogger(name)

    this.runtimeFm = new RuntimeFileman()
    Object.defineProperty(this.runtimeFm, 'hash', {
      get: () => {
        return this.hash
      }
    })

    this.logger.debug('this.opts: %O', this.opts)
  }

  get logger() {
    return this.opts.logger
  }

  get hash() {
    return md5(`${this.opts.context}-${this.actionType}`).slice(0, 10)
  }

  _registerWatch() {
    if (this.opts.hot) {
      this.logger.debug('registerWatch, with arguments')
      this._watcher = chokidar
        .watch(this.opts.context, {
          ignoreInitial: true
        })
        .on('add', path => {
          if (mm.isMatch(path, this.opts.glob, { matchBase: true })) {
            this.logger.debug(`File ${path} has been added`)
            return this._generatePages()
          }
        })
        // .on('change', path => {
        //   if (mm.isMatch(path, this.opts.glob, { matchBase: true })) {
        //     this.logger.debug(`File ${path} has been changed`)
        //     return this._generatePages()
        //   }
        // })
        .on('unlink', path => {
          if (mm.isMatch(path, this.opts.glob, { matchBase: true })) {
            this.logger.debug(`File ${path} has been removed`)
            return this._generatePages()
          }
        })
    }
  }

  _unwatch() {
    if (this._watcher) {
      this._watcher.close()
      this._watcher = null
    }
  }

  async _generatePages() {
    const paths = await globby(this.opts.glob, {
      cwd: this.opts.context
    })
    const content = generatePage(paths, { context: this.opts.context })
    return await this.runtimeFm.write('pages.js', `module.exports = ${content}`)
  }

  async getWebpackConfig({ prod } = {}) {
    const pagesFilename = await this._generatePages()
    const data = { language: this.opts.language, pagesFilename: safeSingle(toUriPath(pagesFilename)) }
    const entryPath = await this.runtimeFm.write('index.js', tplRender('entry.js', data))

    let config = getWebpackConfig({
      hot: this.opts.hot,
      entry: entryPath,
      dist: this.opts.distDir,
      sourceMap: this.opts.sourceMap,
      debug: this.opts.debug,
      compilationSuccessInfo: this.opts.compilationSuccessInfo,
      htmlTemplatePath: this.opts.htmlTemplatePath,
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
    this.actionType = 'build'
    const config = await this.getWebpackConfig({ prod: true })
    const compiler = webpack(config)
    return await pify(compiler.run.bind(compiler))()
  }

  async quit() {
    this._unwatch()
    this.logger.debug('quit: %s', this.runtimeFm.filename())
    this.runtimeFm.clear()
  }

  async getMiddlewares() {
    this.actionType = 'dev'
    const config = await this.getWebpackConfig({ prod: false })
    const compiler = webpack(config)
    this._registerWatch()

    // middleware
    return {
      dev: webpackDevMiddleware(compiler, {
        logLevel: this.opts.debug ? 'info' : 'silent'
      }),
      hot:
        this.opts.hot &&
        hotMiddleware(compiler, {
          log: this.opts.debug ? this.logger.info : false
        })
    }
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
  sourceMap: false,
  htmlTemplatePath: nps.join(__dirname, 'index.html'),
  compilationSuccessInfo: undefined,
  distDir: nps.join(process.cwd(), 'dist'),
  glob: ['**/*.{psd,html,htm}'],
  language: 'en-us',
  hot: true,
  webpackConfigUpdater: config => {
    return config
  }
}

inherits(MeasureExportFactory, MeasureExport)
Object.assign(MeasureExportFactory, MeasureExport)

module.exports = MeasureExportFactory
