const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const orderController = require('../controllers/orderController');

// Validation middlewares
const validateCreateOrder = [
    check('amount').isNumeric().withMessage('Amount must be a number'),
    check('products').isArray({ min: 1 }).withMessage('Products must be an array with at least one item'),
];

const validatePaymentVerification = [
    check('razorpay_order_id').notEmpty().withMessage('Razorpay Order ID is required'),
    check('razorpay_payment_id').notEmpty().withMessage('Razorpay Payment ID is required'),
    check('razorpay_signature').notEmpty().withMessage('Razorpay Signature is required'),
];

router.post('/create-order', validateCreateOrder, orderController.createRazorpayOrder);
router.post('/verify-payment', validatePaymentVerification, orderController.verifyRazorpayPayment);

module.exports = router;
