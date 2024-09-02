// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String, required: true }, // Image URL or path
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false }, // Reference to Category
    description: { type: String, required: true },
    content: { type: [String], required: true }, // Array of content strings
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
