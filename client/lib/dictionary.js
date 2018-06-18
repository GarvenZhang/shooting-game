/**
 * 字典类
 */
class Dictionary {
  constructor () {
    this.dataStore = []
  }
  /**
   * 增加
   * @param {String|Number} key 键
   * @param {Object|Array|String|Boolean|Number|undefined|null|Function} value 值
   */
  add (key, value) {
    this.dataStore[key] = value
  }
  /**
   * 查找
   * @param {String|Number} key 键
   * @return {Object|Array|String|Boolean|Number|undefined|null|Function}
   */
  get (key) {
    return this.dataStore[key]
  }
  /**
   * 移除
   * @param {String|Number} key 键
   * @return {Boolean}
   */
  remove (key) {
    if (this.dataStore[key]) {
      delete this.dataStore[key]
      return true
    }
    return false
  }
  /**
   * 计数
   * @return {Number}
   */
  count () {
    return Object.keys(this.dataStore).length
  }
  /**
   * 清除
   */
  clear () {
    let dS = this.dataStore
    for (var prop in dS) {
      delete dS[prop]
    }
  }
  /**
   * 展示字典
   * @param {Function} fn 执行的函数
   */
  showAll (fn) {
    let dS = this.dataStore
    let sortedKey = Object.keys(dS).sort()
    for (var i = 0, item; item = sortedKey[i++];) {
      fn(dS[item], item)
    }
  }
}

export default Dictionary
