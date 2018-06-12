import { $ } from '../../lib/$'
import TerminalDialogue from '../../lib/Terminal-Dialogue'

import './index.css'

/**
 * 对话服务
 */
let $dialogueWrap = $('.dialogue-wrap')
let msgs = [
  {
    id: 1,
    html: '<p>[]Mon Jan 22 19:39:25 on 123.207.121.188[]</p>',
    status: [0],
    limited: []
  },
  {
    id: 2,
    html: '<p>Mr.garven: What\'s your name?</p>',
    status: [1],
    limited: []
  },
  {
    id: 3,
    html: '<p>user: <Terminal-Input/></p>',
    status: [2],
    limited: []
  },
  {
    id: 4,
    html: `
              <p>
                Mr.garven: What’s your email? (To be ease,only I know.Just to be
                sure that you can receive mine or others reply till
                that time.)
              </p>
            `,
    status: [1],
    limited: []
  },
  {
    id: 5,
    html: '<p>user: <Terminal-Input/></p>',
    status: [2],
    limited: []
  },
  {
    id: 6,
    html: '<p>Mr.garven: Would you like to remember above infomations?[y/n]</p>',
    status: [1],
    limited: []
  },
  {
    id: 7,
    html: '<p>user: <Terminal-Input/></p>',
    status: [2, 3],
    limited: ['y', 'n']
  },
  {
    id: 8,
    html: `
              <p>
                Mr.garven: Which type of chatroom would you wanna enter? Multiple or
                Personal[m/p]
              </p>
            `,
    status: [1],
    limited: []
  },
  {
    id: 9,
    html: '<p>user: <Terminal-Input/></p>',
    status: [2, 3],
    limited: ['m', 'p']
  }
]

let names = [
  'name', 'email', 'isRemember', 'type'
]

// 数据提交
function answersFn (answers) {

  // 生成form结构
  let form = document.createElement('form')
  form.action = '/login'
  form.method = 'post'

  // 把数据逐个放进去
  answers.forEach((item, index) => {
    let input = document.createElement('input')
    input.type = 'text'
    input.name = names[index]
    input.value = item
    form.appendChild(input)
  })

  // 提交按钮
  let btn = document.createElement('input')
  btn.type = 'submit'
  form.appendChild(btn)

  // 扔进body中提交
  document.body.appendChild(form)
  form.submit()

  // 移除
  document.body.removeChild(form)

}

// 终端对话插件调用
const dialogue = new TerminalDialogue(
  $dialogueWrap,
  msgs,
  answersFn
)

/**
 * 帮助服务
 */
let $popupWrap = $('.popup-wrap')

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
