
import './index.css'

/**
 * 表情选择插件
 * @example
 * emotionsModule.init({
 *   widthCount: 15,
 *   heightCount: 7,
 *   width: 29,
 *   height: 29,
 *   selectFn: function (emotion) {},
 *   wrap: $('.wrap')
 * })
 *
 * $('.js-receiveKey')为接受键盘事件的元素
 */
let emotionsModule = {
  data: [], // 数据集合
  curId: '',  // 当前选择项的id
  widthCount: 0,  // 每行个数
  heightCount: 0, // 每列个数
  width: 0, // 每个宽度
  height: 0,  // 每个高度
  selectFn: null, // 选择后的处理函数
  $list: null,  // 外层
  $input: null,  // 接受键盘事件用
  /**
   * 生成位置映射集合
   */
  createDataStruc: function () {
    let heightCount = this.heightCount
    let widthCount = this.widthCount
    let ret = []
    for (var i = 1; i <= heightCount; ++i) {
      for (var j = 1; j <= widthCount; ++j) {
        let obj = {}
        // id
        obj.id = `${i},${j}`
        // up
        if (i === 1) {
          obj.up = `${heightCount},${j}`
        } else {
          obj.up = `${i - 1},${j}`
        }
        // down
        if (i === heightCount) {
          obj.down = `1,${j}`
        } else {
          obj.down = `${i + 1},${j}`
        }
        // left
        if (j === 1) {
          obj.left = `${i},${widthCount}`
        } else {
          obj.left = `${i},${j - 1}`
        }
        // right
        if (j === widthCount) {
          obj.right = `${i},1`
        } else {
          obj.right = `${i},${j + 1}`
        }
        // isCur
        obj.isCur = false
        ret.push(obj)
      }
    }
    this.data = ret
  },
  /**
   * 生成html
   * @return {String}
   */
  createHtml: function () {
    let html = ''
    this.data.forEach(item => {
      let pos = item.id.split(',')
      let x = pos[0]
      let y = pos[1]
      let _width = -(y - 1) * this.width
      let _height = -(x - 1) * this.height
      html += `<a class="emotions-item emotions-${x}-${y}" style="background-position: ${_width}px ${_height}px;"></a>`
    })
    // 转移键盘事件用
    html += `
      <input type="text" class="js-receiveKey">
    `
    return html
  },
  /**
   * 更新状态
   * @param {String} id 位置标记
   */
  updateData: function (id) {
    let data = this.data
    let l = data.length
    // reset
    while (l--) {
      let item = data[l]
      if (item.isCur === true) {
        item.isCur = false
        break
      }
    }
    // update
    l = data.length
    while (l--) {
      let item = data[l]
      if (item.id === id) {
        item.isCur = true
        return
      }
    }
  },
  /**
   * 更新UI
   * @param {String} id 位置标记
   */
  updateUI: function (id) {
    let $list = this.$list
    let $ = this.$.bind(this)
    // 获取x,y
    let pos = id.split(',')
    let x = pos[0]
    let y = pos[1]
    // 把之前的状态取消
    let $isCur = $('.isCur')
    $isCur.classList.remove('isCur')
    // 更新
    $isCur = $(`.emotions-${x}-${y}`)
    $isCur.classList.add('isCur')
  },
  /**
   * 更新
   * @param {String} id 位置标记
   */
  update: function (id) {
    this.updateData(id)
    this.updateUI(id)
  },
  /**
   * 获取位置
   * @return {String}
   */
  getEmotion () {
    let pos = this.curId.split(',')
    let x = pos[0]
    let y = pos[1]
    return `[${x},${y}]`
    // return `<a class="emotions-item emotions-${x}-${y}" style="background-position: ${-(x - 1) * this.width}px ${-(y - 1) * this.height}px;"></a>`
  },
  /**
   * 选取
   */
  control: function(e) {
    let self = this
    switch (e.keyCode) {
      case 37:
        judge('left')
        break
      case 38:
        judge('up')
        break
      case 39:
        judge('right')
        break
      case 40:
        judge('down')
        break
      case 13:
        let emotion = this.getEmotion()
        this.selectFn(emotion)
    }
    // 判断更新的封装
    function judge (attr) {
      for (var i = 0, item; item = self.data[i++];) {
        if (item.id === self.curId) {
          self.curId = item[attr]
          break
        }
      }
      self.update(self.curId)
    }
  },
  $: function (selector) {
    return this.$list.querySelector(selector)
  },
  /**
   * 绑定事件
   */
  bindEvent: function() {
    this.$input.addEventListener('keyup', this.control.bind(this), false)
  },
  /**
   * 初始化
   * @param {Object} options 选项
   */
  init: function (options) {
    this.widthCount = options.widthCount
    this.heightCount = options.heightCount
    this.width = options.width
    this.height = options.height
    this.selectFn =  options.selectFn
    this.$list = options.wrap
    // 创建数据结构
    this.createDataStruc()
    // 生成html
    this.$list.innerHTML = this.createHtml()
    this.$input = $('.js-receiveKey')
    // 绑定事件
    this.bindEvent()
    // 初始化状态
    this.data[0].isCur = true
    this.$list.querySelector('.emotions-1-1').classList.add('isCur')
    this.curId = '1,1'
  }
}

export default emotionsModule
