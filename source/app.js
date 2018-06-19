'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const configuration = require('./config');
const app = express();

express.Router();
const mongoose = require('mongoose');
mongoose.connect(configuration.connectionString);

//Carregando models
require('./models/product');
require('./models/customer');
require('./models/order');

//Carregando rotas
const indexRoutes = require('./routes/index-routes');
const productRoutes = require('./routes/product-routes');
const customerRoutes = require('./routes/customer-routes');
const orderRoutes = require('./routes/order-routes');

//Todas requisições passarão por este middleware e o body será convertido em json
app.use(bodyParser.json({
    limit: '5mb'
}));

//Desabilita a utilização de objetos complexos via url encoded
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use((request, response, next)=>{
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', indexRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

app.use(function (error, request, response, next) {
    response.status(500).send({
        message: 'Falha ao processar sua requisição!',
        data: error
    });
});

module.exports = app; //Quando o require for chamado para este arquivo, o que será exportado é o "app".