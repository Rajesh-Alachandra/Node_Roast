const bcrypt = require('bcryptjs'); // Library for hashing and comparing passwords
const jwt = require('jsonwebtoken'); // Library for generating and verifying JSON Web Tokens
const validator = require('validator'); // Library for validating input data
const moment = require('moment'); // Library for formatting and manipulating dates
const config = require('../config/config'); // Configuration file for storing secrets and settings

//! Function to validate email addresses
exports.isValidEmail = (email) => {
    return validator.isEmail(email); // Uses validator library to check if the email is valid
};

//! Function to send standardized error responses
exports.errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ error: message }); // Sends a standardized JSON response with an error message
};

//! Function to generate JWT token
exports.generateToken = (user) => {
    const payload = {
        user: {
            id: user._id,  // Use _id to match MongoDB's user identifier
            name: user.name
        },
    };
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }); // Signs the token with a secret and sets an expiration time of 1 hour
};

//! Function to hash passwords
exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds
    return await bcrypt.hash(password, salt); // Hashes the password with the generated salt
};

//! Function to compare passwords
exports.comparePassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword); // Compares the entered password with the hashed password
};

//! Function to validate product data
exports.validateProductData = (data) => {
    const { name, description, price } = data;
    // Checks if all required fields are present and price is a number
    if (!name || !description || typeof price !== 'number') {
        throw new Error('Invalid product data'); // Throws an error if any validation fails
    }
    return true; // Returns true if all validations pass
};

//! Function to format dates
exports.formatDate = (date, format = 'YYYY-MM-DD') => {
    return moment(date).format(format); // Formats the date using the moment library with the specified format
};
