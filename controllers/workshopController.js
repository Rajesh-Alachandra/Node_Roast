const workshopService = require('../services/workshopService');
const upload = require('../utils/upload'); // Middleware for handling file uploads

// Controller to create a new workshop
exports.createWorkshop = [
    // Middleware to handle single file upload with the field name 'image'
    upload.single('image'),
    async (req, res) => {
        try {
            // Extract workshop details from request body
            const { slots, title, price, description, date, duration, time, venue, terms, expectations } = req.body;
            // Extract the file path from the uploaded file (if available)
            const image = req.file ? req.file.path : null;

            // Ensure that an image has been uploaded
            if (!image) {
                return res.status(400).json({ error: 'Image upload failed' });
            }

            // Create a new workshop using the workshopService
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
                terms: terms ? terms.split(',') : [], // Convert comma-separated terms into an array
                expectations: expectations ? expectations.split(',') : [], // Convert comma-separated expectations into an array
            });

            // Send a successful response with the created workshop details
            res.status(201).json(workshop);
        } catch (error) {
            // Handle errors and send a 400 Bad Request response with the error message
            res.status(400).json({ error: error.message });
        }
    },
];

// Controller to get all workshops
exports.getAllWorkshops = async (req, res) => {
    try {
        // Fetch all workshops from the workshopService
        const workshops = await workshopService.getAllWorkshops();
        // Send a successful response with the list of workshops
        res.status(200).json(workshops);
    } catch (error) {
        // Handle errors and send a 400 Bad Request response with the error message
        res.status(400).json({ error: error.message });
    }
};

// Controller to get a workshop by ID
exports.getWorkshopById = async (req, res) => {
    try {
        // Fetch a specific workshop by ID from the workshopService
        const workshop = await workshopService.getWorkshopById(req.params.id);
        // Check if the workshop exists
        if (!workshop) {
            return res.status(404).json({ error: 'Workshop not found' });
        }
        // Send a successful response with the workshop details
        res.status(200).json(workshop);
    } catch (error) {
        // Handle errors and send a 400 Bad Request response with the error message
        res.status(400).json({ error: error.message });
    }
};

// Controller to update a workshop
exports.updateWorkshop = [
    // Middleware to handle single file upload with the field name 'image'
    upload.single('image'),
    async (req, res) => {
        try {
            // Update the workshop using the workshopService
            const workshop = await workshopService.updateWorkshop(req.params.id, req.body, req.file);
            // Check if the workshop exists
            if (!workshop) {
                return res.status(404).json({ error: 'Workshop not found' });
            }
            // Send a successful response with the updated workshop details
            res.status(200).json(workshop);
        } catch (error) {
            // Handle errors and send a 400 Bad Request response with the error message
            res.status(400).json({ error: error.message });
        }
    },
];

// Controller to delete a workshop
exports.deleteWorkshop = async (req, res) => {
    try {
        // Delete the workshop by ID using the workshopService
        const workshop = await workshopService.deleteWorkshop(req.params.id);
        // Check if the workshop exists
        if (!workshop) {
            return res.status(404).json({ error: 'Workshop not found' });
        }
        // Send a successful response indicating that the workshop was deleted
        res.status(200).json({ message: 'Workshop deleted successfully' });
    } catch (error) {
        // Handle errors and send a 400 Bad Request response with the error message
        res.status(400).json({ error: error.message });
    }
};
