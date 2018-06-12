import preload from './preload'
import {
  addClass,
  removeClass
} from '../../../../lib/className'

// === 场景的工作原理：执行动画循环 === //
// === 场景初始化 -> 场景更新 -> 场景清除 -> 场景绘制 -> 场景更新 -> ... === //
function Scene (ops = {dom: null}) {

  this.dom = ops.dom
  this.raf = 0
  this.children = {}
  this.l = 0
}

/**
 * 添加场景并初始化
 * @param {Object} layer - 层
 */
Scene.prototype.add = function (layer) {
  this.children[this.l++] = layer
  layer.init()
}

Scene.prototype._run = function () {

  for (const i in this.children) {
    this.children[i].update()
  }

  for (const i in this.children) {
    this.children[i].clear()
    this.children[i].draw()
  }

  this.raf = requestAnimationFrame(() => {
    this._run()
  })

}

Scene.prototype.start = async function () {

  await preload()

  this._run()

}

Scene.prototype.stop = function () {

  cancelAnimationFrame(this.raf)

}

Scene.prototype.appear = function () {

  removeClass(this.dom, 'hide')

}

Scene.prototype.hide = function () {

  addClass(this.dom, 'hide')

}

export default Scene
