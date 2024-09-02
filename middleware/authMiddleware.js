const jwt = require('jsonwebtoken'); // Import JWT library for token verification
const config = require('../config/config'); // Import configuration for JWT secret
const User = require('../models/User'); // Import User model for user queries

// Middleware to authenticate requests
const authMiddleware = async (req, res, next) => {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If no token is provided, respond with unauthorized status
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        console.log('Token:', token);  // Debugging: log the token for verification

        // Verify the token using the JWT secret from the configuration
        const decoded = jwt.verify(token, config.jwtSecret);
        console.log('Decoded:', decoded);  // Debugging: log the decoded token payload

        // Find the user associated with the token
        const user = await User.findById(decoded.user.id);
        if (!user) {
            throw new Error('User not found'); // Throw an error if the user is not found
        }

        // Attach the user object to the request for use in subsequent middleware/routes
        req.user = user;
        console.log('User:', user);  // Debugging: log the retrieved user details

        // Call the next middleware or route handler
        next();
    } catch (err) {
        // Log the error and respond with unauthorized status
        console.error('Auth Error:', err.message);  // Log the error details
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware; // Export the middleware for use in other parts of the application
