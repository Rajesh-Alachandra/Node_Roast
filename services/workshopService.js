// services/workshopService.js
const Workshop = require('../models/workshop');
const fs = require('fs');

// Create a new workshop
exports.createWorkshop = async ({ image, slots, title, price, description, date, duration, time, venue, terms, expectations }) => {
    const workshop = new Workshop({
        image,
        slots,
        title,
        price,
        description,
        date,
        duration,
        time,
        venue,
        terms,
        expectations,
    });

    await workshop.save();
    return workshop;
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
exports.updateWorkshop = async (workshopId, workshopData, file) => {
    if (file) {
        const existingWorkshop = await Workshop.findById(workshopId);
        if (existingWorkshop && existingWorkshop.image) {
            fs.unlink(existingWorkshop.image, (err) => {
                if (err) console.log('Error deleting old image:', err);
            });
        }
        workshopData.image = file.path;
    }

    return await Workshop.findByIdAndUpdate(workshopId, workshopData, { new: true });
};

// Delete a workshop by ID
exports.deleteWorkshop = async (workshopId) => {
    const workshop = await Workshop.findById(workshopId);
    if (workshop && workshop.image) {
        fs.unlink(workshop.image, (err) => {
            if (err) console.log('Error deleting image:', err);
        });
    }
    return await Workshop.findByIdAndDelete(workshopId);
};
