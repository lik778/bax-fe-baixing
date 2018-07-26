const fs = require('fs')
const path = require('path')

async function addPostcss(dir) {
  const files = fs.readdirSync(dir)
  const dirs = files.filter(f => fs.statSync(path.join(dir, f)).isDirectory())
  for (let d of dirs) {
    const vues = fs.readdirSync(path.join(dir, d)).filter(name => name.indexOf('.vue') > -1)
    console.log(vues)
    for (let vue of vues) {
      const content = fs.readFileSync(path.join(dir, d, vue), {encoding: 'utf-8'})
      fs.writeFileSync(path.join(dir, d, vue), content.replace('<style scoped>', '<style lang="postcss" scoped>'))
    }
  }
}
addPostcss(path.join(__dirname, 'component'))
