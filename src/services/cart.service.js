'use strict'
// import Cart from '../models/cart.model';
// import Product from '../models/product.model';
// import {Customer} from '../models/user.model.js';

const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ProductService = require('../services/product.service');
const {Customer} = require('../models/user.model');
class CartService{
    getCartOfCustomer = async (customerId) => {
        const customer = await Customer.findById(customerId).exec();
        if (!customer) {
            const error = new Error('Customer not found');
            error.statusCode = 404;
            throw error;
        }
        return await Cart.findOne({customer: customerId}).populate('products.product').exec();
    }

    addToCart = async (customerId, productId, amount) => {
        const customer = await Customer.findById(customerId).exec();
        if (!customer) {
            const error = new Error('Customer not found');
            error.statusCode = 404;
            throw error;
        }

        const product = await Product.findById(productId).exec();
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        let cart = await Cart.findOne({ customer: customerId }).exec();
        if (!cart) {
            cart = new Cart({
                customer: customerId,
                total: product.price * amount,
                products: [{ product: productId, amount: amount, price: product.price }],
            });
        } else {
            const existingProductIndex = cart.products.findIndex(p => p.product._id.equals(product._id));
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].amount += amount;
                cart.total += product.price * amount;
            } else {
                cart.products.push({ product: productId, amount: amount, price: product.price });
                cart.total += product.price * amount;
            }
        }
        return await cart.save();
    };

    getIndexOfProduct = async (customerId, productId, cart) => {
        const customer = await Customer.findById(customerId).exec();
        if (!customer) {
            const error = new Error('Customer not found');
            error.statusCode = 404;
            throw error;
        }

        if (!cart) {
            const error = new Error('Cart not found');
            error.statusCode = 404;
            throw error;
        }

        const productIndex = cart.products.findIndex(p => p.product._id.equals(productId));
        if (productIndex === -1) {
            const error = new Error('Product not found in cart');
            error.statusCode = 404;
            throw error;
        }
        return productIndex;
    }

    increaseProductOfCart = async (customerId, productId, amount) => {
        const cart = await Cart.findOne({customer: customerId}).populate('products.product').exec();
        const product = cart.products[await this.getIndexOfProduct(customerId, productId, cart)];
        product.amount += amount;
        cart.total += product.product.price;
        return await cart.save();
    };

    decreaseProductOfCart = async (customerId, productId, amount) => {
        let cart = await Cart.findOne({customer: customerId}).populate('products.product').exec();
        const productIndex = await this.getIndexOfProduct(customerId, productId, cart);
        const product = cart.products[productIndex];
        if (product.amount === 1) {
            cart.products.splice(productIndex, 1);
            cart.total -= product.price;
            product.amount = 0;
        } else {
            product.amount -= amount;
            cart.total -= product.product.price;
        }
        return await cart.save();
    };

    resetCart = async (customerId) => {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            const error = new Error('Customer not found');
            error.statusCode = 404;
            throw error;
        }
        const cart = await Cart.findOneAndUpdate(
            {customer: customerId},
            {$set: {total: 0, products: []}},
            {new: true}
        ).exec();
        if (!cart) {
            const error = new Error('Cart not found');
            error.statusCode = 404;
            throw error;
        }
        return cart;
    }
    updateCart = async (customerId, products) => {
        // Find or create the cart
        const currentCart = await Cart.findOneAndUpdate(
            { customer: customerId },
            { $set: { customer: customerId, total: 0, products: [] } },
            { upsert: true, new: true }
        );

        // Update products in the cart
        const updatedProducts = [];
        for (const productDetail of products) {
            const productIndex = currentCart.products.findIndex((p) => p.product.equals(productDetail.product._id));
            if (productIndex !== -1) {
                // Update product amount
                currentCart.products[productIndex].amount = productDetail.amount;
                updatedProducts.push(currentCart.products[productIndex]);
            } else {
                // Get product by id
                const product = await ProductService.findProductById(productDetail.product);
                // Add new product to cart
                updatedProducts.push({
                    product: productDetail.product,
                    amount: productDetail.amount,
                    price: product.price,
                });
            }
        }

        // Update cart products
        currentCart.products = updatedProducts;

        // Save the cart
        return await currentCart.save();
    };
}

module.exports = new CartService();