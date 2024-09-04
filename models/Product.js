const mongoose = require('mongoose');

// Define the schema for a product
const ProductSchema = new mongoose.Schema({
    // Name of the product
    name: {
        type: String, // Data type for product name
        required: true // Ensures that name is required
    },
    // URL or path to the product image
    img: {
        type: String, // Data type for image URL or path
        required: true // Ensures that image field is required
    },
    // Price of the product
    price: {
        type: Number, // Data type for product price
        required: true // Ensures that price is required
    },
    // Reference to the category of the product
    category: {
        type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type for category reference
        ref: 'Category', // Reference to the Category model
        required: false // Category is not required, can be omitted
    },
    // Description of the product
    description: {
        type: String, // Data type for product description
        required: true // Ensures that description is required
    },
    // Array of content strings related to the product
    content: {
        type: [String], // Data type for an array of strings
        required: true // Ensures that content is required
    },
}, { timestamps: true }); // Add timestamps (createdAt, updatedAt) to the schema

// Export the model for use in other parts of the application
module.exports = mongoose.model('Product', ProductSchema);
