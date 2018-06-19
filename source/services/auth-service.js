'use strict';

const jwt = require('jsonwebtoken');
exports.generateToken = async (data) => {
    return jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });
}

exports.decodeToken = async (token) => {
    return await jwt.verify(token, global.SALT_KEY);
}

exports.authorize = async (request, response, next) => {
    var token = request.body.token || request.query.token || request.headers['x-access-token'];

    if (!token) {
        response.status(401).json({ message: 'Usuario não autorizado' })
    }
    else {
        jwt.verify(token, global.SALT_KEY, (error, decoded) => {
            if (error) {
                response.status(401).json({
                    message: 'Token inválido'
                });
            }
            else {
                next();
            }
        });
    }
}

exports.isAdmin = async (request, response, next) => {
    var token = request.body.token || request.query.token || request.headers['x-access-token'];

    if (!token) {
        response.status(401).json({ message: 'Usuario não autorizado' })
    }
    else {
        jwt.verify(token, global.SALT_KEY, (error, decoded) => {
            if (error) {
                response.status(401).json({
                    message: 'Token inválido'
                });
            }
            else {
                if (decoded.roles.includes('admin'))
                    next();
                else
                    response.status(403).json('Funcionalidade proibida');
            }
        });
    }
}