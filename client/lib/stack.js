/**
 * 栈类
 */
class Stack {
  constructor () {
    this.dataStore = [] // 数据
    this.top = 0  // 栈顶位置
  }
  /**
   * 入栈
   * @param {*} data 数据
   */
  push (data) {
    this.dataStore[this.top++] = data
  }
  /**
   * 出栈
   * @return {*}
   */
  pop () {
    return this.dataStore[--this.top]
  }
  /**
   * 获取栈顶元素
   * @return {*}
   */
  peek () {
    return this.dataStore[this.top - 1]
  }
  /**
   * 获取栈长度
   * @return {Number}
   */
  getCount () {
    return this.top
  }
  /**
   * 清栈
   */
  clear () {
    this.top = 0
  }
}

export default Stack
