const jwt = require('jsonwebtoken');
const {User} = require('../models/user.model');

const refreshToken = async (refreshToken) => {
    try {
        if (!refreshToken) {
            const error = new Error('No token provided');
            error.statusCode = 401;
            throw error;
        }
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(payload.userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }
        if (user.refreshToken!== refreshToken) {
            const error = new Error('Invalid token');
            error.statusCode = 401;
            throw error;
        }
        user.refreshToken = jwt.sign({userId: user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});

        return jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '15m'});

    } catch (error) {
        console.log(":::E::: Error in auth service: ", error);
        throw error;
    }
}

module.exports = {refreshToken};