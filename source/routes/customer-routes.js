'use strict';

const express = require('express');
const customerController = require('../controllers/customer-controller');
const router = express.Router();

router.post('/', customerController.register);

module.exports = router;
