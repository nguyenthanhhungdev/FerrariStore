const {Model, Schema, Types } = require('mongoose');
const {Int32} = require("mongodb");
const Collecttion_Name = "Users"
const Document_Name = "User"

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150,
        require: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    sodienthoai: {
        type: String,
        unique: true,
        maxLength: 10,
        trim: true,
        require: true,
    },
    diachi: {
        type: String,
        trim: true,
    },
    diem: {
        type: Number
    },
    dondamua: [{type: Schema.Types.ObjectId, ref: 'Product'}],
    dondahuy: [{type: Schema.Types.ObjectId, ref: 'Product'}],
    mavach:{
        data: Buffer,
        contentType: String,
        require: true
    }

}, {timestamps: true});
