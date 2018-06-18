// === 寻路模式： === //
// === 1 深度优先搜索: 不一定最优 === //
// === 2 广度优先搜索 === //
// === 3 启发式搜索：跟人类的思考方式一样，兼并了性能与最优路径 === //
// === 3.1 A*算法 === //

// === A*寻路： === //
// === 1 估价函数：f(n) = g(n) + h(n) === //
// === 1.1 f(n): n节点估价函数 === //
// === 1.2 g(n): 初始点 到 n节点 的实际代价(路径长度) === //
// === 1.3 h(n): n节点 到 目标点 的实际代价(路径长度) === //
// === 2 思路： === //

import {
  map
} from '../config'

/**
 * 创造节点
 * // === 工厂模式：抽象了创建具体对象的过程，返回的都是同一类对象 === //
 * // === 缺点：无法识别对象类型 === //
 * @param {Number} value - 值
 * @return {Object}
 */
function node (value, i) {
  return {
    value,
    i
  }
}

// const matrix = map.matrix.map((item, i) => node(item, i))
const matrix = map.matrixObj
let openQueue
let closeQueue
let startIndex
let endIndex
let ret

/**
 * 初始化
 * @param {Object} source - 源对象
 * @param {Object} target - 目标对象
 */
function init (source, target) {
  // 初始化变量
  openQueue = []
  closeQueue = []
  startIndex = 0
  endIndex = 0
  ret = []

  // 起点，终点
  startIndex = map.getIndex(source.x, source.y)
  endIndex = map.getIndex(target.x, target.y)

  // 起点入open队列
  openQueue.push(matrix[startIndex])

  // 障碍物入close队列
  for (let l = matrix.length; l--;) {
    (matrix[l].value !== 0) && closeQueue.push(matrix[l])
  }

  // 开始寻路
  findPath()

  // 返回结果
  return ret
}

/**
 * 寻路
 */
// function findPath () {
//
//   // 从open队列中出队一个
//   const cur = openQueue.shift()
//
//   // 若为终点
//   // 填充路径
//   // 结束
//   if (cur.i === endIndex) {
//     const lastItem = closeQueue.pop()
//     findParent(lastItem)
//     return
//   }
//
//   // close队列接收
//   closeQueue.push(cur)
//
//   // 找到该index所指的格子的周围八个中的最优的一个格子
//   findNext(cur)
//
//   // 排序open队列，最优的在前
//   openQueue.sort(function (prev, next) {
//     return prev.num - next.num
//   })
//   // return
//   // 继续从open队列中寻
//   findPath()
//
// }

/**
 * 寻路
 * // === 尾递归优化版本： === //
 */
function findPath () {
  while (openQueue.length > 0) {
    // 从open队列中出队一个
    const cur = openQueue.shift()

    // 若为终点
    // 填充路径
    // 结束
    if (cur.i === endIndex) {
      const lastItem = closeQueue.pop()
      findParent(lastItem)
      break
    }

    // close队列接收
    closeQueue.push(cur)

    // 找到该index所指的格子的周围八个中的最优的一个格子
    findNext(cur)

    // 排序open队列，最优的在前
    openQueue.sort(function (prev, next) {
      return prev.num - next.num
    })
  }
}

/**
 * 寻找下一个最优的格子
 * @param {Number} index - 索引
 */
function findNext (item) {
  let _ret = []
  const curX = map.getX(item.i)
  const curY = map.getY(item.i)

  // 过滤某些格子
  // 如在前一次寻路中已经在其八个格子中出现过的
  for (let l = matrix.length; l--;) {
    filter(matrix[l]) && _ret.push(matrix[l])
  }

  // 找相邻的
  // 通过衡量两个的距离差值来判断
  // 即找到周围的8个
  for (let i = 0, l = _ret.length; i < l; ++i) {
    let _item = _ret[i]
    const itemX = map.getX(_item.i)
    const itemY = map.getY(_item.i)

    if (
      (Math.abs(curX - itemX) <= map.w) &&
      (Math.abs(curY - itemY) <= map.w)
    ) {
      // 计算估价值
      _item.num = f(_item)
      // 设置父节点
      _item.parent = item
      // 入open队列作为下一步
      openQueue.push(_item)
    }
  }
}

/**
 * 过滤函数
 * @param {Number} index - 索引
 * @return {Boolean}
 */
function filter (item) {
  // 若close队列中存在，则排除
  // 若open列表中存在，也排除
  return !closeQueue.some(_item => _item.i === item.i) && !openQueue.some(_item => _item.value === item.i)
}

/**
 * 估价函数f
 * @param {Object} item - 格子对象
 * @return {Number}
 */
function f (item) {
  return g(item) + h(item)
}

/**
 * 初始点 到 n节点 的实际代价(路径长度)
 * @param {Object} item - 格子对象
 * @return {Number}
 */
function g (item) {
  const x = map.getX(startIndex) - map.getX(item.i)
  const y = map.getY(startIndex) - map.getY(item.i)

  return Math.sqrt(Math.pow(x, 2), Math.pow(y, 2))
}

/**
 * n节点 到 目标点 的实际代价(路径长度)
 * @param {Object} item - 格子对象
 * @return {Number}
 */
function h (item) {
  const x = map.getX(endIndex) - map.getX(item.i)
  const y = map.getY(endIndex) - map.getY(item.i)

  return Math.sqrt(Math.pow(x, 2), Math.pow(y, 2))
}

/**
 * 往回寻找路径
 * @param {Object} item - 格子对象
 */
function findParent (item) {
  ret.unshift(item.i)

  if (item.parent.i === startIndex) {
    return
  }

  findParent(item.parent)
}

export default init
