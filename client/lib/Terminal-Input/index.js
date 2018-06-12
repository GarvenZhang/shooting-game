import { $ } from '../../lib/$'

import './index.css'

/**
 * 终端输入模拟插件
 * @param {Node} wrap 包裹层
 * @param {Node} output 输出层
 * @example
 *    <div class="terminal-input-wrap"></div>
 *
 *    let wrap = document.querySelector('.terminal-input-wrap')
 *    new TerminalInput(wrap)
 * @private
 */
class TerminalInput {

  constructor (wrap, output, resultFn) {
    this.$wrap = wrap // 包裹层
    this.$text = null // 可视化层
    this.resultFn = resultFn // 发送后需执行的函数
    this.$textarea = null // 实际层
    this.$blurtab = null  // tab转移层
    this.$output = output // 输出层
    this.init()
  }

  /**
   * 获取节点
   * @param {String} selector 选择符
   * @return {Node}
   */
  $ (selector) {
    let $wrap = this.$wrap
    return $wrap.querySelector(selector)
  }

  /**
   * 创建html基本结构
   */
  createHtml () {

    let $wrap = this.$wrap
    $wrap.innerHTML = `
        <p class="terminal-input-text"></p>
        <textarea class="terminal-input-textarea" cols="30" rows="10"></textarea>
      `
    this.createFakeTab()
  }

  /**
   * 创建input，"禁用"tab键
   */
  createFakeTab () {

    if ($('.js-blur-tab')) {
      return
    }

    let input = document.createElement('input')
    input.className = 'js-blur-tab'
    input.type = 'text'
    document.body.appendChild(input)

  }

  /**
   * 根据textarea内容生成span
   * @param {String} value textarea中的输入内容
   * @param {String} selectionStart 光标在内容中的位置
   */
  createContent (value, selectionStart) {

    let createSpan = this.createSpan
    let beforeStr = ''
    let afterStr = ''
    let ret = ''
    let cursor = '<span class="cursor-before-and-after cursor-char"></span>'

    // 转换成数组
    // 空格转义
    let before = value.substring(0, selectionStart).split('').map(item => /\s/.test(item) ? '&nbsp;' : item)
    let after = value.substring(selectionStart, value.length).split('').map(item => /\s/.test(item) ? '&nbsp;' : item)

    // 若还没有内容
    if (before.length === 0 && after.length === 0) {
      ret = cursor
      // 若光标在最后（正常态）
    } else if (before.length > 0 && after.length === 0) {
      before.forEach(item => {
        beforeStr += createSpan(item)
      })
      ret = `
        <span class="cursor-before">
          ${beforeStr}
        </span>
        ${cursor}
      `
      // 若光标被左右键移动
    } else if (after.length > 0) {
      before.forEach(item => {
        beforeStr += createSpan(item)
      })
      after.slice(1).forEach(item => {
        afterStr += createSpan(item)
      })
      ret = `
        <span class="cursor-before">
          ${beforeStr}
        </span>
        <span class="cursor-after">
          <span class="cursor-middle cursor-char ${/\w/.test(after[0]) ? 'en' : 'cn'}">${after[0]}</span>
          ${afterStr}
        </span>
      `
    }

    // 替换掉换行与空格
    return ret.replace(/(?:[\r\n]|\s{2,})/g, '')

  }

  /**
   * 生成span
   * @param {String} value 字符
   * @return {String}
   */
  createSpan (value) {
    return /\w/.test(value) ? `<span class="cursor-char en">${value}</span>` : `<span class="cursor-char cn">${value}</span>`
  }

  /**
   * 获焦处理
   */
  focusHandle (e) {

    let $text = this.$text
    let $textarea = this.$textarea

    // 默认光标
    if ($text.innerHTML === '') {
      $text.innerHTML = '<span class="cursor-before-and-after cursor-char"></span>'
    }

    $textarea.focus()
    $text.classList.add('shrink')
    e.stopPropagation()

  }

  /**
   * 失焦处理
   */
  blurHandle () {

    let $text = this.$text
    $text.classList.remove('shrink')

  }

  /**
   * 禁止tab键处理
   */
  tabHandle (e) {
    let $blurtab = this.$blurtab
    if (e.keyCode === 9) {
      $blurtab.focus()
    }
  }

  /**
   * 键入处理
   */
  keyupHandle (e) {

    let $wrap = this.$wrap
    let $text = this.$text
    let $output = this.$output
    let $textarea = this.$textarea

    let createContent = this.createContent.bind(this)
    let resultFn = this.resultFn

    // 转换内容到p标签
    $text.innerHTML = createContent($textarea.value, $textarea.selectionStart)

    // 发送
    if (e.keyCode === 13) {

      // 特殊字符检验
      if (/(?:^-h|^--help)/.test($textarea.value)) {
        openHelpLayer()
      // 若有函数可执行
      } else if (resultFn) {
        resultFn($textarea.value)
      // 若需输出到相应的UI上
      } else if ($output) {
        $output.innerHTML += $output.innerHTML
      // 替换掉
      } else {
        $wrap.outerHTML = $textarea.value.replace(/[\r\n]/g, '')
      }

      // reset
      $textarea.value = ''
      $text.innerHTML = '<span class="cursor-before-and-after cursor-char"></span>'

    }
  }

  /**
   * 绑定事件
   */
  bindEvent () {

    let $text = this.$text
    let $textarea = this.$textarea

    $text.addEventListener('click', this.focusHandle.bind(this), false)
    document.addEventListener('click', this.blurHandle.bind(this), false)
    document.addEventListener('keydown', this.tabHandle.bind(this), false)
    $textarea.addEventListener('keyup', this.keyupHandle.bind(this), false)
  }

  /**
   * 初始化
   */
  init () {

    this.createHtml()

    this.$text = $('.terminal-input-text')
    this.$textarea = $('.terminal-input-textarea')
    this.$blurtab = $('.js-blur-tab')
    this.$content = $('.content')

    this.bindEvent()

    this.$text.click()

  }

}

export default TerminalInput
