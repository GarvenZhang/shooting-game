import Dictionary from './dictionary.js'
import Queue from './queue.js'
import Stack from './Stack.js'

/**
 * 图类
 */
class Graph {
  constructor () {
    this.vertices = []  // 存储顶点
    this.adjList = new Dictionary() // 存储边
    this.time = 0
  }

  /**
   * 添加顶点
   * @param {*} vertex 顶点
   */
  addVertex (vertex) {
    this.vertices.push(vertex)
    this.adjList.add(vertex, [])
  }

  /**
   * 添加边
   * @param {*} v 顶点
   * @param {*} w 相邻顶点
   */
  addEdge (v, w) {
    this.adjList.get(v).push(w)
    this.adjList.get(w).push(v)
  }

  /**
   * 转化成可视化字符串
   * @return {String}
   */
  toString () {
    let str = ''
    let vertices = this.vertices
    // 外层：遍历顶点
    for (var i = 0, l = vertices.length; i < l; ++i) {
      str += `${vertices[i]} -> `
      let neighbors = this.adjList.get(vertices[i])
      // 内层：遍历相邻顶点
      for (var j = 0, _l = neighbors.length; j < _l; ++j) {
        str += `${neighbors[j]} `
      }
      str += `\n`
    }
    return str
  }

  /**
   * 初始化颜色
   * @private
   * @return {Array}
   */
  initializeColor () {
    let color = []
    let vertices = this.vertices
    for (var i = 0, l = vertices.length; i < l; ++i) {
      color[vertices[i]] = 'white'
    }
    return color
  }

  /**
   * BFS
   * @param {*} v 顶点
   * @callback cb
   * @param {*} value 顶点的值
   */
  bfs (v, cb) {
    let color = this.initializeColor()
    let queue = new Queue()
    let vertices = this.vertices
    // 把开始的顶点入队
    queue.enqueue(v)
    // 初始化距离和前溯点
    let distance = []
    let predecessors = []
    vertices.forEach(item => {
      distance[item] = 0
      predecessors[item] = null
    })
    // 探索
    while (!queue.isEmpty()) {
      let u = queue.dequeue()
      let neighbors = this.adjList.get(u)
      // 被发现
      color[u] = 'grey'
      // 将相邻顶点加入待访问列表
      neighbors.forEach(item => {
        if (color[item] === 'white') {
          color[item] = 'grey'
          // u称为了item的前溯点
          predecessors[item] = u
          // 前溯点的距离 + 1
          distance[item] = distance[u] + 1
          queue.enqueue(item)
        }
      })
      // 被完全探索
      color[u] = 'black'
    }
    return {
      distance,
      predecessors
    }
  }

  /**
   * DFS
   * @returns {Object}
   */
  dfs () {
    let color = this.initializeColor()
    // 分别代表 发现时间，完全探索时间，前溯点
    let [d, f, p] = [[], [], []]
    // 初始化
    this.time = 0
    this.vertices.forEach(item => {
      d[item] = 0
      f[item] = 0
      p[item] = null
    })
    // 遍历
    this.vertices.forEach(item => {
      if (color[item] === 'white') {
        this.dfsVisit(item, color, d, f, p)
      }
    })
    return {
      discovery: d,
      finished: f,
      predecessors: p
    }
  }

  /**
   * BFS访问顶点
   * @param {*} u 顶点
   * @param {String} color 颜色 - 代表状态
   * @param {Array} d 发现时间的数组
   * @param {Array} f 探索完成时间的数组
   * @param {Array} p 前溯点
   * @private
   */
  dfsVisit (u, color, d, f, p) {
    color[u] = 'grey'
    // 发现时间
    d[u] = ++this.time
    // 相邻点递归
    let neighbors = this.adjList.get(u)
    neighbors.forEach(item => {
      if (color[item] === 'white') {
        // 前溯点记录
        p[item] = u
        this.dfsVisit(item, color, d, f, p)
      }
    })
    color[u] = 'black'
    // 完成时间
    f[u] = ++this.time
  }
}

export default Graph
