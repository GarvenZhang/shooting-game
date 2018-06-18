/**
 * 键盘操作相关对象
 */
let keyboard = {}

keyboard.up = false
keyboard.down = false
keyboard.left = false
keyboard.right = false
keyboard.space = false

keyboard.keydown = function (e) {
  // 获取键位
  const key = e.keyCode

  switch (key) {
    // 点击空格
    case 32:
      this.space = true
      break
    // 点击向上
    case 38:
      this.down = false
      this.up = true
      break
    // 点击向下
    case 40:
      this.up = false
      this.down = true
      break
    // 点击向左
    case 37:
      this.left = true
      this.right = false
      break
    // 点击向右
    case 39:
      this.left = false
      this.right = true
      break
  }
}

keyboard.keyup = function (e) {
  // 获取键位
  const key = e.keyCode

  switch (key) {
    case 32:
      this.space = false
      break
    case 37:
      this.left = false
      break
    case 38:
      this.up = false
      break
    case 39:
      this.right = false
      break
    case 40:
      this.down = false
      break
  }
}

export default keyboard
