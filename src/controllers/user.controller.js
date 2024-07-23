'use strict'

const { signUp } = require('../services/user.service');

const signupController = async (req, res) => {
    try {
        const userData = req.body;
        const token = await signUp(userData);
        res.status(201).json({ token });
    } catch (error) {
        // Assuming error handling is simplified for brevity
        // In production, consider more nuanced error handling and responses
        res.status(400).json({ message: error.message });
    }
};

module.exports = { signupController };