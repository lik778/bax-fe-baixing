
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const { distPath } = require('./config')

const env = process.env.NODE_ENV

module.exports = {
  entry: {
    signin: './component/signin',
    bax: './component/bax'
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
      options: {
        postcss: [
          require('postcss-import')(),
          require('postcss-mixins')(),
          require('postcss-cssnext')()
        ],
        loaders: getVueLoaders()
      }
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue']
  },
  devtool: '#source-map'
}

/**
 * private
 */

function getVueLoaders() {
  if (env === 'production') {
    return {
      css: ExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true,
            minimize: true
          }
        }],
        fallback: 'style-loader'
      })
    }
  }

  return {}
}
