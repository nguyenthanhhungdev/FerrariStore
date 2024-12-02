const userService = require('../services/user.service');
const logger = require('../utils/logger');
const { CustomError } = require("../middleware/ExceptionHandler.middleware");
const { encryptToken, decryptToken } = require('../utils/crypt');
const CryptoJS = require('crypto-js');

// Todo: Tách hàm tạo token và refresh token ra thành một service riêng

class UserController {

    signupController = async (req, res, next) => {
        try {
            const {token, refreshToken, user} = await userService.signUp(req.body);

            // Encrypt the tokens
            const encryptedToken = encryptToken(token);
            const encryptedRefreshToken = encryptToken(refreshToken);

            // Set the encrypted tokens as HTTP-only cookies
            res.cookie("refreshToken", encryptedRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                domain: "localhost"
            });

            res.cookie("token", encryptedToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                domain: "localhost"
            });

            logger.info('User signed up', {
                layer: 'CONTROLLER',
                className: 'UserController',
                methodName: 'signupController'
            });
            res.status(200).json({
                data: user,
                message: 'User signed in successfully'
            });
        } catch (error) {
            next(new CustomError(error.status, error.message, { layer: 'CONTROLLER', className: 'UserController', methodName: 'signupController' }));
        }
    }

    signInController = async (req, res, next) => {
        try {
            const {token, refreshToken, user} = await userService.signIn(req.body);
            if (!user) { // If the user is null, the credentials are invalid
                res.status(200).json({
                    data: null,
                    message: 'Invalid credentials'
                });
                return;
            }

            // Encrypt the tokens
            const encryptedToken = encryptToken(token);
            const encryptedRefreshToken = encryptToken(refreshToken);

            // Set the encrypted tokens as HTTP-only cookies
            res.cookie("refreshToken", encryptedRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                domain: "localhost"
            });

            res.cookie("token", encryptedToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                domain: "localhost"
            });

            logger.info('User signed in', {
                layer: 'CONTROLLER',
                className: 'UserController',
                methodName: 'signInController'
            });
            res.status(200).json({
                data: user,
                message: 'User signed in successfully'
            });
        } catch (error) {
            next(new CustomError(error.status, error.message, { layer: 'CONTROLLER', className: 'UserController', methodName: 'signInController' }));
        }
    }

    getProfileController = async (req, res, next) => {
        try {
            const encryptedToken = req.cookies.token;
            if (!encryptedToken) {
                throw new CustomError(400, 'Token is required');
            }

            // Decrypt the token
            const token = decryptToken(encryptedToken);

            const user = await userService.getUseProfileByToken(token);
            logger.info('User profile retrieved', {
                layer: 'CONTROLLER',
                className: 'UserController',
                methodName: 'getProfileController'
            });
            res.status(200).json(user);
        } catch (error) {
            next(new CustomError(error.status, error.message, { layer: 'CONTROLLER', className: 'UserController', methodName: 'getProfileController' }));
        }
    }

    editProfileController = async (req, res, next) => {
        try {
            const encryptedToken = req.cookies.token;
            if (!encryptedToken) {
                throw new CustomError(400, 'Token is required');
            }

            // Decrypt the token
            const token = decryptToken(encryptedToken);

            const updatedUser = await userService.editProfile(token, req);
            logger.info('User profile updated', {
                layer: 'CONTROLLER',
                className: 'UserController',
                methodName: 'editProfileController'
            });
            res.status(200).json(
              {
                  data: updatedUser,
                  message: 'User profile updated successfully'
              }
            );
        } catch (error) {
            next(new CustomError(error.status, error.message, { layer: 'CONTROLLER', className: 'UserController', methodName: 'editProfileController' }));
        }
    }

    signOutController = async (req, res, next) => {
        try {
            const encryptedToken = req.cookies.token;
            if (!encryptedToken) {
                throw new CustomError(400, 'Token is required');
            }
            // Decrypt the token

            const token = decryptToken(encryptedToken);
            const user = await userService.logout(token);

            res.clearCookie("token");
            res.clearCookie("refreshToken");
            logger.info('User signed out', {
                layer: 'CONTROLLER',
                className: 'UserController',
                methodName: 'signOutController'
            });
            res.status(200).json({
                data: user,
                message: 'User signed out successfully'
            });
        } catch (error) {
            next(new CustomError(error.status, error.message, { layer: 'CONTROLLER', className: 'UserController', methodName: 'signOutController' }));
        }
    }

    changePassword = async (req, res, next) => {
        try {
            let encryptedToken = req.cookies.token;
            if (!encryptedToken) {
                throw new CustomError(400, 'Token is required', { layer: 'CONTROLLER', className: 'UserController', methodName: 'changePassword' });
            }

            // Decrypt the token
            const oldToken = decryptToken(encryptedToken);

            const {oldPassword, newPassword} = req.body;
            const {token, refreshToken} = await userService.changePassword(oldToken, oldPassword, newPassword);

            encryptedToken = encryptToken(token);
            const encryptedRefreshToken = encryptToken(refreshToken);

            // Set the encrypted tokens as HTTP-only cookies
            res.cookie("refreshToken", encryptedRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                domain: "localhost"
            });

            res.cookie("token", encryptedToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                domain: "localhost"
            });
            logger.info('User password changed', {
                layer: 'CONTROLLER',
                className: 'UserController',
                methodName: 'changePassword'
            });
            res.status(200).json({
                message: 'User password changed successfully'
            });
        } catch (error) {
            next(new CustomError(error.status, error.message, { layer: 'CONTROLLER', className: 'UserController', methodName: 'changePassword' }));
        }
    }
}

module.exports = new UserController();