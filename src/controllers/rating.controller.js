'use strict'
// import {
//     createRating as _createRatingService,
//     changeRating as _changeRatingService,
// } from '../../../../WebstormProjects/CofeeBackEnd/src/services/rating.service';

const ratingService = require('../services/rating.service')
class ratingController {
    createRating = async (req, res) => {
        try {
            const {
                customer,
                product
            } = req.params;
            const rating  = req.body;
            await ratingService.createRating(product, customer, rating);
            return res.status(200).json({ message: 'Rating created successfully' });
        } catch (error) {
            res.status(error.statusCode).json({ message: error.message });
            return false;
        }
    }

    changeRating = async (req, res) => {
        try {
            const {
                customer,
                product
            } = req.params;
            const rating  = req.body;
            await ratingService.changeRating(product, customer, rating);
            return res.status(200).json({ message: 'Rating changed successfully' });
        } catch (error) {
            res.status(error.statusCode).json({ message: error.message });
            return false;
        }
    }
}

module.exports = new ratingController();


