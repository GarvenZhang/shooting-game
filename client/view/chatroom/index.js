import { $ } from '../../lib/$'
import TerminalInput from '../../lib/Terminal-Input'
import emotionsModule from '../../lib/emotions'

import './index.css'

let $postedMsgsWrap = $('.posted-msgs-wrap')
let $msgWrap = $('.msgs-wrap')
let $attrWrap = $('.attr-wrap')
let $input = $('.js-receiveKey')
let $popupWrap = $('.popup-wrap')
let $list = $('.emotions-list')
let $textarea = $('.terminal-input-textarea')

/**
 * socket.io服务
 */
let socket = io.connect()

// 登陆
let user = ''
socket.emit('login', '请求登陆')

socket.on('login', ret => {
  if (ret.name) {
    let html = `<p class="system-info">##${ret.name} entered##</p>`
    $postedMsgsWrap.innerHTML += html
    // 记录当前用户名
    user = ret.name
  } else if (ret.retCode === -1) {
    location.assign('/')
  }
})

// 房间属性
socket.on('chatroom-info', data => {
  let html = `
    <p>Total: <span>${data.names.length}</span></p>
  `
  data.names.forEach(item => {
    html += `<p>${item}</p>`
  })
  $attrWrap.innerHTML = html
})

// 发送信息
socket.on('post-message', data => {
  let html = `<p>${data.name === user ? '&gt; ' : ''}${data.name}[${data.time}]: ${data.message}</p>`
  $postedMsgsWrap.innerHTML += html
  // 滑倒底部
  $msgWrap.scrollTop = `100000000`
})

// 离开房间提醒
socket.on('user-leave', user => {
  let html = `<p class="system-info">--${user.name} left--</p>`
  $postedMsgsWrap.innerHTML += html
})

/**
 * 发送信息服务
 */
let $inputMsgWrap = $('.terminal-input-wrap')
function postFn (message) {
  socket.emit('post-message', message)
}

new TerminalInput(
  $inputMsgWrap,
  undefined,
  postFn
)

/**
 * 帮助服务
 */

// 打开帮助窗口
function openHelpLayer () {
  $popupWrap.classList.remove('hide')
}

// 关闭帮助窗口
function closeHelpLayer (e) {
  if (e.keyCode === 27) {
    $popupWrap.classList.add('hide')
  }
}

document.addEventListener('keyup', closeHelpLayer, false)

/**
 * 表情服务
 */
let selectFn = function (emotion) {
  $inputMsgWrap.click()
  $textarea.value += emotion
}

emotionsModule.init({
  widthCount: 15,
  heightCount: 7,
  width: 29,
  height: 29,
  selectFn,
  wrap: $list
})

// 打开表情窗口
function openEmotionsLayer (e) {
  if (e.keyCode === 16) {
    $list.classList.remove('hide')
    // 转移输入区域的焦点
    $input.focus()
  }
}

// 关闭表情窗口
function closeEmotionsLayer (e) {
  if (e.keyCode === 27) {
    $list.classList.add('hide')
  }
}

// 暂时不用表情功能
// document.addEventListener('keyup', openEmotionsLayer, false)
// document.addEventListener('keyup', closeEmotionsLayer, false)

