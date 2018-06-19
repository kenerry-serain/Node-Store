'use strict';

const orderRepository = require('../repositories/order-Repository');
const guid = require('guid');
const jwt = require('jsonwebtoken');

exports.getAll = ('/', async (request, response, next) => {
    try {
        var orderCollection = await orderRepository.getAll();
        return response.status(200).send(orderCollection);
    }
    catch (exception) {
        return TreatException(response, 'Falha ao selecionar uma order.');
    }
});


exports.register = ('/', async (request, response, next) => {
    //No validationg for a while
    try {
        var token = request.body.token || request.query.token || request.headers['x-access-token'];
        var data = jwt.decode(token);         

        await orderRepository.registerOrder({
            customer: data.id,
            number: guid.raw().substring(0,6),
            items: request.body.items
        });
        return response.status(201).send({ message: 'Order cadastrada com sucesso' });
    }
    catch (exception) {
        return TreatException(response, 'Falha ao registrar uma order.');
    }
});


function TreatException(response, message) {
    return response.status(400).send({ message: message });
}

