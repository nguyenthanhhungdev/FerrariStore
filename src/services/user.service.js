const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');

const validateUserData = (userData) => {
    if (!userData.email) throw new Error('You must enter an email address.');
    if (!userData.name) throw new Error('You must enter your full name.');
    if (!userData.password) throw new Error('You must enter a password.');
    if (!userData.phone) throw new Error('You must enter a phone number.');
};

const signUp = async (userData) => {
    try {
        validateUserData(userData);

        const existingUser = await User.findOne({email: userData.email});
        if (existingUser) throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new User({...userData, password: hashedPassword});
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '15m'});

        const refreshToken = jwt.sign({userId: user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});

        await user.save();

        return {
            token: token,
            refreshToken: refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    } catch (error) {
        console.log(":::E::: Error in service: ",error);
        throw error;
    }};

module.exports = { signUp };