
const base = require('./tool/webpack.base')
const merge = require('webpack-merge')
const webpack = require('webpack')

const config = merge(base, {
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    noInfo: true
  }
})

config.entry.hot = ['webpack-hot-middleware/client']

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
