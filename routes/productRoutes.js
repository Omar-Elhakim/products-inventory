const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { productValidationRules } = require('../middleware/productValidator');

router.post('/', protect, admin, productValidationRules, productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', protect, admin, productValidationRules, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;