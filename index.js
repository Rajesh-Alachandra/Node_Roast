const path = require('path');
const express = require('express');
const connectDB = require('./config/db');
const config = require('./config/config');
const setupSwagger = require('./config/swagger'); // Import setupSwagger

const app = express();

//! Connect to the database
connectDB();

//! Middleware
app.use(express.json());

//! Serve the uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//! Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure you require 'path' at the top

//! Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/workshops', require('./routes/workshopRoutes'));

//! Example route to render a page with EJS
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});


//! Setup Swagger
setupSwagger(app); // Use setupSwagger

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
