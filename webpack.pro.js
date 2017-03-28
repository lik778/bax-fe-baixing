
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const base = require('./tool/webpack.base')
const merge = require('webpack-merge')
const webpack = require('webpack')

const config = merge(base, {
  devtool: '#source-map'
})

config.plugins = [
  ...(config.plugins || []),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  new ExtractTextPlugin({
    filename: '[name].css'
  }),
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new webpack.NoEmitOnErrorsPlugin()
]

module.exports = config
