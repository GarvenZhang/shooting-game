const webpack = require('webpack')
const WebpacDevServer = require('webpack-dev-server')
const webpackConfig = require('./webpack.config.dev')
const config = require('../server/auth/config')

let app = new WebpacDevServer(webpack(webpackConfig), {
  contentBase: false,
  public: `http://localhost:${config.dev.devPort}`,
  compress: true,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true
  },
  proxy: {
    '*': `http://localhost:${config.dev.serverPort}`
    // '/': `http://localhost:${config.dev.serverPort}/login`,
    // // 必须要有个路径，如果是*，则会找不到项目
    // '/socket/*': `http://localhost:${config.dev.serverPort}`
  }
})

app.listen(config.dev.devPort, 'localhost', function (err) {
  if (err) {
    console.log(err)
  }
  console.log(`Listening at localhost:${config.dev.devPort}`)
})
