const fs = require('fs')
const path = require('path')

const rootDir = process.cwd()

/**
 * 将dist中的html加入reset.css link
 * // === 遍历文件夹中的文件，先检测后缀名，若为html则通过字符串的拼接来加入新字符；若为文件夹则递归 === //
 * @param {String} fpath - 路径
 */
// function addLink (fpath) {
//
//   const dir = fs.readdirSync(fpath)
//
//   dir.forEach(item => {
//
//     const pathname = path.join(fpath, item)
//
//     if (path.extname(item).slice(1) === 'html') {
//
//       let html = fs.readFileSync(pathname)
//
//       // 找到</title>
//       const titleEndIndex = html.indexOf('</title>')
//
//       // 加入reset.css
//       html = html.slice(0, titleEndIndex + 8) + '<link rel="stylesheet" href="./css/reset.css">' + html.slice(titleEndIndex + 8)
//       console.log(html)
//       // 重写
//       fs.writeFileSync(pathname, html)
//
//     }
//
//     const stats = fs.statSync(pathname)
//
//     if (stats.isDirectory()) {
//       addLink(pathname)
//     }
//
//   })
//
// }

/**
 * 修改资源输出
 * // === emit事件：发生 emit 事件时所有模块的转换和代码块对应的文件已经生成好，需要输出的资源即将输出，因此 emit 事件是修改 Webpack 输出资源的最后时机 === //
 * // === compilation.assets: 所有需要输出的资源会存放在 compilation.assets 中，compilation.assets 是一个键值对，键为需要输出的文件名称，值为文件对应的内容。 === //
 */
function AddResetCss () {

}

AddResetCss.prototype.apply = function (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    // 在dist中加入reset.css
    const resetCss = fs.readFileSync(path.resolve(rootDir, './client/reset.css'), 'utf8')

    // 设置名称为 fileName 的输出资源
    compilation.assets['css/reset.css'] = {

      // 返回文件内容
      source: () => {
        return resetCss
      },

      // 返回文件大小
      size: () => {
        return Buffer.byteLength(resetCss, 'utf8')
      }
    }

    callback()
  })
}

module.exports = AddResetCss
