const userService = require('../services/user.service');
const logger = require('../utils/logger');
const {CustomError} = require("../middleware/ExceptionHandler.middleware");

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

            res.cookie("token", token, {
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
            const {token, refreshToken, user} = await userService.signIn(req.body);
            if (!token) {
                res.status(200).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            // Set the refresh token as an HTTP-only cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            logger.info('User signed in', { layer: 'CONTROLLER', className: 'UserController', methodName: 'signInController' });
            res.status(200).json({
                success: true,
                user,
                token: `Bearer ${token}`,
                message: 'User signed in successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    getProfileController = async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                throw new CustomError(400, 'Token is required');
            }
            const user = await userService.getUseProfileByToken(token); // Exclude password from the response
            logger.info('User profile retrieved', { layer: 'CONTROLLER', className: 'UserController', methodName: 'getProfileController' });
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    editProfileController = async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                throw new CustomError(400, 'Token is required');
            }
            const updatedUser = await userService.editProfile(token);
            logger.info('User profile updated', { layer: 'CONTROLLER', className: 'UserController', methodName: 'editProfileController' });
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
