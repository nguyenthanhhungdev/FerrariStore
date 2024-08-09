const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET } = process.env.JWT_SECRET;

const authMiddleware =async(res, req, next) => {

    /**
     * 1. Take the token from the request header
     * 2. Validate the token
     * */

    try {
        const authenHeader = req.headers["authorization"];
        // If authenHeader is exits then split the token from the Bearer
        const token = authenHeader && authenHeader.split(" ")[1];
        // If token is not exits then return the response
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }

        // Verify the token
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.log(":::Error in authMiddleware:::", err);
                return res.status(403).json({ message: "Fibboden" });
            }
            req.user = user; // Add user to req for next route or middleware
            next();
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}