'use strict'

const { Schema, model, Types, models} = require('mongoose');


const refreshTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    collection: 'RefreshTokens'
});

const RefreshToken = model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;