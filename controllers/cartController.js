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



// Proceed to checkout
exports.checkout = async (req, res) => {
    try {
        const { order, cart } = await cartService.createCheckoutOrder(req.user.id);
        res.status(200).json({
            message: 'Order created successfully',
            order,
            cart,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Verifying payment success and handling post-payment actions
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        // Validate input fields
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(422).json({ error: 'Missing payment details' });
        }

        // Verify payment signature using paymentService
        const isVerified = await paymentService.verifyPayment(
            razorpaySignature,
            razorpayOrderId,
            razorpayPaymentId
        );

        if (!isVerified) {
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Payment is verified, update cart/order status
        const cart = await cartService.getCartDetails(req.user.id);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Mark cart or order as completed (you can add more logic as needed)
        // For example, you could create an order record or update product stock
        cart.paymentStatus = 'completed'; // Assuming you have a field for payment status
        await cart.save();

        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Payment verified and cart updated successfully.',
            cart,
        });
    } catch (error) {
        res.status(500).json({ error: `Error verifying payment: ${error.message}` });
    }
};

