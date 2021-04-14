const base = require('./webpack.base')
const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    noInfo: true,
    clientLogLevel: 'error',
    hot: true,
    compress: true,
    host: 'localhost',
    port: require('./server-config').port,
    open: false,
    overlay: { warnings: false, errors: true },
    quiet: false,
    stats: 'errors-only',
    proxy: {
      '/devApi': {
        target: 'http://172.17.5.8:8000',
        pathRewrite: {
          '^/devApi': '/'
        },
        changeOrigin: true
      }
    },
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/signin/,
          to: '/dist/signin.html'
        },
        // {
        //   from: /^\/main/,
        //   to: '/dist/main.html'
        // },
        {
          from: /^\/huodong/,
          to: '/dist/huodong.html'
        }
      ]
    }
  }
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
