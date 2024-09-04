// Updated Cart Service Functions
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Razorpay = require('razorpay');

// Add item to cart
exports.addToCart = async (userId, productId, quantity = 1) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({ product: productId, quantity });
    }

    // Recalculate the total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
        const itemProduct = item.product.equals(productId) ? product : item.product;
        return total + item.quantity * itemProduct.price;
    }, 0);

    await cart.save();
    return cart;
};

// Remove item from cart
exports.removeFromCart = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) throw new Error('Cart not found');

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    cart.totalAmount = cart.items.reduce((total, item) => {
        return total + item.quantity * item.product.price;
    }, 0);

    await cart.save();
    return cart;
};

// Get cart details
exports.getCartDetails = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) throw new Error('Cart not found');
    return cart;
};

// Create Razorpay order for checkout
exports.createCheckoutOrder = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

    const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const orderOptions = {
        amount: cart.totalAmount * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(orderOptions);
    return { order, cart };
};



// Verify the payment signature received from Razorpay
exports.verifyPayment = async (razorpaySignature, razorpayOrderId, razorpayPaymentId) => {
    const crypto = require('crypto');

    // Create HMAC to verify the signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    const generatedSignature = hmac.digest('hex');

    // Return verification status
    return generatedSignature === razorpaySignature;
};

