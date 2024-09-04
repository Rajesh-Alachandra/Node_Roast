const cartService = require('./cartService');

// Add product to cart
// Adds a product to the user's cart by productId and specified quantity.
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body; // Extracts product ID and quantity from the request body.
        const cart = await cartService.addToCart(req.user.id, productId, quantity); // Calls the service to add the product to the user's cart.
        res.status(200).json(cart); // Responds with the updated cart details.
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handles errors and sends a 400 status with the error message.
    }
};

// Remove product from cart
// Removes a product from the user's cart by productId.
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body; // Extracts product ID from the request body.
        const cart = await cartService.removeFromCart(req.user.id, productId); // Calls the service to remove the product from the cart.
        res.status(200).json(cart); // Responds with the updated cart details.
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handles errors and sends a 400 status with the error message.
    }
};

// Get cart details
// Retrieves the current cart details for the logged-in user.
exports.getCartDetails = async (req, res) => {
    try {
        const cart = await cartService.getCartDetails(req.user.id); // Calls the service to get the user's cart details.
        res.status(200).json(cart); // Responds with the current cart details.
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handles errors and sends a 400 status with the error message.
    }
};

// Proceed to checkout
// Creates an order from the user's cart, preparing it for checkout.
exports.checkout = async (req, res) => {
    try {
        const { order, cart } = await cartService.createCheckoutOrder(req.user.id); // Calls the service to create a checkout order from the cart.
        res.status(200).json({
            message: 'Order created successfully',
            order, // Order details.
            cart, // Updated cart details.
        });
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handles errors and sends a 400 status with the error message.
    }
};

// Verifying payment success and handling post-payment actions
// Verifies the payment details from the client and updates the cart or order status accordingly.
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body; // Extracts payment details from the request body.

        // Validate input fields to ensure all required payment information is present.
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(422).json({ error: 'Missing payment details' });
        }

        // Verify payment signature using paymentService to ensure authenticity.
        const isVerified = await paymentService.verifyPayment(
            razorpaySignature,
            razorpayOrderId,
            razorpayPaymentId
        );

        // If the verification fails, return an error response.
        if (!isVerified) {
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Payment is verified, retrieve the cart details.
        const cart = await cartService.getCartDetails(req.user.id);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Update the cart or order status as completed (this can be customized further).
        cart.paymentStatus = 'completed'; // Example: updating the payment status field in the cart.
        await cart.save(); // Save the updated cart status.

        // Respond with success message and updated cart details.
        res.status(200).json({
            success: true,
            message: 'Payment verified and cart updated successfully.',
            cart,
        });
    } catch (error) {
        res.status(500).json({ error: `Error verifying payment: ${error.message}` }); // Handles errors and sends a 500 status with the error message.
    }
};
