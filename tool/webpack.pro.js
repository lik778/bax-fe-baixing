
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const base = require('./webpack.base')

const config = merge(base, {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true
    }
  },
  output: {
    publicPath: '//file.baixing.net/bax-fe/static/',
    chunkFilename: '[name].[chunkhash:18].js',
    filename: '[name].[chunkhash:18].js'
  }
})

config.plugins = [
  ...config.plugins,
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new MiniCssExtractPlugin({
    filename: '[name].[hash].css',
    chunkFilename: '[id].[hash].css'
  }),
  new HtmlWebpackPlugin({
    filename: 'main.html',
    template: 'template/main.html',
    chunks: ['vendors~bax~huodong~signin', 'vendors~bax~signin', 'bax'],
    minify: {
      collapseWhitespace: true
    }
  }),
  new HtmlWebpackPlugin({
    filename: 'signin.html',
    template: 'template/signin.html',
    chunks: ['vendors~bax~huodong~signin', 'vendors~bax~signin', 'signin'],
    minify: {
      collapseWhitespace: true
    }
  }),
  new HtmlWebpackPlugin({
    filename: 'huodong.html',
    template: 'template/huodong.html',
    chunks: ['vendors~bax~huodong~signin', 'huodong'],
    minify: {
      collapseWhitespace: true
    }
  })
  // new BundleAnalyzerPlugin()
]

module.exports = config
