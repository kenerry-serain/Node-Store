'use strict';

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.registerCustomer = async (requestBody) => {
    const customer = new Customer(requestBody);
    await customer.save();
}

