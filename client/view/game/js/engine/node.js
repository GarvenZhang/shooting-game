import {
  map,
  spriteInfo,
  img,
  game
} from '../config'

/**
 * 父类：element对象
 * @param {Number} w - 宽度
 * @param {Number} h - 高度
 * @param {Number} x - x轴位移
 * @param {Number} y - y轴位移
 * @param {Number} life - 生命数
 * @param {Number} status - 状态
 */
function Node (opts = {w: 0, h: 0, x: 0, y: 0, life: 0, status: 0, direction: 'l', speed: 0}) {
  this.w = opts.w
  this.h = opts.h
  this.x = opts.x
  this.y = opts.y
  this.life = opts.life
  this.direction = opts.direction
  this.speed = opts.speed

  // 0 - 死亡
  // 1 - 正常
  this.status = opts.status

  // 0 - default 可行
  // 1 - obstacle箱
  // 2 - blood包
  // 3 - attack包
  // 10 - 塔
  // 11 - 玩家
  // 12 - 推塔兵
  // 13 - 进攻兵
  // 20 - 子弹
  this.type = 0
}

Node.prototype = {

  update: function (x, y) {
    this.x += x
    this.y += y
  },

  updateLife (num) {
    this.life += num
  },

  // /**
  //  * 手动修改数据
  //  * @param {Number} x - x轴位移
  //  * @param {Number} y - y轴位移
  //  * @param {Number} i - 当前在矩阵中的索引
  //  */
  // modify: function (x, y, type) {
  //
  //   const matrix = map.matrix
  //   const i = map.getIndex(x, y)
  //
  //   matrix[i] = type
  //
  // },

  /**
   * 绘制
   */
  draw (layer, x, y, sourceName) {

    // if (this.life <= 0) {
    //   return
    // }

    const sprite = img.sprite
    const source = spriteInfo[sourceName]
    layer.drawImage(sprite, source.x, source.y, source.w, source.h, x, y, this.w, this.h)

  }

}

export default Node
