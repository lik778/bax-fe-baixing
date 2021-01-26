
// 切记: 不可 build 进前端 js

const path = require('path')

module.exports = {
  operator: 'attach',
  password: 'baixing!123',
  tasks: [{
    prefix: 'bax-fe/',
    bucket: 'attachments',
    rename: origin => path.posix.join('asset', origin),
    directory: path.posix.join(__dirname, '../asset')
  }]
}
