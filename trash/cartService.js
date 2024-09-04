const Cart = require('./Cartmodel');
const Product = require('../models/Product');
const Razorpay = require('razorpay');

// Add item to cart
// Adds a product to the user's cart or updates the quantity if the product already exists.
exports.addToCart = async (userId, productId, quantity = 1) => {
    const product = await Product.findById(productId); // Fetch the product details by ID.
    if (!product) throw new Error('Product not found'); // Throw an error if the product doesn't exist.

    let cart = await Cart.findOne({ user: userId }); // Find the cart associated with the user.

    // If no cart exists, create a new one for the user.
    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product already exists in the cart.
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    // If the product exists, update the quantity; otherwise, add the product to the cart.
    if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({ product: productId, quantity });
    }

    // Recalculate the total amount of the cart by summing up the price of all items.
    cart.totalAmount = cart.items.reduce((total, item) => {
        const itemProduct = item.product.equals(productId) ? product : item.product; // Get the product details if it's the added/updated one.
        return total + item.quantity * itemProduct.price; // Calculate total based on item quantity and price.
    }, 0);

    await cart.save(); // Save the updated cart.
    return cart; // Return the updated cart.
};

// Remove item from cart
// Removes a specified product from the user's cart and updates the total amount.
exports.removeFromCart = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product'); // Find the user's cart and populate product details.
    if (!cart) throw new Error('Cart not found'); // Throw an error if the cart doesn't exist.

    // Filter out the item that matches the productId from the cart.
    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    // Recalculate the total amount after removing the item.
    cart.totalAmount = cart.items.reduce((total, item) => {
        return total + item.quantity * item.product.price;
    }, 0);

    await cart.save(); // Save the updated cart.
    return cart; // Return the updated cart.
};

// Get cart details
// Retrieves the cart details for the specified user, including product information.
exports.getCartDetails = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product'); // Find the user's cart and populate product details.
    if (!cart) throw new Error('Cart not found'); // Throw an error if the cart doesn't exist.
    return cart; // Return the cart details.
};

// Create Razorpay order for checkout
// Creates a Razorpay order for the current cart to proceed with the payment process.
exports.createCheckoutOrder = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product'); // Find the user's cart and populate product details.
    if (!cart || cart.items.length === 0) throw new Error('Cart is empty'); // Throw an error if the cart is empty.

    // Initialize Razorpay instance with key credentials.
    const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create order options including the amount, currency, and receipt details.
    const orderOptions = {
        amount: cart.totalAmount * 100, // Convert the total amount to paise (smallest currency unit).
        currency: 'INR',
        receipt: `receipt_${Date.now()}`, // Unique receipt identifier.
        payment_capture: 1, // Automatically capture the payment.
    };

    const order = await razorpayInstance.orders.create(orderOptions); // Create a new order on Razorpay.
    return { order, cart }; // Return the created order and cart details.
};

// Verify the payment signature received from Razorpay
// Verifies that the payment details received match Razorpay's signature to ensure security.
exports.verifyPayment = async (razorpaySignature, razorpayOrderId, razorpayPaymentId) => {
    const crypto = require('crypto');

    // Create HMAC to verify the payment signature using the Razorpay secret key.
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId); // Concatenate order and payment IDs.
    const generatedSignature = hmac.digest('hex'); // Generate the signature hash.

    // Compare the generated signature with the signature received to confirm authenticity.
    return generatedSignature === razorpaySignature;
};
