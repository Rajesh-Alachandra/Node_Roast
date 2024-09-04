const Order = require('../models/Order');
const razorpayService = require('../services/razorpayService');

// Create a Razorpay order for product purchases
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount, products } = req.body; // Expecting products as an array of objects
        const { order } = await razorpayService.createOrder(amount, 'INR', 'product');

        // Store the order temporarily if needed
        // e.g., save to database or session

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Verify Razorpay payment and save the order
exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const isValid = razorpayService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Extract necessary data from the request
        const { user, products, totalAmount } = req.body; // Example data from request body

        // Save the order to the database
        const order = new Order({
            user,
            products,
            totalAmount,
            paymentId: razorpay_payment_id,
            status: 'completed',
        });

        await order.save();

        res.status(200).json({ message: 'Payment verified and order saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
