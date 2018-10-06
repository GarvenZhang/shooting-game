const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const htmlHandle = require('./webpack.config.html')
const cssHandle = require('./webpack.config.css')
const jsHandle = require('./webpack.config.js')
const rootDir = process.cwd()
const distDir = path.resolve(rootDir, './dist')
const CDNConfig = require('../config').CDN
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

  mode: 'production',

  output: {
    path: distDir,
    filename: 'js/[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: CDNConfig.host,
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
              name: 'img/[name].[ext]',
              publicPath: CDNConfig.host,
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
              name: 'audio/[name].[ext]',
              publicPath: CDNConfig.host,
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
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),

    new ParallelUglifyPlugin({
      // 传递给 UglifyJS 的参数
      uglifyES: {
        output: {
          // 最紧凑的输出
          beautify: true,
          // 删除所有的注释
          comments: true
        },
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true
        }
      },
      include: process.cwd(),
      exclude: 'node_moduels'
    })
  ]

}, htmlHandle, cssHandle, jsHandle)
