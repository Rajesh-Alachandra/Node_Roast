const Enrollment = require('../models/Enrollment');
const Workshop = require('../models/Workshop');
const mongoose = require('mongoose');

// Enroll in a workshop
exports.enrollInWorkshop = async (userId, workshopId, paymentId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the workshop
        const workshop = await Workshop.findById(workshopId).session(session);
        if (!workshop) {
            throw new Error('Workshop not found');
        }
        if (workshop.slots <= 0) {
            throw new Error('No slots available');
        }

        // Check if the user is already enrolled
        const existingEnrollment = await Enrollment.findOne({ user: userId, workshop: workshopId }).session(session);
        if (existingEnrollment) {
            throw new Error('User already enrolled in this workshop');
        }

        // Create and save the enrollment
        const enrollment = new Enrollment({
            user: userId,
            workshop: workshopId,
            paymentId,
            status: 'completed',
        });

        await enrollment.save({ session });

        // Reduce available slots in the workshop
        workshop.slots -= 1;
        await workshop.save({ session });

        await session.commitTransaction();
        session.endSession();

        return enrollment;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error enrolling in workshop:', error.message);
        throw new Error(`Failed to enroll in workshop: ${error.message}`);
    }
};
