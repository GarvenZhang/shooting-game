// === socket.io === //
// === 1 常用api: === //
// === 1.1  === //


module.exports = function (io) {

  io.on('connection', function (socket) {

    socket.emit('test', 'helloworld')

  })

}
