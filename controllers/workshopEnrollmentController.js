const Enrollment = require('../models/Enrollment');
const Workshop = require('../models/Workshop');
const razorpayService = require('../services/razorpayService');
const mongoose = require('mongoose');

// Create a Razorpay order for workshop enrollments
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount, workshopId } = req.body;

        // Validate amount
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount provided' });
        }

        // Check if the workshop exists and has available slots
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) {
            return res.status(404).json({ error: 'Workshop not found' });
        }
        if (workshop.slots <= 0) {
            return res.status(400).json({ error: 'No slots available' });
        }

        const { order } = await razorpayService.createOrder(amount, 'INR', 'workshop');

        // Optionally store the order info in the session or database

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error.message);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Verify Razorpay payment and save the enrollment
exports.verifyRazorpayPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user, workshopId } = req.body;

        const isValid = razorpayService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Validate workshop
        const workshop = await Workshop.findById(workshopId).session(session);
        if (!workshop) {
            await session.abortTransaction();
            return res.status(404).json({ error: 'Workshop not found' });
        }

        if (workshop.slots <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'No slots available' });
        }

        // Ensure user is not already enrolled
        const existingEnrollment = await Enrollment.findOne({ user, workshop: workshopId }).session(session);
        if (existingEnrollment) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'User already enrolled in this workshop' });
        }

        // Create and save the enrollment
        const enrollment = new Enrollment({
            user,
            workshop: workshopId,
            paymentId: razorpay_payment_id,
            status: 'completed',
        });

        await enrollment.save({ session });

        // Reduce available slots in the workshop
        workshop.slots -= 1;
        await workshop.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Payment verified and enrollment saved successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error verifying payment and saving enrollment:', error.message);
        res.status(500).json({ error: 'Failed to process enrollment' });
    }
};
