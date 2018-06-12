const router = require('koa-router')()
const session = require('../../client/lib/session')

// 记录用户信息
router.post('/login', async ctx => {
  const {
    name, email
  } = ctx.request.body
  let cookies = ctx.request.header.cookie
  // 没有则创建
  if (!session.get(cookies)) {
    let sid = session.add({
      name,
      email,
      status: 1 // 0 - 离线 ； 1 - 在线
    })
    // cookie
    ctx.cookies.set('sid', sid, {httpOnly: true})
  // 有则更新状态为上线
  } else {
    session.update(cookies, {
      status: 1
    })
  }
  // 跳转
  ctx.status = 302
  ctx.redirect('/public-chatroom.html')
})

module.exports = router
