// services/workshopService.js
const Workshop = require('../models/workshop');
const Enrollment = require("../models/Enrollment")

// Create a new workshop
exports.createWorkshop = async (workshopData) => {
    console.log(workshopData);
    const workshop = new Workshop(workshopData);
    return await workshop.save();
};

// Get all workshops
exports.getAllWorkshops = async () => {
    return await Workshop.find();
};

// Get a single workshop by ID
exports.getWorkshopById = async (id) => {
    return await Workshop.findById(id);
};

// Update a workshop by ID
exports.updateWorkshop = async (id, workshopData) => {
    return await Workshop.findByIdAndUpdate(id, workshopData, { new: true });
};

// Delete a workshop by ID
exports.deleteWorkshop = async (id) => {
    return await Workshop.findByIdAndDelete(id);
};

// Enroll in a workshop after payment success
exports.enrollInWorkshop = async (workshopId, userId) => {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop || workshop.slots <= 0) {
        throw new Error('No slots available');
    }

    // Check if the user is already enrolled
    const existingEnrollment = await Enrollment.findOne({ user: userId, workshop: workshopId });
    if (existingEnrollment) {
        throw new Error('User already enrolled in this workshop');
    }

    // Create a new enrollment with payment status as 'completed'
    const enrollment = new Enrollment({
        user: userId,
        workshop: workshopId,
        paymentStatus: 'completed', // Ensure payment is successful before enrolling
    });

    await enrollment.save();

    // Reduce available slots
    workshop.slots -= 1;
    await workshop.save();

    return enrollment;
};

// Get all workshops a user is enrolled in
exports.getEnrolledWorkshopsByUser = async (userId) => {
    return await Enrollment.find({ user: userId }).populate('workshop');
};
