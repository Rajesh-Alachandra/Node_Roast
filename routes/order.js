const express = require('express'); // Import the Express framework
const router = express.Router(); // Create a new router instance for handling routes
const { check } = require('express-validator'); // Import the 'check' function from 'express-validator' for validation
const orderController = require('../controllers/orderController'); // Import the order controller functions

// Validation middlewares

// Middleware for validating the create order request
const validateCreateOrder = [
    // Validate that 'amount' is a numeric value
    check('amount')
        .isNumeric()
        .withMessage('Amount must be a number'),
    // Validate that 'products' is an array with at least one item
    check('products')
        .isArray({ min: 1 })
        .withMessage('Products must be an array with at least one item'),
];

// Middleware for validating the payment verification request
const validatePaymentVerification = [
    // Validate that 'razorpay_order_id' is provided
    check('razorpay_order_id')
        .notEmpty()
        .withMessage('Razorpay Order ID is required'),
    // Validate that 'razorpay_payment_id' is provided
    check('razorpay_payment_id')
        .notEmpty()
        .withMessage('Razorpay Payment ID is required'),
    // Validate that 'razorpay_signature' is provided
    check('razorpay_signature')
        .notEmpty()
        .withMessage('Razorpay Signature is required'),
];

// Route to create a Razorpay order
router.post('/create-order', validateCreateOrder, orderController.createRazorpayOrder);
// This route handles POST requests to '/create-order'
// It uses the 'validateCreateOrder' middleware for validation
// It then invokes the 'createRazorpayOrder' method from the 'orderController'

// Route to verify Razorpay payment
router.post('/verify-payment', validatePaymentVerification, orderController.verifyRazorpayPayment);
// This route handles POST requests to '/verify-payment'
// It uses the 'validatePaymentVerification' middleware for validation
// It then invokes the 'verifyRazorpayPayment' method from the 'orderController'

// Export the router to be used in other parts of the application
module.exports = router;
