const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to cart
exports.addToCart = async (userId, productId, quantity = 1) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        // If no cart exists, create a new one
        cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex >= 0) {
        // If the product is already in the cart, update the quantity
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // If the product is not in the cart, add it as a new item
        cart.items.push({ product: productId, quantity });
    }

    // Recalculate the total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
        return total + item.quantity * product.price;
    }, 0);

    await cart.save(); // Save the updated cart

    return cart;
};

// Remove item from cart
exports.removeFromCart = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found');

    // Remove the item from the cart
    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    // Recalculate the total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
        return total + item.quantity * item.product.price;
    }, 0);

    await cart.save(); // Save the updated cart

    return cart;
};

// Get cart details
exports.getCartDetails = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) throw new Error('Cart not found');
    return cart;
};
