const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/workshopEnrollmentController');

router.post('/create-enrollment', enrollmentController.createRazorpayOrder);
router.post('/verify-enrollment-payment', enrollmentController.verifyRazorpayPayment);

module.exports = router;
