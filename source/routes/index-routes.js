'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (request, response, next) => {
    response.status(200).send({
        title: 'Kenerry Node Store - It Works',
        version: '1.0',
    });
});

module.exports = router;