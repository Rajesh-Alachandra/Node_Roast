const Enrollment = require('../models/Enrollment');
const razorpayService = require('../services/razorpayService');
const Workshop = require('../models/workshop');

// Create a Razorpay order for workshop enrollments
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount, workshopId } = req.body;
        const { order } = await razorpayService.createOrder(amount, 'INR', 'workshop');

        // Store the order temporarily if needed
        // e.g., save to database or session

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify Razorpay payment and save the enrollment
exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const isValid = razorpayService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Extract necessary data from the request
        const { user, workshopId } = req.body;

        // Check if the workshop exists
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) {
            return res.status(404).json({ error: 'Workshop not found' });
        }

        // Create and save the enrollment
        const enrollment = new Enrollment({
            user,
            workshop: workshopId,
            paymentId: razorpay_payment_id,
        });

        await enrollment.save();

        // Reduce available slots
        workshop.slots -= 1;
        await workshop.save();

        res.status(200).json({ message: 'Payment verified and enrollment saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
