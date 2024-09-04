const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
exports.createOrder = async (amount, currency = 'INR', context) => {
    const options = {
        amount: amount * 100, // Amount in paise
        currency: currency,
        receipt: `${context}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return { order };
};

// Verify payment signature
exports.verifyPayment = (order_id, payment_id, signature) => {
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${order_id}|${payment_id}`)
        .digest('hex');

    return generated_signature === signature;
};
