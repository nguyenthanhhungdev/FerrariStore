'use strict'

const express = require('express');
const router = express.Router();
router.use('/v1/api', require('./product'));
router.use('/v1/api', require('./rating'));
router.use('/v1/api', require('./category'));
router.use('/v1/api', require('./cart'));
router.use('/v1/api', require('./oder'));
router.use('/v1/api', require('./user/aut.route'));
router.use('/v1/api', require('./protected/protected.route'));
router.use('/v1/api', require('./auth'))


module.exports = router;