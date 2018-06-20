// === css雪碧图：把多个小的图片整合成一张大的图片 === //
// === 1 优缺点：减少http请求数量，但若太大会加载很慢，所以要平衡好保证减少http请求的同时保证加载速度 === //
// === 2 工具: texturepacker === //
// === 2.1 注意点：在用texturepacker打包的时候，一定要先点击每个图片看看是否同一系列的图片选区大小一致，方向是否正确，这些都可以通过右边的packing算法栏选择，只好是basic === //
const fs = require('fs')
const initJson = require('../client/view/game/img/sprite.json').frames

let ret = {}
initJson.forEach(item => {
  ret[item.filename] = item.frame
})

fs.writeFileSync('./sprite.js', `export default ${JSON.stringify(ret)}`)
