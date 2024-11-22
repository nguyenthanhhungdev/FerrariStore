const authService = require('../services/auth.service');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');
const logger = require('../utils/logger');

class AuthController {
    refreshToken = async (req, res, next) => {
        try {
            const refreshTokenCookies = req.cookies.refreshToken;
            if (!refreshTokenCookies) {
                throw new CustomError(400, 'Refresh token is required');
            }

            const {accessToken, refreshToken} = await authService.refreshToken(refreshTokenCookies);

            logger.info('New access token and refresh token created', { layer: 'CONTROLLER', className: 'AuthController', methodName: 'refreshToken' });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            res.status(200).json({
                success: true,
                token: `Bearer ${accessToken}`,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();