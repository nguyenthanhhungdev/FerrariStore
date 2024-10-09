const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const logger = require('../utils/logger');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');

const refreshTokenRotate = async (refreshTokenId) => {
    try {
        if (!refreshTokenId) {
            throw new CustomError(401, "No token provided", { layer: 'SERVICE', methodName: 'refreshToken'});
        }

        const refreshTokenDoc = await RefreshToken.findById(refreshTokenId).exec();
        if (!refreshTokenDoc) {
            throw new CustomError(401, 'Invalid token', { layer: 'SERVICE', methodName: 'refreshToken' });
        }

        let payload;
        try {
            payload = jwt.verify(refreshTokenDoc.token, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                payload = jwt.decode(refreshTokenDoc.token);
                if (!payload) {
                    throw new CustomError(401, 'Invalid token', { layer: 'SERVICE', methodName: 'refreshToken' });
                }
            } else {
                throw err;
            }
        }

        const user = await User.findById(payload.userId).exec();
        if (!user) {
            throw new CustomError(401, 'User not found', { layer: 'SERVICE', methodName: 'refreshToken' });
        }

        const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        const newRefreshTokenDoc = new RefreshToken({
            token: newRefreshToken,
            userId: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
        await newRefreshTokenDoc.save();

        await RefreshToken.findByIdAndDelete(refreshTokenId);

        const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        return {
            accessToken: newAccessToken,
            refreshTokenId: newRefreshTokenDoc._id
        };

    } catch (error) {
        throw error;
    }
}

module.exports = { refreshToken: refreshTokenRotate };