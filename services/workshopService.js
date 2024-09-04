const Workshop = require('../models/workshop'); // Import the Workshop model
const fs = require('fs'); // Import the filesystem module for image handling

// Create a new workshop
exports.createWorkshop = async ({ image, slots, title, price, description, date, duration, time, venue, terms, expectations }) => {
    try {
        // Create a new workshop instance with provided details
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

        // Save the workshop to the database
        await workshop.save();

        // Return the saved workshop
        return workshop;
    } catch (error) {
        // Handle errors that occur during workshop creation
        throw new Error(`Error creating workshop: ${error.message}`);
    }
};

// Get all workshops
exports.getAllWorkshops = async () => {
    try {
        // Retrieve all workshops from the database
        return await Workshop.find();
    } catch (error) {
        // Handle errors that occur while fetching all workshops
        throw new Error(`Error retrieving workshops: ${error.message}`);
    }
};

// Get a single workshop by ID
exports.getWorkshopById = async (id) => {
    try {
        // Find a specific workshop by its ID
        return await Workshop.findById(id);
    } catch (error) {
        // Handle errors that occur while fetching a workshop by ID
        throw new Error(`Error retrieving workshop by ID: ${error.message}`);
    }
};

// Update a workshop by ID
exports.updateWorkshop = async (workshopId, workshopData, file) => {
    try {
        // Check if a new image file is provided
        if (file) {
            // Find the existing workshop by ID
            const existingWorkshop = await Workshop.findById(workshopId);

            // If an old image exists, delete it from the filesystem
            if (existingWorkshop && existingWorkshop.image) {
                fs.unlink(existingWorkshop.image, (err) => {
                    if (err) console.log('Error deleting old image:', err);
                });
            }

            // Update the workshopData with the new image file path
            workshopData.image = file.path;
        }

        // Update the workshop in the database with new data
        return await Workshop.findByIdAndUpdate(workshopId, workshopData, { new: true });
    } catch (error) {
        // Handle errors that occur during workshop update
        throw new Error(`Error updating workshop: ${error.message}`);
    }
};

// Delete a workshop by ID
exports.deleteWorkshop = async (workshopId) => {
    try {
        // Find the workshop by ID
        const workshop = await Workshop.findById(workshopId);

        // If the workshop has an associated image, delete it from the filesystem
        if (workshop && workshop.image) {
            fs.unlink(workshop.image, (err) => {
                if (err) console.log('Error deleting image:', err);
            });
        }

        // Delete the workshop from the database
        return await Workshop.findByIdAndDelete(workshopId);
    } catch (error) {
        // Handle errors that occur during workshop deletion
        throw new Error(`Error deleting workshop: ${error.message}`);
    }
};
