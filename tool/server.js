
process.env.NODE_ENV = 'development'

const history = require('connect-history-api-fallback')
const config = require('./webpack.dev')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('./proxy')
const bodyParser = require('body-parser')
const { join } = require('path')

const compiler = webpack(config)
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())
// 处理代理逻辑
app.use(proxyMiddleware)

app.use(history({
  rewrites: [{
    from: /^\/signin/,
    to: '/dist/signin.html'
  },
  {
    from: /^\/vt/,
    to: '/dist/vt.html'
  }, {
    from: /^\/main/,
    to: '/dist/main.html'
  }, {
    from: /^\/huodong/,
    to: '/dist/huodong.html'
  }]
}))

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  noInfo: false,
  quiet: false
}))

app.use(require('webpack-hot-middleware')(compiler))

app.use(express.static(join(__dirname, '..')))

// CORS
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})

app.listen(3000, err => {
  if (err) {
    return console.error(err)
  }

  console.info('Listening at http://localhost:3000')
})
