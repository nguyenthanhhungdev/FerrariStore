'use strict'
// import {Schema, models} from 'mongoose'

const { Schema, model, Types, models} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
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
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    birthday: {
        type: Date,
        default: Date.now
    },
    permissions: {
        type: [Number],
        default: []
    },

}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt,
});


const staffSchema = new Schema({
    userSchema: userSchema,
    salary: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'sales'],
        default: 'sales'
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
    userSchema: userSchema,
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }], // Tham chiếu đến model Product
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }], // Tham chiếu đến model Order
}, {
    timestamps: true,
    collection: 'Customer' // Set Name
})

// Định nghĩa các hằng số cho từng quyền
userSchema.statics.permissions = {
    VIEW_PRODUCTS: 1 << 0, // 1
    CREATE_ORDER: 1 << 1, // 2
    VIEW_ORDER_HISTORY: 1 << 2, // 4
    MANAGE_ORDERS: 1 << 3, // 8
    VIEW_SALE_REPORTS: 1 << 4, // 16
    VIEW_CUSTOMERS: 1 << 5, // 32
    CONTACT_CUSTOMERS: 1 << 6, // 64
    VIEW_SALES_REPORTS: 1 << 7, // 128
    UPDATE_PROFILE: 1 << 8, // 256
    CHANGE_PASSWORD: 1 << 9, // 512
    CONTACT_SUPPORT: 1 << 10, // 1024
    MANAGE_PRODUCTS: 1 << 11, // 2048
    MANAGE_USERS: 1 << 12, // 4096
    MANAGE_WEBSITE_SETTINGS: 1 << 13, // 8192
    VIEW_SYSTEM_LOGS: 1 << 14 // 16384
};

// Phương thức kiểm tra quyền
userSchema.methods.hasPermission = function(requiredPermission) {
    return this.permissions.includes(requiredPermission);
};

// Phương thức gán quyền cho staff
staffSchema.methods.assignDefaultPermissionsForAdmin = function() {
    this.permissions = userSchema.statics.permissions.VIEW_PRODUCTS |
        userSchema.statics.permissions.CREATE_ORDER |
        userSchema.statics.permissions.VIEW_ORDER_HISTORY |
        userSchema.statics.permissions.MANAGE_ORDERS |
        userSchema.statics.permissions.VIEW_SALE_REPORTS |
        userSchema.statics.permissions.VIEW_CUSTOMERS |
        userSchema.statics.permissions.CONTACT_CUSTOMERS |
        userSchema.statics.permissions.VIEW_SALES_REPORTS |
        userSchema.statics.permissions.UPDATE_PROFILE |
        userSchema.statics.permissions.CHANGE_PASSWORD |
        userSchema.statics.permissions.MANAGE_PRODUCTS |
        userSchema.statics.permissions.MANAGE_WEBSITE_SETTINGS;
};
staffSchema.methods.assignDefaultPermissionsForSales = function() {
    this.permissions = userSchema.statics.permissions.VIEW_PRODUCTS |
        userSchema.statics.permissions.CREATE_ORDER |
        userSchema.statics.permissions.VIEW_ORDER_HISTORY |
        userSchema.statics.permissions.MANAGE_ORDERS |
        userSchema.statics.permissions.VIEW_CUSTOMERS |
        userSchema.statics.permissions.CONTACT_CUSTOMERS |
        userSchema.statics.permissions.VIEW_SALES_REPORTS
};

customerSchema.methods.assignDefaultPermissions = function() {
    this.permissions = userSchema.statics.permissions.VIEW_PRODUCTS |
        userSchema.statics.permissions.VIEW_ORDER_HISTORY |
        userSchema.statics.permissions.UPDATE_PROFILE |
        userSchema.statics.permissions.CHANGE_PASSWORD |
        userSchema.statics.permissions.CONTACT_SUPPORT;
};

const Staff = model('Staff', staffSchema);
const Customer = model('Customer', customerSchema);

module.exports = {
    Staff,
    Customer
};