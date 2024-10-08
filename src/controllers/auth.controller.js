const authService = require('../services/auth.service');
const { CustomError } = require('../middleware/ExceptionHandler.middleware');
const logger = require('../utils/logger');

class AuthController {
    refreshToken = async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new CustomError(400, 'Refresh token is required');
            }

            const newAccessToken = await authService.refreshToken(refreshToken);

            if (!newAccessToken) {
                throw new CustomError(401, 'Invalid refresh token');
            }

            logger.info('New access token created', { layer: 'CONTROLLER', className: 'AuthController', methodName: 'refreshToken' });
            res.status(200).json({
                success: true,
                token: newAccessToken
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();