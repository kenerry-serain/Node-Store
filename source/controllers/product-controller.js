'use strict';

const productRepository = require('../repositories/product-Repository');
const IntegrityKeeper = require('../validators/integritykeeper');

exports.getAll = ('/', async (request, response, next) => {
    try {
        var productCollection = await productRepository.getAll();
        return response.status(200).send(productCollection);
    }
    catch (exception) {
        return TreatException(response, 'Falha ao selecionar a lista de produtos.');
    }
});

exports.getBySlug = ('/', async (request, response, next) => {
    try {
        var product = await productRepository.getBySlug(request.params.slug);
        return response.status(200).send(product);
    }
    catch (exception) {
        return TreatException(response, 'Falha ao selecionar um produto pelo slug.');
    }
});

exports.getByTags = ('/', async (request, response, next) => {
    try {
        var productCollection = await productRepository.getByTags(request.params.tags);
        return response.status(200).send(productCollection);
    }
    catch (exception) {
        return TreatException(response, 'Falha ao selecionar um produto pelas tags.');
    }
});

exports.register = ('/', async (request, response, next) => {

    let integrityKeeper = new IntegrityKeeper();
    integrityKeeper.isRequired(request.body.title, 'O título deve conter pelo menos três caracteres');

    //Validating Request
    if (!integrityKeeper.isValid()) {
        response.status(400).send({
            errorMessage: 'Falha ao cadastrar produto',
            data: integrityKeeper.errors()
        });
        return;
    }
    try {
        await productRepository.registerProduct(request.body);
        return response.status(201).send({ message: 'Produto cadastrado com sucesso' });
    }
    catch (exception) {
        return TreatException(response, 'Falha ao registrar um produto.');
    }
});

exports.alter = ('/:id', async (request, response, next) => {

    let integrityKeeper = new IntegrityKeeper();
    integrityKeeper.isRequired(request.body.title, 'O título deve conter pelo menos três caracteres');

    //Validating Request
    if (!integrityKeeper.isValid()) {
        response.status(400).send({
            errorMessage: 'Falha ao cadastrar produto',
            data: integrityKeeper.errors()
        });
        return;
    }
    try {
        await productRepository.updateProduct(request.params.id, request.body);
        return response.status(202).send({ message: 'Produto alterado com sucesso' });
    }
    catch (exception) {
        return TreatException(response, 'Falha ao atualizar um produto.');
    }
});

exports.remove = ('/:id', async (request, response, next) => {
    try {
        await productRepository.removeProduct(request.params.id);
        return response.status(202).send({ message: 'Produto removido com sucesso' });
    }
    catch (exception) {
        return TreatException(response, 'Falha ao remover um produto.');
    }
});

function TreatException(response, message) {
    return response.status(400).send({ message: message });
}

