'use strict'
const productService = require('../services/product.service')
const {CustomError} = require("../middleware/ExceptionHandler.middleware");

class productController {

    getAll = async (req, res) => {
        // handle error
        try {
            console.log('[P]::Get All Product::')
            /*
            * 200 OK
            * 201 Created
            * */
            const products = await productService.getProducts();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    getAllBooks = async (req, res, next) => {
        try {
            const books = await productService.getBooks();
            if (books.length === 0) {
                res.status(200).json({
                    data: null,
                    message: 'No book found'
                })
            }
            res.status(200).json({
                data: books,
                message: 'Get all books successfully'
            });
        } catch (err) {
            next(new CustomError(500, err.message, { layer: 'CONTROLLER', className: 'ProductController', methodName: 'getAllBooks' }));
        }
    }

    getAllProductsPopular = async (req, res) => {
        try {
            const products = await productService.getAllProductsPopular();
            res.status(200).json(products);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
    getAllProductsOfCategory = async (req, res) => {
        try {
            const products = await productService.getAllProductsOfCategory(req.params.id);
            res.status(200).json(products);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
    findProductById = async (req, res) => {
        try {
            const product = await productService.findProductById(req.params.id);
            if (product) {
                res.status(200).json(product);
            }
        } catch (err) {
            res.status(err.status? err.status: 500).json({message: err.message});
        }
    }

    findProductByName = async (req, res) => {
        try {
            const product = await productService.findProductByName(req.params.name);
            if (product) {
                res.status(200).json(product);
            }
        } catch (err) {
            res.status(err.status? err.status: 500).json({message: err.message});
        }
    }

    createProduct = async (req, res) => {
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).json({message: 'Product created successfully', metadata: product});
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    updateProductById = async (req, res) => {
        try {
            const product = await productService.updateProductById(req.params.id, req.body);
            res.status(200).json({message: 'Product updated successfully', metadata: product});
        } catch (err) {
              res.status(err.status? err.status: 500).json({message: err.message});
        }
    }

    deleteProductById = async (req, res) => {
        try {
            const product = await productService.deleteProductById(req.params.id);
            res.status(200).json({message: 'Product deleted successfully', metadata: product});
        } catch (err) {
            res.status(err.status? err.status: 500).json({message: err.message});
        }
    }

    getProductsWithRating = async (req, res) => {
        try {
            const products = await productService.getProductsWithRating();
            res.status(200).json(products);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    getProductsWithRating_Hung = async (req, res) => {
        try {
            const products = await productService.getProductsWithRating_Hung();
            res.status(200).json(products);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    getBooksByType = async (req, res, next) => {
        try {
            const books = await productService.getBooksByType(req.params.typeName);
            if (books.length === 0) {
                res.status(200).json({
                    data: null,
                    message: 'No book found'
                })
            }
            res.status(200).json({
                data: books,
                message: 'Get books by type successfully'
            });
        } catch (err) {
            next(new CustomError(500, err.message, { layer: 'CONTROLLER', className: 'ProductController', methodName: 'getBooksByType' }));
        }
    }
}

const Product = new productController()
module.exports = Product;