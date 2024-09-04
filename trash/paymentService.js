// Importing the Razorpay library
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Creating a Razorpay instance with the provided key ID and key secret
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Function to create a Razorpay order
exports.createOrder = async (amount, currency = 'INR') => {
    const options = {
        amount: amount * 100, // Amount in paise
        currency,
        receipt: `receipt_order_${Date.now()}`,
        payment_capture: 1
    };

    try {
        // Creating the order using Razorpay's API
        const order = await razorpayInstance.orders.create(options);
        return order;
    } catch (error) {
        // Handling any errors that occur during order creation
        throw new Error('Error creating Razorpay order: ' + error.message);
    }
};

// Function to verify the payment signature received from Razorpay
exports.verifyPayment = async (razorpaySignature, razorpayOrderId, razorpayPaymentId) => {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);

    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);

    const generatedSignature = hmac.digest('hex');

    // Comparing the generated signature with the signature received from Razorpay
    return generatedSignature === razorpaySignature;
};
