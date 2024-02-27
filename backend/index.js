const dotenv = require('dotenv-flow');
const buyTokenController = require('./controllers/swap-tokens.controller');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { bnbController } = require('./bnb-controller');
const { events } = require('./events');
const app = require('express')();
const cors = require('cors');
const { authRouter } = require('./router/auth-router.js');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

dotenv.config({
  cwd: './environments',
  default_node_env: 'development',
});
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(
  bodyParser.json({
    limit: '10mb',
  })
);
app.use(
  bodyParser.urlencoded({
    limit: '10mb',
    extended: true,
  })
);

app.use('/auth', authRouter);

app.post('/buy/bnb', buyTokenController.buyBnbToken);

const server = require('http').createServer(app);

const connection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('connected to db');
    server.listen(3000, () => console.log('server started'));
  } catch (error) {
    console.log(error);
  }
};

connection();

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// bnbController.listenNewPairs(io);

io.on('connection', (socket) => {
  console.log('connected');

  socket.on(events.ListenContractTransactions, (data) => bnbController.listenTransactionsOnContract(data, socket, io));
  socket.on(events.StopListenContractTransactions, (data) =>
    bnbController.stopListenTransactionsOnContract(data, socket, io)
  );

  socket.on('disconnection', () => {
    console.log('disconected from bsc namespace');
  });
});

module.exports = { io };
