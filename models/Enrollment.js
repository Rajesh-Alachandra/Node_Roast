const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workshop: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed'], required: true, default: 'pending' },
    enrollmentDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
