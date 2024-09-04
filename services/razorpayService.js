const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('../utils/logger'); // Example logger, adjust based on your logger setup

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
exports.createOrder = async (amount, currency = 'INR', context) => {
    try {
        // Ensure the amount is a valid number
        if (typeof amount !== 'number' || amount <= 0) {
            throw new Error('Invalid amount provided');
        }

        // Set up the options for creating an order
        const options = {
            amount: amount * 100, // Amount in paise
            currency: currency,
            receipt: `${context}_${Date.now()}`, // Contextual receipt identifier
        };

        // Create the Razorpay order
        const order = await razorpay.orders.create(options);

        // Log order creation success
        logger.info(`Razorpay order created: ${order.id} for context: ${context}`);

        return { order };
    } catch (error) {
        // Log the error for debugging
        logger.error('Error creating Razorpay order:', error.message);

        // Re-throw the error to be handled by the calling function/controller
        throw new Error(`Razorpay order creation failed: ${error.message}`);
    }
};

// Verify payment signature
exports.verifyPayment = (order_id, payment_id, signature) => {
    try {
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${order_id}|${payment_id}`)
            .digest('hex');

        const isValid = generated_signature === signature;

        // Log the result of the verification
        if (isValid) {
            logger.info(`Payment verification successful for order: ${order_id}`);
        } else {
            logger.warn(`Payment verification failed for order: ${order_id}`);
        }

        return isValid;
    } catch (error) {
        // Log the error for debugging
        logger.error('Error verifying Razorpay payment:', error.message);
        return false; // Consider the payment invalid if an error occurs
    }
};
