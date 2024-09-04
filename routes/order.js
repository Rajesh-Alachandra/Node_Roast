const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/create-order', orderController.createRazorpayOrder);
router.post('/verify-payment', orderController.verifyRazorpayPayment);

module.exports = router;
