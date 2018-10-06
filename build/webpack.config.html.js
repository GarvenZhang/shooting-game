const HtmlWebpackPlugin = require('html-webpack-plugin')
const imgSrcModifiedPlugin = require('./imgSrcModifiedPlugin')
const path = require('path')

const rootDir = process.cwd()

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, './client/login/index.html'),
      inject: true,
      minify: {
        removeComment: true,
        collapseWhitespage: true
      },
      chunks: [
        'login'
      ],
      filename: 'index.html'
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, './client/chatroom/index.html'),
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
      template: path.resolve(rootDir, './client/game/index.html'),
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

    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, './client/menu/index.html'),
      inject: true,
      minify: {
        removeComment: true,
        collapseWhitespage: true
      },
      chunks: [
        'menu'
      ],
      filename: 'menu.html'
    }),

    new imgSrcModifiedPlugin(),

  ]
}
