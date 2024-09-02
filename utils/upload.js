const multer = require('multer'); // Importing the multer library for file uploads
const path = require('path'); // Importing the path module to handle file paths

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set the directory where files will be saved
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Create a unique suffix for the filename
        const filename = `${uniqueSuffix}${path.extname(file.originalname)}`; // Construct the filename with the original file extension
        cb(null, filename); // Provide the unique filename to multer
    },
});

// Multer configuration with file filter
const upload = multer({
    storage, // Use the configured storage
    fileFilter: (req, file, cb) => {
        // Check if the file type is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Only images are allowed'), false); // Reject the file with an error message
        }
    },
    limits: { fileSize: 1024 * 1024 * 5 }, // Set the maximum file size to 5MB
});

module.exports = upload; // Export the configured multer instance
