import TerminalInput from '../Terminal-Input'

import './index.css'

/**
 * 终端对话模拟插件
 * @param {Node} wrap 包裹层
 * @param {Array} msgs 对话数据
 *  [
 *    {
   *      html: '<p>Mr.garven: Would you like to remember above infomations?[y/n]</p>',
   *      status: [1],
   *      limited: []
   *    },
 *    {
   *      html: '<p>user: <Terminal-Input/></p>',
   *      status: [3],
   *      limited: ['y', 'n']
   *    }
 *  ]
 * status: 0 - 提示； 1 - 问题； 2 - 需处理Ternimal-Input/有问题； 3 - 限定答案; 4 - 待检验; 5 - 通过检验
 * @param {Function} submitFn 对答案的处理函数
 *  let submitFn = function (answers) { // answers 是所有答案组成的数组，ex: [1, 'esfjl, 'helo', 'y']
 *    answers.forEach(item => {
 *
 *    })
 *  }
 */
class TerminalDialogue {
  constructor (wrap, msgs, submitFn) {
    this.wrap = wrap  // 包裹层
    this.msgs = msgs  // 对话信息
    this.submitFn = submitFn // 对答案的处理函数
    this.curMsg = null // 拷贝当前记录的数据
    this.answers = [] // 答案集合
    this.init()
  }
  /**
   * 需要把数据遍历出来
   * @return {String} ret 结果
   */
  createHtml () {
    let process = this.process.bind(this)
    let msgs = this.msgs
    let ret = ''
    for (var i = 0, msg; msg = msgs[i++]; ) {
      let isPaused = process(msg)
      ret += msg.html
      if (!isPaused) {
        break
      }
    }
    return ret
  }
  /**
   * 对每次遍历的数据进行判断
   * @param {Object} msg 单个数据
   * @return {Boolean}
   */
  process (msg) {
    let some = this.some
    let html = msg.html
    // 先拷贝
    this.curMsg = JSON.parse(JSON.stringify(msg))
    // 给每个标签加上`data-id`
    if (!(some(msg.status, 4) || some(msg.status, 5))) {
      html = html.replace(/^<p/, `<p data-id='${msg.id}' `)
    }
    // 把2中的自定义标签改了
    if (some(msg.status, 2)) {
      html = html.replace(/<Terminal-Input\/>/, '<span class="terminal-input-wrap"></span>')
    }
    // 把3中的limited放到`data-limited`中
    if (some(msg.status, 3)) {
      html = html.replace(/^<p/, `<p data-limited='${msg.limited}' `)
    }
    // 把2的变成4
    if (some(msg.status, 2)) {
      msg.html = html
      msg.status = [4]
    } else if (some(msg.status, 0) || some(msg.status, 1)) {
      msg.status = [5]
    }
    // 如果需要停顿
    if (/terminal-input-wrap/.test(html)) {
      return false
    }
    return true
  }
  /**
   * 检验数组中是否含有某值
   * @param {Array} arr 需检验的数组
   * @param {String|Number} value 需检验的值
   * @return {Boolean}
   */
  some (arr, value) {
    return arr.some(item => item === value)
  }
  /**
   * 提交答案的时候去检验数据合法性
   * @return {Boolean}
   */
  validate () {
    let curMsg = this.curMsg
    let wrap = this.wrap
    let msgs = this.msgs
    let answers = this.answers
    let some = this.some
    // 获取到答案
    let id = curMsg.id
    let reg = new RegExp(curMsg.html.replace(/<Terminal-Input\/>/, '(.+?)$').replace(/<.+?>/g, ''))
    let $p = wrap.querySelector(`[data-id='${id}']`)
    let html = $p.outerHTML
    let answer = reg.exec(html.replace(/<.+?>/g, ''))[1]
    // 其它检验
    if (/(?:^-h|^--help)/.test(answer)) {
      openHelpLayer()
      // 重置
      reset()
      return false
    }
    // 检验data-limited
    let ret = false
    if (/data-limited/.test(html)) {
      let limited = $p.getAttribute('data-limited').split(',')
      ret = some(limited, answer)
      // 限制性检验
      if (!ret) {
        reset()
        return false
      }
    }
    // 改变数据，答案放进集合
    for (var i = 0, msg; msg = msgs[i]; ++i) {
      if (msg.id === id) {
        msgs[i].html = html
        msgs[i].status = [5]
        break
      }
    }
    answers.push(answer)
    return true

    /**
     * 重置处理封装
     */
    function reset () {
      for (var i = 0, msg; msg = msgs[i]; ++i) {
        if (msg.id === id) {
          // 重置
          msgs[i] = JSON.parse(JSON.stringify(curMsg))
          break
        }
      }
    }
  }
  /**
   * 提交答案处理
   * @param {ObjecT} e 事件对象
   */
  enterHandle (e) {
    if (e.keyCode === 13) {
      // 检验答案合法性
      this.validate()
      // 是否全部对话完毕
      if (this.msgs.every(item => item.status[0] === 5)) {
        // 跳到下一个程序
        this.submitFn(this.answers)
        return
      }
      // 渲染试图
      this.update()
    }
  }
  /**
   * 更新
   */
  update () {
    this.wrap.innerHTML = this.createHtml()
    new TerminalInput(this.$('.terminal-input-wrap'))
    this.bindEvent()
  }
  /**
   * 绑定事件
   */
  bindEvent () {
    this.$('.terminal-input-textarea').addEventListener('keyup', this.enterHandle.bind(this), false)
  }
  /**
   * 查询
   */
  $ (selector) {
    return this.wrap.querySelector(selector)
  }
  /**
   * 初始化
   */
  init () {
    this.update()
  }
}

export default TerminalDialogue
