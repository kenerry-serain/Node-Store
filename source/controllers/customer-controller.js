'use strict';

const customerRepository = require('../repositories/customer-Repository');
const IntegrityKeeper = require('../validators/integritykeeper');

exports.register = ('/', async (request, response, next) => {

    let integrityKeeper = new IntegrityKeeper();
    integrityKeeper.isRequired(request.body.name, 'O nome deve conter pelo menos três caracteres');

    //Validating Request
    if (!integrityKeeper.isValid()) {
        response.status(400).send({
            errorMessage: 'Falha ao cadastrar client',
            data: integrityKeeper.errors()
        });
        return;
    }
    try {
        await customerRepository.registerCustomer(request.body);
        return response.status(201).send({ message: 'Customer cadastrado com sucesso' });
    }
    catch (exception) {
        return TreatException(response, 'Falha ao registrar um customer.');
    }
});


function TreatException(response, message) {
    return response.status(400).send({ message: message });
}

