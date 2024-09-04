// models/workshop.js
const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
    image: { type: String, required: true }, // Image URL or path
    slots: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    duration: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    terms: { type: [String], required: true }, // Array of terms
    expectations: { type: [String], required: true }, // Array of expectations
}, { timestamps: true });

module.exports = mongoose.model('Workshop', workshopSchema);
