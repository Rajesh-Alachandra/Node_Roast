const Order = require('../models/Order');
const Enrollment = require('../models/Enrollment');

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('products.product');
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all enrollments
exports.getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find().populate('user').populate('workshop');
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
