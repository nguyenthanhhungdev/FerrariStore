const userService = require('../services/user.service');
const logger = require('../utils/logger');

class UserController {
    signupController = async (req, res, next) => {
        try {
            const {token, refreshTokenId, user} = await userService.signUp(req.body);
            // Set the refresh token as an HTTP-only cookie
            res.cookie("refreshTokenId", refreshTokenId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            logger.info('User signed up', { layer: 'CONTROLLER', className: 'UserController', methodName: 'signupController' });
            res.status(200).json({
                success: true,
                user,
                token: `Bearer ${token}`
            });


        } catch (error) {
            next(error);
        }
    }

    signInController = async (req, res, next) => {
        try {
            const {token, refreshTokenId, user} = await userService.signIn(req.body.email, req.body.password);
            // Set the refresh token as an HTTP-only cookie
            res.cookie("refreshTokenId", refreshTokenId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            logger.info('User signed in', { layer: 'CONTROLLER', className: 'UserController', methodName: 'signInController' });
            res.status(200).json({
                success: true,
                user,
                token: `Bearer ${token}`
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
