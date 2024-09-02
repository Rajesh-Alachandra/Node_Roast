// Importing the Razorpay library
const Razorpay = require('razorpay');

// Creating a Razorpay instance with the provided key ID and key secret
// These credentials are typically stored in environment variables for security
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay key ID (ensure it's stored securely)
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay key secret (ensure it's stored securely)
});

// Function to create a Razorpay order
// This function takes an amount and an optional currency parameter (default is 'INR')
exports.createOrder = async (amount, currency = 'INR') => {
    // Options for creating an order, where amount is in paise (smallest currency unit)
    const options = {
        amount: amount * 100, // Convert the amount to paise (Razorpay expects the amount in the smallest unit)
        currency, // Currency type (default is INR)
        receipt: `receipt_order_${Date.now()}`, // Generating a unique receipt ID using the current timestamp
        payment_capture: 1 // Automatically capture the payment (1 means auto-capture)
    };

    try {
        // Creating the order using Razorpay's API
        const order = await razorpayInstance.orders.create(options);
        return order; // Returning the created order object
    } catch (error) {
        // Handling any errors that occur during order creation
        throw new Error('Error creating Razorpay order: ' + error.message);
    }
};

// Function to verify the payment signature received from Razorpay
// This function takes the Razorpay signature, order ID, and payment ID as parameters
exports.verifyPayment = async (razorpaySignature, razorpayOrderId, razorpayPaymentId) => {
    // Importing the crypto module to create HMAC
    const crypto = require('crypto');

    // Creating a HMAC (Hash-based Message Authentication Code) using SHA-256
    // The key used is your Razorpay key secret
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);

    // Updating the HMAC with the concatenated order ID and payment ID
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);

    // Generating the final signature by digesting the HMAC to a hexadecimal string
    const generatedSignature = hmac.digest('hex');

    // Comparing the generated signature with the signature received from Razorpay
    if (generatedSignature === razorpaySignature) {
        return true; // Return true if the signature matches, meaning the payment is valid
    } else {
        // If the signatures don't match, throw an error indicating payment verification failure
        throw new Error('Payment verification failed');
    }
};
