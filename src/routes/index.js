'use strict'
// import {Router} from 'express';

// const {Router} = require('express');
// const router = Router();

const express = require('express');
const router = express.Router();
router.use('/v1/api', require('../routes/product'));
router.use('/v1/api', require('../routes/rating'));
// router.use('/v1/api', require('../routes/oder'));
// router.use('/v1/api', require('../routes/cart'));


module.exports = router;