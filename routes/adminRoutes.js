const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin Monitoring Routes
router.get('/orders', adminController.getAllOrders); // Get all product orders for admin
router.get('/enrollments', adminController.getAllEnrollments); // Get all workshop enrollments for admin

module.exports = router;
