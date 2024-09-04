const cartService = require('../services/cartService');

// Add product to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id; // Assuming user ID is available in the request
        const cart = await cartService.addToCart(userId, productId, quantity);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        const cart = await cartService.removeFromCart(userId, productId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all cart products
exports.getCartProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await cartService.getCartProducts(userId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Checkout and create order
exports.checkout = async (req, res) => {
    try {
        const { totalAmount, paymentId } = req.body;
        const userId = req.user.id;
        const order = await cartService.createOrder(userId, totalAmount, paymentId);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
