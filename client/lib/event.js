// === 发布订阅模式/观察者模式: 定义对象间的一对多的依赖关系, 当一个对象的状态发生改变时, 所有依赖于它的对象都得到通知 === //
// === 1 实现: === //
// === 1.1 指定好谁充当发布者 === //
// === 1.2 给发布者添加一个缓存列表, 用于存放回调以便通知订阅者 === //
// === 1.3 发布消息时, 发布者遍历缓存列表, 依次触发里面的订阅者回调 === //
// === 2 先发布后订阅: === //
// === 2.1 建立一个存放离线事件的堆栈 === //
// === 2.2 事件发布时, 若此时还未有订阅者订阅此事件, 暂时把发布事件的动作包裹在一个函数中 === //
// === 2.3 有对象订阅此事件时, 遍历堆栈且依次执行这些包装函数 === //
// === 2.4 离线事件的声明周期只有一次 === //

let shift = Array.prototype.shift
let unshift = Array.prototype.unshift

/**
 * 自定义事件对象
 */
export let Event = (function () {

  let Event
  let _default = 'default'

  Event = function () {

    let namespaceCache = {}
    let _listen
    let _trigger
    let _remove
    let _create
    let each
    const _shift = shift
    const _unshift = unshift

    /**
     * 遍历
     * @param {Array} arr - 数组
     * @param {Function} fn - 回调
     * @return {*}
     * @private
     */
    each = function (arr, fn) {

      let ret

      for (let i = 0, l = arr.length; i < l; ++i) {
        const n = arr[i]
        ret = fn.call(n, i, n)
      }

      return ret

    }

    /**
     * 订阅
     * 给发布者添加一个缓存列表, 用于存放回调以便通知订阅者
     * @param {String} key - 事件名
     * @param {Function} fn - 回调
     * @param {Array} cache - 缓存列表
     * @private
     */
    _listen = function (key, fn, cache) {

      !cache[key] && (cache[key] = [])

      cache[key].push(fn)

    }

    /**
     * 移除
     * @param {String} key - 事件名
     * @param {Array} cache - 缓存列表
     * @param {Function} [fn] - 回调
     * @private
     */
    _remove = function (key, cache, fn) {

      // 发布者缓存列表中没有此事件则直接返回
      if (!cache[key]) {
        return
      }

      // 若有指定的事件回调则指定删除
      if (fn) {

        for (let l = cache[key].length; l--; ) {
          (cache[key] === fn) && cache[key].splice(l, 1)
        }

      // 没有的话直接清空缓存列表
      } else {
        cache[key] = []
      }

    }

    /**
     * 发布
     * 发布消息时, 发布者遍历缓存列表, 依次触发里面的订阅者回调
     * @param 第一个是缓存列表
     * @param 第二个是事件名称
     * @return {*}
     */
    _trigger = function () {

      let cache = _shift.call(arguments)
      let key = _shift.call(arguments)
      let args = arguments
      let _self = this
      let stack = cache[key]

      // 不存在此缓存列表或缓存列表为空则什么也不做
      if (!stack || !stack.length) {
        return
      }

      // 依次调用缓存列表中的回调
      return each(stack, () => this.apply(_self, args))

    }

    /**
     * 创建命名空间
     * @param {String} namespace - 命名空间
     * @return {Object}
     * @private
     */
    _create = function (namespace = _default) {

      let cache = {}

      // 建立一个存放离线事件的堆栈
      let offlineStack = []

      let ret = {

        /**
         * 订阅事件
         * @param {String} key - 事件名称
         * @param {Function} fn - 回调
         */
        listen: function (key, fn) {

          _listen(key, fn, cache)

          // 离线事件的声明周期只有一次
          if (offlineStack === null) {
            return
          }
          // 有对象订阅此事件时, 遍历堆栈且依次执行这些包装函数
          each(offlineStack, function () {
            this()
          })
          offlineStack = null

        },

        /**
         * 移除事件
         * @param {String} key - 事件名称
         * @param {Function} fn - 回调
         */
        remove: function (key, fn) {
          _remove(key, cache, fn)
        },

        trigger: function () {

          let fn
          let args
          let _self = this

          _unshift.call(arguments, cache)

          args = arguments

          fn = function () {
            return _trigger.apply(_self, args)
          }

          // 事件发布时, 若此时还未有订阅者订阅此事件, 暂时把发布事件的动作包裹在一个函数中
          if (Array.isArray(offlineStack)) {
            return offlineStack.push(fn)
          }

          return fn()

        }

      }

      // 命名空间缓存列表中有指定的命名空间则返回此列表
      // 否则在命名空间缓存列表中初始化该命名空间
      // 每个命名空间是一个ret对象
      return namespaceCache[namespace] ?  namespaceCache[namespace] : namespaceCache[namespace] = ret

    }

    return {

      /**
       * 创建命名空间
       */
      create: _create,

      /**
       *
       */
      one: function (key, fn, last) {
        const event = this.create()
        event.one(key, fn, last)
      },

      /**
       * 移除事件
       * @param {String} key - 事件名
       * @param {Function} fn - 回调
       */
      remove: function (key, fn) {
        const event = this.create()
        event.remove(key, fn)
      },

      /**
       * 订阅事件
       * @param {String} key - 事件名
       * @param {Function} fn - 回调
       * @param {String} [last] - 最后一个
       */
      listen: function (key, fn, last) {
        const event = this.create()
        event.listen(key, fn, last)
      },

      /**
       * 发布事件
       */
      trigger: function () {
        const event = this.create()
        event.trigger.apply(this, arguments)
      }
    }

  }()

  return Event

})()
