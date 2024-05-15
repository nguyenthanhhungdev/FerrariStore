'use strict'
const customerService = require('../services/customer.service');

class CustomerController {
    getCustomers= async(req, res) => {
        try {
            const customers = await customerService.getCustomerById(req.params.id);
            return res.status(200).json(customers);
        } catch (error) {
            res.status(error.statusCode | 500).json({message: error.message});
        }
    }
}
module.exports = new CustomerController();