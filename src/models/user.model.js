'use strict'

const { Schema, model, Types, models} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    birthday: {
        type: Date,
        default: Date.now
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'sales', 'manager', 'customer'],
    },

}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt,
    collection: 'Users'
});

const User = model('Users', userSchema);

module.exports = {
    User
};