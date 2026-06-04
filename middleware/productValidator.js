const { check } = require('express-validator');

exports.productValidationRules = [
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Category must be a string').optional().isString(),
    check('price', 'Price must be a positive number').isFloat({ gt: 0 }),
    check('quantity', 'Quantity must be a non-negative integer').isInt({ min: 0 })
];