import {
  soldier,
  soldier1,
  soldier2
} from '../config'
import Node from '../engine/node'
import {
  soldierCtx
} from '../preGet'
// === webpack中使用web worker： === //
// === 1 安装worker-loader === //
// === 2 webpack配置loader === //
// === 3 引入： worker-loader![url] === //
import MyWorker from 'worker-loader!../engine/worker.js'

class Soldier extends Node {

  constructor (ops) {

    super()
    Object.assign(this, soldier)

    ops && (this.x = ops.x)
    ops && (this.y = ops.y)

    this.findPath()
    // console.log(this.path)

  }

  move () {
    // === 若使用Astar寻路，性能消耗太大了 === //
    // this.findPath()

  }

  findPath () {

    let worker = new MyWorker()

    worker.postMessage(this)

    worker.onmessage = (e) => {
      this.path = e.data
    }
  }

  attack () {

  }

  draw (name) {
    super.draw(soldierCtx, this.x, this.y, `${name}_${this.direction}.gif`)
  }
}

export default Soldier
