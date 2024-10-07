const authService = require('../services/auth.service');

class AuthController {
    refreshToken = async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(400).json({ error: 'Refresh token is required' });
            }

            const newAccessToken = await authService.refreshToken(refreshToken);

            if (!newAccessToken) {
                return res.status(401).json({ error: 'Invalid refresh token' });
            }
            res.status(200).json({
                success: true,
                token: newAccessToken
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();