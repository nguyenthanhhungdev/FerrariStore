const authService = require('../services/auth.service');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');
const logger = require('../utils/logger');
const {encryptToken ,decryptToken} = require("../utils/crypt");

class AuthController {
    refreshToken = async (req, res, next) => {
        try {
            const encryptedRefreshToken = req.cookies.refreshToken;
            if (!encryptedRefreshToken) {
                throw new CustomError(400, 'Refresh token is required');
            }

            const oldRefreshToken = decryptToken(encryptedRefreshToken);
            const {newAccessToken, newRefreshToken} = await authService.refreshToken(oldRefreshToken);

            const newEncryptedAccessToken = encryptToken(newAccessToken);
            const newEncryptedRefreshToken = encryptToken(newRefreshToken);
            
            logger.info('New access token and refresh token created', { layer: 'CONTROLLER', className: 'AuthController', methodName: 'refreshToken' });
            res.cookie("token", newEncryptedAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: '/',
                domain: 'localhost'
            });
            
            res.cookie("refreshToken", newEncryptedRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: '/',
                domain: 'localhost'
            });
            res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();