'use strict'
// import {
//     getCartOfUser as _getetCartOfUser,
//     addToCart as _addToCart,
//     increaseProductOfCart as _increaseProductOfCart,
//     decreaseProductOfCart as _decreaseProductOfCart,
//     resetCart as _resetCart
//
// } from '../../../../WebstormProjects/CofeeBackEnd/src/services/cart.service';

const cartService = require('../services/cart.service');
const productService = require("../services/product.service");
class cartController {
    getCartOfUser = async (req, res) => {
        try {
            const cart = await cartService.getCartOfCustomer(req.params.customer);
            res.status(200).json(cart);
        } catch (error) {
            res.status(error.statusCode || 500).json({message: error.message});
        }
    }

    addToCart = async (req, res) => {
        try {
            const cart = await cartService.addToCart(req.params.customer, req.params.product, req.body.amount);
            res.status(200).json({message: 'Add to cart successfully!', metadata: cart});
        } catch (error) {
            res.status(error.statusCode || 500).json({message: error.message});
        }
    }

    decreaseProductOfCart = async (req, res) => {
        try {
            const cart = await cartService.decreaseProductOfCart(req.params.customer, req.params.product, req.body.amount);
            res.status(200).json({message: 'Decrease product of cart successfully!', metadata: cart});
        } catch (error) {
            res.status(error.statusCode || 500).json({message: error.message});
        }
    }

    increaseProductOfCart = async (req, res) => {
        try {
            const cart = await cartService.increaseProductOfCart(req.params.customer, req.params.product, req.body.amount);
            res.status(200).json({message: 'Increase product of cart successfully!', metadata: cart});
        } catch (error) {
            res.status(error.statusCode || 500).json({message: error.message});
        }
    }

    resetCart = async (req, res) => {
        try {
            const cart = await cartService.resetCart(req.params.customer);
            res.status(200).json({message: 'Reset cart successfully!', metadata: cart});
        } catch (error) {
            res.status(error.statusCode || 500).json({message: error.message});
        }
    }
    updateCart = async (req, res) => {
        try {
            console.log("[P]:::Update Cart:::")
            const products = req.body.products;

            // Check if any property in products is null
            if (products?.length <= 0) {
                return res.status(400).json({message: 'Products cannot be null'});
            }

            for (const item of products) {
                console.log("[P]:::Product:::", item)
                if (item?.amount == null) {
                    return res.status(400).json({message: 'Product or amount cannot be null'});
                }
            }

            const updatedProducts = await Promise.all(products.map(async item => {
                const product = await productService.findProductById(item.product);
                return {
                    product: item.product,
                    amount: item.amount,
                    price: product.price
                };
            }));

            const cart = await cartService.updateCart(req.params.customer, updatedProducts);
            res.status(200).json({message: 'Update cart successfully!', metadata: cart});
        } catch (error) {
            res.status(error.statusCode || 500).json({message: error.message});
        }
    }
}

const Cart = new cartController();
module.exports = Cart;