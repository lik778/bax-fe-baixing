const { distPath } = require('./config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const env = process.env.NODE_ENV

console.log(env)

const cssLoaders = [
  env === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
  {
    loader: 'css-loader',
    options: {
      import: false,
      importLoaders: 1
    }
  }
]

module.exports = {
  entry: {
    signin: './template/signin',
    bax: './template/bax',
    huodong: './template/huodong',
    authorizationPage: './template/authorization-page',
    yibaisou: './template/yibaisou'
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
        loader: 'vue-loader'
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => /node_modules/.test(file)
      },
      {
        test: /\.css$/,
        use: [
          ...cssLoaders
        ]
      },
      {
        test: /\.scss$/,
        use: [
          ...cssLoaders,
          {
            loader: 'sass-loader'
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                './cssbase/vars.scss',
                './cssbase/mixins.scss'
              ]
            }
          }
        ]
      },
      {
        test: /\.(eot|woff|ttf|png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.css']
  },
  devtool: '#source-map',
  plugins: [
    new VueLoaderPlugin()
  ]
}
