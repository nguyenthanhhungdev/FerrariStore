const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const logger = require('../utils/logger');
class UserService {
    signUp = async (userData) => {
        try {
            const existingUser = await User.findOne({email: userData.email});
            if (existingUser) {
                const error = new Error('User already exists');
                error.statusCode = 400;
                throw error;
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({...userData, password: hashedPassword});
            const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '15m'});

            const refreshToken = jwt.sign({userId: user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});

            user.refreshToken = refreshToken; // Lưu refreshToken vào cơ sở dữ liệu

            await user.save();

            return {
                token: token,
                refreshToken: refreshToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            };
        } catch (error) {
            // logger.error(error, {layer: 'SERVICE'}, 'Error in user service');
            throw error;
        }
    };
}
module.exports = new UserService();