// services/productService.js
const Product = require('../models/Product');
const fs = require('fs'); // Required for file system operations

// Create a new product
exports.postProduct = async ({ name, img, price, category, description, content }) => {
    const product = new Product({
        name,
        img, // This is the path of the uploaded image
        price,
        category,
        description,
        content,
    });

    await product.save();
    return product;
};

// Get all products with category populated
exports.getAllProducts = async () => {
    return await Product.find().populate('category'); // Populate category details
};

// Get a single product by ID with category populated
exports.getProductById = async (productId) => {
    return await Product.findById(productId).populate('category');
};

// Update a product by ID
exports.updateProduct = async (productId, productData, file) => {
    // If a new image is uploaded, handle the old one
    if (file) {
        const existingProduct = await Product.findById(productId);
        if (existingProduct && existingProduct.img) {
            fs.unlink(existingProduct.img, (err) => {
                if (err) console.log('Error deleting old image:', err);
            });
        }
        productData.img = file.path; // Assign new image path
    }

    return await Product.findByIdAndUpdate(productId, productData, { new: true }).populate('category');
};

// Delete a product by ID
exports.deleteProduct = async (productId) => {
    const product = await Product.findById(productId);
    if (product && product.img) {
        // Delete the associated image file
        fs.unlink(product.img, (err) => {
            if (err) console.log('Error deleting image:', err);
        });
    }
    return await Product.findByIdAndDelete(productId);
};

// Get products by category (using category ObjectId)
exports.getProductsByCategory = async (categoryId) => {
    return await Product.find({ category: categoryId }).populate('category');
};
