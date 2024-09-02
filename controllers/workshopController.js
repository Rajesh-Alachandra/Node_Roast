// Importing required modules and services
const workshopService = require('../services/workshopService'); // Service for handling workshop-related operations
const fs = require('fs'); // File system module for handling file operations
const path = require('path'); // Module for working with file and directory paths

// Controller to create a new workshop
exports.createWorkshop = async (req, res) => {
    try {
        // Extract the image path if a file is uploaded
        const imagePath = req.file ? req.file.path : null;
        // Create workshop data including the image path
        const workshopData = { ...req.body, image: imagePath };
        // Create a new workshop using workshopService
        const workshop = await workshopService.createWorkshop(workshopData);
        // Respond with the created workshop and a 201 status code (Created)
        res.status(201).json(workshop);
    } catch (error) {
        // Handle any errors during workshop creation and send a 400 error response with the error message
        res.status(400).json({ error: error.message });
    }
};

// Controller to get all workshops
exports.getAllWorkshops = async (req, res) => {
    try {
        // Fetch all workshops using workshopService
        const workshops = await workshopService.getAllWorkshops();
        // Respond with the list of workshops and a 200 status code (OK)
        res.json(workshops);
    } catch (error) {
        // Handle any errors during fetching workshops and send a 500 error response with the error message
        res.status(500).json({ error: error.message });
    }
};

// Controller to get a single workshop by ID
exports.getWorkshopById = async (req, res) => {
    try {
        // Fetch the workshop by ID using workshopService
        const workshop = await workshopService.getWorkshopById(req.params.id);
        // Check if the workshop was found
        if (!workshop) return res.status(404).json({ error: 'Workshop not found' });
        // Respond with the workshop and a 200 status code (OK)
        res.json(workshop);
    } catch (error) {
        // Handle any errors during fetching workshop by ID and send a 500 error response with the error message
        res.status(500).json({ error: error.message });
    }
};

// Controller to update a workshop
exports.updateWorkshop = async (req, res) => {
    try {
        // Fetch the existing workshop by ID to check if it exists
        const existingWorkshop = await workshopService.getWorkshopById(req.params.id);
        if (!existingWorkshop) return res.status(404).json({ error: 'Workshop not found' });

        // Remove the old image if a new image is uploaded
        if (req.file && existingWorkshop.image) {
            fs.unlinkSync(path.resolve(existingWorkshop.image)); // Delete the old image file
        }

        // Get the path of the new image if uploaded, otherwise keep the existing image
        const imagePath = req.file ? req.file.path : existingWorkshop.image;
        // Create workshop data including the image path
        const workshopData = { ...req.body, image: imagePath };
        // Update the workshop using workshopService
        const updatedWorkshop = await workshopService.updateWorkshop(req.params.id, workshopData);
        // Respond with the updated workshop and a 200 status code (OK)
        res.json(updatedWorkshop);
    } catch (error) {
        // Handle any errors during workshop update and send a 400 error response with the error message
        res.status(400).json({ error: error.message });
    }
};

// Controller to delete a workshop
exports.deleteWorkshop = async (req, res) => {
    try {
        // Fetch the workshop by ID to check if it exists
        const workshop = await workshopService.getWorkshopById(req.params.id);
        if (workshop && workshop.image) {
            fs.unlinkSync(path.resolve(workshop.image)); // Delete the associated image file
        }

        // Delete the workshop using workshopService
        await workshopService.deleteWorkshop(req.params.id);
        // Respond with a success message and a 200 status code (OK)
        res.json({ message: 'Workshop deleted' });
    } catch (error) {
        // Handle any errors during workshop deletion and send a 500 error response with the error message
        res.status(500).json({ error: error.message });
    }
};


