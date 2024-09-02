// Importing required models
const Category = require('../models/Category'); // Category model
const Product = require('../models/Product'); // Product model

// Create a new category
exports.createCategory = async (name) => {
    const category = new Category({ name }); // Create a new Category instance with the given name
    await category.save(); // Save the new category to the database
    return category; // Return the created category
};

// Get all categories
exports.getAllCategories = async () => {
    return await Category.find(); // Fetch and return all categories from the database
};

// Get a category by ID and its associated products
exports.getCategoryById = async (categoryId) => {
    const category = await Category.findById(categoryId); // Find the category by its ID
    if (!category) {
        throw new Error('Category not found'); // Throw an error if the category is not found
    }
    const products = await Product.find({ category: categoryId }); // Find all products associated with the category
    return { category, products }; // Return both the category and the associated products
};

// Update a category by ID
exports.updateCategory = async (categoryId, name) => {
    return await Category.findByIdAndUpdate(categoryId, { name }, { new: true }); // Find and update the category by its ID, returning the updated category
};

// Delete a category by ID
exports.deleteCategory = async (categoryId) => {
    return await Category.findByIdAndDelete(categoryId); // Find and delete the category by its ID, returning the deleted category
};
