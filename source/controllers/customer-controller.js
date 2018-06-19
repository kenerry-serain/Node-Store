'use strict';

const customerRepository = require('../repositories/customer-Repository');
const IntegrityKeeper = require('../validators/integritykeeper');
const md5 = require('md5');
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

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
        await customerRepository.registerCustomer({
            name: request.body.name,
            email: request.body.email,
            password: md5(request.body.password + global.SALT_KEY),
            roles: ['user']
        });

        emailService.send(request.body.email, 'Node Store', '<p> Welcome to Node Store! </p>');
        return response.status(201).send({ message: 'Customer cadastrado com sucesso' });
    }
    catch (exception) {
        console.log(exception);
        return TreatException(response, 'Falha ao registrar um customer.');
    }
});

exports.authenticate = ('/', async (request, response, next) => {

    try {
        const customer = await customerRepository.authenticate({
            email: request.body.email,
            password: md5(request.body.password + global.SALT_KEY)
        });

        if (!customer) {
            return response.status(404).send({
                message: 'Usuario ou senha inválidos'
            });
        }

        const generatedToken = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        return response.status(201).send({
            token: generatedToken,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    }
    catch (exception) {
        console.log(exception);
        return TreatException(response, 'Falha ao registrar um customer.');
    }
});

exports.refreshToken = ('/', async (request, response, next) => {
    
        try {
            var token = request.body.token || request.query.token || request.headers['x-access-token'];
            const data = await authService.decodeToken(token);
            console.log(data);
            const customer = await customerRepository.getById(data.id);
            console.log(customer)
            if (!customer) {
                return response.status(404).send({
                    message: 'Usuario ou senha inválidos'
                });
            }
    
            const generatedToken = await authService.generateToken({
                id: customer._id,
                email: customer.email,
                name: customer.name
            });
    
            return response.status(201).send({
                token: generatedToken,
                data: {
                    email: customer.email,
                    name: customer.name
                }
            });
        }
        catch (exception) {
            console.log(exception);
            return TreatException(response, 'Falha ao registrar um customer.');
        }
    });


function TreatException(response, message) {
    return response.status(400).send({ message: message });
}

