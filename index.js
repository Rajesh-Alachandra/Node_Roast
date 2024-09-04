// Importing required modules and configuration files
const path = require('path'); // Module for handling and transforming file paths
const express = require('express'); // Web framework for Node.js
const connectDB = require('./config/db'); // Function to connect to the database
const config = require('./config/config'); // Configuration file for application settings
const setupSwagger = require('./config/swagger'); // Function to set up Swagger documentation

const app = express(); // Creating an Express application

//! Connect to the database
connectDB(); // Call the function to connect to the database

//! Middleware
app.use(express.json()); // Middleware to parse incoming JSON requests

//! Serve the uploads folder statically
// This middleware serves files from the 'uploads' directory at the '/uploads' URL path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//! Set up EJS
// Configure Express to use EJS as the templating engine
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the directory for view templates

//! Routes
// Define the routes and map them to the appropriate route handlers
app.use('/api/auth', require('./routes/auth')); // Routes related to authentication
app.use('/api/products', require('./routes/product')); // Routes related to products
app.use('/api/categories', require('./routes/categoryRoutes')); // Routes related to categories
app.use('/workshops', require('./routes/workshopRoutes')); // Routes related to workshops
app.use('/api/cart', require('./routes/cart')); // Routes related to cart

//! Example route to render a page with EJS
// A route to render the 'index' view template with a title variable
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

//! Setup Swagger
// Initialize Swagger for API documentation
setupSwagger(app); // Call the function to set up Swagger

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack to the console
    res.status(500).json({ error: 'Something went wrong!' }); // Respond with a 500 status and error message
});

// Start the server
const PORT = config.port; // Get the port number from the configuration file
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log a message when the server starts
});
