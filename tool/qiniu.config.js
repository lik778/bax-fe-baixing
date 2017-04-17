
const { join } = require('path')

module.exports = {
  accessKey: 'dOp3WMvDbVIbjL0vRk9rKF7HXb_UK13kLnknM8oY',
  secretKey: 'YKqPJ4PD6M-rxOLXjgGAIJJyUDOZMqP8TxAKtfFU',
  tasks: [{
    directory: join(__dirname, '../dist'),
    prefix: 'bax-static.',
    bucket: 'adfe'
  }]
}
