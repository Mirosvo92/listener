let socket = null;

const init = (socket_io) => {
  return new Promise( (resolve) => {
    socket_io.on('connection', (_socket) => {
      console.log('connection');
      socket = _socket;
      resolve(_socket);
    });
  });
}

const sendMessage = (data = 'test') => {
  socket.emit("new-pair", data);
}

module.exports = {
  init,
  sendMessage
}
