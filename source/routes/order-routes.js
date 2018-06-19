'use strict';

const express = require('express');
const orderController = require('../controllers/order-controller');
const authService = require('../services/auth-service');
const router = express.Router();

router.get('/', orderController.getAll);
router.post('/', authService.authorize, orderController.register);

module.exports = router;
