const logger = require('../utils/logger');

class CustomError extends Error {
    constructor(statusCode, message, metadata = {}) {
        super(message);
        this.statusCode = statusCode;
        this.metadata = metadata;
    }
}

const handleError = (err, req, res, next) => {
    const { statusCode, message, metadata } = err;
    logger.error(message, { metadata });
    res.status(statusCode || 500).json({
        status: "error",
        statusCode: statusCode || 500,
        message: message || "Internal Server Error",
        metadata: metadata || {}
    });
};

module.exports = {
    CustomError,
    handleError
};