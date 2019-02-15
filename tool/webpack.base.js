
const { join } = require('path')
const { distPath } = require('./config')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const env = process.env.NODE_ENV

module.exports = {
  entry: {
    signin: './template/signin',
    bax: './template/bax',
  },
  output: {
    path: distPath,
    publicPath: '/dist/',
    chunkFilename: '[name].js',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => /node_modules/.test(file)
      }, {
        test: /css$/,
        use: [
          env === 'production'
            ? MiniCssExtractPlugin.loader
            : 'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              import: false,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-import')(),
                require('postcss-mixins')(),
                require('postcss-cssnext')()
              ]
            }
          }
        ]
      },
      {
        test: /\.(eot|woff|ttf)$/,
        loader: "file-loader"
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
    extensions: ['.js', '.vue', '.css']
  },
  devtool: '#source-map',
  plugins: [
    new VueLoaderPlugin(),
  ]
}
