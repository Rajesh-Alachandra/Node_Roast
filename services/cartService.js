const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order'); // Make sure to import the Order model

// Add product to cart
exports.addToCart = async (userId, productId, quantity) => {
    try {
        let cart = await Cart.findOne({ user: userId });

        // Create a new cart if not found
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        // Check if product already exists in cart
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex > -1) {
            // Update quantity if product already exists
            cart.products[productIndex].quantity += quantity;
        } else {
            // Add new product to cart
            cart.products.push({ product: productId, quantity });
        }

        return await cart.save();
    } catch (error) {
        throw new Error(`Error adding product to cart: ${error.message}`);
    }
};

// Remove product from cart
exports.removeFromCart = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) throw new Error('Cart not found');

        cart.products = cart.products.filter(p => p.product.toString() !== productId);

        return await cart.save();
    } catch (error) {
        throw new Error(`Error removing product from cart: ${error.message}`);
    }
};

// Get all cart products
exports.getCartProducts = async (userId) => {
    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        if (!cart) throw new Error('Cart not found');

        return cart;
    } catch (error) {
        throw new Error(`Error getting cart products: ${error.message}`);
    }
};

// Checkout - Create an order after successful payment
exports.createOrder = async (userId, totalAmount, paymentId) => {
    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        if (!cart) throw new Error('Cart not found');

        // Ensure that products are properly populated
        const orderProducts = cart.products.map(p => ({
            product: p.product,
            quantity: p.quantity,
            // If you need more details about the product
            // you can also fetch them from the Product model here
        }));

        const order = new Order({
            user: userId,
            products: orderProducts,
            totalAmount,
            paymentId,
            status: 'completed',
        });

        await order.save();
        await cart.remove(); // Clear the cart after successful checkout

        return order;
    } catch (error) {
        throw new Error(`Error creating order: ${error.message}`);
    }
};
