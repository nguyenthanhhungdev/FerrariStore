const express = require('express');
const router = express.Router();
const validateMiddleware = require('../../middleware/validate.middleware');
const userController = require('../../controllers/user.controller');
const Joi = require('joi');

// Define the schema for sign-up request data validation
const signUpValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string().required(),
  gender: Joi.string().required(),
  phone: Joi.string().required(),
  birthday: Joi.string().required(),
  status: Joi.boolean().required(),
});

// Apply the validation middleware to the sign-up route
router.post('/signup', validateMiddleware(signUpValidationSchema), userController.signupController);

// Define the schema for sign-in request data validation
const signInValidationSchema = Joi.object({
  usernameoremail: Joi.string().required(),
  password: Joi.string().required(),
});

router.post('/signin', validateMiddleware(signInValidationSchema), userController.signInController);

router.get('/profile', userController.getProfileController);

module.exports = router;