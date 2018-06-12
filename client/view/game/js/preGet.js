import { $ } from '../../../lib/$'
import { game } from './config'
import { set } from '../../../lib/style'

// 获取Node节点

export let $wrap = $('.game-wrap')
export let $startScene = $('.start-scene')
export let $playScene = $('.play-scene')
export let $endScene = $('.end-scene')
export let $allSence = [$startScene, $playScene, $endScene]

let $startLayer = $('.start-layer')
let $mapLayer = $('.map-layer')
let $playerLayer = $('.player-layer')
let $soldierLayer = $('.soldier-layer')
let $toolLayer = $('.tool-layer')
let $sysLayer = $('.sys-layer')
let $endLayer = $('.end-layer')

// 游戏开始场景 - 提示层
export let startCtx = $startLayer.getContext('2d')
!startCtx && alert('当前浏览器不支持canvas，请升级浏览器！')

// 游戏进行场景 - 地图画布
export let mapCtx = $mapLayer.getContext('2d')

// 游戏进行场景 - 道具画布
export let toolCtx = $toolLayer.getContext('2d')

// 游戏进行场景 - 道具画布
export let soldierCtx = $soldierLayer.getContext('2d')

// 游戏进行场景 - 玩家画布
export let playerCtx = $playerLayer.getContext('2d')

// 游戏进行场景 - 系统信息画布
export let sysCtx = $sysLayer.getContext('2d')

// 游戏结束场景 - 通告画布
export let endCtx = $endLayer.getContext('2d')

// 设置宽高

set($wrap, 'width', `${game.w}px`)
set($wrap, 'height', `${game.h}px`);

[$startLayer, $mapLayer, $playerLayer, $endLayer, $toolLayer, $sysLayer, $soldierLayer].forEach(item => {
  item.width = game.w
  item.height = game.h
})
