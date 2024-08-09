'use strict'

const express = require('express');
const router = express.Router();
router.use('/v1/api', require('../routes/product'));
router.use('/v1/api', require('../routes/rating'));
router.use('/v1/api', require('../routes/category'));
router.use('/v1/api', require('../routes/cart'));
router.use('/v1/api', require('../routes/oder'));
router.use('/v1/api', require('./user/aut.route'));
router.use('/v1/api', require('../routes/protected/protected.route'));


module.exports = router;