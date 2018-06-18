// === FPS(帧频)：每秒帧数 === //
// === 1 检测： === //
// === 1.1 开发者工具：More tools -> Rendering -> FPS meter === //
// === 1.2 Frame Timing API: Web Performance Timing API中的一员，兼容性不行 === //
// === 1.3 requestAnimationFrame: 每动画循环一次，帧数自增1；1s后用帧数除以时间间隔则得出fps === //

// 1s内帧数
let frame = 0
// 上次计算fps时的时间
let lastTime = 0

/**
 * 计算fps
 * @return {Numner} - fps
 */
export default function () {
  const now = Date.now()

  ++frame

  let fps = 0

  // 检测是否自上次检测后过了1s
  if (now >= 1000 + lastTime) {
    // 乘以1000，由ms换算成s
    fps = (frame * 1000) / (now - lastTime) | 0

    // 重置
    frame = 0
    lastTime = now

    return fps
  }
}
