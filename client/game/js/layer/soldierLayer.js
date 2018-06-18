import {
  soldier1,
  soldier2,
  spriteInfo,
  game
} from '../config'
import {
  soldierCtx
} from '../preGet'
import Soldier from '../sprite/soldier'

let soldierLayer = {

  children: {},

  init: function () {
    for (let i in soldier1) {
      this.children[`soldier1-${i}`] = new Soldier({
        x: soldier1[i].x,
        y: soldier1[i].y
      })
    }

    // for (let i in soldier2) {
    //
    //   this.children[`soldier2-${i}`] = new Soldier({
    //     x: soldier2[i].x,
    //     y: soldier2[i].y
    //   })
    //
    // }
  },

  update: function () {
    for (let i in this.children) {
      this.children[i].move()
    }
  },

  draw: function () {
    for (let i in this.children) {
      this.children[i].draw(i.substr(0, 8))
    }
  },

  clear: function () {
    soldierCtx.clearRect(0, 0, game.x, game.y)
  }

}

export default soldierLayer
