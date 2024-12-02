const logger = require('../utils/logger');

// Cho phép tạo một Error tùy chỉnh với status code, message và metadata
class CustomError extends Error {
    constructor(status, message, metadata = {}) {
        super(message);
        this.status = status;
        this.metadata = metadata;
        Error.captureStackTrace(this, this.constructor);
    }

}


// Xử lý lỗi và ghi log lỗi
const handleError = (err, req, res, next) => {
    // Lấy thông tin từ error object
    const { status, message, metadata } = err;
    // Log the full error for server-side debugging
    logger.error(err.message, {
        name: err.name,
        stack: err.stack,
        metadata: err.metadata
    });

    // Trả về lỗi cho client
    res.status(status || 500).json({
        // status: "error",
        // statusCode: statusCode || 500,
        // message: message || "Internal Server Error",
        isError: true,
        detail: {
            status: status || 500,
            message: message || "Internal Server Error",
            metadata: metadata || {}
        }
    });
};

module.exports = {
    CustomError,
    handleError
};