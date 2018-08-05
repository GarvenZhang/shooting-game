const path = require('path')
const fs = require('fs')
const postcss = require('postcss')
const sprites = require('postcss-sprites')
const webpack = require('webpack')
const merge = require('webpack-merge')
const WriteFilePlugin = require('write-file-webpack-plugin')

const AddResetCss = require('./addResetCss')
const htmlHandle = require('./webpack.config.html')
const cssHandle = require('./webpack.config.css')
const jsHandle = require('./webpack.config.js')
const rootDir = process.cwd()
const distDir = path.resolve(rootDir, './dist')
// const css = fs.readFileSync(path.resolve(rootDir, './client/css/style.css'), 'utf8')
//
// const spritesOpts = {
//   stylesheetPath: distDir,
//   spritePath: path.resolve(distDir, './image')
// }
//
// postcss([sprites(spritesOpts)])
//   .process(css, {
//     from: path.resolve(rootDir, './client/css/style.css'),
//     to: path.resolve(rootDir, './css/style.css')
//   })
//   .then(result => {
//     fs.writeFileSync(path.resolve(rootDir, './client/css/style.css'), result.css)
//   })

module.exports = merge({

  mode: 'development',
  devtool: 'source-map',

  output: {
    path: distDir,
    filename: 'js/[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
    globalObject: 'this'
  },

  resolve: {
    extensions: [
      '.js'
    ]
  },

  module: {

    rules: [

      {
        test: /\.js$/,
        include: path.resolve(rootDir, './client'),
        exclude: path.resolve(rootDir, './node_modules'),
        loader: 'babel-loader'
      },

      {
        test: /\.(svg|eot|woff|ttf|woff2|jpg|png|gif|jpeg|bmp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]'
            }
          }
        ]
      },

      {
        test: /\.(mp3|ogg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'audio/[name].[ext]'
            }
          }
        ]
      },

      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader'
        }
      }

    ]

  },

  plugins: [

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),

    new AddResetCss(),
    new WriteFilePlugin()
  ]

}, htmlHandle, cssHandle, jsHandle)
