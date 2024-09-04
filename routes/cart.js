const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController'); // Ensure this path is correct

// Define routes with valid callback functions
router.post('/add', cartController.addToCart);
router.post('/remove', cartController.removeFromCart);
router.get('/', cartController.getCartProducts);

module.exports = router;

