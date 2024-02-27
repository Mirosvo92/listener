const { authController } = require('../controllers/auth-controller');

const { Router } = require('express');

const authRouter = Router();

authRouter.get('/nonce', authController.getNonce);
authRouter.post('/login', authController.login);
authRouter.get('/rerify', authController.verify);
authRouter.get('/refresh', authController.refresh);
authRouter.get('/logout', authController.logout);

module.exports = { authRouter };
