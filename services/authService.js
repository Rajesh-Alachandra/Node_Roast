const bcrypt = require('bcryptjs'); // Importing bcrypt for hashing passwords
const User = require('../models/User'); // Importing the User model
const { generateToken, hashPassword, comparePassword } = require('../utils/helpers'); // Importing utility functions

// Register a new user
exports.register = async ({ name, email, password }) => {
    // Check if a user with the given email already exists
    let user = await User.findOne({ email });
    if (user) {
        throw new Error('User already exists'); // Throw an error if the user is already registered
    }

    // Hash the user's password
    const hashedPassword = await hashPassword(password);

    // Create a new user instance
    user = new User({
        name,
        email,
        password: hashedPassword, // Store the hashed password
    });

    // Save the new user to the database
    await user.save();

    // Generate a JWT token for the user
    const token = generateToken(user);

    // Return the token and user details (excluding the password)
    return { token, user: { id: user.id, name: user.name, email: user.email } };
};

// Log in an existing user
exports.login = async ({ email, password }) => {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials'); // Throw an error if the user does not exist
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials'); // Throw an error if the passwords do not match
    }

    // Generate a JWT token for the user
    const token = generateToken(user);

    // Return the token
    return token;
};
