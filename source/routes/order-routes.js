'use strict';

const express = require('express');
const orderController = require('../controllers/order-controller');
const router = express.Router();

router.get('/', orderController.getAll);
router.post('/', orderController.register);

module.exports = router;
