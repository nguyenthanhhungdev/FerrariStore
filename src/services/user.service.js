const bcrypt = require('bcrypt'); //Hash password
const jwt = require('jsonwebtoken'); //Create token
const User = require('../models/user.model');
const {Customer} = require("../models/user.model"); // Adjust the path as necessary


/**
 * Input: email, password, name, phone
 * Output: JWT token
 * 1. Validate userData
 * 3. Hash password
 * 4. Create user
 * 5. Generate JWT
 * 6. Return token
 * */


const signUp = async (userData) => {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create customer
    const customer = new Customer({
        ...userData,
        password: hashedPassword,
    });
    await customer.save();


    // Generate JWT with permissions
    return jwt.sign(
        {
            userId: customer._id,
            role: customer.role,
            email: customer.email,
            phone: customer.phone,
        },
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
    )
};




module.exports = { signUp };