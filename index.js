const dotenv = require('dotenv-flow');
const { handleSocketEvents } = require('./controllers/socketEvents');
const { initApp } = require('./init-app');
const { io, server } = require('./socket');

dotenv.config({
  cwd: './environments',
  default_node_env: 'development',
});

initApp();
handleSocketEvents(io);

server.listen(3000);
