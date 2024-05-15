'use strict'
const { Router } = require('express');
const router = Router();
const Customer = require('../../controllers/customer.controller');
//getCustomerById
router.get('/customer/:id', Customer.getCustomers);

module.exports = router;