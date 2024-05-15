'use strict'
const {Customer} = require("../models/user.model")
class CustomerService {
    getCustomerById = async(id) => {
        try {
            return await Customer.findById(id).populate("commonuser").exec();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CustomerService();