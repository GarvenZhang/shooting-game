import {
  box
} from '../config'
import Node from '../engine/node'
import {
  mapCtx
} from '../preGet'

class ObstacleBox extends Node {

  constructor (ops) {

    super()

    this.life = Infinity
    this.type = 1

    ops && (this.x = ops.x)
    ops && (this.y = ops.y)
    this.w = box.w
    this.h = box.h

  }

  draw () {
    super.draw(mapCtx, this.x, this.y, 'steel.gif')
  }

}

export default ObstacleBox
