'use strict';

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.registerCustomer = async (requestBody) => {
    const customer = new Customer(requestBody);
    await customer.save();
}

exports.authenticate = async(data) =>{
    return Customer.findOne({
        email: data.email,
        password: data.password
    });
}

exports.getById = async(id) =>{
    return Customer.findById(id);
}