'use strict';

const productRepository = require('../repositories/product-Repository');
const IntegrityKeeper = require('../validators/integritykeeper');
const azureStorage = require('azure-storage');
const guid = require('guid');
const configuration = require('../config');

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

        const blobService = azureStorage.createBlobService(configuration.containerConnectionString);
        let fileName = guid.raw().toString() + '.jpg';
        let rawData = request.body.image;
        let matches = rawData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');
        console.log('aqui'+matches[1]);
        blobService.createBlockBlobFromText('product-images', fileName, buffer, {contentType:type},(error, result, response)=>{
            if(error) //Se der erro colocar uma imagem padrão
                fileName = 'default-product.jpg';
        });

        request.body.image = 'https://kenerrynodestore.blob.core.windows.net/product-images/' + fileName;
        await productRepository.registerProduct(request.body);
        return response.status(201).send({ message: 'Produto cadastrado com sucesso' });
    }
    catch (exception) {
        console.log(exception);
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

