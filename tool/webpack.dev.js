
const base = require('./webpack.base')
const merge = require('webpack-merge')
const webpack = require('webpack')
const { join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
  new webpack.NoEmitOnErrorsPlugin(),
  new HtmlWebpackPlugin({
    filename: 'main.html',
    template: 'template/main.html',
    chunks: ['vendors~bax~huodong~signin', 'vendors~bax~signin', 'bax']
  }),
  new HtmlWebpackPlugin({
    filename: 'signin.html',
    template: 'template/signin.html',
    chunks: ['vendors~bax~huodong~signin', 'vendors~bax~signin', 'signin']
  }),
  new HtmlWebpackPlugin({
    filename: 'huodong.html',
    template: 'template/huodong.html',
    chunks: ['vendors~bax~huodong~signin', 'huodong']
  })
]

module.exports = config
