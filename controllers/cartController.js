const cartService = require('../services/cartService');

// Add product to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await cartService.addToCart(req.user.id, productId, quantity);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await cartService.removeFromCart(req.user.id, productId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get cart details
exports.getCartDetails = async (req, res) => {
    try {
        const cart = await cartService.getCartDetails(req.user.id);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
