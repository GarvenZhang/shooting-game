const webpack = require('webpack')
const WebpacDevServer = require('webpack-dev-server')
const webpackConfig = require('./webpack.config.dev')

const createIndexServer = (port) => {
  let app = new WebpacDevServer(webpack(webpackConfig), {
    contentBase: false,
    public: `http://localhost:${port}`,
    compress: true,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  })

  app.listen(port, 'localhost', function (err) {
    if (err) {
      console.log(err)
    }
    console.log(`Listening at localhost:${port}`)
  })
}

createIndexServer(3007)
