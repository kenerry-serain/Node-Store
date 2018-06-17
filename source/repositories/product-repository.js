'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const defaultActiveValue = true;
const defaultColumnsToSelect = 'title slug price tags';

exports.getAll = async _ =>
    await Product.find({ active: defaultActiveValue }, defaultColumnsToSelect);

exports.getBySlug = async (slug) =>
    await Product.findOne({ slug: slug, active: defaultActiveValue }, defaultColumnsToSelect);

exports.getByTags = async (tags) =>
    await Product.findOne({ tags: tags, active: defaultActiveValue }, defaultColumnsToSelect);

exports.registerProduct = async (requestBody) => {
    const product = new Product(requestBody);
    await product.save();
}

exports.updateProduct = async (id, requestBody) => {
    return await Product.findByIdAndUpdate(id, {
        $set: {
            title: requestBody.title,
            description: requestBody.description,
            price: requestBody.price,
            slug: requestBody.slug,
        }
    });
}

exports.removeProduct = async (id) => 
    await Product.findByIdAndRemove(id);


