const Enrollment = require('../models/Enrollment');
const Workshop = require('../models/workshop');

// Enroll in a workshop
exports.enrollInWorkshop = async (userId, workshopId, paymentId) => {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop || workshop.slots <= 0) {
        throw new Error('No slots available');
    }

    // Check if the user is already enrolled
    const existingEnrollment = await Enrollment.findOne({ user: userId, workshop: workshopId });
    if (existingEnrollment) {
        throw new Error('User already enrolled in this workshop');
    }

    const enrollment = new Enrollment({
        user: userId,
        workshop: workshopId,
        paymentId,
        status: 'completed',
    });

    await enrollment.save();

    // Reduce available slots in the workshop
    workshop.slots -= 1;
    await workshop.save();

    return enrollment;
};
