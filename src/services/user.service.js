const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');
const {loggers} = require("winston");

async function extracted(user) {
    const accessToken = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '15m'});

    const refreshToken = jwt.sign({userId: user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '100d'});
    const refreshTokenModel = new RefreshToken({
        token: refreshToken,
        userId: user._id,
        expiresAt: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000)
    });

    await refreshTokenModel.save();
    return {accessToken, refreshToken};
}

decodeTokenToUserID = (token) => {
    const result =  jwt.verify(token, process.env.JWT_SECRET);
    return result.userId;
}

class UserService {
    signUp = async (userData) => {
        try {
            const existingUser = await User.findOne({email: userData.email});
            if (existingUser) {
                throw new CustomError(409, 'User already exists', { username: userData.name, email: userData.email});
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({...userData, password: hashedPassword});
            const {accessToken, refreshToken} = await extracted(user);

            await user.save();

            return {
                token: accessToken,
                refreshToken: refreshToken,
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
            const user = await User.findOne({ $or: [{ email: usernameoremail }, { username: usernameoremail }] }).exec();
            if (!user) {
                return { token: null, refreshToken: null, user: null };
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { token: null, refreshToken: null, user: null };
            }

            const {accessToken, refreshToken} = await extracted(user);

            return {
                token: accessToken,
                refreshToken: refreshToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role
                }
            };
        } catch (error) {
            throw error;
        }
    };

    getUseProfileByToken = async (req) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new CustomError(401, 'No token provided');
            }

            const token = authHeader.split(' ')[1];
            const userId = decodeTokenToUserID(token);
            const user = await User.findById(userId).exec();
            if (!user) {
                throw new CustomError(404, 'User not found');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();