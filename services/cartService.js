const Cart = require('../models/Cart'); // Import the Cart model
const Product = require('../models/Product'); // Import the Product model
const Order = require('../models/Order'); // Import the Order model

// Add product to cart
exports.addToCart = async (userId, productId, quantity) => {
    try {
        // Find the cart for the given user
        let cart = await Cart.findOne({ user: userId });

        // Create a new cart if one does not exist
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        // Check if the product already exists in the cart
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex > -1) {
            // Update the quantity if the product already exists
            cart.products[productIndex].quantity += quantity;
        } else {
            // Add the new product to the cart
            cart.products.push({ product: productId, quantity });
        }

        // Save the cart and return it
        return await cart.save();
    } catch (error) {
        // Handle and throw any errors encountered
        throw new Error(`Error adding product to cart: ${error.message}`);
    }
};

// Remove product from cart
exports.removeFromCart = async (userId, productId) => {
    try {
        // Find the cart for the given user
        const cart = await Cart.findOne({ user: userId });
        if (!cart) throw new Error('Cart not found');

        // Filter out the product to remove it
        cart.products = cart.products.filter(p => p.product.toString() !== productId);

        // Save the updated cart and return it
        return await cart.save();
    } catch (error) {
        // Handle and throw any errors encountered
        throw new Error(`Error removing product from cart: ${error.message}`);
    }
};

// Get all cart products
exports.getCartProducts = async (userId) => {
    try {
        // Find the cart for the given user and populate product details
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        if (!cart) throw new Error('Cart not found');

        // Return the populated cart
        return cart;
    } catch (error) {
        // Handle and throw any errors encountered
        throw new Error(`Error getting cart products: ${error.message}`);
    }
};

// Checkout - Create an order after successful payment
exports.createOrder = async (userId, totalAmount, paymentId) => {
    try {
        // Find the cart for the given user and populate product details
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        if (!cart) throw new Error('Cart not found');

        // Prepare the order products from the cart
        const orderProducts = cart.products.map(p => ({
            product: p.product,
            quantity: p.quantity,
        }));

        // Create a new order
        const order = new Order({
            user: userId,
            products: orderProducts,
            totalAmount,
            paymentId,
            status: 'completed',
        });

        // Save the order and clear the cart
        await order.save();
        await cart.remove(); // Clear the cart after successful checkout

        // Return the created order
        return order;
    } catch (error) {
        // Handle and throw any errors encountered
        throw new Error(`Error creating order: ${error.message}`);
    }
};
