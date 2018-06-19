'use strict';

const express = require('express');
const customerController = require('../controllers/customer-controller');
const authService = require('../services/auth-service');
const router = express.Router();

router.post('/', customerController.register);
router.post('/authenticate', customerController.authenticate);
router.post('/refresh-token', authService.authorize, customerController.refreshToken);

module.exports = router;
