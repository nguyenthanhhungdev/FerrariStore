const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');
const {encryptToken, decryptToken} = require("../utils/crypt");

const refreshTokenRotate = async (oldEncryptedRefreshToken) => {
    try {
        if (!oldEncryptedRefreshToken) {
            throw new CustomError(401, "No token provided", { layer: 'SERVICE', methodName: 'refreshToken'});
        }

        const oldRefreshTokenModel = await RefreshToken.findOne({ token: oldEncryptedRefreshToken }).exec();
        if (!oldRefreshTokenModel) {
            throw new CustomError(401, 'Invalid token', { layer: 'SERVICE', methodName: 'refreshToken', message: 'Refresh Token not found' });
        }

        const decryptedOldRefreshToken = decryptToken(oldEncryptedRefreshToken);

        let payload;
        try {
            payload = jwt.verify(decryptedOldRefreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                payload = jwt.decode(decryptedOldRefreshToken);
                if (!payload) {
                    throw new CustomError(401, 'Invalid token', { layer: 'SERVICE', methodName: 'refreshToken' });
                }
            } else {
                throw new CustomError(500, err.message, { layer: 'SERVICE', methodName: 'refreshToken', message: 'Error verifying token' });
            }
        }

        const user = await User.findById(payload.userId).exec();
        if (!user) {
            throw new CustomError(401, 'User not found', { layer: 'SERVICE', methodName: 'refreshToken' });
        }

        const expiresInDays = (oldRefreshTokenModel.expiresAt - Date.now()) / (1000 * 60 * 60 * 24);
        console.info(`Token expires in ${expiresInDays} days`);

        const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: `${expiresInDays}d` });
        const encryptedNewRefreshToken = encryptToken(newRefreshToken);
        const newRefreshTokenModel = new RefreshToken({
            token: encryptedNewRefreshToken,
            userId: user._id,
            expiresAt: oldRefreshTokenModel.expiresAt // same expiration as the old refresh token
        });
        await newRefreshTokenModel.save();

        await RefreshToken.findOneAndDelete({ token: oldEncryptedRefreshToken }).exec();

        const newAccessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const encryptedNewAccessToken = encryptToken(newAccessToken);


        return {
            encryptedNewAccessToken: encryptedNewAccessToken,
            encryptedNewRefreshToken: encryptedNewRefreshToken
        };

    } catch (error) {
        throw error;
    }
}

module.exports = { refreshToken: refreshTokenRotate };