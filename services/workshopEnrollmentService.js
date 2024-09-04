const Enrollment = require('../models/Enrollment'); // Import the Enrollment model
const Workshop = require('../models/workshop'); // Import the Workshop model
const mongoose = require('mongoose'); // Import mongoose for transactions

// Enroll in a workshop
exports.enrollInWorkshop = async (userId, workshopId, paymentId) => {
    const session = await mongoose.startSession(); // Start a new session for transaction
    session.startTransaction(); // Begin the transaction

    try {
        // Find the workshop for the given ID within the transaction session
        const workshop = await Workshop.findById(workshopId).session(session);
        if (!workshop) {
            throw new Error('Workshop not found'); // Handle case where workshop does not exist
        }
        if (workshop.slots <= 0) {
            throw new Error('No slots available'); // Handle case where no slots are available
        }

        // Check if the user is already enrolled in the workshop
        const existingEnrollment = await Enrollment.findOne({ user: userId, workshop: workshopId }).session(session);
        if (existingEnrollment) {
            throw new Error('User already enrolled in this workshop'); // Handle case where user is already enrolled
        }

        // Create a new enrollment record
        const enrollment = new Enrollment({
            user: userId,
            workshop: workshopId,
            paymentId,
            status: 'completed', // Set the enrollment status to completed
        });

        // Save the enrollment record in the database
        await enrollment.save({ session });

        // Reduce the available slots in the workshop
        workshop.slots -= 1;
        await workshop.save({ session });

        // Commit the transaction if all operations succeed
        await session.commitTransaction();
        session.endSession(); // End the session

        return enrollment; // Return the created enrollment record
    } catch (error) {
        // Abort the transaction if any error occurs
        await session.abortTransaction();
        session.endSession(); // End the session

        console.error('Error enrolling in workshop:', error.message); // Log the error
        throw new Error(`Failed to enroll in workshop: ${error.message}`); // Throw an error with a descriptive message
    }
};
