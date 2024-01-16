let io = null;

const setIo = (_io) => {
  io = _io;
};

const getIo = () => io;

module.exports = {
  getIo,
  setIo
};
