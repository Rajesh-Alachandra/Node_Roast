// controllers/productController.js
const productService = require('../services/productService');
const upload = require('../utils/upload');

// Create a new product with image upload
exports.postProduct = [
    upload.single('img'), // Middleware to handle file upload
    async (req, res) => {
        try {
            const { name, price, category, description, content } = req.body;
            const img = req.file ? req.file.filename : null; // Extract only the filename

            if (!img) {
                return res.status(400).json({ error: 'Image upload failed' });
            }

            const product = await productService.postProduct({
                name,
                img,
                price,
                category,
                description,
                content: content ? content.split(',') : [],
            });

            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
];
// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a product
exports.updateProduct = [
    upload.single('img'), // Handle new image upload if provided
    async (req, res) => {
        try {
            const product = await productService.updateProduct(req.params.id, req.body, req.file);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
];

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await productService.deleteProduct(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await productService.getProductsByCategory(req.params.categoryId);
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
