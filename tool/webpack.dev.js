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
    useLocalIp: true,
    compress: true,
    host: '0.0.0.0',
    port: require('./server-config').port,
    open: false,
    overlay: { warnings: false, errors: true },
    quiet: false,
    stats: 'errors-only',
    proxy: {
      '/devApi': {
        target: 'http://bax.baixing.cn',
        pathRewrite: {
          '^/devApi': '/'
        },
        changeOrigin: true
      },
      '/fmDevApi': {
        target: 'http://172.17.0.144:8000',
        pathRewrite: {
          '^/fmDevApi': '/'
        },
        changeOrigin: true
      },
      '/adPlatformApi': {
        target: 'http://dev-api.baixing.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/adPlatformApi': '/'
        }
      },
      '/bwplusDevApi': {
        target: 'http://172.17.10.174:8080',
        pathRewrite: {
          '^/bwplusDevApi': '/'
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
        {
          from: /^\/main/,
          to: '/dist/main.html'
        },
        {
          from: /^\/huodong/,
          to: '/dist/huodong.html'
        },
        {
          from: /^\/authorization/,
          to: '/dist/authorizationPage.html'
        },
        {
          from: /^\/yibaisou/,
          to: '/dist/yibaisou.html'
        },
        {
          from: /^\/fengming/,
          to: '/dist/fengming.html'
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
  }),
  new HtmlWebpackPlugin({
    filename: 'authorizationPage.html',
    template: 'template/authorization-page.html',
    chunks: ['vendors~bax~huodong~signin', 'authorizationPage']
  }),
  new HtmlWebpackPlugin({
    filename: 'yibaisou.html',
    template: 'template/yibaisou.html',
    chunks: ['vendors~bax~huodong~signin', 'vendors~bax~signin', 'yibaisou']
  }),
  new HtmlWebpackPlugin({
    filename: 'fengming.html',
    template: 'template/fengming.html',
    chunks: ['vendors~bax~huodong~signin', 'vendors~bax~signin', 'fengming']
  })
]

module.exports = config
