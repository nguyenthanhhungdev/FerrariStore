const { signUp } = require('../services/user.service');

const signupController = async (req, res) => {
    try {
        const { token, user } = await signUp(req.body);
        res.status(200).json({
            success: true,
            user,
            token
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

module.exports = { signupController };