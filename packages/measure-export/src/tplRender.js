const nps = require('path')
const fs = require('fs')
const globby = require('globby')
const Handlebars = require('handlebars')

const MyHandlebars = Handlebars.create()

const tplPath = nps.join(__dirname, './tpls')
const tplNames = globby.sync(['*.js'], {
  cwd: tplPath
})

const compilerMap = {}
tplNames.forEach(name => {
  compilerMap[name] = MyHandlebars.compile(fs.readFileSync(nps.join(tplPath, name)).toString())
})

function render(name, data) {
  const c = compilerMap[name]
  if (typeof c !== 'function') {
    throw new TypeError(`the compiler named "${name}" wasn't found.`)
  }
  return c(data)
}

module.exports = render
