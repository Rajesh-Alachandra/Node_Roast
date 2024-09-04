// Importing required models
const Workshop = require('../models/workshop'); // Workshop model
const Enrollment = require('../trash/Enrollment'); // Enrollment model

// Service to create a new workshop
exports.createWorkshop = async (workshopData) => {
    console.log(workshopData); // Log workshop data for debugging purposes
    const workshop = new Workshop(workshopData); // Create a new workshop instance with provided data
    return await workshop.save(); // Save the workshop to the database and return it
};

// Service to get all workshops
exports.getAllWorkshops = async () => {
    return await Workshop.find(); // Fetch all workshop entries from the database
};

// Service to get a single workshop by ID
exports.getWorkshopById = async (id) => {
    return await Workshop.findById(id); // Fetch a single workshop by its ID
};

// Service to update a workshop by ID
exports.updateWorkshop = async (id, workshopData) => {
    return await Workshop.findByIdAndUpdate(id, workshopData, { new: true }); // Update the workshop and return the updated entry
};

// Service to delete a workshop by ID
exports.deleteWorkshop = async (id) => {
    return await Workshop.findByIdAndDelete(id); // Delete the workshop by its ID and return the deleted entry
};

// Service to enroll a user in a workshop after payment success
exports.enrollInWorkshop = async (workshopId, userId) => {
    const workshop = await Workshop.findById(workshopId); // Find the workshop by ID
    if (!workshop || workshop.slots <= 0) {
        throw new Error('No slots available'); // Throw an error if the workshop does not exist or has no available slots
    }

    // Check if the user is already enrolled
    const existingEnrollment = await Enrollment.findOne({ user: userId, workshop: workshopId });
    if (existingEnrollment) {
        throw new Error('User already enrolled in this workshop'); // Throw an error if the user is already enrolled
    }

    // Create a new enrollment with payment status as 'completed'
    const enrollment = new Enrollment({
        user: userId,
        workshop: workshopId,
        paymentStatus: 'completed', // Ensure payment is successful before enrolling
    });

    await enrollment.save(); // Save the enrollment to the database

    // Reduce available slots in the workshop
    workshop.slots -= 1;
    await workshop.save(); // Save the updated workshop with reduced slots

    return enrollment; // Return the created enrollment
};

// Service to get all workshops a user is enrolled in
exports.getEnrolledWorkshopsByUser = async (userId) => {
    return await Enrollment.find({ user: userId }).populate('workshop'); // Find all enrollments for the user and populate the workshop details
};
