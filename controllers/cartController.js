const cartService = require('../services/cartService');

// Add product to cart
exports.addToCart = async (req, res) => {
    try {
        // Extract product ID and quantity from the request body
        const { productId, quantity } = req.body;
        // Extract user ID from the authenticated user (assumed to be available in req.user)
        const userId = req.user.id;
        // Call the cartService to add the product to the user's cart
        const cart = await cartService.addToCart(userId, productId, quantity);
        // Send a successful response with the updated cart
        res.status(200).json(cart);
    } catch (error) {
        // Handle errors and send a 400 Bad Request response with the error message
        res.status(400).json({ error: error.message });
    }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
    try {
        // Extract product ID from the request parameters
        const { productId } = req.params;
        // Extract user ID from the authenticated user (assumed to be available in req.user)
        const userId = req.user.id;
        // Call the cartService to remove the product from the user's cart
        const cart = await cartService.removeFromCart(userId, productId);
        // Send a successful response with the updated cart
        res.status(200).json(cart);
    } catch (error) {
        // Handle errors and send a 400 Bad Request response with the error message
        res.status(400).json({ error: error.message });
    }
};

// Get all cart products
exports.getCartProducts = async (req, res) => {
    try {
        // Extract user ID from the authenticated user (assumed to be available in req.user)
        const userId = req.user.id;
        // Call the cartService to get all products in the user's cart
        const cart = await cartService.getCartProducts(userId);
        // Send a successful response with the list of products in the cart
        res.status(200).json(cart);
    } catch (error) {
        // Handle errors and send a 400 Bad Request response with the error message
        res.status(400).json({ error: error.message });
    }
};

// Checkout and create order
exports.checkout = async (req, res) => {
    try {
        // Extract total amount and payment ID from the request body
        const { totalAmount, paymentId } = req.body;
        // Extract user ID from the authenticated user (assumed to be available in req.user)
        const userId = req.user.id;
        // Call the cartService to create an order based on the cart's content
        const order = await cartService.createOrder(userId, totalAmount, paymentId);
        // Send a successful response with the created order
        res.status(201).json(order);
    } catch (error) {
        // Handle errors and send a 400 Bad Request response with the error message
        res.status(400).json({ error: error.message });
    }
};
