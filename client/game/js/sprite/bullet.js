import Node from '../engine/node'
import {
  bullet,
  game,
  map
} from '../config'
import {
  playerCtx
} from '../preGet'

/**
 * 子类 Bullet 子弹对象
 */
class Bullet extends Node {
  constructor (ops) {
    super()

    Object.assign(this, bullet)

    this.tank = ops.tank || null
    this.x = ops.x
    this.y = ops.y
    this.type = 20
    this.direction = ops.direction
  }

  /**
   * 子弹飞行
   */
  fly () {
    const direction = this.direction
    const speed = this.speed

    if (direction === 'l') {
      this.update(-speed, 0)
    } else if (direction === 'r') {
      this.update(speed, 0)
    } else if (direction === 'u') {
      this.update(0, -speed)
    } else if (direction === 'd') {
      this.update(0, speed)
    }
  }

  /**
   * 判断子弹是否出界
   * @return {Boolean}
   */
  isOut () {
    return this.x < 0 || this.x > game.w || this.y < 0 || this.y > game.h
  }

  /**
   * 判断是否和物体碰撞
   * @return {Boolean}
   */
  hasCrash () {
    const x = this.x
    const y = this.y
    let ret = false

    function _isCrash (obj) {
      const children = obj.children

      // 若有children则递归
      if (children) {
        for (const i in children) {
          _isCrash(children[i])
        }
      } else if (typeof obj.x !== 'undefined' && obj.type !== 11 && obj.type !== 20) {
        // 子弹消失
        // === 为什么： && !(x + self.w < obj.x) && !(obj.x + map.w < x) && !(y + self.h < obj.y) && !(obj.y + map.h < y) 不行 === //
        if (Math.abs(obj.y - y) < map.w && Math.abs(obj.x - x) < map.w) {
          obj.updateLife(-1)
          window.updateLifeProgress(obj.life / obj.totalLife)

          ret = true
        }
      }
    }

    _isCrash(Director.curScene)

    return ret
  }

  draw () {
    super.draw(playerCtx, this.x, this.y, `bullet_${this.direction}.gif`)
  }
}

export default Bullet
