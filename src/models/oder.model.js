'use strict'
// import {Schema, models, Types} from "mongoose"

const { Schema, model } = require('mongoose');
const Collection_Name = "Order"

const orderSchema = new Schema({
    customer: { type: Schema.ObjectId, ref: 'Customer', required: true},
    orderDateTime: { type: Date, required: true },
    status: { type: String, default: 'Unpaid',required: true },
    deliveryLocation: { type: String, required: true },
    note: { type: String, default: ''},
    discount: { type: Number, default: 0},
    detailOrders: [{
        product: { type: Schema.ObjectId, ref: 'Product', required: true },
        amount: { type: Number, required: true }
    }],
    totalPrice: { type: Number, default: 0, required: true},
    paymentMethod: { type: String, required: true, default: 'COD'}
}, {
    timestamps: true,
    collection: Collection_Name
});
module.exports =  model(Collection_Name, orderSchema);