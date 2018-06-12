const Koa = require('koa')
const app = module.exports = new Koa()
const path = require('path')
const router = require('./routers/index')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const sio = require('socket.io')
const game = require('./game')
const chat = require('./chat')

// 配置项
const staticPath = './static'

// 中间件
app.use(bodyParser())

app.use(static(
  path.join( __dirname, staticPath)
))

app.use(router.routes())


// socket.io服务器
let io = sio.listen(app.listen(3002, () => {
  console.log('3002端口已建立连接！')
}))

// 聊天室
chat(io)
// 游戏
game(io)
