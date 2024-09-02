// services/workshopService.js
const Workshop = require('../models/workshop');

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

// Enroll in a workshop (reduces available slots by 1)
exports.enrollInWorkshop = async (id) => {
    const workshop = await Workshop.findById(id);
    if (!workshop || workshop.slots <= 0) {
        throw new Error('No slots available');
    }
    workshop.slots -= 1;
    return await workshop.save();
};
