import fps from '../../../../lib/fps'
import {
  sysCtx
} from '../preGet'
import {
  game
} from '../config'

let sysLayer = {

  fps: 0,
  lifeRate: 1,

  init: function () {

  },
  update: function () {

    this.updateFps()

  },

  updateFps: function () {
    const _fps = fps()
    _fps && (this.fps = _fps)
  },

  updateLifeProgress: function (rate) {
    this.lifeRate = rate
  },

  draw: function () {

    this.drawFps()
    this.drawLifeProgress()

  },

  drawFps: function () {
    sysCtx.font = '16px serif'
    sysCtx.fillText(`fps: ${this.fps}`, 16, 16)
  },

  drawLifeProgress: function () {
    sysCtx.strokeStyle = '#000'
    sysCtx.strokeRect(game.w / 5 * 2, 3, game.w / 5 * 1, 14)
    sysCtx.fillStyle = 'red'
    sysCtx.fillRect(game.w / 5 * 2 + 2, 5, (game.w / 5 * 1 - 4) * this.lifeRate, 10)
    sysCtx.fillStyle = '#000'
  },

  clear: function () {
    sysCtx.clearRect(0, 0, game.w, game.h)
  }

}

window.updateLifeProgress = sysLayer.updateLifeProgress.bind(sysLayer)

export default sysLayer
