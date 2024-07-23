'use strict'
// import {Schema, models} from 'mongoose'

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
    role: {
        type: String,
        enum: ['admin', 'sales', 'manager', 'customer'],
        default: 'customer'
    },

}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt,
});


const staffSchema = new Schema({
    ...userSchema.obj,
    salary: {
        type: Number,
        required: true
    },

    address: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    collection: 'Staff' // Set Name
})

const customerSchema = new Schema({
    ...userSchema.obj,
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product', default: null}], // Tham chiếu đến model Product
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order', default: null}], // Tham chiếu đến model Order
}, {
    timestamps: true,
    collection: 'Customer' // Set Name
})

const Staff = model('Staff', staffSchema);
const Customer = model('Customer', customerSchema);

module.exports = {
    Staff,
    Customer
};