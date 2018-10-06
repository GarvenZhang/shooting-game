const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CDNCONFIG = require('../config').CDN

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
          publicPath: CDNCONFIG.host
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name]-[hash].css', // [name] 表示每个入口都有对应的css提取
      disable: false,
      allChunks: true
    })

  ]
}
