import Node from '../engine/node'
import Bullet from './bullet'
import {
  tank,
  img,
  spriteInfo,
  game,
  map,
  bullet
} from '../config'
import {
  playerCtx
} from '../preGet'

/**
 * Tank 坦克
 */
class Tank extends Node {

  constructor (ops) {
    super()
    Object.assign(this, tank)

    ops && (this.x = ops.x)
    ops && (this.y = ops.y)

    this.children = {}
    this.l = 0
    this.type = 11
    this.life = 5
    this.totalLife = 5

    // 控制射击频率
    this.lastShoot = Date.now()

  }

  /**
   * 边界检测
   */
  willOut () {

    const direction = this.direction
    const speed = this.speed

    switch (direction) {

      case 'l':

        if (this.x - speed < 0) {
          return true
        }
        break

      case 'r':

        if (this.x + this.w + speed > game.w) {
          return true
        }
        break

      case 'u':

        if (this.y - speed < 0) {
          return true
        }
        break

      case 'd':

        if (this.y + this.h + speed > game.h) {
          return true
        }
        break

    }

    return false

  }

  /**
   * 碰撞检测
   * @return {Boolean}
   */
  detectCrash () {
    return this.willCrashTools() || this.didCrashedBullet() || this.didCrashedPlayer()
  }

  /**
   * 检测是否碰撞到道具
   * // === 思路：将坦克坐标放进map中去比较会更加容易 === //
   * // === 由坦克y坐标检测到属于map中二维格子中的哪一列，再逐一与该列中的每个格子进行碰撞检测 === //
   */
  willCrashTools () {

    let x = this.x
    let y = this.y

    switch (this.direction) {
      case 'l':
        x -= this.speed
        break
      case 'r':
        x += this.speed
        break
      case 'u':
        y -= this.speed
        break
      case 'd':
        y += this.speed
        break
    }

    // // 找出处于map中那一列
    // const l = map.cols * map.rows
    // let arr = []
    // let i = x / map.w | 0
    // let j = i + 1
    //
    // do {
    //   arr.push({
    //     x: (i % map.cols | 0) * map.w,
    //     y: (i / map.cols | 0) * map.w,
    //     i
    //   })
    //   i += map.cols
    // } while (i < l)
    //
    // do {
    //   arr.push({
    //     x: (j % map.cols | 0) * map.w,
    //     y: (j / map.cols | 0) * map.w,
    //     i: j
    //   })
    //   j += map.cols
    // } while (j < l)
    let ret = false

    function _isCrash (obj) {

      const children = obj.children

      // 若有children则递归
      if (children) {

        for (const i in children) {
          _isCrash(children[i])
        }

      } else if (typeof obj.x !== 'undefined' && obj.type !== 11) {

        // === 为什么： && !(x + self.w < obj.x) && !(obj.x + map.w < x) && !(y + self.h < obj.y) && !(obj.y + map.h < y) 不行 === //
        if (Math.abs(obj.y - y) < map.w && Math.abs(obj.x - x) < map.w) {
          ret = true
        }

      }

    }

    _isCrash(Director.curScene)

    return ret

  }

  /**
   * 检测是否碰撞到敌方子弹
   */
  didCrashedBullet () {
    return false
  }

  /**
   * 检测是否碰撞到敌方坦克
   */
  didCrashedPlayer () {
    return false
  }

  /**
   * 移动
   */
  move (direction) {

    const speed = this.speed

    // 记录方向
    this.direction = direction

    // 边界检测
    if (this.willOut()) {
      return
    }

    // 碰撞检测
    if (this.detectCrash()) {
      return
    }

    // 判断移动的方向
    switch (direction) {

      case 'l':
        this.update(-speed, 0)
        break
      case 'r':
        this.update(speed, 0)
        break
      case 'u':
        this.update(0, -speed)
        break
      case 'd':
        this.update(0, speed)
        break

    }
  }

  /**
   * 射击
   */
  shoot () {

    const direction = this.direction

    // 200毫秒内，可以射击一次
    if (Date.now() - this.lastShoot <= 200) {
      return
    }

    // 计算子弹位置
    // 数值是测试出来的
    let x = this.x
    let y = this.y

    // switch (direction) {
    //
    //   case 'l':
    //   case 'r':
    //     y -= 3
    //     break
    //   case 'u':
    //   case 'd':
    //     x += 9
    //     break
    //
    // }

    // 创建子弹
    this.children[this.l++] = new Bullet({
      x,
      y,
      direction,
      tank: this
    })

    // 更新上次射击时间
    this.lastShoot = new Date()
  }

  draw () {
    super.draw(playerCtx, this.x, this.y, `player1_${this.direction}.gif`)
  }
}

export default Tank
