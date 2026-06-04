const Product = require('../models/Product');
const { validationResult } = require('express-validator');

exports.createProduct = async (req, res) => {   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, category, price, quantity } = req.body;

        const product = new Product({
            name,
            category,
            price,
            quantity
        });

        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error while creating product' });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments();

        res.status(200).json({
            total,
            page,
            pages: Math.ceil(total / limit),
            data: products
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error while fetching products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error.message);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(500).json({ message: 'Server error while fetching product' });
    }
};

exports.updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, category, price, quantity } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, category, price, quantity },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error.message);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(500).json({ message: 'Server error while updating product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product removed successfully' });
    } catch (error) {
        console.error(error.message);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(500).json({ message: 'Server error while deleting product' });
    }
};