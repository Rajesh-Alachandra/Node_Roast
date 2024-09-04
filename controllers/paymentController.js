// Importing the paymentService and workshopService modules
const paymentService = require('../services/paymentService');
const workshopService = require('../services/workshopService');

// Controller function to create a Razorpay order
exports.createOrder = async (req, res) => {
    try {
        // Extracting amount and currency from the request body
        const { amount, currency } = req.body;

        // Validate input data
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        if (!currency) {
            return res.status(400).json({ error: 'Currency is required' });
        }

        // Calling the paymentService to create an order with the provided amount and currency
        const order = await paymentService.createOrder(amount, currency);

        // Responding with the created order as a JSON object
        res.json(order);
    } catch (error) {
        // Handling errors that occur during order creation
        res.status(500).json({ error: `Error creating order: ${error.message}` });
    }
};

// Controller function to verify payment and enroll the user in a workshop
exports.verifyPaymentAndEnroll = async (req, res) => {
    try {
        // Extracting Razorpay order ID, payment ID, and signature from the request body
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        // Validate input data
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(422).json({ error: 'Missing required payment details' });
        }

        // Calling the paymentService to verify the payment using the provided IDs and signature
        const isVerified = await paymentService.verifyPayment(razorpaySignature, razorpayOrderId, razorpayPaymentId);

        if (isVerified) {
            // Enroll the user in the workshop
            const enrollment = await workshopService.enrollInWorkshop(req.params.id, req.user.id);

            // Responding with a success message and the enrollment details
            res.json({ message: 'Payment successful and enrolled in workshop', enrollment });
        } else {
            // Respond if payment verification fails
            res.status(401).json({ error: 'Payment verification failed' });
        }
    } catch (error) {
        // Handling errors that occur during payment verification or enrollment
        res.status(500).json({ error: `Error during payment verification: ${error.message}` });
    }
};
