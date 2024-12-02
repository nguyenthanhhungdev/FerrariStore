const express = require('express');
const router = express.Router();
const validateMiddleware = require('../../middleware/validate.middleware');
const userController = require('../../controllers/user.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const Joi = require('joi');
const AuthenticationError = require("../../middleware/ExceptionHandler.middleware");
const {CustomError} = require("../../middleware/ExceptionHandler.middleware");

// Define the schema for sign-up request data validation
const signUpValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  // avatar: Joi.string().required(),
  phone: Joi.string().required(),
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

// Define the schema for edit-profile request data validation
const editProfileValidationSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  username: Joi.string(),
  email: Joi.string().email(),
  // avatar: Joi.string(),
  phone: Joi.string(),
});

// Apply the validation middleware and authentication middleware to the edit-profile route
router.put('/edit-profile', authMiddleware, validateMiddleware(editProfileValidationSchema), userController.editProfileController);

router.post('/signout', userController.signOutController);

// Define the schema for change-password request data validation
const changePasswordValidationSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});
router.put('/change-password', authMiddleware, validateMiddleware(changePasswordValidationSchema), userController.changePassword);


module.exports = router;
