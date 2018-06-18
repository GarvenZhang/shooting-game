import Director from './engine/director'
import Sence from './engine/scene'
import playerLayer from './layer/playerLayer'
import soldierLayer from './layer/soldierLayer'
import toolLayer from './layer/toolLayer'
import sysLayer from './layer/sysLayer'
import {
  $playScene
} from './preGet'

import '../index.css'

// 实例化导演

// 游戏开始场景

// 游戏进行场景

let playingSence = new Sence({
  dom: $playScene
})

playingSence.add(toolLayer)
playingSence.add(soldierLayer)
playingSence.add(playerLayer)
playingSence.add(sysLayer)

Director.setStatus('GAME_PLAYING')

Director.add(playingSence)
Director.action(playingSence)

// 游戏结束场景
