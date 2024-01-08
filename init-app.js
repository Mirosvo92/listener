const { bnbController } = require('./bnb-controller');

function initApp() {
  bnbController.listenNewPairs();
}

module.exports = { initApp };
