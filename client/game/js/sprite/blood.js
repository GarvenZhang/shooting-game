import {
  map,
  box
} from '../config'
import Node from '../engine/node'
import {
  mapCtx
} from '../preGet'

class BloodBox extends Node {
  constructor (ops) {
    super()

    this.totalLife = 2
    this.life = 2
    this.type = 2

    ops && (this.x = ops.x)
    ops && (this.y = ops.y)
    this.w = box.w
    this.h = box.h
    this.type = 2
  }

  updateLife (num) {
    this.life += num

    if (this.life === 0) {
      const i = map.getIndex(this.x, this.y)

      map.matrix[i] = 0
    }
  }

  /**
   * 更新位置数据
   * @param {Number} x - x轴位移
   * @param {Number} y - y轴位移
   * @param {Number} curIndex - 当前在矩阵中的索引
   */
  update (x = 0, y = 0) {

    // const matrix = map.matrix
    //
    // // 之前的index
    // const oldIndex = map.getIndex(this.x, this.y)

    // 对象本身位置更新
    // this.x += x
    // this.y += y

    // // 现在的index
    // const newIndex = map.getIndex(this.x, this.y)
    //
    // // 交换
    // matrix[newIndex] = [matrix[oldIndex], matrix[oldIndex] = matrix[newIndex]][0]

    // const temp = matrix[oldIndex]
    // matrix[oldIndex] = matrix[newIndex]
    // matrix[newIndex] = temp

  }

  draw () {
    super.draw(mapCtx, this.x, this.y, 'medical.png')
  }
}

export default BloodBox
