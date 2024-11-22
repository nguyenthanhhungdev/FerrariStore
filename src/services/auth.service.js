const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const logger = require('../utils/logger');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');

const refreshTokenRotate = async (refreshToken) => {
    try {
        if (!refreshToken) {
            throw new CustomError(401, "No token provided", { layer: 'SERVICE', methodName: 'refreshToken'});
        }

        const refreshTokenModel = await RefreshToken.findOne({ token: refreshToken }).exec();
        if (!refreshTokenModel) {
            throw new CustomError(401, 'Invalid token', { layer: 'SERVICE', methodName: 'refreshToken' });
        }

        let payload;
        try {
            payload = jwt.verify(refreshTokenModel.token, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                payload = jwt.decode(refreshTokenModel.token);
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

        const expiresInDays = (refreshTokenModel.expiresAt - Date.now()) / (1000 * 60 * 60 * 24);
        console.info(`Token expires in ${expiresInDays} days`);

        const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: `${expiresInDays}d` });
        const newRefreshTokenModel = new RefreshToken({
            token: newRefreshToken,
            userId: user._id,
            expiresAt: refreshTokenModel.expiresAt // same expiration as the old refresh token
        });
        await newRefreshTokenModel.save();

        await RefreshToken.findOneAndDelete({ token: refreshToken }).exec();

        const newAccessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };

    } catch (error) {
        throw error;
    }
}

module.exports = { refreshToken: refreshTokenRotate };