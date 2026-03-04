"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${req.method} ${req.originalUrl}`);
    console.error(err.stack);
    // Check if headers have already been sent to avoid "Headers already sent" errors
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({
        message: 'An unexpected internal server error occurred.',
        // Only include the stack in development mode for safety
        error: process.env.NODE_ENV === 'production' ? undefined : err.message
    });
};
exports.errorHandler = errorHandler;
