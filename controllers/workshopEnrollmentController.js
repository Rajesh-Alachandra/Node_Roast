const Enrollment = require('../models/Enrollment');
const Workshop = require('../models/workshop');
const razorpayService = require('../services/razorpayService');
const mongoose = require('mongoose');

// Create a Razorpay order for workshop enrollments
exports.createRazorpayOrder = async (req, res) => {
    try {
        // Extract amount and workshopId from request body
        const { amount, workshopId } = req.body;

        // Validate the amount provided
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount provided' });
        }

        // Check if the workshop exists and if there are available slots
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) {
            return res.status(404).json({ error: 'Workshop not found' });
        }
        if (workshop.slots <= 0) {
            return res.status(400).json({ error: 'No slots available' });
        }

        // Create an order using Razorpay service
        const { order } = await razorpayService.createOrder(amount, 'INR', 'workshop');

        // Optionally store the order info in session or database for future reference

        // Send a successful response with the Razorpay order details
        res.status(201).json(order);
    } catch (error) {
        // Log and handle errors
        console.error('Error creating Razorpay order:', error.message);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Verify Razorpay payment and save the enrollment
exports.verifyRazorpayPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extract payment details and user info from request body
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user, workshopId } = req.body;

        // Verify the payment using Razorpay service
        const isValid = razorpayService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isValid) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Validate if the workshop exists
        const workshop = await Workshop.findById(workshopId).session(session);
        if (!workshop) {
            await session.abortTransaction();
            return res.status(404).json({ error: 'Workshop not found' });
        }

        // Check if there are available slots
        if (workshop.slots <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'No slots available' });
        }

        // Ensure the user is not already enrolled
        const existingEnrollment = await Enrollment.findOne({ user, workshop: workshopId }).session(session);
        if (existingEnrollment) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'User already enrolled in this workshop' });
        }

        // Create a new enrollment record
        const enrollment = new Enrollment({
            user,
            workshop: workshopId,
            paymentId: razorpay_payment_id,
            status: 'completed',
        });

        await enrollment.save({ session });

        // Reduce the available slots in the workshop
        workshop.slots -= 1;
        await workshop.save({ session });

        // Commit the transaction if everything is successful
        await session.commitTransaction();
        session.endSession();

        // Send a successful response with a message
        res.status(200).json({ message: 'Payment verified and enrollment saved successfully' });
    } catch (error) {
        // Abort the transaction and end the session if an error occurs
        await session.abortTransaction();
        session.endSession();

        // Log and handle errors
        console.error('Error verifying payment and saving enrollment:', error.message);
        res.status(500).json({ error: 'Failed to process enrollment' });
    }
};
