// utils/logger.js
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name (__dirname equivalent for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create daily rotate transport for log files
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: path.join(__dirname, '../logs/api-%DATE%.log'), // Log file pattern
  datePattern: 'YYYY-MM-DD',                              // Rotation date format
  maxSize: '10m',                                         // Max size of log files
  maxFiles: '10d',                                        // Retain logs for 14 days
}); 

// Create the logger
const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }) // Format log message
  ),
  transports: [
    dailyRotateFileTransport, // Write logs to rotated files
    new transports.Console({ // Also log to console
      format: format.combine(
        format.colorize(), // Add colors for console output
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),
    }),
  ],
});

export default logger;