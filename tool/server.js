
process.env.NODE_ENV = 'development'

const history = require('connect-history-api-fallback')
const config = require('./webpack.dev')
const express = require('express')
const webpack = require('webpack')
const { join } = require('path')

const compiler = webpack(config)
const app = express()

app.use(history({
  rewrites: [{
    from: /^\/signin/,
    to: '/template/signin.html'
  },
  {
    from: /^\/vt/,
    to: '/template/vt.html'
  }, {
    from: /^\/main/,
    to: '/template/main.html'
  }]
}))

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  noInfo: false,
  quiet: false
}))

app.use(require('webpack-hot-middleware')(compiler))

app.use(express.static(join(__dirname, '..')))

app.listen(3000, err => {
  if (err) {
    return console.error(err)
  }

  console.info('Listening at http://localhost:3000')
})
