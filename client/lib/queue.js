/**
 * 队列类
 */
class Queue {
  constructor () {
    this.dataStore = []
  }
  /**
   * 入队
   * @param {*} data 数据
   */
  enqueue (data) {
    this.dataStore.push(data)
  }
  /**
   * 出队
   * @return {*}
   */
  dequeue () {
    return this.dataStore.shift()
  }
  /**
   * 获取队首元素
   * @return {*}
   */
  getFront () {
    return this.dataStore[0]
  }
  /**
   * 获取队尾元素
   * @return {*}
   */
  getBack () {
    let dS = this.dataStore
    return dS[dS.length - 1]
  }
  /**
   * 转化为可视化字符串
   * @return {String}
   */
  toString () {
    let result = ''
    this.dataStore.forEach(item => {
      result += `${item} \n`
    })
    return result
  }
  /**
   * 是否空
   * @return {Boolean}
   */
  isEmpty () {
    return this.dataStore.length === 0
  }
  /**
   * 获取队列长度
   * @return {Number}
   */
  getCount () {
    return this.dataStore.length
  }
}

export default Queue
