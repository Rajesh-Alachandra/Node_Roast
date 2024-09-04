const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define Order Item Schema for individual items within an order
const orderItemSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
});

// Define Main Order Schema
const orderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart', // Reference to the Cart model (optional but useful)
            required: true,
        },
        items: [orderItemSchema], // Array of items in the order
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['created', 'paid', 'shipped', 'delivered', 'cancelled'], // Various statuses for the order
            default: 'created',
        },
        razorpayOrderId: {
            type: String,
            required: true, // Store Razorpay order ID for reference
        },
        paymentDetails: {
            paymentId: { type: String }, // Razorpay payment ID
            signature: { type: String }, // Razorpay signature for verification
        },
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt fields
    }
);

// Update `updatedAt` field on save automatically
orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);
