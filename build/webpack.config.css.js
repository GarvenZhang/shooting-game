const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].css', // [name] 表示每个入口都有对应的css提取
      disable: false,
      allChunks: true
    })

  ]
}
