'use strict'

const { Schema, model, Types, models} = require('mongoose');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    gender: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    birthday: {
        type: String,
    },
    status: {
        type: Boolean,
    },
    role: {
        type: String,
        enum: ['admin', 'sales', 'manager', 'customer'],
    }
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt,
    collection: 'Users'
});

const User = model('Users', userSchema);

module.exports = {
    User
};
