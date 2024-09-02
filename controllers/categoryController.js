// Importing required modules and utilities
const categoryService = require('../services/categoryService'); // Service for handling category-related operations
const { errorResponse } = require('../utils/helpers'); // Utility function for consistent error handling

// Controller to create a new category
exports.createCategory = async (req, res) => {
    try {
        // Create a new category using categoryService with the name from the request body
        const category = await categoryService.createCategory(req.body.name);
        // Respond with the created category and a 201 status code (Created)
        res.status(201).json(category);
    } catch (error) {
        // Handle any errors during category creation and send a 400 error response with the error message
        errorResponse(res, 400, error.message);
    }
};

// Controller to get all categories
exports.getAllCategories = async (req, res) => {
    try {
        // Fetch all categories using categoryService
        const categories = await categoryService.getAllCategories();
        // Respond with the list of categories and a 200 status code (OK)
        res.status(200).json(categories);
    } catch (error) {
        // Handle any errors during fetching categories and send a 400 error response with the error message
        errorResponse(res, 400, error.message);
    }
};

// Controller to get a category by ID
exports.getCategoryById = async (req, res) => {
    try {
        // Fetch the category and associated products by ID using categoryService
        const { category, products } = await categoryService.getCategoryById(req.params.id);
        // Respond with the category and products and a 200 status code (OK)
        res.status(200).json({ category, products });
    } catch (error) {
        // Handle any errors during fetching category by ID and send a 400 error response with the error message
        errorResponse(res, 400, error.message);
    }
};

// Controller to update a category
exports.updateCategory = async (req, res) => {
    try {
        // Update the category by ID with the new name from the request body using categoryService
        const category = await categoryService.updateCategory(req.params.id, req.body.name);
        // Check if the category was found and updated
        if (!category) {
            return errorResponse(res, 404, 'Category not found');
        }
        // Respond with the updated category and a 200 status code (OK)
        res.status(200).json(category);
    } catch (error) {
        // Handle any errors during category update and send a 400 error response with the error message
        errorResponse(res, 400, error.message);
    }
};

// Controller to delete a category
exports.deleteCategory = async (req, res) => {
    try {
        // Delete the category by ID using categoryService
        const category = await categoryService.deleteCategory(req.params.id);
        // Check if the category was found and deleted
        if (!category) {
            return errorResponse(res, 404, 'Category not found');
        }
        // Respond with a success message and a 200 status code (OK)
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        // Handle any errors during category deletion and send a 400 error response with the error message
        errorResponse(res, 400, error.message);
    }
};
