const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const razorpayController = require('../controllers/orderController');

// Product Ordering Routes
router.post('/create-order', orderController.createProductOrder); // Create a new product order
router.delete('/remove-from-cart/:productId', orderController.removeProductFromCart); // Remove a product from cart
router.get('/cart', orderController.getCartProducts); // Get all products in the cart
router.post('/checkout', razorpayController.createRazorpayOrder); // Create Razorpay order for checkout
router.post('/verify-payment', razorpayController.verifyRazorpayPayment); // Verify payment from Razorpay

module.exports = router;
