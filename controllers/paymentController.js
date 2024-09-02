// Importing the paymentService and workshopService modules
// paymentService handles payment-related operations, and workshopService handles workshop-related operations
const paymentService = require('../services/paymentService');
const workshopService = require('../services/workshopService');

// Controller function to create a Razorpay order
exports.createOrder = async (req, res) => {
    try {
        // Extracting amount and currency from the request body
        const { amount, currency } = req.body;

        // Calling the paymentService to create an order with the provided amount and currency
        const order = await paymentService.createOrder(amount, currency);

        // Responding with the created order as a JSON object
        res.json(order);
    } catch (error) {
        // Handling errors that occur during order creation
        // Responding with a 500 status code and the error message
        res.status(500).json({ error: error.message });
    }
};

// Controller function to verify payment and enroll the user in a workshop
exports.verifyPaymentAndEnroll = async (req, res) => {
    try {
        // Extracting Razorpay order ID, payment ID, and signature from the request body
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        // Calling the paymentService to verify the payment using the provided IDs and signature
        const isVerified = await paymentService.verifyPayment(razorpaySignature, razorpayOrderId, razorpayPaymentId);

        if (isVerified) {
            // If payment verification is successful, enroll the user in the workshop
            // `req.params.id` contains the workshop ID, and `req.user.id` contains the user ID
            const enrollment = await workshopService.enrollInWorkshop(req.params.id, req.user.id);

            // Responding with a success message and the enrollment details
            res.json({ message: 'Payment successful and enrolled in workshop', enrollment });
        } else {
            // If payment verification fails, respond with a 400 status code and an error message
            res.status(400).json({ error: 'Payment verification failed' });
        }
    } catch (error) {
        // Handling errors that occur during payment verification or enrollment
        // Responding with a 500 status code and the error message
        res.status(500).json({ error: error.message });
    }
};
