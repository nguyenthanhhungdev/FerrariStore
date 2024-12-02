const authService = require('../services/auth.service');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');
const logger = require('../utils/logger');
const {encryptToken ,decryptToken} = require("../utils/crypt");

class AuthController {
    refreshToken = async (req, res, next) => {
        try {
            const oldEncryptedRefreshToken = req.cookies.refreshToken;
            if (!oldEncryptedRefreshToken) {
                throw new CustomError(400, 'Refresh token is required');
            }

            console.info('Old refresh token in auth controller from cookies', oldEncryptedRefreshToken);

            const {encryptedNewAccessToken, encryptedNewRefreshToken} = await authService.refreshToken(oldEncryptedRefreshToken);


            logger.info('New access token and refresh token created', { layer: 'CONTROLLER', className: 'AuthController', methodName: 'refreshToken' });
            res.cookie("token", encryptedNewAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: '/',
                domain: 'localhost'
            });
            
            res.cookie("refreshToken", encryptedNewRefreshToken, {
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