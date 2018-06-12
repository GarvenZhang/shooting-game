/**
 * 用户模块
 */
const router = require('koa-router')()

/**
 * session模块
 */
let users = {} // 用户集合
let expires = 60 * 60 * 24 * 2 // 过期时间
let session = {
  /**
   * 生成随机id
   * @return {String}
   * @private
   */
  createId: function () {
    const str = '1234567890qwertyuiopasdfghjklzxcvbnm'
    let count = 40
    let ret = 'sid_'
    while (count--) {
      ret += str[Math.random() * str.length | 0 ]
    }
    return ret
  },
  /**
   * 提取cookie
   * @param {String} cookies 用户cookies
   * @param {String} name 查询的name
   * @private
   * @return {String|Boolean}
   */
  getCookie: function(cookies, name) {
    if (!cookies) {
      return false
    }
    let result = ''
    let item = []
    // 先截断分号;
    item = cookies.split(';')
    // 再截断等号=
    item.forEach(function (item, i, len) {
      var _name = item.split('=')[0].trim()
      // 匹配
      if (_name === name) {
        result = item.split('=')[1].trim()
      }
    })
    // 不存在
    if (result === '') {
      return false
    }
    return result
  },
  /**
   * 添加用户
   * @param {Object} infos 用户信息
   */
  add: function (infos) {
    // 非对象则抛错
    if (Object.prototype.constructor.call(infos).toString() !== '[object Object]') {
      throw new Error('arguments is not type of Object!')
    }
    // 检验id是否重复
    let sid = this.createId()
    while (users[sid]) {
      sid = this.createId()
    }
    // 加上过期时间
    infos.expires = Date.now()
    // 入库
    users[sid] = infos
    return sid
  },
  /**
   * 查询用户
   * @param {String} cookies 用户cookies
   * @return {String|Boolean}
   */
  get: function (cookies) {
    // 检验cookie中是否有sid
    let sid = this.getCookie(cookies, 'sid')
    if (!sid) {
      return false
    }
    // 检验此sid是否真实存在
    if (!users[sid]) {
      return false
    }
    // 更新过期时间
    this.updateExpires(sid)
    return users[sid]
  },
  /**
   * 获取全部用户信息
   * @return {Object}
   */
  getAll: function () {
    return users
  },
  /**
   * 更新用户信息
   * @param {String} cookies 用户cookies
   * @param {Object} data 需更新的数据
   * @return {Object}
   */
  update: function (cookies, data) {
    let sid = this.getCookie(cookies, 'sid')
    if (!sid) {
      return false
    }
    Object.assign(users[sid], data)
    return users[sid]
  },
  /**
   * 更新用户过期时间
   * @param {String} sid 用户sessionid
   * @private
   */
  updateExpires: function (sid) {
    console.log(users, sid)
    let _expires = users[sid].expires
    _expires = _expires + expires
    users[sid].expires = _expires
  },
  /**
   * 删除用户
   * @param {String} cookies 用户cookies
   */
  remove: function (cookies) {
    let sid = this.getCookie(cookies, 'sid')
    delete users[sid]
  },
  /**
   * 清除不活跃用户
   */
  clear: function () {
    let users = users
    for (var obj in users) {
      if (users[obj].expires <= Date.now()) {
        delete users[obj]
      }
    }
  }
}

// 2天清理一次
setInterval(function () {
  session.clear()
}, expires * 1000)


module.exports = session;