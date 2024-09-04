const express = require('express'); // Import the Express framework
const router = express.Router(); // Create a new router instance for handling routes
const workshopController = require('../controllers/workshopController'); // Import the workshop controller functions

// Route to create a new workshop
router.post('/', workshopController.createWorkshop);
// This route handles POST requests to '/'
// It invokes the 'createWorkshop' method from the 'workshopController'
// The controller will handle the logic for creating a new workshop

// Route to get all workshops
router.get('/', workshopController.getAllWorkshops);
// This route handles GET requests to '/'
// It invokes the 'getAllWorkshops' method from the 'workshopController'
// The controller will handle the logic for retrieving all workshops

// Route to get a specific workshop by ID
router.get('/:id', workshopController.getWorkshopById);
// This route handles GET requests to '/:id'
// It extracts the workshop ID from the URL parameters
// It invokes the 'getWorkshopById' method from the 'workshopController'
// The controller will handle the logic for retrieving a workshop by its ID

// Route to update a specific workshop by ID
router.put('/:id', workshopController.updateWorkshop);
// This route handles PUT requests to '/:id'
// It extracts the workshop ID from the URL parameters
// It invokes the 'updateWorkshop' method from the 'workshopController'
// The controller will handle the logic for updating a workshop by its ID

// Route to delete a specific workshop by ID
router.delete('/:id', workshopController.deleteWorkshop);
// This route handles DELETE requests to '/:id'
// It extracts the workshop ID from the URL parameters
// It invokes the 'deleteWorkshop' method from the 'workshopController'
// The controller will handle the logic for deleting a workshop by its ID

// Export the router to be used in other parts of the application
module.exports = router;
