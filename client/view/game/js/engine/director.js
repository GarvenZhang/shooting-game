import keyboard from './keyboard'
import {
  game,
  CONST
} from '../config'

document.addEventListener('keydown', keyboard.keydown.bind(keyboard), false)
document.addEventListener('keyup', keyboard.keyup.bind(keyboard), false)

// 导演
let Director = window.Director = {
  scenes: [], // 场景集合
  curScene: null, // 当前场景
  status: game.status
}

Director.add = function (scene) {
  this.scenes.push(scene)
}

Director.setStatus = function (status) {
  this.status = CONST[status]
}

Director.action = function (scene) {

  // reset
  this.scenes.forEach(item => {

    // 场景都消失
    item.hide()
    // 取消动画循环
    item.stop()
  })

  // 开启
  scene.appear()
  scene.start()

  this.curScene = scene
}

Director.cut = function () {

}

Director.next = function () {

}

export default Director
