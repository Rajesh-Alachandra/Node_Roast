const mongoose = require('mongoose');

// Define the schema for the cart
const cartSchema = new mongoose.Schema({
    // Reference to the user who owns the cart
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference type for MongoDB ObjectId
        ref: 'User', // Reference to the User model
        required: true // Ensures that user is required for the cart
    },
    // Array of products in the cart
    products: [
        {
            // Reference to the product
            product: {
                type: mongoose.Schema.Types.ObjectId, // Reference type for MongoDB ObjectId
                ref: 'Product', // Reference to the Product model
                required: true // Ensures that product is required in the cart
            },
            // Quantity of the product in the cart
            quantity: {
                type: Number, // Data type for quantity
                default: 1 // Default value is 1 if not specified
            },
        },
    ],
}, { timestamps: true }); // Add timestamps (createdAt, updatedAt) to the schema

// Export the model for use in other parts of the application
module.exports = mongoose.model('Cart', cartSchema);
