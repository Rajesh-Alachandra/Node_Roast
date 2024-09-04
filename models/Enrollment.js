const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workshop: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true },
    paymentId: { type: String, required: true },
    status: { type: String, default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
