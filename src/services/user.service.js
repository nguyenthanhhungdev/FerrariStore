const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');

async function extracted(user) {
    const accessToken = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '15m'});

    const refreshToken = jwt.sign({userId: user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});
    const refreshTokenDoc = new RefreshToken({
        token: refreshToken,
        userId: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    await refreshTokenDoc.save();
    return {accessToken, refreshTokenDoc};
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
            const {accessToken, refreshTokenDoc} = await extracted(user);

            await user.save();

            return {
                token: accessToken,
                refreshTokenId: refreshTokenDoc._id,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            };
        } catch (error) {
            throw error;
        }
    };


    signIn = async (email, password) => {
        try {
            const user = await User.findOne({ email }).exec();
            if (!user) {
                throw new CustomError(401, 'Invalid email or password');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new CustomError(401, 'Invalid email or password');
            }

            const {accessToken, refreshTokenDoc} = await extracted(user);

            return {
                token: accessToken,
                refreshTokenId: refreshTokenDoc._id,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
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
    }
}

module.exports = new UserService();