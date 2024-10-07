const userService = require('../services/user.service');

class UserController {
    signupController = async (req, res) => {
        try {
            const {token, refreshToken, user} = await userService.signUp(req.body);
            // Set the refresh token as an HTTP-only cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            res.status(200).json({
                success: true,
                user,
                token: `Bearer ${token}`
            });


        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message
            });
        }
    };
}

module.exports = new UserController();