import {
  map,
  game
} from '../config'
import {
  mapCtx
} from '../preGet'
import Attack from '../sprite/attack'
import Obstacle from '../sprite/obstacle'
import Blood from '../sprite/blood'
import Tower from '../sprite/tower'

const matrix = map.matrix
const w = map.w

let toolLayer = {

  children: {},

  init: function () {

    // 遍历行
    for (let rows = map.rows; rows--; ) {
      // 遍历列
      for (let cols = map.cols; cols--; ) {

        const i = rows * map.cols + cols

        // 渲染类型编号
        const type = matrix[i]
        const x = cols * w
        const y = rows * w

        // 初始化不同类型
        switch (type) {
          case 1:
            this.children[i] = new Obstacle({x, y})
            break
          case 2:
            this.children[i] = new Blood({x, y})
            break
          case 3:
            this.children[i] = new Attack({x, y})
            break
          case 10:
            this.children[i] = new Tower({x, y})
            break
        }

      }
    }
  },

  update: function () {

    for (let i in this.children) {
      if (this.children[i].life === 0) {
        delete this.children[i]
      }
    }

  },

  draw: function () {
    for (let i in this.children) {
      this.children[i].draw()
    }
  },

  clear: function () {
    mapCtx.clearRect(0, 0, game.w, game.h)
  }
}

export default toolLayer
