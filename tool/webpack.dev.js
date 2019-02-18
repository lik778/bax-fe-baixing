
const base = require('./webpack.base')
const merge = require('webpack-merge')
const webpack = require('webpack')
const { join } = require('path')

const isArray = Array.isArray

const config = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    noInfo: true
  }
})

Object.keys(config.entry).forEach((key) => {
  const a = isArray(config.entry[key]) ? config.entry[key] : [config.entry[key]]

  config.entry[key] = [
    join(__dirname, 'dev-client'),
    ...a
  ]
})

config.plugins = [
  ...config.plugins,
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
]
console.log(config.module.rules)

module.exports = config
