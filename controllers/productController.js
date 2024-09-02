// Importing required modules and utilities
const productService = require('../services/productService'); // Service for handling product-related operations
const upload = require('../utils/upload'); // Middleware for handling file uploads

// Controller to create a new product with image upload
exports.postProduct = [
    upload.single('img'), // Middleware to handle single file upload (image)
    async (req, res) => {
        try {
            // Extracting product details from the request body
            const { name, price, category, description, content } = req.body;
            // Extracting the filename of the uploaded image if it exists
            const img = req.file ? req.file.filename : null;

            // Check if the image upload was successful
            if (!img) {
                return res.status(400).json({ error: 'Image upload failed' });
            }

            // Creating a new product using productService
            const product = await productService.postProduct({
                name,
                img,
                price,
                category,
                description,
                content: content ? content.split(',') : [], // Convert comma-separated content into an array
            });

            // Responding with the created product and a 201 status code
            res.status(201).json(product);
        } catch (error) {
            // Handling any errors and responding with a 400 status code
            res.status(400).json({ error: error.message });
        }
    },
];

// Controller to get all products
exports.getAllProducts = async (req, res) => {
    try {
        // Fetching all products using productService
        const products = await productService.getAllProducts();
        // Responding with the list of products and a 200 status code
        res.status(200).json(products);
    } catch (error) {
        // Handling any errors and responding with a 400 status code
        res.status(400).json({ error: error.message });
    }
};

// Controller to get a product by ID
exports.getProductById = async (req, res) => {
    try {
        // Fetching a single product by ID using productService
        const product = await productService.getProductById(req.params.id);
        // Check if the product exists
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        // Responding with the product details and a 200 status code
        res.status(200).json(product);
    } catch (error) {
        // Handling any errors and responding with a 400 status code
        res.status(400).json({ error: error.message });
    }
};

// Controller to update a product
exports.updateProduct = [
    upload.single('img'), // Middleware to handle new image upload if provided
    async (req, res) => {
        try {
            // Updating the product using productService
            const product = await productService.updateProduct(req.params.id, req.body, req.file);
            // Check if the product exists
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            // Responding with the updated product and a 200 status code
            res.status(200).json(product);
        } catch (error) {
            // Handling any errors and responding with a 400 status code
            res.status(400).json({ error: error.message });
        }
    },
];

// Controller to delete a product
exports.deleteProduct = async (req, res) => {
    try {
        // Deleting the product using productService
        const product = await productService.deleteProduct(req.params.id);
        // Check if the product exists
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        // Responding with a success message and a 200 status code
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        // Handling any errors and responding with a 400 status code
        res.status(400).json({ error: error.message });
    }
};

// Controller to get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        // Fetching products by category using productService
        const products = await productService.getProductsByCategory(req.params.categoryId);
        // Responding with the list of products and a 200 status code
        res.status(200).json(products);
    } catch (error) {
        // Handling any errors and responding with a 400 status code
        res.status(400).json({ error: error.message });
    }
};
