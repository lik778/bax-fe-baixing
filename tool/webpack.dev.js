
const base = require('./webpack.base')
const merge = require('webpack-merge')
const webpack = require('webpack')

const config = merge(base, {
  devServer: {
    historyApiFallback: true,
    noInfo: true
  }
})

config.entry.hot = ['webpack-hot-middleware/client?reload=true']

config.plugins = [
  ...(config.plugins || []),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"'
    }
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
]

module.exports = config
