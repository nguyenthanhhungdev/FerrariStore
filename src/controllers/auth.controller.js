const authService = require('../services/auth.service');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');
const logger = require('../utils/logger');

class AuthController {
    refreshToken = async (req, res, next) => {
        try {
            const refreshTokenId = req.cookies.refreshTokenId;
            if (!refreshTokenId) {
                throw new CustomError(400, 'Refresh token ID is required');
            }

            const tokens = await authService.refreshToken(refreshTokenId);

            logger.info('New access token and refresh token created', { layer: 'CONTROLLER', className: 'AuthController', methodName: 'refreshToken' });
            res.cookie("refreshTokenId", tokens.refreshTokenId, {
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