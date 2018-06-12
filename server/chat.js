let formatDate = require('../client/lib/formatDate')
let session = require('../client/lib/session')

module.exports = function (io) {
  io.sockets.on('connection', socket => {
    let cookies = socket.handshake.headers.cookie
    // 登陆
    socket.on('login', () => {
      let ret = session.get(cookies)
      if (ret) {
        session.update(cookies, {
          status: 1
        })
        update('login', ret)
        console.log(`用户 ${ret.name} 已上线！`)
      } else {
        socket.emit('login', {
          retCode: -1
        })
      }
    })
    // 发言
    socket.on('post-message', message => {
      let ret = session.get(cookies)
      io.sockets.emit('post-message', {
        name: ret.name,
        message,
        time: formatDate('YYYY-MM-DD hh:mm:ss', new Date())
      })
      console.log(`用户 ${ret.name} 发言：${message}`)
    })
    // 离开
    socket.on('disconnect', () => {
      // 数据更新
      let user = session.update(cookies, {
        status: 0
      })
      // 直接进入聊天室网址的情况
      if (!user) {
        return
      }
      console.log(`用户：${user.name} 离开了房间！`)
      // 房间UI更新
      update('user-leave', user)
    })
  })

  /**
   * 广播用户变化
   * @param {String} eventName 事件名称
   */
  function update (eventName, param) {
    // 房间属性
    io.sockets.emit('chatroom-info', {
      names: filterName(),
    })
    // 用户动态
    switch (eventName) {
      case 'user-leave':
        io.sockets.emit('user-leave', {
          name: param.name
        })
        break
      case 'login':
        io.sockets.emit('login', {
          name: param.name
        })
        break
    }
  }

  /**
   * 过滤出名字
   * @return {Array}
   */
  function filterName () {
    let users = session.getAll()
    let arr = []
    for (var sid in users) {
      if (users[sid].status === 1) {
        arr.push(users[sid].name)
      }
    }
    return arr
  }
}
