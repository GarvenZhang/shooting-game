const CDNCONFIG = require('../config').CDN

function imgSrcModifiedPlugin() {

}

imgSrcModifiedPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compilation.tap('imgSrcModifiedPlugin', (compilation) => {
    compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
      'imgSrcModifiedPlugin',
      (data, cb) => {
        
        data.html = data.html.replace(/<img src="(.+?)"/, `<img src="${CDNCONFIG.host}$1"`)

        cb(null, data)
      }
    )
  })
}

module.exports = imgSrcModifiedPlugin
