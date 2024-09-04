// routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('./cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Add to Cart
router.post('/add', authMiddleware, cartController.addToCart);

// Remove from Cart
router.post('/remove', authMiddleware, cartController.removeFromCart);

// Get Cart Details
router.get('/', authMiddleware, cartController.getCartDetails);

// Proceed to Checkout
router.post('/checkout', authMiddleware, cartController.checkout);

// Verify payment and complete the checkout process
router.post('/verify-payment', authMiddleware, cartController.verifyPayment);


module.exports = router;
