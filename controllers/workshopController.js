// controllers/workshopController.js
const workshopService = require('../services/workshopService');
const upload = require('../utils/upload'); // Middleware for handling file uploads

// Controller to create a new workshop
exports.createWorkshop = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { slots, title, price, description, date, duration, time, venue, terms, expectations } = req.body;
            const image = req.file ? req.file.path : null;

            if (!image) {
                return res.status(400).json({ error: 'Image upload failed' });
            }

            const workshop = await workshopService.createWorkshop({
                image,
                slots,
                title,
                price,
                description,
                date,
                duration,
                time,
                venue,
                terms: terms ? terms.split(',') : [],
                expectations: expectations ? expectations.split(',') : [],
            });

            res.status(201).json(workshop);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
];

// Controller to get all workshops
exports.getAllWorkshops = async (req, res) => {
    try {
        const workshops = await workshopService.getAllWorkshops();
        res.status(200).json(workshops);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to get a workshop by ID
exports.getWorkshopById = async (req, res) => {
    try {
        const workshop = await workshopService.getWorkshopById(req.params.id);
        if (!workshop) {
            return res.status(404).json({ error: 'Workshop not found' });
        }
        res.status(200).json(workshop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to update a workshop
exports.updateWorkshop = [
    upload.single('image'),
    async (req, res) => {
        try {
            const workshop = await workshopService.updateWorkshop(req.params.id, req.body, req.file);
            if (!workshop) {
                return res.status(404).json({ error: 'Workshop not found' });
            }
            res.status(200).json(workshop);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
];

// Controller to delete a workshop
exports.deleteWorkshop = async (req, res) => {
    try {
        const workshop = await workshopService.deleteWorkshop(req.params.id);
        if (!workshop) {
            return res.status(404).json({ error: 'Workshop not found' });
        }
        res.status(200).json({ message: 'Workshop deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
