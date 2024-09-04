const express = require('express');
const router = express.Router();
const paymentController = require('./paymentController');

router.post('/create-order', paymentController.createOrder);
router.post('/verify-payment/:id', paymentController.verifyPaymentAndEnroll);

module.exports = router;
