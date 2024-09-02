// controllers/workshopController.js
const workshopService = require('../services/workshopService');
const fs = require('fs');
const path = require('path');

// Create a new workshop
exports.createWorkshop = async (req, res) => {
    try {
        const imagePath = req.file ? req.file.path : null;
        const workshopData = { ...req.body, image: imagePath };
        const workshop = await workshopService.createWorkshop(workshopData);
        res.status(201).json(workshop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get all workshops
exports.getAllWorkshops = async (req, res) => {
    try {
        const workshops = await workshopService.getAllWorkshops();
        res.json(workshops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single workshop by ID
exports.getWorkshopById = async (req, res) => {
    try {
        const workshop = await workshopService.getWorkshopById(req.params.id);
        if (!workshop) return res.status(404).json({ error: 'Workshop not found' });
        res.json(workshop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a workshop
exports.updateWorkshop = async (req, res) => {
    try {
        const existingWorkshop = await workshopService.getWorkshopById(req.params.id);
        if (!existingWorkshop) return res.status(404).json({ error: 'Workshop not found' });

        // Remove the old image if a new one is uploaded
        if (req.file && existingWorkshop.image) {
            fs.unlinkSync(path.resolve(existingWorkshop.image));
        }

        const imagePath = req.file ? req.file.path : existingWorkshop.image;
        const workshopData = { ...req.body, image: imagePath };
        const updatedWorkshop = await workshopService.updateWorkshop(req.params.id, workshopData);
        res.json(updatedWorkshop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a workshop
exports.deleteWorkshop = async (req, res) => {
    try {
        const workshop = await workshopService.getWorkshopById(req.params.id);
        if (workshop && workshop.image) {
            fs.unlinkSync(path.resolve(workshop.image)); // Delete the associated image
        }

        await workshopService.deleteWorkshop(req.params.id);
        res.json({ message: 'Workshop deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Enroll in a workshop
exports.enrollWorkshop = async (req, res) => {
    try {
        const enrollment = await workshopService.enrollInWorkshop(req.params.id, req.user.id);
        res.json({ message: 'Successfully enrolled', enrollment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



