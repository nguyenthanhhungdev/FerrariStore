const userService = require('../services/user.service');
const logger = require('../utils/logger');

class UserController {
    signupController = async (req, res, next) => {
        try {
            const {token, refreshToken, user} = await userService.signUp(req.body);
            // Set the refresh token as an HTTP-only cookie
            res.cookie("refreshToken", refreshToken, {
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
}

module.exports = new UserController();
