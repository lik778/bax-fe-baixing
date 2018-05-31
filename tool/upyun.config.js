
// 切记: 不可 build 进前端 js

const { join } = require('path')

module.exports = {
  operator: 'attach',
  password: 'baixing!123',
  tasks: [{
    prefix: 'bax-fe/',
    bucket: 'attachments',
    rename: origin => join('static', origin),
    directory: join(__dirname, '../dist')
  }]
}
