const { signUp } = require('../services/user.service');

const signupController = async (req, res) => {
    try {
        const { token, user } = await signUp(req.body);
        res.cookie('token', token, { httpOnly: true ,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

module.exports = { signupController };