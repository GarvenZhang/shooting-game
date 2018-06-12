import {
  tower,
  img,
  spriteInfo
} from '../config'
import {
  mapCtx
} from '../preGet'
import Node from '../engine/node'

class Tower extends Node {

  constructor (ops) {

    super()
    Object.assign(this, tower)

    ops && (this.x = ops.x)
    ops && (this.y = ops.y)

    this.totalLife = 5
    this.type = 10
    this.soldier = []

  }

  draw () {
    super.draw(mapCtx, this.x, this.y, 'tower.png')
  }

}

export default Tower
