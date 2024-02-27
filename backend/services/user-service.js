const UserModel = require('../models/user.js');
const tokenService = require('./token-service.js');

class UserService {
  async login(address) {
    let user = await UserModel.findOne({ address });
    if (!user) {
      user = await UserModel.create({ address });
    }
    const tokens = tokenService.generateTokens({ address });

    await tokenService.saveToken(user._id, tokens.refreshToken);

    return { ...tokens, user };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenservice.validateRefreshToken(refreshToken);
    const tokenFromDb = tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findOne({ _id: userData.id });
    const userDto = new UserDto(user);
    const tokens = tokenservice.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}

module.exports = new UserService();
