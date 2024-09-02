// Importing required modules
const Product = require('../models/Product'); // Product model
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

    await product.save(); // Save the new product to the database
    return product; // Return the created product
};

// Get all products with category populated
exports.getAllProducts = async () => {
    return await Product.find().populate('category'); // Fetch all products and populate category details
};

// Get a single product by ID with category populated
exports.getProductById = async (productId) => {
    return await Product.findById(productId).populate('category'); // Fetch a single product by its ID and populate category details
};

// Update a product by ID
exports.updateProduct = async (productId, productData, file) => {
    // If a new image is uploaded, handle the old one
    if (file) {
        const existingProduct = await Product.findById(productId);
        if (existingProduct && existingProduct.img) {
            fs.unlink(existingProduct.img, (err) => {
                if (err) console.log('Error deleting old image:', err); // Log any errors in deleting the old image
            });
        }
        productData.img = file.path; // Assign new image path
    }

    // Update the product with the new data and return the updated product
    return await Product.findByIdAndUpdate(productId, productData, { new: true }).populate('category');
};

// Delete a product by ID
exports.deleteProduct = async (productId) => {
    const product = await Product.findById(productId);
    if (product && product.img) {
        // Delete the associated image file
        fs.unlink(product.img, (err) => {
            if (err) console.log('Error deleting image:', err); // Log any errors in deleting the image
        });
    }
    return await Product.findByIdAndDelete(productId); // Delete the product and return the deleted product
};

// Get products by category (using category ObjectId)
exports.getProductsByCategory = async (categoryId) => {
    return await Product.find({ category: categoryId }).populate('category'); // Fetch products by category and populate category details
};
