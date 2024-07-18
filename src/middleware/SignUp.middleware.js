const Joi = require('joi');
const { Customer } = require('../models/user.model');

/**
 *
 * Middleware structure:
 * function middlewareName(req, res, next) {
 *   // 1. Do something with the request object (req)
 *   // 2. Do something with the response object (res)
 *   // 3. End the request-response cycle (optional)
 *   // 4. Call the next middleware function in the stack
 *   next();
 * }
 * */


// Define the schema for request data validation
const signUpValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    // Add any other fields as necessary
});

const signUpMiddleware = async (req, res, next) => {
    try {
        // Validate request data
        const { error } = signUpValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if the user already exists
        const existingUser = await Customer.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // If validation passes and user doesn't exist, proceed to the next middleware (signup service)
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = signUpMiddleware;