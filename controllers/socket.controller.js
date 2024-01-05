let socket = null;

const init = (socket_io) => {
  return new Promise( (resolve) => {
    if (socket) { resolve(socket);  }

    socket_io.on('connection', (_socket) => {
      console.log('connection');
      socket = _socket;
      resolve(_socket);
    });
  });
}

const sendMessage = (eventName = 'event test', data = 'test') => {
  socket.emit(eventName, data);
}

module.exports = {
  init,
  sendMessage
}
