// utils/logger.js

const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Define the path for the logs directory
const logsDir = path.join(__dirname, '../logs');

// Ensure the logs directory exists
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Define the custom logging format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Create a winston logger instance
const logger = winston.createLogger({
    level: 'info', // Default log level
    format: winston.format.combine(
        winston.format.timestamp(),
        logFormat
    ),
    transports: [
        // Console transport for logging to the console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            ),
        }),
        // File transport for logging to a file
        new winston.transports.File({
            filename: path.join(logsDir, 'app.log'), // Log file location
            format: winston.format.combine(
                winston.format.timestamp(),
                logFormat
            ),
        })
    ],
});

module.exports = logger;
