// controllers/workshopController.js
const workshopService = require('../services/workshopService');

// Create a new workshop
exports.createWorkshop = async (req, res) => {
    try {
        const workshop = await workshopService.createWorkshop(req.body);
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
        const workshop = await workshopService.updateWorkshop(req.params.id, req.body);
        if (!workshop) return res.status(404).json({ error: 'Workshop not found' });
        res.json(workshop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a workshop
exports.deleteWorkshop = async (req, res) => {
    try {
        await workshopService.deleteWorkshop(req.params.id);
        res.json({ message: 'Workshop deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Enroll in a workshop
exports.enrollWorkshop = async (req, res) => {
    try {
        const workshop = await workshopService.enrollInWorkshop(req.params.id);
        res.json({ message: 'Successfully enrolled', workshop });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
