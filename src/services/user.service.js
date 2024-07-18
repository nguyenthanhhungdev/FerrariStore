const bcrypt = require('bcrypt'); //Hash password
const jwt = require('jsonwebtoken'); //Create token
const User = require('../models/user.model');
const {Customer} = require("../models/user.model"); // Adjust the path as necessary


/**
 * Input: email, password, name, phone
 * Output: JWT token
 * 1. Validate userData
 * 2. Check if user already exists
 * 3. Hash password
 * 4. Create user
 * 5. Generate JWT
 * 6. Return token
 * */


const signUp = async (userData) => {
    // Validate userData here (e.g., using Joi or express-validator)

    // Check if customer already exists
    // const existingCustomer = await Customer.findOne({ email: userData.email });
    // if (existingCustomer) {
    //     throw new Error('Customer already exists');
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create customer
    const customer = new Customer({
        ...userData,
        password: hashedPassword,
    });
    await customer.save();

// Generate JWT with permissions
    const token = jwt.sign(
        {
            userId: customer._id,
            permissions: permissions
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};




module.exports = { signUp };