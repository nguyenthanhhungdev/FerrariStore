const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');

class UserService {
    signUp = async (userData) => {
        try {
            const existingUser = await User.findOne({email: userData.email});
            if (existingUser) {
                throw new CustomError(409, 'User already exists', { username: userData.name, email: userData.email});
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({...userData, password: hashedPassword});
            const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '15m'});

            const refreshToken = jwt.sign({userId: user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});
            const refreshTokenDoc = new RefreshToken({
                token: refreshToken,
                userId: user._id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            });

            await refreshTokenDoc.save();
            await user.save();

            return {
                token: token,
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
}

module.exports = new UserService();