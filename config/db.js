// Importing the Mongoose library and configuration settings
const mongoose = require('mongoose'); // Mongoose library for MongoDB object modeling
const config = require('./config'); // Configuration file containing database URI

// Function to connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI from the configuration file
        // The options `useNewUrlParser` and `useUnifiedTopology` are set to avoid deprecation warnings
        await mongoose.connect(config.dbURI, {
            useNewUrlParser: true, // Use the new URL string parser
            useUnifiedTopology: true, // Use the new server discovery and monitoring engine
        });
        console.log('MongoDB connected...'); // Log a success message upon successful connection
    } catch (err) {
        // Handle any errors that occur during connection
        console.error(err.message); // Log the error message to the console
        process.exit(1); // Exit the process with a failure code (1) to indicate an error
    }
};

// Exporting the connectDB function to be used in other modules
module.exports = connectDB;

