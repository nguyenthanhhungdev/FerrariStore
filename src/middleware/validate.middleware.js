const Joi = require('joi');

// Generalized validation middleware
const validateMiddleware = (schema) => async (req, res, next) => {
    try {
        // Validate request data against the passed schema
        const { error } = schema.validate(req.body);
        if (error) {
            console.log(":::Error in validateMiddleware:::", error);
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = validateMdiddleware;