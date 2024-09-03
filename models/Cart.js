const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }, // To handle multiple items of the same product
});

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [CartItemSchema], // Array of cart items
    totalAmount: { type: Number, default: 0 }, // Total cart amount
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
