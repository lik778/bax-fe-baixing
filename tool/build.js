
process.env.NODE_ENV = 'production'

const webpackConfig = require('./webpack.pro')
const config = require('./config')

const webpack = require('webpack')

const rm = require('rimraf')
const ora = require('ora')

const spinner = ora('😇 building for production ...')
spinner.start()

rm(config.distPath, err => {
  if (err) throw err

  webpack(webpackConfig, (err, stats) => {
    spinner.stop()

    if (err) throw err

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.info('😎 Build complete.')
  })
})
