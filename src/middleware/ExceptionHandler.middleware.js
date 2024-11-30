const logger = require('../utils/logger');

// Cho phép tạo một Error tùy chỉnh với status code, message và metadata
class CustomError extends Error {
    constructor(statusCode, message, metadata = {}) {
        super(message);
        this.statusCode = statusCode;
        this.metadata = metadata;
    }
}

// Xử lý lỗi và ghi log lỗi
const handleError = (err, req, res, next) => {
    // Lấy thông tin từ error object
    const { statusCode, message, metadata } = err;
    logger.error(message, { metadata });
    // Trả về lỗi cho client
    res.status(statusCode || 500).json({
        // status: "error",
        // statusCode: statusCode || 500,
        // message: message || "Internal Server Error",
        isError: true,
        detail: {
            status: "error",
            statusCode: statusCode || 500,
            message: message || "Internal Server Error",
            metadata: metadata || {}
        }
    });
};

module.exports = {
    CustomError,
    handleError
};