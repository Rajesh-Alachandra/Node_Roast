const mongoose = require('mongoose');

// Define the schema for the enrollment
const enrollmentSchema = new mongoose.Schema({
    // Reference to the user who is enrolled
    user: {
        type: mongoose.Schema.Types.ObjectId, // Specifies this field will store MongoDB ObjectIds
        ref: 'User', // Indicates that this field references the User model
        required: true // Ensures that the user field is mandatory
    },
    // Reference to the workshop in which the user is enrolled
    workshop: {
        type: mongoose.Schema.Types.ObjectId, // Specifies this field will store MongoDB ObjectIds
        ref: 'Workshop', // Indicates that this field references the Workshop model
        required: true // Ensures that the workshop field is mandatory
    },
    // Payment ID associated with the enrollment
    paymentId: {
        type: String, // Data type for storing payment IDs
        required: true // Ensures that paymentId is provided
    },
    // Status of the enrollment
    status: {
        type: String, // Data type for storing status as a string
        default: 'completed' // Default value for status if not specified
    },
}, { timestamps: true }); // Add timestamps (createdAt, updatedAt) to the schema

// Export the model for use in other parts of the application
module.exports = mongoose.model('Enrollment', enrollmentSchema);
