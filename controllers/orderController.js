const Order = require('../models/Order');
const razorpayService = require('../services/razorpayService');
const { validationResult } = require('express-validator'); // For input validation

// Create a Razorpay order for product purchases
exports.createRazorpayOrder = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { amount, products } = req.body;

        // Validate request data
        if (!amount || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        const { order } = await razorpayService.createOrder(amount, 'INR', 'product');

        // Optional: Store the order temporarily if needed
        // e.g., save to database or session

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error); // Log the error
        res.status(500).json({ error: error.message });
    }
};

// Verify Razorpay payment and save the order
exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const isValid = razorpayService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Extract necessary data from the request
        const { user, products, totalAmount } = req.body;

        // Ensure that products are properly populated
        const populatedProducts = products.map(p => ({
            product: p.product,
            quantity: p.quantity,
        }));

        // Save the order to the database
        const order = new Order({
            user,
            products: populatedProducts,
            totalAmount,
            paymentId: razorpay_payment_id,
            status: 'completed',
        });

        await order.save();

        res.status(200).json({ message: 'Payment verified and order saved successfully', order });
    } catch (error) {
        console.error('Error verifying Razorpay payment:', error); // Log the error
        res.status(500).json({ error: error.message });
    }
};
