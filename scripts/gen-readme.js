/**
 * @file gen-readme
 * @author Cuttle Cong
 * @date 2018/9/24
 *
 */

const nps = require('path')
const each = require('lodash.foreach')
const globby = require('globby')
const fs = require('fs')
;(async () => {
  const cwd = nps.join(__dirname, '..')
  const packagesPath = require(nps.join(cwd, 'lerna.json')).packages

  const paths = globby.sync(packagesPath, {
    onlyDirectories: true,
    cwd
  })

  const data = {}
  paths.forEach(path => {
    path = nps.join(cwd, path)
    const pkg = require(nps.join(path, 'package.json'))
    data[pkg.name] = {
      pkg,
      path
    }
  })

  const strings = []
  each(data, (val, name) => {
    strings.push(`- [${name}](${nps.relative(cwd, val.path)}) - ${val.pkg.description}  `)
  })

  const readmePath = nps.join(cwd, 'README.md')
  const readme = fs.readFileSync(readmePath, { encoding: 'utf8' })
  const newReadme = readme.replace(/(?<=\n## Packages)[^]*?(?=\n#+ )/, () => {
    return '\n\n' + strings.join('\n') + '\n\n'
  })

  if (newReadme !== readme) {
    fs.writeFileSync(readmePath, newReadme)
  }
})()
