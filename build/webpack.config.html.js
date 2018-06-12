const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const rootDir = process.cwd()

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, './client/view/login/index.html'),
      inject: true,
      minify: {
        removeComment: true,
        collapseWhitespage: true
      },
      chunks: [
        'login'
      ],
      filename: 'login.html'
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, './client/view/chatroom/index.html'),
      inject: true,
      minify: {
        removeComment: true,
        collapseWhitespage: true
      },
      chunks: [
        'chatroom'
      ],
      filename: 'chatroom.html'
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, './client/view/game/index.html'),
      inject: true,
      minify: {
        removeComment: true,
        collapseWhitespage: true
      },
      chunks: [
        'game'
      ],
      filename: 'game.html'
    }),
  ]
}
