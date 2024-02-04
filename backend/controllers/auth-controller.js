const crypto = require('crypto');
const ethers = require('ethers');
const tokenService = require('../services/token-service');
const userService = require('../services/user-service');

class AuthController {
  getNonce = async (req, res, next) => {
    console.log('working');
    // Generate a random 32-byte value to use as the nonce
    const nonce = crypto.randomBytes(32).toString('hex');
    // Return the nonce value as a JSON object in the response body
    res.json({ nonce });
  };

  login = async (req, res, next) => {
    const { signedMessage, message, address } = req.body;
    const recoveredAddress = ethers.utils.verifyMessage(message, signedMessage);
    if (recoveredAddress !== address) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    const userData = await userService.login(address);

    res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.json(userData);
  };

  verify = async (req, res, next) => {};
  logout = async (req, res, next) => {};
  refresh = async (req, res, next) => {};
}

const authController = new AuthController();

module.exports = { authController };
