const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const {CustomError} = require('../middleware/ExceptionHandler.middleware');
const authService = require('./auth.service');
const {encryptToken} = require("../utils/crypt");

async function extracted(user) {
  const accessToken = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1m'});

  const refreshToken = jwt.sign({userId: user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '100d'});
  const encryptedRefreshToken = encryptToken(refreshToken);
  const encryptedAccessToken = encryptToken(accessToken);
  console.log("Store encryptedRefreshToken into database", encryptedRefreshToken);
  const refreshTokenModel = new RefreshToken({
    token: encryptedRefreshToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000)
  });

  await refreshTokenModel.save();
  return {encryptedAccessToken, encryptedRefreshToken};
}

decodeTokenToUserID = (token) => {
  try {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    return result.userId;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new CustomError(401, error.name, {layer: 'SERVICE', className: 'UserService', methodName: 'decodeTokenToUserID'});
    }
  }

}

class UserService {
  signUp = async (userData) => {
    try {
      const existingUser = await User.findOne({email: userData.email});
      if (existingUser) {
        throw new CustomError(409, 'User already exists', {username: userData.name, email: userData.email});
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({...userData, password: hashedPassword});
      await user.save();

      const {encryptedAccessToken, encryptedRefreshToken} = await extracted(user);

      return {
        encryptedAccessToken: encryptedAccessToken,
        encryptedRefreshToken: encryptedRefreshToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      throw error;
    }
  };

  signIn = async (reqBody) => {
    try {
      const {usernameoremail, password} = reqBody;
      const user = await User.findOne({$or: [{email: usernameoremail}, {username: usernameoremail}]}).exec();
      if (!user) {
        return {token: null, refreshToken: null, user: null};
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {token: null, refreshToken: null, user: null};
      }

      const {encryptedAccessToken, encryptedRefreshToken} = await extracted(user);

      return {
        encryptedAccessToken: encryptedAccessToken,
        encryptedRefreshToken: encryptedRefreshToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        }
      };
    } catch (error) {
      throw error;
    }
  };

  getUseProfileByToken = async (token) => {
    try {
      const userId = decodeTokenToUserID(token);
      const user = await User.findById(userId).exec();
      if (!user) {
        throw new CustomError(404, 'User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  };

  editProfile = async (token, req) => {
    try {
      const userId = decodeTokenToUserID(token);


      const {firstName, lastName, username, email /* avatar */, phone} = req.body;
      const user = await User.findById(userId).exec();
      if (!user) {
        throw new CustomError(404, 'User not found');
      }

      if (username) user.username = username;
      if (email) user.email = email;
      // if (avatar) user.avatar = avatar;
      if (phone) user.phone = phone;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;

      await user.save();

      return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
      };
    } catch (error) {
      throw error;
    }
  };

  logout = async (token) => {
    try {
      const userId = decodeTokenToUserID(token);
      console.info(userId);
      await RefreshToken.deleteMany({userId: userId});
      return await User.findById(userId).exec();
    } catch (error) {
      throw error;
    }
  }

  changePassword = async (oldToken, oldEncryptedRefreshToken, oldPassword, newPassword) => {
    try {

      let userId;
      userId = decodeTokenToUserID(oldToken);

      const {encryptedNewAccessToken, encryptedNewRefreshToken} = await authService.refreshToken(oldEncryptedRefreshToken);

      const user = await User.findById(userId).exec();
      if (!user) {
        throw new CustomError(404, 'User not found', {layer: 'SERVICE', className: 'UserService', methodName: 'changePassword'});

      }
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new CustomError(401, 'Old password is incorrect', {layer: 'SERVICE', className: 'UserService', methodName: 'changePassword'});

      }
      user.password = await bcrypt.hash(newPassword, 10);

      await user.save();

      return {
        encryptedNewAccessToken: encryptedNewAccessToken,
        encryptedNewRefreshToken: encryptedNewRefreshToken,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
