const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const logger = require('../utils/logger');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');

const refreshTokenRotate = async (oldRefreshToken) => {
    try {
        if (!oldRefreshToken) {
            throw new CustomError(401, "No token provided", { layer: 'SERVICE', methodName: 'refreshToken'});
        }

        let payload;
        try {
            // Xác thực refresh token, nếu hết hạn thì sẽ bắn ra lỗi TokenExpiredError
            payload = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                payload = jwt.decode(oldRefreshToken);
                if (!payload) {
                    throw new CustomError(401, 'Invalid token', { layer: 'SERVICE', methodName: 'refreshToken' });
                }
            } else {
                throw err;
            }
        }

        const user = await User.findById(payload.userId);
        if (!user) {
            throw new CustomError(401, 'User not found', { layer: 'SERVICE', methodName: 'refreshToken' });
        }

        if (user.refreshToken !== oldRefreshToken) {
            throw new CustomError(401, 'Invalid token', { layer: 'SERVICE', methodName: 'refreshToken' });
        }

        const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        user.refreshToken = newRefreshToken;
        await user.save();

        const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };

    } catch (error) {
        throw error;
    }
}

module.exports = { refreshToken: refreshTokenRotate };