/**
 * @file parsePattern
 * @author Cuttle Cong
 * @date 2018/9/23
 *
 */


function parse(string) {
  const lines = string.split('\n')
  const patterns = []
  lines.forEach(line => {
    line = line.trim()
    if (line && !line.startsWith('#')) {
      patterns.push(line)
    }
  })

  return patterns
}

module.exports = parse
