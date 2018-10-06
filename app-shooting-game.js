const Koa = require('koa')
const app = module.exports = new Koa()
const path = require('path')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const sio = require('socket.io')

const config = require('./config')
const router = require('./server/routers/index')
const game = require('./server/game')
const chat = require('./server/chat')

// 中间件

app.use(bodyParser())

app.use(static(
  path.join( __dirname, './dist')
))

app.use(router.routes())

// socket.io服务器
const port = process.env.NODE_ENV === 'development' ? config.DEV.SERVERPORT : config.PROD.SERVERPORT
sio.path = '/socket'
let io = sio.listen(app.listen(port, () => {
  console.log(`${port}端口已建立连接！`)
}))

// 聊天室
let chatIo = io.of('/chat')
chat(chatIo)

// 游戏
let gameIo = io.of('/game')
game(gameIo)
