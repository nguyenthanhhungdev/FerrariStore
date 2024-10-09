const express = require('express');
const router = express.Router();
const validateMiddleware = require('../../middleware/validate.middleware');
const userController = require('../../controllers/user.controller');
const Joi = require('joi');

// Define the schema for sign-up request data validation
const signUpValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    role: Joi.string().valid("admin", "customer", "sales", "manager").required(),
    address: Joi.string().required(),

});

// Apply the validation middleware to the sign-up route
router.post('/signup', validateMiddleware(signUpValidationSchema),  userController.signupController);

// Define the schema for sign-in request data validation
const signInValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

router.post('/signin', validateMiddleware(signInValidationSchema), userController.signInController);

module.exports = router;