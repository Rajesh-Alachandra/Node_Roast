const Order = require('../models/Order');
const razorpayService = require('../services/razorpayService');
const { validationResult } = require('express-validator'); // For input validation

// Create a Razorpay order for product purchases
exports.createRazorpayOrder = async (req, res) => {
    try {
        // Validate request data using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors if any
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract amount and products from the request body
        const { amount, products } = req.body;

        // Validate request data
        if (!amount || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        // Call razorpayService to create a Razorpay order
        const { order } = await razorpayService.createOrder(amount, 'INR', 'product');

        // Optional: Store the order temporarily if needed
        // For example, save it to the database or session

        // Respond with the created order details
        res.status(201).json(order);
    } catch (error) {
        // Log the error for debugging
        console.error('Error creating Razorpay order:', error);
        // Send a 500 Internal Server Error response with the error message
        res.status(500).json({ error: error.message });
    }
};

// Verify Razorpay payment and save the order
exports.verifyRazorpayPayment = async (req, res) => {
    try {
        // Validate request data using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors if any
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract payment details from the request body
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        // Verify the payment using razorpayService
        const isValid = razorpayService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            // Respond with an error if payment verification fails
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Extract additional data from the request body
        const { user, products, totalAmount } = req.body;

        // Ensure products are properly populated
        const populatedProducts = products.map(p => ({
            product: p.product,
            quantity: p.quantity,
        }));

        // Create a new Order instance with the verified payment details
        const order = new Order({
            user,
            products: populatedProducts,
            totalAmount,
            paymentId: razorpay_payment_id,
            status: 'completed',
        });

        // Save the order to the database
        await order.save();

        // Respond with a success message and the saved order details
        res.status(200).json({ message: 'Payment verified and order saved successfully', order });
    } catch (error) {
        // Log the error for debugging
        console.error('Error verifying Razorpay payment:', error);
        // Send a 500 Internal Server Error response with the error message
        res.status(500).json({ error: error.message });
    }
};
