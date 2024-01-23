const dotenv = require('dotenv-flow');
const { handleSocketEvents } = require('./controllers/socketEvents');
const buyTokenController= require('./controllers/swap-tokens.controller');
const { initApp } = require('./init-app');
const { io, server } = require('./socket');
const app = require('express')();
const bodyParser = require('body-parser');

dotenv.config({
  cwd: './environments',
  default_node_env: 'development',
});

initApp();
handleSocketEvents(io);

app.use(bodyParser.json({
  limit: '10mb'
}));
app.use(bodyParser.urlencoded({
  limit: '10mb',
  extended: true
}));

app.post('/buy/bnb', buyTokenController.buyBnbToken);
app.listen(3000);
