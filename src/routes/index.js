'use strict'

const express = require('express');
const router = express.Router();
router.use('/api', require('./product'));
router.use('/api', require('./rating'));
router.use('/api', require('./category'));
router.use('/api', require('./cart'));
router.use('/api', require('./oder'));
router.use('/api', require('./user/user.route'));
router.use('/api', require('./protected/protected.route'));
router.use('/api', require('./auth/auth.route'))


module.exports = router;