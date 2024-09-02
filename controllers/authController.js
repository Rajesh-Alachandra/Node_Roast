// Importing required modules and utilities
const authService = require('../services/authService'); // Service for handling authentication-related operations
const { isValidEmail, errorResponse } = require('../utils/helpers'); // Utility functions for email validation and error handling

// Controller for user registration
exports.register = async (req, res) => {
    // Extracting email from the request body
    const { email } = req.body;

    // Validate email format using the utility function
    if (!isValidEmail(email)) {
        // If email is invalid, send a 400 error response with an appropriate message
        return errorResponse(res, 400, 'Invalid email address');
    }

    try {
        // Register the user using the authService
        const user = await authService.register(req.body);
        // Respond with the created user and a 201 status code (Created)
        res.status(201).json(user);
    } catch (error) {
        // Handle any errors during registration and send a 400 error response with the error message
        errorResponse(res, 400, error.message);
    }
};

// Controller for user login
exports.login = async (req, res) => {
    try {
        // Log in the user using the authService and get a JWT token
        const token = await authService.login(req.body);
        // Respond with the token
        res.json({ token });
    } catch (error) {
        // Handle any errors during login and send a 400 error response with the error message
        errorResponse(res, 400, error.message);
    }
};
