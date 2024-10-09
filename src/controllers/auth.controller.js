const authService = require('../services/auth.service');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');
const logger = require('../utils/logger');

class AuthController {
    refreshToken = async (req, res, next) => {
        try {
            const oldRefreshToken = req.cookies.refreshToken;
            if (!oldRefreshToken) {
                throw new CustomError(400, 'Refresh token is required');
            }

            const tokens = await authService.refreshToken(oldRefreshToken);

            logger.info('New access token and refresh token created', { layer: 'CONTROLLER', className: 'AuthController', methodName: 'refreshToken' });

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            res.status(200).json({
                success: true,
                token: tokens.accessToken
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();