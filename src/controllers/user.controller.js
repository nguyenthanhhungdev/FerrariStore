const userService = require('../services/user.service');
const logger = require('../utils/logger');
const { CustomError } = require("../middleware/ExceptionHandler.middleware");
const CryptoJS = require('crypto-js');

class UserController {
    encryptToken = (token) => {
        return CryptoJS.AES.encrypt(token, process.env.TOKEN_SECRET).toString();
    }

    signupController = async (req, res, next) => {
        try {
            const { token, refreshToken, user } = await userService.signUp(req.body);

            // Encrypt the tokens
            const encryptedToken = this.encryptToken(token);
            const encryptedRefreshToken = this.encryptToken(refreshToken);

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
            const { token, refreshToken, user } = await userService.signIn(req.body);
            if (!token) {
                res.status(200).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Encrypt the tokens
            const encryptedToken = this.encryptToken(token);
            const encryptedRefreshToken = this.encryptToken(refreshToken);

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
            const encryptedToken = req.cookies.token;
            if (!encryptedToken) {
                throw new CustomError(400, 'Token is required');
            }

            // Decrypt the token
            const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.TOKEN_SECRET);
            const token = bytes.toString(CryptoJS.enc.Utf8);

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
            const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.TOKEN_SECRET);
            const token = bytes.toString(CryptoJS.enc.Utf8);

            const updatedUser = await userService.editProfile(token);
            logger.info('User profile updated', { layer: 'CONTROLLER', className: 'UserController', methodName: 'editProfileController' });
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();