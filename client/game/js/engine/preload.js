// === 图片预加载：提前加载资源，当用户真正需要时从本地缓存中获取 === //
// === 1 结合css和js：在window的load事件触发后，通过js赋值background或者img的src来实现加载，但只有到了真正使用时才通过css移到可视区或者display出来，简单便捷 === //
// === 2 利用dom：通过new Image对象并赋值src值来加载，但并不会将该对象放到DON里面，即只进行资源的加载；之后就会去缓存中获取 === //
// === 3 利用ajax：通过 XMLHttpRequest2 的get请求获取，可更加详细地获取加载的进度等细节，但受同源限制，需跨域处理 === //

// === 获取对象属性个数: Object没有length属性，需要通过方法来获取 === //
// === 1 Object.keys(obj): 返回自身可枚举属性名(除Symbol)组成的数组 === //
// === 2 Object.getOwnPropertyNames(obj)：返回自身所有属性名(除Symbol)组成的数组  === //
// === 3 Reflect.ownKeys(obj)：返回自身所有属性名组成的数组 === //
// === 4 for..in: 遍历自身和继承的可枚举属性 === //

import { audio, img } from '../config'
import { addClass } from '../../../lib/className'

// 已加载的图片资源数量
let loadedImgsNum = 0
// 总共需加载的图片资源数量
let totalImg = Object.keys(img).length
// 已加载的音频资源数量
let loadedAudiosNum = 0
// 总共需加载的音频资源数量
let totalAudio = Object.keys(audio).length
// 浏览器支持的音频格式
let supportedFormat = ''

/**
 * 图片转换：将src转换成img对象
 * @param {String} src - 图片地址
 * @return {Promise}
 */
function transformImg (src) {
  return new Promise((resolve, reject) => {
    let img = new Image()

    img.onload = function () {
      ++loadedImgsNum
      resolve(this)
    }

    img.onerror = function (e) {
      reject(e)
    }

    img.src = src
  })
}

/**
 * 检测浏览器支持的音频格式
 * @return {String} 格式名称
 */
function supportWhichFormat () {
  let audio = new Audio()

  if (audio.canPlayType('audio/mpeg')) {
    return 'mp3'
  }

  if (audio.canPlayType('audio/ogg')) {
    return 'ogg'
  }
}

/**
 * 音频转换：将src转换成audio对象
 * @param {String} src - 音频文件地址，一开始不带后缀名，在这个函数中获取格式支持后再带上
 * @return {Promise}
 */
function transformAudio (src) {
  return new Promise((resolve, reject) => {
    src = src + '.' + supportedFormat

    let audio = new Audio(src)

    audio.addEventListener('canplaythrough', function () {
      ++loadedAudiosNum
      resolve(this)
    }, false)

    audio.onerror = function (e) {
      reject(e)
    }
  })
}

/**
 * 更新进度条
 */
function updateProgress () {
  // 已加载的比例
  const loaded = (loadedImgsNum + loadedAudiosNum) / (totalImg + totalAudio)

  // DOM更新
  $progress.style.transform = 'scaleX(' + loaded + ')'
  $percent.innerHTML = (loaded * 100 | 0) + '%'

  // 加载完毕
  if (loaded === 1) {
    addClass($percent, 'loaded-over')
  }
}

/**
 * 初始化：
 *  @param {Function} cb - 回调
 */
async function init (cb) {
  // 获取浏览器支持的格式
  supportedFormat = supportWhichFormat()

  // 音频处理
  for (let name in audio) {
    await transformAudio(audio[name])
      .then(obj => {
        audio[name] = obj
        // updateProgress(cb)
      })
  }

  // 图片处理
  for (let name in img) {
    await transformImg(img[name])
      .then(obj => {
        img[name] = obj
        // updateProgress(cb)
      })
  }
}

export default init
