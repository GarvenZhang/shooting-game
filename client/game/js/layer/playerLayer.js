import keyboard from '../engine/keyboard'
import Player from '../sprite/tank'
import {
  playerCtx
} from '../preGet'
import {
  game,
  map
} from '../config'

let playerLayer = {

  children: {},

  init: function () {
    this.children.player = new Player()
  },

  update: function () {
    this.updatePlayer()
    this.updateBullets()
  },

  updatePlayer: function () {
    let player = this.children.player

    // 按左键
    if (keyboard.left) {
      player.move('l')
    }

    // 按右键
    if (keyboard.right) {
      player.move('r')
    }

    // 按上键
    if (keyboard.up) {
      player.move('u')
    }

    // 按下键
    if (keyboard.down) {
      player.move('d')
    }

    // 按空格
    if (keyboard.space) {
      player.shoot()
    }
  },

  updateBullets: function () {
    let bullets = this.children.player.children

    for (let i in bullets) {
      let bullet = bullets[i]

      // 边界检测
      if (bullet.isOut()) {
        delete bullets[i]
        return
      }

      // 碰撞检测
      if (bullet.hasCrash()) {
        delete bullets[i]
        return
      }

      bullet.fly()
    }
  },

  draw: function () {
    // player
    const player = this.children.player
    player.draw()

    // bullets
    const bullets = player.children

    for (const i in bullets) {
      bullets[i].draw()
    }
  },

  clear: function () {
    playerCtx.clearRect(0, 0, game.w, game.h)
  }

}

export default playerLayer
