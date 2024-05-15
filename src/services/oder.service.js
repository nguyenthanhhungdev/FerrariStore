// import Order from '../models/oder.model';

const Order = require('../models/oder.model');
const ProductService = require('../services/product.service');

class OderService {
    getAllOrders = async () => {
        try {
            return await Order.find().populate('detailOrders.product');
        } catch (err) {
            throw err;
        }
    }

    findOrderById = async (id) => {
        const order = await Order.findById(id).populate('detailOrders.product').exec();
        if (order) {
            return order;
        } else {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error
        }
    }

    createOrder = async (products, discount, deliveryLocation, note, customer) => {
        var total = 0;
        await Promise.all(products.map(async item => {
            const product = await ProductService.findProductById(item.product);
            total += product.price * item.amount;
        }));

        return await Order.create({
            customer: customer,
            orderDateTime: new Date(),
            deliveryLocation: deliveryLocation,
            note: note,
            discount: discount,
            detailOrders: products,
            totalPrice: total
        });
    }
    updateStatus = async (orderId, statusData) => {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                const error = new Error('Order not found');
                error.statusCode = 404;
                throw error;
            }
            await Order.updateOne({_id: orderId}, {$set: {status: statusData}});
        } catch (err) {
            throw err;
        }
    }


    getOrdersOfStatus = async (status) => {
        try {
            return await Order.find({status: status}).populate('detailOrders.product');
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new OderService();

