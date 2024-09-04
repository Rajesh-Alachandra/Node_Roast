const express = require('express'); // Import the Express framework
const router = express.Router(); // Create a new router instance for handling routes
const productController = require('../controllers/productController'); // Import the product controller functions
const authMiddleware = require('../middleware/authMiddleware'); // Import the authentication middleware

// Route to post a new product
router.post('/post', productController.postProduct);
// This route handles POST requests to '/post'
// It invokes the 'postProduct' method from the 'productController'
// The controller will handle the logic for creating a new product

// Route to get all products
router.get('/', productController.getAllProducts);
// This route handles GET requests to '/'
// It invokes the 'getAllProducts' method from the 'productController'
// The controller will handle the logic for retrieving all products

// Route to get a specific product by ID
router.get('/:id', authMiddleware, productController.getProductById);
// This route handles GET requests to '/:id'
// It extracts the product ID from the URL parameters
// It uses 'authMiddleware' to ensure the user is authenticated
// It then invokes the 'getProductById' method from the 'productController'
// The controller will handle the logic for retrieving a product by its ID

// Route to update a specific product by ID
router.put('/:id', authMiddleware, productController.updateProduct);
// This route handles PUT requests to '/:id'
// It extracts the product ID from the URL parameters
// It uses 'authMiddleware' to ensure the user is authenticated
// It then invokes the 'updateProduct' method from the 'productController'
// The controller will handle the logic for updating a product by its ID

// Route to delete a specific product by ID
router.delete('/:id', authMiddleware, productController.deleteProduct);
// This route handles DELETE requests to '/:id'
// It extracts the product ID from the URL parameters
// It uses 'authMiddleware' to ensure the user is authenticated
// It then invokes the 'deleteProduct' method from the 'productController'
// The controller will handle the logic for deleting a product by its ID

// Route to get products by category ID
router.get('/category/:categoryId', authMiddleware, productController.getProductsByCategory);
// This route handles GET requests to '/category/:categoryId'
// It extracts the category ID from the URL parameters
// It uses 'authMiddleware' to ensure the user is authenticated
// It then invokes the 'getProductsByCategory' method from the 'productController'
// The controller will handle the logic for retrieving products by category ID

// Export the router to be used in other parts of the application
module.exports = router;
