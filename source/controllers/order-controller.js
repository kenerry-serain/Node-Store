'use strict';

const orderRepository = require('../repositories/order-Repository');
const guid = require('guid');

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
        await orderRepository.registerOrder({
            customer: request.body.customer,
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

