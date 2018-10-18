
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { join } = require('path')

const { distPath } = require('./config')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

const env = process.env.NODE_ENV

module.exports = {
  entry: {
    signin: ['babel-esnext-polyfill', join(__dirname, '../template/signin')],
    bax: ['babel-esnext-polyfill', join(__dirname, '../template/bax')],
    'huodong': ['babel-esnext-polyfill', join(__dirname, '../template/huodong')],
  },
  output: {
    path: distPath,
    publicPath: '/dist/',
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: file => (
        /node_modules/.test(file) &&
        !/\.vue\.js/.test(file)
      )},
      {
      test: /css$/,
      use: [
        'vue-style-loader',
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
      ],
    }
  ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.css']
  },
  devtool: '#source-map',
  plugins: [
    new VueLoaderPlugin()
  ]
}

/**
 * private
 */

function getVueLoaders() {
  if (env === 'production') {
    return {
      // css: ExtractTextPlugin.extract({
      //   use: [{
      //     loader: 'css-loader',
      //     options: {
      //       sourceMap: true,
      //       minimize: true
      //     }
      //   }],
      //   fallback: 'style-loader'
      // })
    }
  }

  return {}
}
