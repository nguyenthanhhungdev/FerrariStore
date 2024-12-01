const userService = require('../services/user.service');
const logger = require('../utils/logger');
const { CustomError } = require("../middleware/ExceptionHandler.middleware");
const { encryptToken, decryptToken } = require('../utils/crypt');
const CryptoJS = require('crypto-js');

// Todo: Tách hàm tạo token và refresh token ra thành một service riêng

class UserController {

    signupController = async (req, res, next) => {
        try {
            const { token, refreshToken, user } = await userService.signUp(req.body);

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

            logger.info('User signed up', { layer: 'CONTROLLER', className: 'UserController', methodName: 'signupController' });
            res.status(200).json({
                data: user,
                message: 'User signed in successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    signInController = async (req, res, next) => {
        try {
            const { token, refreshToken, user } = await userService.signIn(req.body);
            if (!token) { // If the token is null, the credentials are invalid
                res.status(200).json({
                    data: null,
                    message: 'Invalid credentials'
                });
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

            logger.info('User signed in', { layer: 'CONTROLLER', className: 'UserController', methodName: 'signInController' });
            res.status(200).json({
                data: user,
                message: 'User signed in successfully'
            });
        } catch (error) {
            next(error);
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
            logger.info('User profile retrieved', { layer: 'CONTROLLER', className: 'UserController', methodName: 'getProfileController' });
            res.status(200).json(user);
        } catch (error) {
            next(error);
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
            logger.info('User profile updated', { layer: 'CONTROLLER', className: 'UserController', methodName: 'editProfileController' });
            res.status(200).json(
                {
                    data: updatedUser,
                    message: 'User profile updated successfully'
                }
            );
        } catch (error) {
            next(error);
        }
    }

    signOutController = async (req, res, next) => {
        try {
            logger.info('User signed out', { layer: 'CONTROLLER', className: 'UserController', methodName: 'signOutController' });
            const encryptedToken = req.cookies.token;
            if (!encryptedToken) {
                throw new CustomError(400, 'Token is required');
            }

            // Decrypt the token
            const token = decryptToken(encryptedToken);
            
            const user = await userService.logout(token);
            res.clearCookie("token");
            res.clearCookie("refreshToken");
            res.status(200).json({
                data: user,
                message: 'User signed out successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();