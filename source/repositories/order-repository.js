'use strict';

const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.getAll = async _ => 
    await Order.find({}, 'number status customer items')
    .populate('customer', 'name')
    .populate('items.product', 'title');

exports.registerOrder = async (requestBody) => {
    const order = new Order(requestBody);
    await order.save();
}

