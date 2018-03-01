
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const base = require('./webpack.base')
const merge = require('webpack-merge')
const webpack = require('webpack')

const config = merge(base, {
  mode: 'production',
  optimization: {
    splitChunks: {
      name: 'vendor',
      minSize: 0,
      chunks: "all",
    }
  },
  output: {
    filename: '[name].[chunkhash:18].js'
  }
})

config.plugins = [
  ...(config.plugins || []),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(zh-cn)$/),
  new ExtractTextPlugin({
    filename: '[name].[contenthash:18].css'
  })
]

module.exports = config
