'use strict'

const express = require('express');
const router = express.Router();
const Oder = require('../../controllers/oder.controller.js');
//getAllOders
router.get('/oder', Oder.getAllOders);
//findOrderById
router.get('/oder/:id', Oder.findOrderById);
//createOrder
router.post('/oder/create', Oder.createOrder);
//updateStatus
router.patch('/oder/:id/status/update', Oder.updateStatus);
//getOrdersOfStatus
router.get('/oder/status/:status', Oder.getOrdersOfStatus);
module.exports = router;