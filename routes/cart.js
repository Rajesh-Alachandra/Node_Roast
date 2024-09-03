// routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware') // Assuming you have an authentication middleware

// Add to Cart
router.post('/add', authMiddleware, cartController.addToCart);

// Remove from Cart
router.post('/remove', authMiddleware, cartController.removeFromCart);

// Get Cart Details
router.get('/', authMiddleware, cartController.getCartDetails);

module.exports = router;
