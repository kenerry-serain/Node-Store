'use strict';

const express = require('express');
const productController = require('../controllers/product-controller');
const authService = require('../services/auth-service');
const router = express.Router();

router.get('/', productController.getAll);
router.get('/:slug', productController.getBySlug);
router.get('/tags/:tags', productController.getByTags);
router.post('/', authService.isAdmin, productController.register);
router.put('/:id', productController.alter);
router.delete('/:id', productController.remove);

module.exports = router;