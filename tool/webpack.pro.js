
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')
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
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
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
