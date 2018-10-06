const webpack = require('webpack')
const WebpacDevServer = require('webpack-dev-server')
const webpackConfig = require('./webpack.config.dev')
const config = require('../config')

let app = new WebpacDevServer(webpack(webpackConfig), {
  contentBase: false,
  public: `http://localhost:${config.DEV.CLIENTPORT}`,
  compress: true,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true
  },
  proxy: {
    '*': `http://localhost:${config.DEV.SERVERPORT}`,
    // '/': `http://localhost:${config.dev.serverPort}/login`,
    // 必须要有个路径，如果是*，则会找不到项目
    '/socket/*': `http://localhost:${config.DEV.SERVERPORT}`
  }
})

app.listen(config.DEV.CLIENTPORT, 'localhost', function (err) {
  if (err) {
    console.log(err)
  }
  console.log(`Listening at localhost:${config.DEV.CLIENTPORT}`)
})
