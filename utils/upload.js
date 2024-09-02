// utils/upload.js
const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `${uniqueSuffix}${path.extname(file.originalname)}`; // Create a unique filename
        cb(null, filename); // Save only the filename
    },
});

// Multer configuration with file filter
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Check for image files only
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'), false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

module.exports = upload;
