const mongoose = require('mongoose');

// Define the schema for an order
const orderSchema = new mongoose.Schema({
    // Reference to the user who placed the order
    user: {
        type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type for user reference
        ref: 'User', // Reference to the User model
        required: true // Ensures that an order must be associated with a user
    },
    // Array of products in the order
    products: [
        {
            // Reference to the product
            product: {
                type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type for product reference
                ref: 'Product', // Reference to the Product model
                required: true // Ensures that each product in the order must be referenced
            },
            // Quantity of the product
            quantity: {
                type: Number, // Data type for quantity
                default: 1 // Default value is 1 if not specified
            },
        },
    ],
    // Total amount for the order
    totalAmount: {
        type: Number, // Data type for total amount
        required: true // Ensures that total amount is required for each order
    },
    // Payment identifier from the payment gateway
    paymentId: {
        type: String, // Data type for payment ID
        required: true, // Ensures that payment ID is required
        unique: true // Ensures that payment ID must be unique across all orders
    },
    // Status of the order
    status: {
        type: String, // Data type for status
        enum: ['pending', 'completed', 'failed'], // Allowed values for status
        default: 'pending' // Default value is 'pending' if not specified
    },
}, { timestamps: true }); // Add timestamps (createdAt, updatedAt) to the schema

// Export the model for use in other parts of the application
module.exports = mongoose.model('Order', orderSchema);
