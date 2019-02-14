
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')

const base = require('./webpack.base')

const config = merge(base, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
        chunkFilter: (chunk) => chunk.name !== 'vendor'
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      name: 'vendor',
      minSize: 0,
      chunks: "all",
    }
  },
  output: {
    chunkFilename: '[name].[chunkhash:18].js',
    filename: '[name].[chunkhash:18].js'
  }
})

config.plugins = [
  ...config.plugins,
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(zh-cn)$/),
  new MiniCssExtractPlugin({
    filename: "[name].[hash].css",
    chunkFilename: "[id].[hash].css"
  }),
  new HtmlWebpackPlugin({
    filename: 'main.html',
    template: 'template/main.html',
    chunks: ['bax', 'vendor'],
    minify: {
      collapseWhitespace: true,
    }
  }),
  new HtmlWebpackPlugin({
    filename: 'signin.html',
    template: 'template/signin.html',
    chunks: ['signin', 'vendor'],
    minify: {
      collapseWhitespace: true,
    }
  })
]

module.exports = config
