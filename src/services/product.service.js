'use strict'
// import Product from '../models/product.model';
// import Rating from '../models/rating.model';

const Product = require('../models/product.model');
const Book = require('../models/book.model');
const {CustomError} = require("../middleware/ExceptionHandler.middleware");

class ProductService {
  getProducts = async () => {
    try {
      return await Product.find().populate('category');
    } catch (error) {
      throw error;
    }
  };

  getBooks = async () => {
    try {
      return await Book.find()
        .populate('authors', 'name')
        .populate('category', 'name');
    } catch (error) {
      throw new CustomError(500, error.message, {
        layer: 'SERVICE',
        className: 'ProductService',
        methodName: 'getBooks'
      });
    }
  }

  getBooksByCategory = async (category) => {

  }

  getBooksByType = async (typeName) => {
    try {
      if (!typeName) {
        throw new CustomError(400, 'Type name is required', {
          layer: 'SERVICE',
          className: 'ProductService',
          methodName: 'getBooksByType'
        });
      }
      const query = {
        'type.name': {
          $regex: new RegExp(typeName, 'i')
        }
      };

      return await Book.find(query)
        .populate('authors', 'name')
        .populate('category', 'name');

    } catch (error) {
      throw error;
    }
  }

  getAllProductsPopular = async () => {
    try {
      return await Product.find({popular: true});
    } catch (error) {
      throw error;
    }
  }

  getAllProductsOfCategory = async (id) => {
    try {
      return await Product.find({category: id});
    } catch (error) {
      throw error;
    }
  }

  findProductById = async (id) => {
    try {
      return await Product.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  findProductByName = async (name) => {
    try {
      return await Product.find({name: {$regex: name, $options: 'i'}});
    } catch (err) {
      throw err;
    }
  }

  createProduct = async (data) => {
    // return await Product.create({
    //     ...data
    // });

    return await Product.create({

      name: data.name,
      price: data.price,
      description: data.description,
      image: data.image,
      category: data.category

    });
  }
  updateProductById = async (productId, updateData) => {
    const updateProduct = await Product.findByIdAndUpdate(productId, updateData, {new: true}).exec();
    if (!updateProduct) {
      const error = new Error('Product is not found')
      error.status = 404;
      throw error;
    }
    return updateProduct;
  }

  deleteProductById = async (productId) => {
    const deleteProduct = await Product.findByIdAndDelete(productId).exec();
    if (!deleteProduct) {
      const error = new Error('Product is not found')
      error.status = 404;
      throw error;
    }
    return deleteProduct;
  }

  getProductsWithRating = async () => {
    try {
      const products = await Product.find();
      const productRatings = await Rating.aggregate([
        {
          $group: {
            _id: "$product",
            avgRating: {$avg: "$rating"},
          },
        },
      ]);

      const productsWithRatings = products.map((product) => {
        const avgRatingObj = productRatings.find(
          (rating) => rating._id.toString() === product._id.toString()
        );
        const avgRating = avgRatingObj ? avgRatingObj.avgRating : 0;
        return {...product.toObject(), avgRating};
      });
    } catch (err) {
      throw err;
    }
  }

  getProductsWithRating_Hung = async () => {
    try {
      return await Product.aggregate([
        {
          $lookup: {
            from: 'ratings',
            localField: '_id',
            foreignField: 'product',
            as: 'ratings',
          },
        },
        {
          $addFields: {
            avgRating: {
              $avg: '$ratings.rating',
            },
          },
        },
        {
          $project: {
            ratings: 0,
          },
        },
      ]);
    } catch (err) {
      throw err;
    }
  };
}


module.exports = new ProductService();