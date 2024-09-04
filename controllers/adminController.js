const Order = require('../models/Order');
const Enrollment = require('../models/Enrollment');

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        // Fetch all orders from the database
        // Use populate to replace user and product references with actual user and product data
        const orders = await Order.find()
            .populate('user')          // Populate the 'user' field with user details
            .populate('products.product'); // Populate the 'product' field within 'products' with product details

        // Send a successful response with the fetched orders
        res.status(200).json(orders);
    } catch (error) {
        // Handle errors and send a 400 Bad Request response with the error message
        res.status(400).json({ error: error.message });
    }
};

// Get all enrollments
exports.getAllEnrollments = async (req, res) => {
    try {
        // Fetch all enrollments from the database
        // Use populate to replace user and workshop references with actual user and workshop data
        const enrollments = await Enrollment.find()
            .populate('user')          // Populate the 'user' field with user details
            .populate('workshop');     // Populate the 'workshop' field with workshop details

        // Send a successful response with the fetched enrollments
        res.status(200).json(enrollments);
    } catch (error) {
        // Handle errors and send a 400 Bad Request response with the error message
        res.status(400).json({ error: error.message });
    }
};





