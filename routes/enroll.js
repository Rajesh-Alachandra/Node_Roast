const express = require('express'); // Import Express framework
const router = express.Router(); // Create a new router instance for handling routes
const enrollmentController = require('../controllers/workshopEnrollmentController'); // Import the controller functions

// Route to create a Razorpay order for workshop enrollment
router.post('/create-enrollment', enrollmentController.createRazorpayOrder);
// This route handles POST requests to /create-enrollment
// It invokes the createRazorpayOrder method from the enrollmentController
// This method creates an order with Razorpay for enrolling in a workshop

// Route to verify Razorpay payment and save the enrollment
router.post('/verify-enrollment-payment', enrollmentController.verifyRazorpayPayment);
// This route handles POST requests to /verify-enrollment-payment
// It invokes the verifyRazorpayPayment method from the enrollmentController
// This method verifies the payment with Razorpay and saves the enrollment details

// Export the router to be used in other parts of the application
module.exports = router;
