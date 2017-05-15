
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const base = require('./webpack.base')
const merge = require('webpack-merge')
const webpack = require('webpack')

const config = merge(base, {
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
  new ExtractTextPlugin({
    filename: '[name].[contenthash:18].css'
  }),
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: (module, count) => {
      return (
        module.resource &&
        module.resource.endsWith('.js') &&
        module.resource.includes('/node_modules/')
      )
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    chunks: ['vendor']
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new webpack.NoEmitOnErrorsPlugin()
]

module.exports = config
